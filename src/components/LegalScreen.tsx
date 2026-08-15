import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Ban,
  Building2,
  Check,
  Cookie,
  Database,
  FileText,
  Fingerprint,
  KeyRound,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

export type LegalKey = "terms" | "privacy" | "company" | "license";

const META: Record<
  LegalKey,
  { n: string; label: string; icon: typeof FileText; meta: string }
> = {
  terms: {
    n: "01",
    label: "Terms of Service",
    icon: FileText,
    meta: "Updated 12 Aug 2026",
  },
  privacy: {
    n: "02",
    label: "Privacy Policy",
    icon: ShieldCheck,
    meta: "Updated 12 Aug 2026",
  },
  company: {
    n: "03",
    label: "Company",
    icon: Building2,
    meta: "Independent studio",
  },
  license: {
    n: "04",
    label: "License",
    icon: KeyRound,
    meta: "Standard license v2",
  },
};

const fade = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

/* ---------------- 01 — contract sheet, clauses tiled across ---------------- */
const CLAUSES = [
  {
    n: "01",
    h: "Your account",
    b: "You are responsible for everything that happens under your account. Sharing one to hand assets to people who have not bought them is not allowed.",
  },
  {
    n: "02",
    h: "Purchases",
    b: "Every price is shown before checkout and charged once, never as a subscription. A third-party gateway handles payment — we never see your card.",
  },
  {
    n: "03",
    h: "Acceptable use",
    b: "You may not resell, redistribute, or publish our assets as your own, modified or not. Projects that break Roblox's own terms are out too.",
  },
  {
    n: "04",
    h: "Availability",
    b: "We keep every product downloadable indefinitely, but may retire an asset if a dependency breaks. Existing owners keep access wherever possible.",
  },
  {
    n: "05",
    h: "Changes to these terms",
    b: "If we revise these terms the date above changes. Continuing to use the store after a revision means you accept it.",
  },
];

function TermsDoc() {
  return (
    <div className="doc doc-terms">
      {CLAUSES.map((c) => (
        <div key={c.n} className="clause">
          <span className="clause-n">{c.n}</span>
          <h3>{c.h}</h3>
          <p>{c.b}</p>
        </div>
      ))}
      {/* the sixth cell keeps the grid square instead of leaving a hole */}
      <div className="terms-seal">
        <span className="seal-mark">AXZY</span>
        <span className="seal-sub">Binding on purchase · v2.4</span>
      </div>
    </div>
  );
}

/* ---------------- 02 — collected / never / erase, three columns ---------------- */
const COLLECT = [
  { icon: Mail, t: "Email & username", d: "To identify your account and send receipts." },
  { icon: Database, t: "Order history", d: "So your licenses stay downloadable forever." },
  { icon: Cookie, t: "Session cookies", d: "To keep you logged in, and remember currency." },
];

const NEVER = [
  { icon: Fingerprint, t: "Card details", d: "They go straight to the gateway, never to us." },
  { icon: Users, t: "Sold to anyone", d: "We do not sell or rent your data. Ever." },
  { icon: Ban, t: "Ad trackers", d: "No third-party advertising pixels on this site." },
];

