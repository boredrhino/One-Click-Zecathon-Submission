use bip39::Mnemonic;
use serde::Serialize;
use wasm_bindgen::prelude::*;
use zcash_keys::keys::{UnifiedAddressRequest, UnifiedSpendingKey};
use zcash_protocol::consensus::Network;
use zip32::AccountId;
use zip32::fingerprint::SeedFingerprint;

/// What one seed is willing to show a solver.
///
/// `address` is the only string Once will place in a 1Click recipient field.
/// `sibling_address` is the next diversifier of the same key. It is a different
/// string and the same viewing key. Once does not quote it.
#[derive(Debug, Serialize)]
pub struct Door {
    pub address: String,
    pub ufvk: String,
    pub seed_fingerprint: String,
    pub diversifier: String,
    pub sibling_address: String,
    pub sibling_diversifier: String,
}

pub fn derive_door(phrase: &str) -> Result<Door, String> {
    let mnemonic = Mnemonic::parse(phrase.trim()).map_err(|error| error.to_string())?;
    let seed = mnemonic.to_seed("");
    let account = AccountId::try_from(0u32).map_err(|_| "account 0 is not a ZIP-32 account".to_string())?;
    let params = Network::MainNetwork;
    let usk = UnifiedSpendingKey::from_seed(&params, &seed, account)
        .map_err(|error| format!("spending key: {error:?}"))?;
    let ufvk = usk.to_unified_full_viewing_key();
    let (address, diversifier) = ufvk
        .default_address(UnifiedAddressRequest::ORCHARD)
        .map_err(|error| format!("address: {error:?}"))?;
    let mut next = diversifier;
    next.increment()
        .map_err(|_| "diversifier space ended at the first address".to_string())?;
    let (sibling, sibling_diversifier) = ufvk
        .find_address(next, UnifiedAddressRequest::ORCHARD)
        .map_err(|error| format!("sibling: {error:?}"))?;
    let encoded = address.encode(&params);
    let sibling_encoded = sibling.encode(&params);
    if encoded == sibling_encoded {
        return Err("two diversifiers produced one address".into());
    }
    let ufvk_encoded = ufvk
        .encode(&params)
        .map_err(|error| format!("viewing key: {error:?}"))?;
    let fingerprint = SeedFingerprint::from_seed(&seed).ok_or("seed is too short")?;
    Ok(Door {
        address: encoded,
        ufvk: ufvk_encoded,
        seed_fingerprint: hex::encode(fingerprint.to_bytes()),
        diversifier: diversifier_label(&diversifier),
        sibling_address: sibling_encoded,
        sibling_diversifier: diversifier_label(&sibling_diversifier),
    })
}

fn diversifier_label(index: &zip32::DiversifierIndex) -> String {
    let bytes = index.as_bytes();
    let mut value = 0u64;
    for (place, byte) in bytes.iter().take(8).enumerate() {
        value |= u64::from(*byte) << (8 * place);
    }
    value.to_string()
}

#[wasm_bindgen]
pub fn derive_door_json(phrase: &str) -> Result<String, JsError> {
    let door = derive_door(phrase).map_err(|error| JsError::new(&error))?;
    serde_json::to_string(&door).map_err(|error| JsError::new(&error.to_string()))
}

#[cfg(test)]
mod tests {
    use super::derive_door;

    const ABANDON: &str = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art";

    #[test]
    fn one_seed_has_one_viewing_key_and_two_addresses() {
        let door = derive_door(ABANDON).expect("abandon phrase");
        assert_eq!(
            door.address,
            "u1gsqvqxx6lmmqg05uvx57gjdg5j3a54nxw09z4vq4z0yp7dfdcjrqk5wq64quwzrufmujd5e8xu5jn7cyewjaptxc8lsqwa2lk559u4cd"
        );
        assert!(door.sibling_address.starts_with("u1"));
        assert_ne!(door.address, door.sibling_address);
        assert!(door.ufvk.starts_with("uview"));
        let again = derive_door(ABANDON).expect("stable");
        assert_eq!(door.address, again.address);
        assert_eq!(door.ufvk, again.ufvk);
        assert_eq!(door.seed_fingerprint, again.seed_fingerprint);
        println!("ADDRESS {}", door.address);
        println!("SIBLING {}", door.sibling_address);
        println!("UFVK {}", door.ufvk);
        println!("FP {}", door.seed_fingerprint);
    }

    #[test]
    fn a_second_seed_is_a_second_viewing_key() {
        let first = derive_door(ABANDON).unwrap();
        let second = derive_door(
            "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote",
        )
        .expect("zoo phrase");
        assert_ne!(first.address, second.address);
        assert_ne!(first.ufvk, second.ufvk);
        assert_ne!(first.seed_fingerprint, second.seed_fingerprint);
    }
}
