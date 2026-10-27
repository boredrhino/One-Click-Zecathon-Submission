import { sha256 } from "@noble/hashes/sha2.js";

/** Short public mark of a viewing key. The key itself stays off the quote. */
export function viewingMark(ufvk: string): string {
  const digest = sha256(new TextEncoder().encode(ufvk));
  return hex(digest.slice(0, 8));
}

export function fingerprintMark(seedFingerprint: string): string {
  return seedFingerprint.slice(0, 16);
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
