import { sha256 } from "@noble/hashes/sha2.js";
import { base58 } from "@scure/base";
import stringify from "json-stable-stringify";
import nacl from "tweetnacl";
import {
  ONE_CLICK_MANAGER_PUB_KEY,
  type OneClickQuoteResponse,
} from "./types";

const ED25519_PREFIX = "ed25519:";

/**
 * Verifies a 1Click quote signature.
 *
 * The signed message is the base58 SHA-256 of canonical JSON: the allowlisted
 * request fields, the dry or full quote fields, and the timestamp. This matches
 * `verifyQuoteSignature` in `@defuse-protocol/one-click-sdk-typescript`.
 */
export function verifyQuoteSignature(
  response: OneClickQuoteResponse,
  managerPublicKey = ONE_CLICK_MANAGER_PUB_KEY,
): boolean {
  try {
    const signatureBytes = decodeEd25519Base58(response.signature);
    const publicKeyBytes = decodeEd25519Base58(managerPublicKey);
    const message = new TextEncoder().encode(quoteHash(response));
    return nacl.sign.detached.verify(message, signatureBytes, publicKeyBytes);
  } catch {
    return false;
  }
}

export function quoteHash(response: OneClickQuoteResponse): string {
  const dataString = stringify({
    ...buildSignedQuoteRequest(response),
    ...buildSignedQuote(response),
    timestamp: response.timestamp,
  });
  if (!dataString) return "";
  return base58.encode(sha256(new TextEncoder().encode(dataString)));
}

function buildSignedQuoteRequest(response: OneClickQuoteResponse) {
  const { quoteRequest } = response;
  return {
    dry: quoteRequest.dry,
    swapType: quoteRequest.swapType,
    slippageTolerance: quoteRequest.slippageTolerance,
    originAsset: quoteRequest.originAsset,
    depositType: quoteRequest.depositType,
    destinationAsset: quoteRequest.destinationAsset,
    amount: quoteRequest.amount,
    refundTo: quoteRequest.refundTo,
    refundType: quoteRequest.refundType,
    recipient: quoteRequest.recipient,
    recipientType: quoteRequest.recipientType,
    deadline: quoteRequest.deadline,
    quoteWaitingTimeMs: quoteRequest.quoteWaitingTimeMs
      ? quoteRequest.quoteWaitingTimeMs
      : undefined,
    referral: quoteRequest.referral ? quoteRequest.referral : undefined,
    virtualChainRecipient: quoteRequest.virtualChainRecipient
      ? quoteRequest.virtualChainRecipient
      : undefined,
    virtualChainRefundRecipient: quoteRequest.virtualChainRefundRecipient
      ? quoteRequest.virtualChainRefundRecipient
      : undefined,
    customRecipientMsg: quoteRequest.customRecipientMsg
      ? quoteRequest.customRecipientMsg
      : undefined,
    sessionId: undefined,
    connectedWallets: undefined,
    correlationId: undefined,
    appFees: undefined,
    partnerId: undefined,
    userAccountId: undefined,
    depositMode: undefined,
  };
}

function buildSignedQuote(response: OneClickQuoteResponse) {
  const { quote } = response;
  if (response.quoteRequest.dry) {
    return {
      amountIn: quote.amountIn,
      amountInFormatted: quote.amountInFormatted,
      amountInUsd: quote.amountInUsd,
      minAmountIn: quote.minAmountIn,
      amountOut: quote.amountOut,
      amountOutFormatted: quote.amountOutFormatted,
      amountOutUsd: quote.amountOutUsd,
      minAmountOut: quote.minAmountOut,
    };
  }
  return {
    amountIn: quote.amountIn,
    amountInFormatted: quote.amountInFormatted,
    amountInUsd: quote.amountInUsd,
    minAmountIn: quote.minAmountIn,
    amountOut: quote.amountOut,
    amountOutFormatted: quote.amountOutFormatted,
    amountOutUsd: quote.amountOutUsd,
    minAmountOut: quote.minAmountOut,
    depositAddress: quote.depositAddress || undefined,
    depositMemo: quote.depositMemo || undefined,
    deadline: quote.deadline || undefined,
    timeWhenInactive: quote.timeWhenInactive || undefined,
    timeEstimate: quote.timeEstimate || undefined,
    refundFee: quote.refundFee || undefined,
    withdrawFee: quote.withdrawFee || undefined,
  };
}

function decodeEd25519Base58(value: string): Uint8Array {
  const encoded = value.startsWith(ED25519_PREFIX)
    ? value.slice(ED25519_PREFIX.length)
    : value;
  return base58.decode(encoded);
}

/** The Zcash string a funded swap writes down next to the deposit. */
export function publishedRecipient(response: OneClickQuoteResponse): string {
  return response.quoteRequest.recipient;
}
