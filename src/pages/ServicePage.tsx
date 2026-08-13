import { ArrowUpRight, Boxes, Code2, LayoutTemplate, Wand2 } from "lucide-react";
import Reveal from "../components/Reveal";
import { SERVICES } from "../data";

const ICONS = {
  layout: LayoutTemplate,
  code: Code2,
  wand: Wand2,
  boxes: Boxes,
} as const;

export default function ServicePage({ active }: { active: boolean }) {
  return (
    <div className="center-wrap">
      <Reveal active={active} delay={0.05}>
        <p className="page-kicker">Service</p>
      </Reveal>
      <Reveal active={active} delay={0.12}>
        <h2 className="page-title">What we can build for you.</h2>
      </Reveal>
      <Reveal active={active} delay={0.2}>
        <p className="page-lead">
          Commission work for Roblox studios of any size — from a single menu
          to a complete game kit.
        </p>
      </Reveal>

      <div className="service-grid">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <Reveal key={s.name} active={active} delay={0.26 + i * 0.08} y={34}>
              <div className="service-card">
                <div className="service-top">
                  <div className="service-icon">
                    <Icon size={21} strokeWidth={2.2} />
                  </div>
                  <span className="service-arrow">
                    <ArrowUpRight size={17} strokeWidth={2.4} />
                  </span>
                </div>
                <h3 className="service-name">{s.name}</h3>
                <p className="service-desc">{s.desc}</p>
                <div className="service-price">
                  <span>starts at</span> {s.price}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
