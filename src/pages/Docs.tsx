import type { RouteName } from "../router";

export function Docs({ go }: { go: (route: RouteName) => void }) {
  return (
    <div className="page narrow">
      <p className="eyebrow">Documentation</p>
      <h1>What the desk actually does.</h1>
      <p className="lede">
        Once is a cross-chain onramp into one shielded address. The pages below are the
        whole product: the leak, the address, the quote, and the checks.
      </p>

      <article className="doc">
        <h2>The leak</h2>
        <p>
          NEAR Intents already swaps USDC, SOL, and other assets to ZEC at a shielded
          address. The quote names that address. A funded swap can publish it beside the
          deposit on NEAR.
        </p>
        <p>
          Wallets often treat “a new address” as the next diversifier of one account. The
          strings differ. The incoming viewing key does not. One recovered viewing key reads
          every payment to every diversifier of that account.
        </p>
      </article>

      <article className="doc">
        <h2>The address</h2>
        <p>
          Derivation runs in this browser, in WebAssembly built from <code>zcash_keys</code>{" "}
          0.17. The path is account 0 and the default Orchard diversifier. There is no
          transparent receiver in the unified address.
        </p>
        <p>
          The desk also derives the following diversifier and labels it. That address is
          valid for the same key. Once will not place it in <code>recipient</code>.
        </p>
        <p>
          A second door is a second BIP-39 seed. Its viewing-key mark and seed mark differ
          from the first. The seed and the unified full viewing key stay in the tab.
        </p>
      </article>

      <article className="doc">
        <h2>The quote</h2>
        <p>
          The desk asks <code>POST /v0/quote</code> on NEAR Intents 1Click. The request is
          dry: <code>dry: true</code>, exact input, destination <code>nep141:zec.omft.near</code>,
          recipient type <code>DESTINATION_CHAIN</code>. A dry quote has no deposit address.
        </p>
        <p>
          The response signature is checked the way{" "}
          <code>verifyQuoteSignature</code> does in the 1Click TypeScript SDK, against the
          published manager key. If the signed recipient is not the door address, the quote
          is discarded.
        </p>
        <p>
          Tamper edits the output amount in the tab. The signature then fails. The recorded
          example is a dry quote from 27 Oct 2026 for the public abandon mnemonic. Its refund
          field is a public example address. Nothing was deposited.
        </p>
      </article>

      <article className="doc">
        <h2>A pass through the desk</h2>
        <ol>
          <li>Cut two keys. The viewing-key marks differ. The seed marks differ.</li>
          <li>On one door, read the next diversifier. It is absent from the quote.</li>
          <li>Price the door. The signed recipient begins with <code>u1</code> and matches the door.</li>
          <li>Tamper with the output. The signature fails.</li>
        </ol>
        <button type="button" className="btn solid" onClick={() => go("desk")}>
          Open the desk
        </button>
      </article>
    </div>
  );
}
