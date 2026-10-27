import type { RouteName } from "../router";

export function About({ go }: { go: (route: RouteName) => void }) {
  return (
    <div className="page">
      <section className="split about-hero">
        <div>
          <p className="eyebrow">About</p>
          <h1>A new swap should not extend an old key.</h1>
        </div>
        <div className="prose">
          <p>
            Once is an entry for the ZECATHON cross-chain track. The track asks for a swap
            that reaches another chain without unshielding on the way through. The arrival
            address is part of that promise.
          </p>
          <p>
            Zodl and other wallets already request a shielded ZEC payout from NEAR Intents.
            The missing piece is a recipient that will not be reused, and that does not share
            a viewing key with the next payout.
          </p>
        </div>
      </section>

      <section className="steps about-grid">
        <article>
          <h2>Local keys</h2>
          <p>
            The seed is generated with <code>crypto.getRandomValues</code> through a BIP-39
            library, then derived by the Zcash key library. Refreshing the page drops it.
            Once does not store a seed.
          </p>
        </article>
        <article>
          <h2>A dry price</h2>
          <p>
            The desk can price a route from Base USDC, Solana USDC, or SOL. The refund
            address is yours, on the chain the deposit would come from. 1Click rejects the
            burn address.
          </p>
        </article>
        <article>
          <h2>What it will not do</h2>
          <p>
            It will not build a shielded spend, reserve a deposit address, or ask you to send
            funds. A live swap would publish the recipient. The desk stops at the signed quote.
          </p>
        </article>
      </section>

      <section className="split">
        <div>
          <p className="eyebrow">Track</p>
          <h2>Cross-chain.</h2>
        </div>
        <div className="prose">
          <p>
            Origin assets are the 1Click ids for USDC on Base, USDC on Solana, and SOL. The
            destination is native ZEC delivered to the unified address, not a transparent
            Zcash address that you would shield afterward.
          </p>
          <button type="button" className="btn solid" onClick={() => go("docs")}>
            Read the docs
          </button>
        </div>
      </section>
    </div>
  );
}
