import { describe, expect, it } from "vitest";
import { RECORDED_QUOTE } from "./oneclick";
import { publishedRecipient, verifyQuoteSignature } from "./verifyQuote";
import type { OneClickQuoteResponse } from "./types";

describe("quote signatures", () => {
  it("accepts the recorded dry quote into an Orchard address", () => {
    expect(verifyQuoteSignature(RECORDED_QUOTE)).toBe(true);
    expect(publishedRecipient(RECORDED_QUOTE)).toMatch(/^u1/);
    expect(RECORDED_QUOTE.quoteRequest.destinationAsset).toBe("nep141:zec.omft.near");
    expect(RECORDED_QUOTE.quoteRequest.dry).toBe(true);
    expect(RECORDED_QUOTE.quote.depositAddress).toBeUndefined();
  });

  it("rejects a quote whose output amount was changed", () => {
    const tampered = structuredClone(RECORDED_QUOTE) as OneClickQuoteResponse;
    tampered.quote.amountOut = "1";
    tampered.quote.amountOutFormatted = "0.00000001";
    expect(verifyQuoteSignature(tampered)).toBe(false);
  });

  it("rejects a quote whose recipient was swapped for the sibling address", () => {
    const tampered = structuredClone(RECORDED_QUOTE) as OneClickQuoteResponse;
    tampered.quoteRequest.recipient =
      "u1fqdx7vv7zam7y73vufrmp5w64rdw37c7yxlynffl2rf7leq4atcunzen42y789n82yh74v764ehx2wu7yjn0gthkdfju2mudtcjqm893";
    expect(verifyQuoteSignature(tampered)).toBe(false);
    expect(publishedRecipient(tampered)).not.toBe(publishedRecipient(RECORDED_QUOTE));
  });
});
