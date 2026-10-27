export interface DoorKeys {
  address: string;
  ufvk: string;
  seedFingerprint: string;
  diversifier: string;
  siblingAddress: string;
  siblingDiversifier: string;
}

interface DoorJson {
  address: string;
  ufvk: string;
  seed_fingerprint: string;
  diversifier: string;
  sibling_address: string;
  sibling_diversifier: string;
}

let ready: Promise<typeof import("../keys/pkg/once_keys.js")> | null = null;

function moduleReady() {
  ready ??= import("../keys/pkg/once_keys.js");
  return ready;
}

/** Derives one Orchard address, and the next diversifier of the same key. */
export async function deriveDoor(phrase: string): Promise<DoorKeys> {
  const keys = await moduleReady();
  const json = keys.derive_door_json(phrase);
  const parsed = JSON.parse(json) as DoorJson;
  return {
    address: parsed.address,
    ufvk: parsed.ufvk,
    seedFingerprint: parsed.seed_fingerprint,
    diversifier: parsed.diversifier,
    siblingAddress: parsed.sibling_address,
    siblingDiversifier: parsed.sibling_diversifier,
  };
}
