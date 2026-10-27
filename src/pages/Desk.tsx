import { useMemo, useState } from "react";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { deriveDoor, type DoorKeys } from "../door/derive";
import { fingerprintMark, viewingMark } from "../door/marks";
import { obtainQuote, recordedExample, type PricedQuote } from "../intents/oneclick";
import { ORIGINS } from "../intents/types";
import { refundProblem, toBaseUnits } from "../intents/units";
import { verifyQuoteSignature } from "../intents/verifyQuote";

interface Door extends DoorKeys {
  phrase: string;
  phraseVisible: boolean;
}

export function Desk() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [doorError, setDoorError] = useState<string | null>(null);
  const [originId, setOriginId] = useState(ORIGINS[0].id);
  const [amount, setAmount] = useState("20");
  const [refundTo, setRefundTo] = useState("");
  const [quotedDoor, setQuotedDoor] = useState(0);
  const [priced, setPriced] = useState<PricedQuote | null>(null);
  const [tampered, setTampered] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const origin = ORIGINS.find((item) => item.id === originId) ?? ORIGINS[0];
  const active = doors[quotedDoor];
  const baseUnits = toBaseUnits(amount, origin.decimals);
  const refundIssue = refundTo.trim() ? refundProblem(origin.id, refundTo) : "Enter a refund address.";

  async function cutKey() {
    if (doors.length >= 2 || busy) return;
    setDoorError(null);
    setBusy("Cutting a key in this tab…");
    try {
      const phrase = generateMnemonic(wordlist, 256);
      const keys = await deriveDoor(phrase);
      setDoors((current) => [...current, { ...keys, phrase, phraseVisible: false }]);
      setQuotedDoor(doors.length);
      setPriced(null);
      setTampered(false);
    } catch (error) {
      setDoorError(error instanceof Error ? error.message : "The key could not be derived.");
    } finally {
      setBusy(null);
    }
  }

  async function price() {
    if (!active || !baseUnits || refundIssue || busy) return;
    setQuoteError(null);
    setTampered(false);
    setBusy("Asking 1Click for a dry quote…");
    try {
      const next = await obtainQuote({
        originAsset: origin.asset,
        amount: baseUnits,
        refundTo: refundTo.trim(),
        recipient: active.address,
      });
      setPriced(next);
    } catch (error) {
      setPriced(null);
      setQuoteError(error instanceof Error ? error.message : "The quote failed.");
    } finally {
      setBusy(null);
    }
  }

  function showRecorded() {
    setQuoteError(null);
    setTampered(false);
    setPriced(recordedExample());
  }

  function togglePhrase(index: number) {
    setDoors((current) =>
      current.map((door, place) =>
        place === index ? { ...door, phraseVisible: !door.phraseVisible } : door,
      ),
    );
  }

  const shown = priced ? displayQuote(priced, tampered) : null;
  const signatureOk = shown ? verifyQuoteSignature(shown.quote) : false;
  const recipientMatches =
    shown && active ? shown.quote.quoteRequest.recipient === active.address : false;

  const step = !doors.length ? 0 : !shown || !signatureOk ? 2 : 3;

  return (
    <div className="page">
      <p className="eyebrow">Desk</p>
      <h1>Price one arrival.</h1>
      <p className="lede">
        Cut a key in this browser, then ask 1Click for a dry price into that Orchard address.
        A second key is a second seed.
      </p>

      <section className="work">
        <div className="card work-main">
          {doors.length === 0 ? (
            <>
              <h2>Cut a key to begin</h2>
              <p>
                The seed is generated in this tab and is not sent with the quote. Refreshing
                the page drops it. Once quotes the first diversifier only.
              </p>
              {doorError ? <p className="fail">{doorError}</p> : null}
              <button type="button" className="btn solid" onClick={cutKey} disabled={Boolean(busy)}>
                {busy ?? "Cut a key"}
              </button>
            </>
          ) : (
            <>
              <div className="panel-head">
                <h2>Door {quotedDoor + 1}</h2>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={cutKey}
                  disabled={Boolean(busy) || doors.length >= 2}
                >
                  {doors.length === 1 ? "Cut the second key" : "Two keys"}
                </button>
              </div>
              <p className="note">
                The sibling is the next diversifier of this key. It stays out of the recipient
                field.
              </p>
              <label>
                From
                <select
                  value={originId}
                  onChange={(event) => {
                    setOriginId(event.target.value);
                    setRefundTo("");
                    setPriced(null);
                  }}
                >
                  {ORIGINS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="fields">
                <label>
                  Amount
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setPriced(null);
                    }}
                  />
                </label>
                <label>
                  Refund on {origin.chain}
                  <input
                    value={refundTo}
                    placeholder={origin.placeholder}
                    spellCheck={false}
                    onChange={(event) => {
                      setRefundTo(event.target.value);
                      setPriced(null);
                    }}
                  />
                </label>
              </div>
              {refundTo && refundIssue ? <p className="fail">{refundIssue}</p> : null}
              {!baseUnits ? <p className="fail">Enter an amount this asset can represent.</p> : null}
              <div className="actions">
                <button
                  type="button"
                  className="btn solid"
                  onClick={price}
                  disabled={Boolean(busy) || !baseUnits || Boolean(refundIssue)}
                >
                  {busy ?? `Price door ${quotedDoor + 1}`}
                </button>
                <button type="button" className="btn ghost" onClick={showRecorded} disabled={Boolean(busy)}>
                  Recorded example
                </button>
              </div>
              {quoteError ? <p className="fail">{quoteError}</p> : null}
              {doorError ? <p className="fail">{doorError}</p> : null}
            </>
          )}
        </div>

        <ol className="card rail">
          <li className={step > 0 ? "done" : "now"}>
            <span>01</span>
            <h3>Cut</h3>
            <p>A fresh seed and one Orchard address.</p>
          </li>
          <li className={step > 1 ? "done" : ""}>
            <span>02</span>
            <h3>Separate</h3>
            <p>The next diversifier stays off the quote.</p>
          </li>
          <li className={step > 2 ? "done" : step === 2 ? "now" : ""}>
            <span>03</span>
            <h3>Price</h3>
            <p>A dry quote. The signature is checked here.</p>
          </li>
        </ol>
      </section>

      {doors.length > 0 ? (
        <ol className="door-list">
          {doors.map((door, index) => (
            <li key={door.seedFingerprint} className={index === quotedDoor ? "card is-quoted" : "card"}>
              <div className="panel-head">
                <h2>Door {index + 1}</h2>
                <button type="button" className="btn ghost" onClick={() => setQuotedDoor(index)}>
                  {index === quotedDoor ? "Quoted" : "Quote this door"}
                </button>
              </div>
              <Field k="Recipient" v={door.address} copy />
              <dl className="facts">
                <div>
                  <dt>Diversifier</dt>
                  <dd className="mono">{door.diversifier}</dd>
                </div>
                <div>
                  <dt>Viewing-key mark</dt>
                  <dd className="mono">{viewingMark(door.ufvk)}</dd>
                </div>
                <div>
                  <dt>Seed mark</dt>
                  <dd className="mono">{fingerprintMark(door.seedFingerprint)}</dd>
                </div>
              </dl>
              <div className="sibling">
                <p className="eyebrow">Same key, next diversifier</p>
                <p>
                  Diversifier {door.siblingDiversifier} is a different address and the same
                  viewing key. Once does not put it in the recipient field.
                </p>
                <Field k="Left out" v={door.siblingAddress} />
              </div>
              <button type="button" className="text" onClick={() => togglePhrase(index)}>
                {door.phraseVisible ? "Hide the seed" : "Show the seed"}
              </button>
              {door.phraseVisible ? <p className="phrase">{door.phrase}</p> : null}
            </li>
          ))}
        </ol>
      ) : null}

      {doors.length === 2 ? <Comparison left={doors[0]} right={doors[1]} /> : null}

      {shown ? (
        <QuoteCard
          priced={shown}
          signatureOk={signatureOk}
          recipientMatches={recipientMatches}
          sibling={active?.siblingAddress}
          onTamper={() => setTampered((value) => !value)}
          tampered={tampered}
        />
      ) : null}
    </div>
  );
}