function PrivacyDoc() {
  return (
    <div className="doc doc-privacy">
      <div className="privacy-col col-yes">
        <span className="privacy-col-head">
          <Check size={14} strokeWidth={3} />
          What we collect
        </span>
        {COLLECT.map((r) => (
          <div key={r.t} className="privacy-row">
            <span className="privacy-icon">
              <r.icon size={16} strokeWidth={2.3} />
            </span>
            <div>
              <b>{r.t}</b>
              <p>{r.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="privacy-col col-no">
        <span className="privacy-col-head">
          <X size={14} strokeWidth={3} />
          What we never touch
        </span>
        {NEVER.map((r) => (
          <div key={r.t} className="privacy-row">
            <span className="privacy-icon">
              <r.icon size={16} strokeWidth={2.3} />
            </span>
            <div>
              <b>{r.t}</b>
              <p>{r.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="privacy-erase">
        <span className="erase-icon">
          <Trash2 size={19} strokeWidth={2.3} />
        </span>
        <b>Erase everything</b>
        <p>
          Ask us and we delete your account, orders, and email within 30 days.
          Deletion also removes access to your licenses, so download anything you
          want to keep first.
        </p>
        <a className="erase-btn" href="#">
          Request deletion
          <ArrowRight size={14} strokeWidth={2.6} />
        </a>
      </div>
    </div>
  );
}

/* ---------------- 03 — studio profile, brand left / record right ---------------- */
const STATS = [
  { v: "2024", l: "Founded" },
  { v: "60+", l: "Assets shipped" },
  { v: "18K", l: "Downloads" },
  { v: "<1d", l: "Reply time" },
];

const TIMELINE = [
  { y: "2024", t: "First UI kit", d: "Built for our own game, then released after too many people asked." },
  { y: "2025", t: "Store opens", d: "Moved off DMs and onto a real storefront with instant delivery." },
  { y: "2026", t: "Lifetime updates", d: "Every asset now gets free patches after Roblox engine updates." },
];

function CompanyDoc() {
  return (
    <div className="doc doc-company">
      <div className="co-brand">
        <span className="co-wordmark">AXZY.</span>
        <p className="co-lede">
          A small independent studio building assets and tooling for Roblox
          creators. Everything we sell is used in a real project before it
          reaches the store.
        </p>
        <div className="co-contact">
          <a className="co-card" href="#">
            <MessageCircle size={17} strokeWidth={2.3} />
            <b>Discord</b>
            <span>Support and previews.</span>
          </a>
          <a className="co-card" href="#">
            <Mail size={17} strokeWidth={2.3} />
            <b>hello@axzy.store</b>
            <span>Business and custom orders.</span>
          </a>
        </div>
      </div>

      <div className="co-record">
        <div className="co-stats">
          {STATS.map((s) => (
            <div key={s.l} className="co-stat">
              <b>{s.v}</b>
              <span>{s.l}</span>
            </div>
          ))}
        </div>

        <div className="co-timeline">
          {TIMELINE.map((t) => (
            <div key={t.y} className="co-milestone">
              <span className="co-year">{t.y}</span>
              <span className="co-dot" />
              <div className="co-mile-text">
                <b>{t.t}</b>
                <p>{t.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 04 — permit card left, terms right ---------------- */
const MAY = [
  "Use in unlimited personal projects",
  "Use in commercial experiences",
  "Modify the source freely",
  "Keep using it forever",
];

const MAY_NOT = [
  "Resell or sublicense the asset",
  "Upload it to the Roblox toolbox",
  "Bundle it into an asset pack",
  "Publish it as your own work",
];

function LicenseDoc() {
  return (
    <div className="doc doc-license">
      <div className="permit">
        <div className="permit-top">
          <span className="permit-issuer">AXZY · Standard license</span>
          <span className="permit-v">v2</span>
        </div>
        <div className="permit-body">
          <span className="permit-label">Granted to</span>
          <span className="permit-holder">The purchasing account</span>
          <div className="permit-meta">
            <span>
              <b>Scope</b>
              Unlimited projects
            </span>
            <span>
              <b>Term</b>
              Perpetual
            </span>
            <span>
              <b>Updates</b>
              Free for life
            </span>
          </div>
        </div>
        <div className="permit-perf" />
        <div className="permit-foot">
          <Sparkles size={13} strokeWidth={2.4} />
          One purchase covers you and the collaborators on your project.
        </div>
      </div>

      <div className="permit-lists">
        <div className="permit-list list-may">
          <span className="permit-list-head">You may</span>
          {MAY.map((t) => (
            <span key={t} className="permit-item">
              <Check size={13} strokeWidth={3} />
              {t}
            </span>
          ))}
        </div>
        <div className="permit-list list-not">
          <span className="permit-list-head">You may not</span>
          {MAY_NOT.map((t) => (
            <span key={t} className="permit-item">
              <X size={13} strokeWidth={3} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const DOCS: Record<LegalKey, () => ReactElement> = {
  terms: TermsDoc,
  privacy: PrivacyDoc,
  company: CompanyDoc,
  license: LicenseDoc,
};

export default function LegalScreen({ tab }: { tab: LegalKey }) {
  const doc = META[tab];
  const Doc = DOCS[tab];

  return (
    <section className={`legal-screen scroll-y is-${tab}`}>
      <div className="legal-inner">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article key={tab} className="legal-doc" {...fade}>
            <header className="doc-head">
              <span className="doc-n">{doc.n}</span>
              <div>
                <span className="legal-eyebrow">{doc.meta}</span>
                <h2 className="doc-title">{doc.label}</h2>
              </div>
              {/* scrolling up is the way out — no button needed */}
              <span className="doc-hint">Scroll up to go back</span>
            </header>

            <Doc />
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
