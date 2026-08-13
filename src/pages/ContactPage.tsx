import { Gamepad2, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { CONTACTS } from "../data";

const ICONS = {
  discord: MessageCircle,
  mail: Mail,
  roblox: Gamepad2,
} as const;

export default function ContactPage({ active }: { active: boolean }) {
  return (
    <div className="contact-wrap">
      <Reveal active={active} delay={0.05}>
        <p className="page-kicker">Contact</p>
      </Reveal>
      <Reveal active={active} delay={0.12}>
        <h2 className="page-title">Let's talk.</h2>
      </Reveal>
      <Reveal active={active} delay={0.2}>
        <p className="page-lead">
          Questions, custom requests, or just want to say hi? Pick a channel
          below — we usually reply within a day.
        </p>
      </Reveal>

      <div className="contact-grid">
        {CONTACTS.map((c, i) => {
          const Icon = ICONS[c.icon];
          return (
            <Reveal key={c.name} active={active} delay={0.28 + i * 0.08} y={30}>
              <div className="contact-card">
                <div className="contact-top">
                  <Icon size={22} strokeWidth={2.2} />
                  <ArrowUpRight size={17} strokeWidth={2.4} className="contact-arrow" />
                </div>
                <h3 className="contact-name">{c.name}</h3>
                <p className="contact-desc">{c.desc}</p>
                <span className="contact-value">{c.value}</span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
