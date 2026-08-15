import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Bitcoin,
  CheckCircle2,
  Clock4,
  CreditCard,
  Hash,
  Package,
  QrCode,
  RefreshCcw,
  Timer,
  Wallet,
  XCircle,
} from "lucide-react";
import { PENDING_ORDERS, type OrderStatus, type PayMethod } from "../data";

type Order = (typeof PENDING_ORDERS)[number];

const METHOD_ICONS: Record<PayMethod, typeof Wallet> = {
  QRIS: QrCode,
  "E-Wallet": Wallet,
  Crypto: Bitcoin,
  PayPal: CreditCard,
};

const STATUS_UI: Record<
  OrderStatus,
  { label: string; cls: string; icon: typeof Clock4 }
> = {
  awaiting: { label: "Awaiting payment", cls: "cart-awaiting", icon: Clock4 },
  processing: { label: "Processing", cls: "cart-processing", icon: RefreshCcw },
  expired: { label: "Expired", cls: "cart-expired", icon: XCircle },
};

const item = {
  hidden: { opacity: 0, x: 30 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.42,
      delay: 0.12 + i * 0.07,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/* payment view for a single order — same flow as product checkout */
function PayView({
  order,
  paid,
  onPaid,
  onBack,
}: {
  order: Order;
  paid: boolean;
  onPaid: () => void;
  onBack: () => void;
}) {
  const [checking, setChecking] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const MethodIcon = METHOD_ICONS[order.method];

  const refresh = () => {
    if (checking || paid) return;
    setChecking(true);
    // dummy poll — the gateway hasn't confirmed anything yet
    setTimeout(() => setChecking(false), 1200);
  };

  const pay = () => {
    if (redirecting || paid) return;
    setRedirecting(true);
    // a real build would hand off to the gateway here
    setTimeout(() => {
      setRedirecting(false);
      onPaid();
    }, 1400);
  };

  return (
    <motion.div
      key="pay"
      className="cart-pay"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="cart-pay-back" onClick={onBack}>
        <ArrowLeft size={14} strokeWidth={2.6} />
        All orders
      </button>

      <div className={`cart-pay-status ${paid ? "is-paid" : "is-pending"}`}>
        {paid ? (
          <CheckCircle2 size={26} strokeWidth={2.2} />
        ) : (
          <Clock4 size={26} strokeWidth={2.2} />
        )}
      </div>
      <h3 className="cart-pay-title">
        {paid ? "Paid" : "Awaiting payment"}
      </h3>
      <p className="cart-pay-sub">
        {paid
          ? "Payment received — the license is now in your profile."
          : `Pay with ${order.method} to finish this order. You'll be sent to the payment gateway.`}
      </p>

      <div className="cart-pay-card">
        <div className="cart-pay-row">
          <span className="cart-pay-label">
            <Package size={12} strokeWidth={2.4} /> Product
          </span>
          <span className="cart-pay-value">{order.product}</span>
        </div>
        <div className="cart-pay-row">
          <span className="cart-pay-label">
            <MethodIcon size={12} strokeWidth={2.4} /> Method
          </span>
          <span className="cart-pay-value">{order.methodDetail}</span>
        </div>
        <div className="cart-pay-row">
          <span className="cart-pay-label">
            <Hash size={12} strokeWidth={2.4} /> Transaction
          </span>
          <span className="cart-pay-value">{order.txid}</span>
        </div>
        <div className="cart-pay-row">
          <span className="cart-pay-label">
            <Timer size={12} strokeWidth={2.4} /> Expires
          </span>
          <span className="cart-pay-value">
            {paid ? "Completed" : order.expires}
          </span>
        </div>
        <div className="cart-pay-row">
          <span className="cart-pay-label">Total</span>
          <span className="cart-pay-value cart-pay-total">${order.price}</span>
        </div>
      </div>

      {paid ? (
        <button className="cart-pay-btn" onClick={onBack}>
          Back to orders
        </button>
      ) : (
        <div className="cart-pay-actions">
          <button className="cart-pay-btn" onClick={pay} disabled={redirecting}>
            {redirecting ? "Redirecting…" : `Pay $${order.price}`}
            <ArrowUpRight size={15} strokeWidth={2.6} />
          </button>
          <button
            className={`cart-refresh${checking ? " is-loading" : ""}`}
            onClick={refresh}
            disabled={checking}
            title="Refresh status"
          >
            {checking ? (
              <RefreshCcw size={15} strokeWidth={2.6} className="spin" />
            ) : (
              "Refresh status"
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function CartPanel() {
  const [openTxid, setOpenTxid] = useState<string | null>(null);
  const [paid, setPaid] = useState<string[]>([]);

  const orders = PENDING_ORDERS;
  const open = orders.find((o) => o.txid === openTxid) ?? null;
  const unpaid = orders.filter(
    (o) => o.status !== "expired" && !paid.includes(o.txid)
  );
  const dueTotal = unpaid.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="cart-panel">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <PayView
            key={open.txid}
            order={open}
            paid={paid.includes(open.txid)}
            onPaid={() => setPaid((p) => [...p, open.txid])}
            onBack={() => setOpenTxid(null)}
          />
        ) : (
          <motion.div
            key="list"
            className="cart-list-view"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="cart-head"
              variants={item}
              custom={0}
              initial="hidden"
              animate="show"
            >
              <h3 className="cart-title">Pending payments</h3>
              <p className="cart-sub">
                Orders waiting to be paid. Open one to finish the payment.
              </p>
            </motion.div>

            <motion.div
              className="cart-summary"
              variants={item}
              custom={1}
              initial="hidden"
              animate="show"
            >
              <div className="cart-sum-item">
                <b>{unpaid.length}</b>
                <span>Open</span>
              </div>
              <div className="cart-sum-divider" />
              <div className="cart-sum-item">
                <b>${dueTotal}</b>
                <span>Total due</span>
              </div>
            </motion.div>

            <div className="cart-list">
              {orders.map((o, i) => {
                const isPaid = paid.includes(o.txid);
                const st = isPaid
                  ? { label: "Paid", cls: "cart-paid", icon: CheckCircle2 }
                  : STATUS_UI[o.status];
                const MethodIcon = METHOD_ICONS[o.method];
                const locked = isPaid || o.status === "expired";

                return (
                  <motion.button
                    key={o.txid}
                    className={`cart-row${locked ? " is-locked" : ""}`}
                    variants={item}
                    custom={2 + i}
                    initial="hidden"
                    animate="show"
                    onClick={() => !locked && setOpenTxid(o.txid)}
                    disabled={locked}
                  >
                    <span className="cart-thumb">
                      <Package size={17} strokeWidth={2} />
                    </span>

                    <span className="cart-main">
                      <span className="cart-row-title">
                        <b>{o.product}</b>
                        <span className={`cart-badge ${st.cls}`}>
                          <st.icon size={11} strokeWidth={2.6} />
                          {st.label}
                        </span>
                      </span>
                      <span className="cart-meta">
                        <span className="cart-meta-item">
                          <MethodIcon size={11} strokeWidth={2.4} />
                          {o.methodDetail}
                        </span>
                        <span className="cart-meta-item">
                          <Timer size={11} strokeWidth={2.4} />
                          {isPaid ? "Completed" : o.expires}
                        </span>
                      </span>
                    </span>

                    <span className="cart-amount">${o.price}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
