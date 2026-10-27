import { useState } from "react";
import type { RouteName } from "../router";
import { ZEC_ASSET } from "../intents/types";

export function Home({ go }: { go: (route: RouteName) => void }) {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Cross-chain into the shielded pool</p>
          <h1>Every arrival gets a new key.</h1>
          <p className="lede">
            USDC or SOL becomes ZEC at one Orchard address. The next swap is a new seed, so
            the two arrivals do not share a viewing key. The price is a signed dry quote.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn solid" onClick={() => go("desk")}>
              Open the desk <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="btn ghost" onClick={() => go("docs")}>
              Documentation
            </button>
          </div>
        </div>
        <aside className="card balance">
          <p className="eyebrow">Example publication</p>
          <dl>
            <div>
              <dt>Recipient</dt>
              <dd>one Orchard address</dd>
            </div>
            <div>
              <dt>Sibling</dt>
              <dd>left out</dd>
            </div>
            <div>
              <dt>Viewing key</dt>
              <dd>stays in the tab</dd>
            </div>
          </dl>
          <p className="card-foot">Cut a key, then price the door. The sibling never enters the quote.</p>
        </aside>
      </section>

      <section className="asset-row card">
        <div>
          <p className="eyebrow">Destination asset</p>
          <p className="mono asset-id">{ZEC_ASSET}</p>
        </div>
        <CopyButton value={ZEC_ASSET} />
      </section>

      <section className="block">
        <div className="block-head">
          <p className="eyebrow">How it works</p>
          <h2>Cut, separate, then price</h2>
        </div>
        <ol className="steps">
          <li>
            <span>01</span>
            <h3>Cut</h3>
            <p>
              This browser derives a fresh BIP-39 seed and one Orchard unified address. The
              seed is not sent with the quote.
            </p>
          </li>
          <li>
            <span>02</span>
            <h3>Separate</h3>
            <p>
              The next diversifier is a second address under the same viewing key. A wallet’s
              “new address” button does that. Once leaves it off the recipient field.
            </p>
          </li>
          <li>
            <span>03</span>
            <h3>Price</h3>
            <p>
              NEAR Intents 1Click returns a dry quote into that address. The signature is
              checked here. Nothing is deposited.
            </p>
          </li>
        </ol>
      </section>

      <section className="split">
        <div>
          <p className="eyebrow">The arrival</p>
          <h2>One seed. One address. One quote.</h2>
        </div>
        <div className="prose">
          <p>
            A funded swap writes the recipient next to the deposit. Diversified addresses from
            one account look unrelated and still share an incoming viewing key. Once does not
            hand out a second diversifier for a second swap.
          </p>
          <p>
            The address is Orchard-only. Anyone can decode a unified address, and this one has
            no transparent receiver inside it.
          </p>
          <button type="button" className="btn solid" onClick={() => go("desk")}>
            Open the desk
          </button>
        </div>
      </section>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn ghost"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