function Comparison({ left, right }: { left: Door; right: Door }) {
  const sameView = left.ufvk === right.ufvk;
  const sameSeed = left.seedFingerprint === right.seedFingerprint;
  const shared = sameView || sameSeed;
  return (
    <section className={shared ? "card verdict bad" : "card verdict"}>
      <p className="eyebrow">Two doors</p>
      <p>
        {shared
          ? "These two doors still share key material. Once should not have produced that."
          : "Door 2 does not share a viewing key or a seed with door 1. A payment to one address does not teach a watcher the other."}
      </p>
    </section>
  );
}

function QuoteCard({
  priced,
  signatureOk,
  recipientMatches,
  sibling,
  onTamper,
  tampered,
}: {
  priced: PricedQuote;
  signatureOk: boolean;
  recipientMatches: boolean;
  sibling?: string;
  onTamper: () => void;
  tampered: boolean;
}) {
  const { quote, source } = priced;
  const namesSibling = Boolean(sibling && quote.quoteRequest.recipient === sibling);
  const line = useMemo(() => {
    if (namesSibling) return "The recipient is the sibling address. Once would discard this quote.";
    if (recipientMatches) return "The recipient is this door. The sibling address is not in the quote.";
    if (source === "recorded") {
      return "This example was signed for the public abandon-mnemonic door, which may not be the door above.";
    }
    return "The recipient does not match the selected door.";
  }, [namesSibling, recipientMatches, source]);

  return (
    <section className="card quote">
      <p className="eyebrow">{source === "live" ? "Live dry quote" : "Recorded dry quote · 27 Oct 2026"}</p>
      <p className="out">
        <strong>{quote.quote.amountOutFormatted} ZEC</strong>
        <span> about ${quote.quote.amountOutUsd}</span>
      </p>
      <p className={signatureOk ? "ok" : "fail"}>
        {signatureOk ? "Signature valid." : "Signature rejected."}
        {tampered ? " The output amount was edited in this tab." : ""}
      </p>
      <Field k="Signed recipient" v={quote.quoteRequest.recipient} />
      <p className={recipientMatches && !namesSibling ? "ok" : "fail"}>{line}</p>
      <dl className="facts">
        <div>
          <dt>In</dt>
          <dd>
            {quote.quote.amountInFormatted} · ${quote.quote.amountInUsd}
          </dd>
        </div>
        <div>
          <dt>Minimum out</dt>
          <dd className="mono">{quote.quote.minAmountOut}</dd>
        </div>
        <div>
          <dt>Refund field</dt>
          <dd className="mono">{shorten(quote.quoteRequest.refundTo)}</dd>
        </div>
      </dl>
      <button type="button" className="btn ghost" onClick={onTamper}>
        {tampered ? "Restore the signed amount" : "Tamper with the output"}
      </button>
    </section>
  );
}

function Field({ k, v, copy = false }: { k: string; v: string; copy?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="field">
      <div className="field-head">
        <span>{k}</span>
        {copy ? (
          <button
            type="button"
            className="text"
            onClick={() => {
              void navigator.clipboard.writeText(v).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1200);
              });
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      <code>{v}</code>
    </div>
  );
}

function displayQuote(priced: PricedQuote, tampered: boolean): PricedQuote {
  if (!tampered) return priced;
  return {
    source: priced.source,
    quote: {
      ...priced.quote,
      quote: {
        ...priced.quote.quote,
        amountOut: "1",
        amountOutFormatted: "0.00000001",
        amountOutUsd: "0.00",
      },
    },
  };
}

function shorten(value: string): string {
  if (value.length < 22) return value;
  return `${value.slice(0, 10)}…${value.slice(-6)}`;
}
