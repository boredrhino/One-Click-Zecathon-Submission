/** Smallest-unit conversion that does not pass through floating point. */
export function toBaseUnits(input: string, decimals: number): string | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const [whole, fraction = ""] = trimmed.split(".");
  if (fraction.length > decimals) return null;
  const digits = `${whole}${fraction.padEnd(decimals, "0")}`.replace(/^0+/, "");
  return digits.length > 0 ? digits : null;
}

export function refundProblem(chain: string, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `Add a ${chain} address for a failed-swap refund.`;
  if (chain === "Base") {
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      return "A Base address is 0x followed by 40 hex characters.";
    }
    if (/^0x0{40}$/i.test(trimmed) || /^0x0{36}dead$/i.test(trimmed)) {
      return "1Click rejects the burn address. Use an address you control.";
    }
    return null;
  }
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) {
    return "A Solana address is base58, 32 to 44 characters.";
  }
  return null;
}
