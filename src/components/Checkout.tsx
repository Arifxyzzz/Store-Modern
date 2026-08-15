import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bitcoin,
  CheckCircle2,
  Clock4,
  CreditCard,
  Hash,
  Package,
  QrCode,
  RefreshCcw,
  Wallet,
  XCircle,
} from "lucide-react";
import type { PayMethod, Product } from "../data";

const METHODS: {
  key: PayMethod;
  icon: typeof Wallet;
  desc: string;
}[] = [
  { key: "QRIS", icon: QrCode, desc: "One scan, every bank & e-wallet" },
  { key: "E-Wallet", icon: Wallet, desc: "DANA · GoPay · OVO · ShopeePay" },
  { key: "Crypto", icon: Bitcoin, desc: "USDT · BTC · ETH" },
  { key: "PayPal", icon: CreditCard, desc: "Balance or international card" },
];

type TxStatus = "pending" | "paid" | "cancelled";

const STATUS_UI: Record<
  TxStatus,
  { icon: typeof Clock4; label: string; cls: string }
> = {
  pending: { icon: Clock4, label: "Awaiting payment", cls: "tx-pending" },
  paid: { icon: CheckCircle2, label: "Paid", cls: "tx-paid" },
  cancelled: { icon: XCircle, label: "Cancelled", cls: "tx-cancelled" },
};

export default function Checkout({
  product,
  onBack,
}: {
  product: Product;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [stage, setStage] = useState<"pick" | "receipt">("pick");
  const [status, setStatus] = useState<TxStatus>("pending");
  const [checking, setChecking] = useState(false);
  const [paying, setPaying] = useState(false);

  const txid = `AXZ-${product.name.length}${product.price}X${product.tag.length}0`.toUpperCase();

  const checkStatus = () => {
    if (status !== "pending") return;
    setChecking(true);
    // dummy: after "checking" for 1.2s the transaction is still unpaid
    setTimeout(() => setChecking(false), 1200);
  };

  // real build would redirect to the gateway here — this fakes the round trip
  const pay = () => {
    if (status !== "pending" || paying) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStatus("paid");
    }, 1400);
  };

  const st = STATUS_UI[status];

  return (
    <motion.div
      className="detail"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 26 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="detail-back" onClick={onBack}>
        <ArrowLeft size={15} strokeWidth={2.6} />
        Back to product
      </button>

      <div className="checkout-wrap scroll-y">
        <AnimatePresence mode="wait" initial={false}>
          {stage === "pick" ? (
            <motion.div
              key="pick"
              className="checkout-stage"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="checkout-title">Checkout</h2>
              <p className="checkout-sub">
                Choose a payment method to complete your order.
              </p>

              {/* order summary */}
              <div className="order-card">
                <span className="order-thumb">
                  <Package size={20} strokeWidth={2} />
                </span>
                <span className="order-info">
                  <b>{product.name}</b>
                  <span className="order-tag">{product.tag} · one-time</span>
                </span>
                <span className="order-price">${product.price}</span>
              </div>

              {/* payment methods */}
              <div className="method-grid">
                {METHODS.map((m) => (
                  <button
                    key={m.key}
                    className={`method-card${method === m.key ? " active" : ""}`}
                    onClick={() => setMethod(m.key)}
                  >
                    <span className="method-icon">
                      <m.icon size={19} strokeWidth={2.2} />
                    </span>
                    <span className="method-info">
                      <b>{m.key}</b>
                      <span>{m.desc}</span>
                    </span>
                    <span className="method-radio" />
                  </button>
                ))}
              </div>

              <button
                className="checkout-confirm"
                disabled={!method}
                onClick={() => setStage("receipt")}
              >
                Confirm & pay ${product.price}
                <ArrowRight size={16} strokeWidth={2.6} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="receipt"
              className="checkout-stage"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`tx-status ${st.cls}`}>
                <st.icon size={30} strokeWidth={2.2} />
              </div>
              <h2 className="checkout-title">{st.label}</h2>
              <p className="checkout-sub">
                {status === "pending" &&
                  `Pay with ${method} to finish this order — you'll be sent to the payment gateway. Come back and refresh the status once it's done.`}
                {status === "paid" &&
                  "Payment received — the license is now in your profile."}
                {status === "cancelled" &&
                  "Transaction cancelled. You can start over any time."}
              </p>

              {/* transaction detail */}
              <div className="tx-card">
                <div className="tx-row">
                  <span className="tx-label">
                    <Package size={13} strokeWidth={2.4} /> Product
                  </span>
                  <span className="tx-value">{product.name}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">
                    <Wallet size={13} strokeWidth={2.4} /> Method
                  </span>
                  <span className="tx-value">{method}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">
                    <Hash size={13} strokeWidth={2.4} /> Transaction
                  </span>
                  <span className="tx-value">{txid}</span>
                </div>
                <div className="tx-row">
                  <span className="tx-label">Total</span>
                  <span className="tx-value tx-total">${product.price}</span>
                </div>
              </div>

              {status === "pending" && (
                <div className="tx-actions">
                  <button
                    className="checkout-confirm"
                    onClick={pay}
                    disabled={paying || checking}
                  >
                    {paying ? "Redirecting…" : `Pay $${product.price}`}
                    <ArrowUpRight size={16} strokeWidth={2.6} />
                  </button>
                  <div className="tx-actions-row">
                    <button
                      className="tx-secondary"
                      onClick={checkStatus}
                      disabled={checking || paying}
                      title="Refresh status"
                    >
                      {checking ? (
                        <RefreshCcw size={14} strokeWidth={2.6} className="spin" />
                      ) : (
                        "Refresh status"
                      )}
                    </button>
                    <button
                      className="tx-secondary tx-danger"
                      onClick={() => setStatus("cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {status === "paid" && (
                <button className="checkout-confirm" onClick={onBack}>
                  Back to product
                  <ArrowRight size={16} strokeWidth={2.6} />
                </button>
              )}

              {status === "cancelled" && (
                <div className="tx-actions">
                  <button
                    className="checkout-confirm"
                    onClick={() => {
                      setStatus("pending");
                      setStage("pick");
                    }}
                  >
                    Try again
                  </button>
                  <button className="tx-secondary" onClick={onBack}>
                    Back to product
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
