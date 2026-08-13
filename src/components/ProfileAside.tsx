import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  KeyRound,
  LogOut,
  Pencil,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { LICENSES } from "../data";

const item = {
  hidden: { opacity: 0, x: 36 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      delay: 0.15 + i * 0.06,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const PURCHASES_LINE = [32, 58, 44, 76, 62, 92];
const DOWNLOADS_LINE = [20, 40, 64, 52, 84, 70];

const CHART_W = 172;
const CHART_H = 84;
const PAD_X = 8;
const PAD_Y = 10;

const RING_R = 30;
const RING_C = 2 * Math.PI * RING_R;
const RING_VALUE = 0.72;

function toPoints(values: number[]) {
  const stepX = (CHART_W - PAD_X * 2) / (values.length - 1);
  return values.map((v, i) => ({
    x: PAD_X + i * stepX,
    y: CHART_H - PAD_Y - (v / 100) * (CHART_H - PAD_Y * 2),
  }));
}

function toPath(points: { x: number; y: number }[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
}

// kredensial dummy dari .env — testing local, frontend only
const ENV_EMAIL = import.meta.env.VITE_AUTH_EMAIL ?? "";
const ENV_USERNAME = import.meta.env.VITE_AUTH_USERNAME ?? "";
const ENV_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD ?? "";

function AuthPanel({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [human, setHuman] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const isLogin = mode === "login";

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setError("");
  };

  const toggleHuman = () => {
    if (human || verifying) return;
    // dummy captcha: spinner sebentar lalu tercentang
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setHuman(true);
    }, 900);
  };

  const submit = () => {
    if (!human) {
      setError("Centang verifikasi dulu ya.");
      return;
    }
    if (isLogin) {
      const userOk =
        username.trim().toLowerCase() === ENV_USERNAME.toLowerCase() ||
        username.trim().toLowerCase() === ENV_EMAIL.toLowerCase();
      if (userOk && password === ENV_PASSWORD) {
        setError("");
        onLogin();
      } else {
        setError("Username atau password salah.");
      }
    } else {
      // register dummy: langsung dianggap berhasil
      setError("");
      onLogin();
    }
  };

  return (
    <motion.div
      key="auth"
      className="auth-panel"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="auth-head">
        <div className="auth-avatar">
          <User size={22} strokeWidth={2.2} />
        </div>
        <h3 className="auth-title">
          {isLogin ? "Welcome back." : "Create account."}
        </h3>
        <p className="auth-sub">
          {isLogin
            ? "Login to access your licenses."
            : "Register to start collecting assets."}
        </p>
      </div>

      <div className="auth-tabs">
        <button
          className={`auth-tab${isLogin ? " active" : ""}`}
          onClick={() => switchMode("login")}
        >
          Login
        </button>
        <button
          className={`auth-tab${!isLogin ? " active" : ""}`}
          onClick={() => switchMode("register")}
        >
          Register
        </button>
        <span
          className="auth-tab-slider"
          style={{ transform: `translateX(${isLogin ? 0 : 100}%)` }}
        />
      </div>

      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <AnimatePresence initial={false}>
          {!isLogin && (
            <motion.label
              className="auth-field-wrap"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="auth-field">
                <AtSign size={15} strokeWidth={2.4} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
            </motion.label>
          )}
        </AnimatePresence>

        <label className="auth-field">
          <User size={15} strokeWidth={2.4} />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="auth-field">
          <KeyRound size={15} strokeWidth={2.4} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              className="auth-error"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" className="auth-submit">
          {isLogin ? "Login" : "Create account"}
          <ArrowRight size={16} strokeWidth={2.6} />
        </button>
      </form>

      <p className="auth-hint">
        {isLogin ? "No account yet?" : "Already registered?"}{" "}
        <button
          className="auth-switch"
          onClick={() => switchMode(isLogin ? "register" : "login")}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>

      {/* dummy anti-bot captcha */}
      <button
        type="button"
        className={`captcha-box${human ? " verified" : ""}`}
        onClick={toggleHuman}
      >
        <span className={`captcha-check${human ? " on" : ""}`}>
          {verifying ? (
            <RefreshCcw size={15} strokeWidth={2.6} className="spin" />
          ) : human ? (
            <Check size={15} strokeWidth={3} />
          ) : null}
        </span>
        <span className="captcha-text">
          <b>
            {verifying
              ? "Verifying…"
              : human
                ? "Verification passed"
                : "I'm not a robot"}
          </b>
          <span>
            {verifying
              ? "Checking your browser before continuing."
              : human
                ? "You can continue to login or register."
                : "Please verify that you're human to continue."}
          </span>
        </span>
        <span className="captcha-brand-box">
          <ShieldCheck size={20} strokeWidth={2} />
          <span>AXZY</span>
          <span className="captcha-brand-sub">Security</span>
        </span>
      </button>
    </motion.div>
  );
}

function EditPanel({
  name,
  onSave,
  onCancel,
}: {
  name: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [draftName, setDraftName] = useState(name);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!draftName.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    // ganti password opsional — kalau salah satu field pw diisi, semua dicek
    if (currentPw || newPw || confirmPw) {
      if (currentPw !== ENV_PASSWORD) {
        setError("Current password salah.");
        return;
      }
      if (newPw.length < 6) {
        setError("Password baru minimal 6 karakter.");
        return;
      }
      if (newPw !== confirmPw) {
        setError("Konfirmasi password tidak cocok.");
        return;
      }
    }
    setError("");
    onSave(draftName.trim());
  };

  return (
    <motion.div
      key="edit"
      className="auth-panel"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="auth-head">
        <div className="auth-avatar">{name.charAt(0).toUpperCase()}</div>
        <h3 className="auth-title">Edit profile.</h3>
        <p className="auth-sub">Update your name or change password.</p>
      </div>

      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <span className="aside-section-title">Display name</span>
        <label className="auth-field">
          <User size={15} strokeWidth={2.4} />
          <input
            type="text"
            placeholder="Display name"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
        </label>

        <span className="aside-section-title edit-section-gap">
          Change password
        </span>
        <label className="auth-field">
          <KeyRound size={15} strokeWidth={2.4} />
          <input
            type="password"
            placeholder="Current password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
          />
        </label>
        <label className="auth-field">
          <KeyRound size={15} strokeWidth={2.4} />
          <input
            type="password"
            placeholder="New password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
        </label>
        <label className="auth-field">
          <ShieldCheck size={15} strokeWidth={2.4} />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
        </label>

        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              className="auth-error"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="edit-actions">
          <button type="button" className="tx-secondary edit-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="auth-submit">
            Save changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}

const PER_PAGE = 4;

function LicenseList() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(LICENSES.length / PER_PAGE);
  const shown = LICENSES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <>
      <div className="license-list">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((l, i) => (
            <motion.div
              key={l.name}
              className="license-item"
              initial={{ opacity: 0, x: 24 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.35,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
            >
              <span className="license-icon">
                <Box size={17} strokeWidth={2.2} />
              </span>
              <span className="license-info">
                <span className="license-name">{l.name}</span>
                <span className="license-version">{l.version}</span>
              </span>
              <button className="license-dl" title="Download">
                <Download size={15} strokeWidth={2.4} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {pages > 1 && (
        <div className="license-pager">
          <button
            className="pager-btn"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={15} strokeWidth={2.6} />
          </button>
          <span className="pager-count">
            <b>{page + 1}</b> / {pages}
          </span>
          <button
            className="pager-btn"
            disabled={page === pages - 1}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={15} strokeWidth={2.6} />
          </button>
        </div>
      )}
    </>
  );
}

export default function ProfileAside({
  loggedIn,
  name,
  onRename,
  onLogin,
  onLogout,
}: {
  loggedIn: boolean;
  name: string;
  onRename: (name: string) => void;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <motion.aside
      className="profile-aside"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "auto", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="profile-inner">
        <AnimatePresence mode="wait" initial={false}>
        {!loggedIn ? (
          <AuthPanel onLogin={onLogin} />
        ) : editing ? (
          <EditPanel
            key="edit"
            name={name}
            onSave={(newName) => {
              onRename(newName);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
        <motion.div
          key="profile"
          className="profile-panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
        <motion.div className="profile-head" variants={item} custom={0} initial="hidden" animate="show">
          <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="profile-id">
            <div className="profile-name">{name}</div>
            <div className="profile-plan">
              <BadgeCheck size={14} strokeWidth={2.6} />
              Creator Plan
            </div>
          </div>
          <button
            className="profile-logout"
            title="Edit profile"
            onClick={() => setEditing(true)}
          >
            <Pencil size={15} strokeWidth={2.4} />
          </button>
          <button className="profile-logout" title="Logout" onClick={onLogout}>
            <LogOut size={16} strokeWidth={2.4} />
          </button>
        </motion.div>

        <motion.div className="profile-stats" variants={item} custom={1} initial="hidden" animate="show">
          <div className="profile-stat">
            <div className="profile-stat-value">50</div>
            <div className="profile-stat-label">
              <ShoppingBag size={13} strokeWidth={2.4} /> Purchase
            </div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">10K</div>
            <div className="profile-stat-label">
              <Wallet size={13} strokeWidth={2.4} /> Spending
            </div>
          </div>
        </motion.div>

        <motion.div className="profile-chart" variants={item} custom={2} initial="hidden" animate="show">
          <div className="profile-chart-head">
            <span className="aside-section-title">Activity</span>
            <span className="profile-chart-trend">
              <TrendingUp size={13} strokeWidth={2.6} />
              +48%
            </span>
          </div>
          <div className="chart-split">
            <div className="chart-left">
              <svg
                className="chart-svg"
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                fill="none"
              >
                {[0.25, 0.5, 0.75].map((t) => (
                  <line
                    key={t}
                    x1={PAD_X}
                    x2={CHART_W - PAD_X}
                    y1={PAD_Y + t * (CHART_H - PAD_Y * 2)}
                    y2={PAD_Y + t * (CHART_H - PAD_Y * 2)}
                    stroke="#26262a"
                    strokeDasharray="3 5"
                  />
                ))}

                <motion.path
                  d={toPath(toPoints(DOWNLOADS_LINE))}
                  stroke="#6e6e76"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
                />
                <motion.path
                  d={toPath(toPoints(PURCHASES_LINE))}
                  stroke="#f4f4f2"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
                />
                {toPoints(DOWNLOADS_LINE).map((p, i) => (
                  <motion.circle
                    key={`d-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="2.8"
                    fill="#1a1a1d"
                    stroke="#6e6e76"
                    strokeWidth="2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                  />
                ))}
                {toPoints(PURCHASES_LINE).map((p, i) => (
                  <motion.circle
                    key={`p-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="3.2"
                    fill="#1a1a1d"
                    stroke="#f4f4f2"
                    strokeWidth="2.2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                  />
                ))}
              </svg>
              <div className="chart-months">
                {MONTHS.map((m) => (
                  <span key={m} className="chart-label">
                    {m}
                  </span>
                ))}
              </div>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot legend-light" /> Purchase
                </span>
                <span className="legend-item">
                  <span className="legend-dot legend-dim" /> Download
                </span>
              </div>
            </div>

            <div className="chart-ring">
              <svg viewBox="0 0 80 80" fill="none">
                <circle
                  cx="40"
                  cy="40"
                  r={RING_R}
                  stroke="#26262a"
                  strokeWidth="7"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={RING_R}
                  stroke="#f4f4f2"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  transform="rotate(-90 40 40)"
                  initial={{ strokeDashoffset: RING_C }}
                  animate={{ strokeDashoffset: RING_C * (1 - RING_VALUE) }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="chart-ring-center">
                <b>{Math.round(RING_VALUE * 100)}%</b>
                <span>Usage</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} custom={3} initial="hidden" animate="show">
          <span className="aside-section-title">My License</span>
        </motion.div>

        <motion.div
          className="license-wrap"
          variants={item}
          custom={4}
          initial="hidden"
          animate="show"
        >
          <LicenseList />
        </motion.div>
        </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
