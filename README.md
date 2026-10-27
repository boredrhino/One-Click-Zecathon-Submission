# Once

A swap into shielded ZEC that arrives at one Orchard address. The next swap is a new seed, so the two arrivals do not share a viewing key.

Cross-chain track. NEAR Intents 1Click quotes USDC or SOL straight to that address. The quote is dry: it is signed, and it does not reserve a deposit address.

## The leak this closes

A unified address can be decoded by anyone. Wallets that offer a fresh address are usually offering the next diversifier of one account. Those strings look unrelated. They share an incoming viewing key. NEAR Intents writes the recipient into the quote, and a funded swap publishes it beside the deposit.

Once derives account 0, diversifier 0, Orchard receiver only. There is no transparent receiver inside the address. The following diversifier is shown on the door and left out of the recipient field. A second door is a second BIP-39 seed.

The seed and the unified full viewing key stay in the tab. The quote carries the payment address.

## Try it

Node 20 or newer.

```sh
npm install
npm test
npm run dev
```

Open the printed local URL. Home, Desk, Docs, and About are routes in the same app. The desk is where a key is cut and a quote is priced.

| Do this | See this |
| --- | --- |
| `npm test` | The recorded dry quote verifies. Editing the ZEC amount, or swapping in the sibling address, fails the signature. `cargo test --manifest-path crates/once-keys/Cargo.toml` checks that one seed yields the pinned Orchard address and a different sibling, and that a second seed has a different viewing key. |
| Cut a key | A `u1` address, a viewing-key mark, and the next diversifier of the same key. |
| Cut the second key | The two viewing-key marks differ. |
| Paste a Base or Solana refund address you control, then Price this door | A live dry quote. The signed recipient is the door address. About twenty USDC is a size 1Click will price. |
| Tamper with the output | The signature fails. |
| Recorded example | The dry quote saved on 27 Oct 2026, still signature-checked, aimed at the public abandon mnemonic. Its refund field is a public example address 1Click would accept. Nothing was deposited. |

A dry quote does not move funds. This page has no control that asks for a deposit.

## What is live

- Address derivation runs locally in WebAssembly built from `crates/once-keys`, which calls `zcash_keys` 0.17. The pinned address in the Rust test is the Orchard default for the BIP-39 abandon phrase at account 0.
- The live price is a dry `POST` to `https://1click.chaindefuser.com/v0/quote`. The dev server also proxies `/oneclick` to that host.
- Signature checks follow `verifyQuoteSignature` in `@defuse-protocol/one-click-sdk-typescript`, against manager key `ed25519:reYaWhvwu8Jzo3WUM3zhn6VrhuMEF4eADL17qtRVifc`.

Rebuild the wasm, if you have Rust and `wasm-bindgen` 0.2.129:

```sh
npm run keys
```

`npm run keys` expects `wasm-bindgen` 0.2.129 on `PATH` and a C compiler that accepts `--target=wasm32-unknown-unknown` (Apple clang does not). It writes `src/keys/pkg`. The wasm already in that folder is what `npm run dev` loads.

## Deploy

Vercel hosts this. The app is a static site plus one rewrite. `vercel.json` sends `/oneclick/*` to 1Click and every other path to `index.html`, so `/desk`, `/docs`, and `/about` load. Derivation stays in the browser. A VPS is not required.
