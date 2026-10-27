import recorded from "./recorded-quote.json";
import { publishedRecipient, verifyQuoteSignature } from "./verifyQuote";
import type { OneClickQuoteResponse } from "./types";

export const RECORDED_QUOTE = recorded as OneClickQuoteResponse;

export interface PricedQuote {
  quote: OneClickQuoteResponse;
  source: "live" | "recorded";
}

export interface QuoteRequestInput {
  originAsset: string;
  amount: string;
  refundTo: string;
  recipient: string;
}

const ENDPOINTS = [
  "/oneclick/v0/quote",
  "https://1click.chaindefuser.com/v0/quote",
];

/**
 * Asks 1Click for a dry quote into one Orchard address.
 * Dry means the response has no deposit address and nothing can be sent.
 */
export async function obtainQuote(input: QuoteRequestInput): Promise<PricedQuote> {
  const quote = await fetchDryQuote(input);
  if (!verifyQuoteSignature(quote)) {
    throw new Error("1Click answered with a signature Once will not accept.");
  }
  if (publishedRecipient(quote) !== input.recipient) {
    throw new Error("1Click changed the recipient. Once discarded the quote.");
  }
  return { quote, source: "live" };
}

export function recordedExample(): PricedQuote {
  if (!verifyQuoteSignature(RECORDED_QUOTE)) {
    throw new Error("The recorded quote failed its own signature check.");
  }
  return { quote: structuredClone(RECORDED_QUOTE), source: "recorded" };
}

async function fetchDryQuote(input: QuoteRequestInput): Promise<OneClickQuoteResponse> {
  const deadline = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
  const body = {
    dry: true,
    swapType: "EXACT_INPUT",
    slippageTolerance: 100,
    originAsset: input.originAsset,
    destinationAsset: "nep141:zec.omft.near",
    amount: input.amount,
    depositType: "ORIGIN_CHAIN",
    refundTo: input.refundTo,
    refundType: "ORIGIN_CHAIN",
    recipient: input.recipient,
    recipientType: "DESTINATION_CHAIN",
    deadline,
    quoteWaitingTimeMs: 0,
  };

  let last = "no route to 1Click";
  for (const url of ENDPOINTS) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      });
      const text = await response.text();
      if (!response.ok) {
        last = explainHttp(response.status, text);
        continue;
      }
      return JSON.parse(text) as OneClickQuoteResponse;
    } catch (error) {
      last = error instanceof Error ? error.message : "network error";
    }
  }
  throw new Error(last);
}

function explainHttp(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string };
    if (parsed.message) return parsed.message;
  } catch {
    // The body was not JSON.
  }
  return `${status} ${body.slice(0, 180)}`;
}
