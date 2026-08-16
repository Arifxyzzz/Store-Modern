import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bitcoin,
  CheckCircle2,
  CreditCard,
  Hash,
  Package,
  QrCode,
  Wallet,
} from "lucide-react";
import type { Order, PayMethod, Product } from "../data";
import { METHOD_DETAILS } from "./statusMeta";

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

/* checkout only places the order — paying, cancelling, and invoices
   all live in one place: the orders panel in the profile aside */
export default function Checkout({
  product,
  onPlaceOrder,
  onOpenOrders,
  onBack,
}: {
  product: Product;
  onPlaceOrder: (order: Order) => void;
  onOpenOrders: () => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [placed, setPlaced] = useState(false);

  const txid = `AXZ-${product.name.length}${product.price}X${product.tag.length}0`.toUpperCase();

  const confirm = () => {
    if (!method || placed) return;
    onPlaceOrder({
      product: product.name,
      tag: product.tag,
      price: product.price,
      method,
      methodDetail: METHOD_DETAILS[method],
      txid,
      created: "Just now",
      expires: "60 min left",
      status: "awaiting",
    });
    setPlaced(true);
  };

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
          {!placed ? (
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
                Choose a payment method to place your order.
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
                onClick={confirm}
              >
                Place order — ${product.price}
                <ArrowRight size={16} strokeWidth={2.6} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placed"
              className="checkout-stage"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="tx-status st-paid">
                <CheckCircle2 size={30} strokeWidth={2.2} />
              </div>
              <h2 className="checkout-title">Order placed</h2>
              <p className="checkout-sub">
                Your order is waiting in your profile — finish the payment
                there. You can also cancel it any time before paying.
              </p>

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

              <div className="tx-actions">
                <button className="checkout-confirm" onClick={onOpenOrders}>
                  Pay in my orders
                  <ArrowUpRight size={16} strokeWidth={2.6} />
                </button>
                <button className="tx-secondary" onClick={onBack}>
                  Keep browsing
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
