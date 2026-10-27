import { describe, expect, it } from "vitest";
import { refundProblem, toBaseUnits } from "./units";

describe("amounts and refunds", () => {
  it("converts a human amount without floating point", () => {
    expect(toBaseUnits("20", 6)).toBe("20000000");
    expect(toBaseUnits("0.1", 9)).toBe("100000000");
    expect(toBaseUnits("0", 6)).toBeNull();
    expect(toBaseUnits("1.1234567", 6)).toBeNull();
  });

  it("rejects a burn address and accepts a normal Base address", () => {
    expect(refundProblem("Base", "0x000000000000000000000000000000000000dEaD")).toContain("burn");
    expect(refundProblem("Base", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")).toBeNull();
    expect(refundProblem("Solana", "not an address")).toContain("base58");
  });
});
