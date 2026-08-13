import {
  ArrowRight,
  Download,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react";
import Reveal from "../components/Reveal";

const FEATURES = [
  { icon: Layers, label: "40+ UI Components" },
  { icon: Zap, label: "Optimized & Lightweight" },
  { icon: ShieldCheck, label: "Lifetime Updates" },
];

export default function HomePage({ active }: { active: boolean }) {
  return (
    <div className="hero">
      <div className="hero-center">
        <Reveal active={active} delay={0.02}>
          <div className="hero-features">
            {FEATURES.map((f) => (
              <div key={f.label} className="hero-chip">
                <f.icon size={14} strokeWidth={2.4} />
                {f.label}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal active={active} delay={0.1} y={40}>
          <img src="/logo.webp" alt="AXZY logo" className="hero-logo-big" />
        </Reveal>

        <Reveal active={active} delay={0.2}>
          <p className="hero-tagline">
            Roblox assets built for creators.{" "}
            <span>Clean, smooth, ready to ship.</span>
          </p>
        </Reveal>

        <Reveal active={active} delay={0.28}>
          <div className="hero-stats">
            <div className="hero-stat">
              <ShoppingBag size={17} strokeWidth={2.4} />
              <b>2.4K+</b> <span>Sales</span>
            </div>
            <div className="hero-divider" />
            <div className="hero-stat">
              <Download size={17} strokeWidth={2.4} />
              <b>18K+</b> <span>Download</span>
            </div>
            <div className="hero-divider" />
            <div className="hero-stat">
              <Star size={17} strokeWidth={2.4} />
              <b>4.9</b> <span>Rating</span>
            </div>
          </div>
        </Reveal>

        <Reveal active={active} delay={0.36}>
          <button className="cta-btn">
            Get Started
            <ArrowRight size={17} strokeWidth={2.6} />
          </button>
        </Reveal>
      </div>
    </div>
  );
}
