import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Languages,
  ArrowLeftRight,
  ChevronLeft,
  ChevronsDown,
  User,
  House,
  Wrench,
  Package,
  RefreshCw,
  Receipt,
  ShoppingCart,
  Mail,
} from "lucide-react";
import SiteFooter from "./components/SiteFooter";
import LegalScreen, { type LegalKey } from "./components/LegalScreen";
import HomePage from "./pages/HomePage";
import ServicePage from "./pages/ServicePage";
import ProductsPage from "./pages/ProductsPage";
import UpdatePage from "./pages/UpdatePage";
import SalesPage from "./pages/SalesPage";
import ContactPage from "./pages/ContactPage";
import ProfileAside from "./components/ProfileAside";
import {
  NAV_PAGES,
  ORDERS,
  type Order,
  type OrderStatus,
  type PageKey,
} from "./data";

const NAV_ICONS: Record<PageKey, typeof House> = {
  home: House,
  service: Wrench,
  products: Package,
  update: RefreshCw,
  sales: Receipt,
  contact: Mail,
};

export default function App() {
  const [index, setIndex] = useState(() => {
    const hash = window.location.hash.replace("#", "") as PageKey;
    const i = NAV_PAGES.indexOf(hash);
    return i >= 0 ? i : 0;
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userName, setUserName] = useState("Arif");
  // one shared order list — checkout creates orders here, the profile
  // orders panel is the single place to pay, cancel, or open an invoice
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [currency, setCurrency] = useState<"USD" | "IDR">("USD");
  const [lang, setLang] = useState<"EN" | "ID">("EN");
  // vertical depth of the shell: 0 = pages, 1 = footer (the bottom of the site)
  const [depth, setDepth] = useState(0);
  // a legal document only exists once picked from the footer — never scrolled to
  const [legalTab, setLegalTab] = useState<LegalKey | null>(null);
  const wheelLock = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const indexRef = useRef(index);
  indexRef.current = index;
  const depthRef = useRef(depth);
  depthRef.current = depth;

  // checkout hands a new order to the shared list and sends the user here
  const placeOrder = (order: Order) =>
    setOrders((prev) => [order, ...prev]);
  const openOrders = () => {
    setProfileOpen(true);
    setCartOpen(true);
  };
  const setOrderStatus = (txid: string, status: OrderStatus) =>
    setOrders((prev) =>
      prev.map((o) => (o.txid === txid ? { ...o, status } : o))
    );

  // unpaid orders drive the dot on the login/profile button
  const hasPending = orders.some(
    (o) => o.status === "awaiting" || o.status === "processing"
  );

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
    setDepth(0);
    setTimeout(() => setLegalTab(null), 850);
    setIndex(Math.max(0, Math.min(NAV_PAGES.length - 1, i)));
  };

  // picking a document from the footer mounts it below and slides down to it
  const openLegal = (tab: LegalKey) => {
    setLegalTab(tab);
    setDepth(2);
  };

  // leaving a document slides back to the footer, then unmounts it
  const closeLegal = () => {
    setDepth(1);
    setTimeout(() => setLegalTab(null), 850);
  };

  // one step: pages horizontally, then down to the footer — which is the end
  const step = (dir: 1 | -1) => {
    const last = NAV_PAGES.length - 1;
    // inside a legal document only an upward step is meaningful
    if (depthRef.current === 2) {
      if (dir < 0) closeLegal();
      return;
    }
    if (depthRef.current === 1) {
      if (dir < 0) setDepth(0);
      return;
    }
    if (dir > 0 && indexRef.current === last) {
      setDepth(1);
      return;
    }
    setIndex(Math.max(0, Math.min(last, indexRef.current + dir)));
  };

  // Wheel / trackpad scroll => horizontal page navigation
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const target = e.target as Element;
      // overlays (profile) own their scroll — never page from inside them
      if (target.closest?.(".no-page")) return;
      // inside a scrollable area (e.g. product grid), let it scroll natively —
      // except a legal doc already at its top, where scrolling up means leave
      const scrollable = target.closest?.(".scroll-y");
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const leavingLegal =
          scrollable.classList.contains("legal-screen") &&
          scrollable.scrollTop <= 0 &&
          e.deltaY < 0;
        if (!leavingLegal) return;
      }
      e.preventDefault();
      if (wheelLock.current) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 12) return;
      wheelLock.current = true;
      setTimeout(() => (wheelLock.current = false), 750);
      step(delta > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown")
        step(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp")
        step(-1);
      if (e.key === "Escape") {
        setDepth(0);
        setTimeout(() => setLegalTab(null), 850);
      }
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
      const target = e.target as Element;
      // overlays (profile) own their gestures — never page from inside them
      if (target.closest?.(".no-page")) return;
      const horizontal = Math.abs(dx) >= Math.abs(dy);
      // a vertical swipe inside a scrollable area scrolls it instead of paging —
      // except a legal doc already at its top, where swiping down means leave
      if (!horizontal) {
        const scrollable = target.closest?.(".scroll-y");
        if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
          const leavingLegal =
            scrollable.classList.contains("legal-screen") &&
            scrollable.scrollTop <= 0 &&
            dy > 0;
          if (!leavingLegal) return;
        }
      }
      // swipe left or up both move forward
      const delta = horizontal ? -dx : -dy;
      if (Math.abs(delta) < 40) return;
      step(delta > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const activeKey = NAV_PAGES[index];

  const navLink = (key: PageKey, i: number) => {
    const Icon = NAV_ICONS[key];
    return (
      <button
        key={key}
        ref={(el) => (navRefs.current[i] = el)}
        className={`nav-link${activeKey === key ? " active" : ""}`}
        title={key.charAt(0).toUpperCase() + key.slice(1)}
        aria-label={key}
        onClick={() => goTo(NAV_PAGES.indexOf(key))}
      >
        <span className="nav-icon">
          <Icon size={19} strokeWidth={2.3} />
        </span>
        <span className="nav-label">{key.toUpperCase()}</span>
      </button>
    );
  };

  return (
    <div className="shell">
      <motion.div
        className="shell-track"
        animate={{ y: `-${depth * 100}dvh` }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
    <div className="app">
      <header className="header">
        <div className="header-left">
          <button
            className="icon-btn"
            title="Change language"
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
            title="Change currency"
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
              <motion.div
                key="back"
                className="header-aside-btns"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  className={`icon-btn cart-toggle${cartOpen ? " active" : ""}`}
                  title={cartOpen ? "Back to profile" : "My orders"}
                  onClick={() => setCartOpen(!cartOpen)}
                >
                  <ShoppingCart size={19} strokeWidth={2.4} />
                  {hasPending && !cartOpen && <span className="notif-dot" />}
                </button>
                <button
                  className="icon-btn"
                  title="Close profile"
                  onClick={() => {
                    setProfileOpen(false);
                    setCartOpen(false);
                  }}
                >
                  <ChevronLeft size={24} strokeWidth={2.6} />
                </button>
              </motion.div>
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
                {hasPending && <span className="notif-dot" />}
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
                {hasPending && <span className="notif-dot" />}
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
                <section className="page scroll-y"><HomePage active={index === 0} /></section>
                <section className="page scroll-y"><ServicePage active={index === 1} /></section>
                <section className="page scroll-y"><ProductsPage active={index === 2} onPlaceOrder={placeOrder} onOpenOrders={openOrders} /></section>
                <section className="page scroll-y"><UpdatePage active={index === 3} /></section>
                <section className="page scroll-y"><SalesPage active={index === 4} /></section>
                <section className="page scroll-y"><ContactPage active={index === 5} /></section>
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
              cartOpen={cartOpen}
              name={userName}
              orders={orders}
              onSetOrderStatus={setOrderStatus}
              onRename={setUserName}
              onLogin={() => setLoggedIn(true)}
              onLogout={() => {
                setLoggedIn(false);
                setCartOpen(false);
              }}
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

        {/* hint only on the last page — scroll once more for the footer */}
        <AnimatePresence>
          {index === NAV_PAGES.length - 1 && depth === 0 && (
            <motion.button
              className="footer-hint"
              onClick={() => setDepth(1)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
            >
              <ChevronsDown size={15} strokeWidth={2.6} />
              Scroll for more
            </motion.button>
          )}
        </AnimatePresence>
      </footer>
    </div>

        <SiteFooter
          onTop={() => setDepth(0)}
          onGoTo={goTo}
          onLegal={openLegal}
          active={legalTab}
        />
        {/* only exists while a document is open — the footer is otherwise the end */}
        {legalTab && <LegalScreen tab={legalTab} />}
      </motion.div>
    </div>
  );
}
