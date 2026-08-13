import Reveal from "../components/Reveal";
import { CHANGELOG } from "../data";

export default function UpdatePage({ active }: { active: boolean }) {
  return (
    <>
      <Reveal active={active} delay={0.05}>
        <p className="page-kicker">Update</p>
      </Reveal>
      <Reveal active={active} delay={0.12}>
        <h2 className="page-title">Changelog</h2>
      </Reveal>
      <Reveal active={active} delay={0.2}>
        <p className="page-lead">
          Every purchase includes lifetime updates. Here's what shipped
          recently.
        </p>
      </Reveal>

      <div className="changelog">
        {CHANGELOG.map((log, i) => (
          <Reveal key={log.version} active={active} delay={0.26 + i * 0.08} y={24}>
            <div className="log-item">
              <span className="log-version">{log.version}</span>
              <span className="log-text">{log.text}</span>
              <span className="log-date">{log.date}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
