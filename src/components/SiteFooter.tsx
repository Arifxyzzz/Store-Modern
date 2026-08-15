import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Globe,
  Mail,
  MessageCircle,
  Play,
  Send,
} from "lucide-react";
import { NAV_PAGES, type PageKey } from "../data";
import type { LegalKey } from "./LegalScreen";

const SOCIALS: { label: string; icon: typeof Mail; href: string }[] = [
  { label: "Discord", icon: MessageCircle, href: "#" },
  { label: "YouTube", icon: Play, href: "#" },
  { label: "Telegram", icon: Send, href: "#" },
  { label: "Website", icon: Globe, href: "#" },
  { label: "Email", icon: Mail, href: "#" },
];

const LEGAL: { key: LegalKey; label: string }[] = [
  { key: "terms", label: "Terms of Service" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "company", label: "Company" },
  { key: "license", label: "License" },
];

export default function SiteFooter({
  onTop,
  onGoTo,
  onLegal,
  active,
}: {
  onTop: () => void;
  onGoTo: (i: number) => void;
  onLegal: (tab: LegalKey) => void;
  active: LegalKey | null;
}) {
  return (
    <section className="site-footer scroll-y">
      <div className="site-footer-inner">
        <div className="foot-top">
          {/* brand + pitch */}
          <div className="foot-brand">
            <span className="foot-logo">AXZY</span>
            <p className="foot-tagline">
              Roblox assets for creators. Clean, smooth, ready to ship.
            </p>
            <div className="foot-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  className="foot-social"
                  href={s.href}
                  title={s.label}
                  aria-label={s.label}
                >
                  <s.icon size={17} strokeWidth={2.2} />
                </a>
              ))}
            </div>
          </div>

          {/* sitemap */}
          <div className="foot-col">
            <span className="foot-col-title">Explore</span>
            {NAV_PAGES.map((key: PageKey, i) => (
              <button key={key} className="foot-link" onClick={() => onGoTo(i)}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <div className="foot-col">
            <span className="foot-col-title">Legal</span>
            {LEGAL.map((l) => (
              <button
                key={l.key}
                className={`foot-link${active === l.key ? " is-open" : ""}`}
                onClick={() => onLegal(l.key)}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* newsletter */}
          <div className="foot-col foot-cta">
            <span className="foot-col-title">Stay updated</span>
            <p className="foot-cta-sub">
              New drops, updates and discounts — no spam.
            </p>
            <form className="foot-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@email.com" />
              <button type="submit" title="Subscribe">
                <ArrowUpRight size={16} strokeWidth={2.6} />
              </button>
            </form>
          </div>
        </div>

        {/* oversized wordmark */}
        <div className="foot-wordmark" aria-hidden="true">
          AXZY
        </div>

        <div className="foot-bottom">
          <span className="foot-copy">© 2026 AXZY — All rights reserved.</span>
          <motion.button
            className="foot-top-btn"
            onClick={onTop}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            Back to top
            <ArrowUp size={15} strokeWidth={2.6} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
