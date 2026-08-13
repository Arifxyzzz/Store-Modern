import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Languages, ArrowLeftRight, ChevronLeft, User } from "lucide-react";
import HomePage from "./pages/HomePage";
import ServicePage from "./pages/ServicePage";
import ProductsPage from "./pages/ProductsPage";
import UpdatePage from "./pages/UpdatePage";
import SalesPage from "./pages/SalesPage";
import ContactPage from "./pages/ContactPage";
import ProfileAside from "./components/ProfileAside";
import { NAV_PAGES, type PageKey } from "./data";

export default function App() {
  const [index, setIndex] = useState(() => {
    const hash = window.location.hash.replace("#", "") as PageKey;
    const i = NAV_PAGES.indexOf(hash);
    return i >= 0 ? i : 0;
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("Arif");
  const [currency, setCurrency] = useState<"USD" | "IDR">("USD");
  const [lang, setLang] = useState<"EN" | "ID">("EN");
  const wheelLock = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const indexRef = useRef(index);
  indexRef.current = index;

  // Track active nav button position for the sliding pill
  useEffect(() => {
    const update = () => {
      const el = navRefs.current[index];
      if (!el) return;
      setPill({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [index]);

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(NAV_PAGES.length - 1, i)));
  };

  // Wheel / trackpad scroll => horizontal page navigation
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // inside a scrollable area (e.g. product grid), let it scroll natively
      const scrollable = (e.target as Element).closest?.(".scroll-y");
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        return;
      }
      e.preventDefault();
      if (wheelLock.current) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 12) return;
      wheelLock.current = true;
      setTimeout(() => (wheelLock.current = false), 750);
      goTo(indexRef.current + (delta > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") goTo(indexRef.current + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") goTo(indexRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Touch swipe
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;
      const delta = Math.abs(dx) >= Math.abs(dy) ? -dx : dy;
      if (Math.abs(delta) < 40) return;
      goTo(indexRef.current + (delta > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const activeKey = NAV_PAGES[index];

  const navLink = (key: PageKey, i: number) => (
    <button
      key={key}
      ref={(el) => (navRefs.current[i] = el)}
      className={`nav-link${activeKey === key ? " active" : ""}`}
      onClick={() => goTo(NAV_PAGES.indexOf(key))}
    >
      <span className="nav-label">{key.toUpperCase()}</span>
    </button>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <button
            className="icon-btn"
            title="Ganti bahasa"
            onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
          >
            <Languages size={19} strokeWidth={2.4} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={lang}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {lang}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            className="icon-btn"
            title="Ganti mata uang"
            onClick={() => setCurrency(currency === "USD" ? "IDR" : "USD")}
          >
            <ArrowLeftRight size={15} strokeWidth={2.6} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={currency}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {currency}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <span className="brand">AXZY</span>

        <div className="header-right">
          <AnimatePresence mode="wait" initial={false}>
            {profileOpen ? (
              <motion.button
                key="back"
                className="icon-btn"
                title="Close profile"
                onClick={() => setProfileOpen(false)}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronLeft size={24} strokeWidth={2.6} />
              </motion.button>
            ) : loggedIn ? (
              <motion.button
                key="profile"
                className="login-btn"
                title="Open profile"
                onClick={() => setProfileOpen(true)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <span className="login-icon">{userName.charAt(0).toUpperCase()}</span>
                {userName}
              </motion.button>
            ) : (
              <motion.button
                key="login"
                className="login-btn"
                onClick={() => setProfileOpen(true)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <span className="login-icon">
                  <User size={14} strokeWidth={2.6} />
                </span>
                Login
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="main">
        <motion.div className="panel-wrap" layout transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="panel">
            <div className="panel-blobs">
              <span className="blob blob-1" />
              <span className="blob blob-2" />
              <span className="blob blob-3" />
              <span className="blob blob-4" />
            </div>
            <div className="pager">
              <motion.div
                className="pager-track"
                animate={{ x: `-${index * 100}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <section className="page"><HomePage active={index === 0} /></section>
                <section className="page"><ServicePage active={index === 1} /></section>
                <section className="page"><ProductsPage active={index === 2} /></section>
                <section className="page"><UpdatePage active={index === 3} /></section>
                <section className="page"><SalesPage active={index === 4} /></section>
                <section className="page"><ContactPage active={index === 5} /></section>
              </motion.div>
            </div>
            <div className="panel-corner corner-left">
              <span className="corner-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="corner-total">/ {String(NAV_PAGES.length).padStart(2, "0")}</span>
            </div>
            <div className="panel-corner corner-right">
              © 2026 AXZY — scroll to explore
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {profileOpen && (
            <ProfileAside
              loggedIn={loggedIn}
              name={userName}
              onRename={setUserName}
              onLogin={() => setLoggedIn(true)}
              onLogout={() => setLoggedIn(false)}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <nav className="nav-group">
          {pill.ready && (
            <motion.span
              className="nav-pill"
              initial={false}
              animate={{ x: pill.x, width: pill.w }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          {NAV_PAGES.map(navLink)}
        </nav>
      </footer>
    </div>
  );
}
