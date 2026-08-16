import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock4,
  FileDown,
  Hash,
  Package,
  Receipt,
  RefreshCcw,
  Timer,
  XCircle,
} from "lucide-react";
import type { Order, OrderStatus } from "../data";
import { METHOD_ICONS, STATUS_UI } from "./statusMeta";
import InvoiceDoc from "./InvoiceDoc";
import { printInvoice, type InvoiceData } from "./invoice";

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

function toInvoice(order: Order, customer: string): InvoiceData {
  return {
    txid: order.txid,
    product: order.product,
    tag: order.tag,
    price: order.price,
    method: order.method,
    methodDetail: order.methodDetail,
    customer,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

/* invoice page for a paid order — download PDF is optional from here */
function InvoiceView({
  order,
  customer,
  onBack,
}: {
  order: Order;
  customer: string;
  onBack: () => void;
}) {
  const inv = toInvoice(order, customer);
  return (
    <motion.div
      key="invoice"
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

      <InvoiceDoc inv={inv} />

      <div className="cart-pay-actions">
        <button className="cart-pay-btn" onClick={() => printInvoice(inv)}>
          <FileDown size={15} strokeWidth={2.4} />
          Download PDF
        </button>
      </div>
    </motion.div>
  );
}

/* payment view for a single open order — pay, refresh, or cancel it */
function PayView({
  order,
  status,
  onPaid,
  onCancelled,
  onInvoice,
  onBack,
}: {
  order: Order;
  status: OrderStatus;
  onPaid: () => void;
  onCancelled: () => void;
  onInvoice: () => void;
  onBack: () => void;
}) {
  const [checking, setChecking] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const MethodIcon = METHOD_ICONS[order.method];
  const paid = status === "paid";
  const cancelled = status === "cancelled";
  const open = !paid && !cancelled;

  const refresh = () => {
    if (checking || !open) return;
    setChecking(true);
    // dummy poll — the gateway hasn't confirmed anything yet
    setTimeout(() => setChecking(false), 1200);
  };

  const pay = () => {
    if (redirecting || !open) return;
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

      <div
        className={`cart-pay-status ${
          paid ? "is-paid" : cancelled ? "is-cancelled" : "is-awaiting"
        }`}
      >
        {paid ? (
          <CheckCircle2 size={26} strokeWidth={2.2} />
        ) : cancelled ? (
          <XCircle size={26} strokeWidth={2.2} />
        ) : (
          <Clock4 size={26} strokeWidth={2.2} />
        )}
      </div>
      <h3 className="cart-pay-title">
        {paid ? "Paid" : cancelled ? "Cancelled" : "Awaiting payment"}
      </h3>
      <p className="cart-pay-sub">
        {paid
          ? "Payment received — the license is now in your profile."
          : cancelled
            ? "This order was cancelled. You can order the product again any time."
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
            {paid ? "Completed" : cancelled ? "—" : order.expires}
          </span>
        </div>
        <div className="cart-pay-row">
          <span className="cart-pay-label">Total</span>
          <span className="cart-pay-value cart-pay-total">${order.price}</span>
        </div>
      </div>

      {paid ? (
        <div className="cart-pay-actions">
          <button className="cart-pay-btn" onClick={onInvoice}>
            <Receipt size={15} strokeWidth={2.4} />
            View invoice
          </button>
          <button className="cart-refresh" onClick={onBack}>
            Back to orders
          </button>
        </div>
      ) : cancelled ? (
        <div className="cart-pay-actions">
          <button className="cart-pay-btn" onClick={onBack}>
            Back to orders
          </button>
        </div>
      ) : (
        <div className="cart-pay-actions">
          <button className="cart-pay-btn" onClick={pay} disabled={redirecting}>
            {redirecting ? "Redirecting…" : `Pay $${order.price}`}
            <ArrowUpRight size={15} strokeWidth={2.6} />
          </button>
          <button
            className={`cart-refresh${checking ? " is-loading" : ""}`}
            onClick={refresh}
            disabled={checking || redirecting}
            title="Refresh"
          >
            {checking ? (
              <RefreshCcw size={15} strokeWidth={2.6} className="spin" />
            ) : (
              "Refresh"
            )}
          </button>
          <button
            className="cart-refresh cart-cancel"
            onClick={onCancelled}
            disabled={redirecting}
          >
            Cancel order
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function CartPanel({
  customer = "AXZY Member",
  orders,
  onSetStatus,
}: {
  customer?: string;
  orders: Order[];
  onSetStatus: (txid: string, status: OrderStatus) => void;
}) {
  const [view, setView] = useState<
    { kind: "list" } | { kind: "pay"; txid: string } | { kind: "invoice"; txid: string }
  >({ kind: "list" });

  const current =
    view.kind === "list" ? null : orders.find((o) => o.txid === view.txid) ?? null;

  const openOrders = orders.filter(
    (o) => o.status === "awaiting" || o.status === "processing"
  );
  const dueTotal = openOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="cart-panel">
      <AnimatePresence mode="wait" initial={false}>
        {view.kind === "invoice" && current ? (
          <InvoiceView
            key={`inv-${current.txid}`}
            order={current}
            customer={customer}
            onBack={() => setView({ kind: "list" })}
          />
        ) : view.kind === "pay" && current ? (
          <PayView
            key={current.txid}
            order={current}
            status={current.status}
            onPaid={() => onSetStatus(current.txid, "paid")}
            onCancelled={() => onSetStatus(current.txid, "cancelled")}
            onInvoice={() => setView({ kind: "invoice", txid: current.txid })}
            onBack={() => setView({ kind: "list" })}
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
              <h3 className="cart-title">Orders</h3>
              <p className="cart-sub">
                Open an order to pay or cancel it — paid orders keep their
                invoice here.
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
                <b>{openOrders.length}</b>
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
                const status = o.status;
                const st = STATUS_UI[status];
                const MethodIcon = METHOD_ICONS[o.method];
                const isPaid = status === "paid";
                const locked = status === "expired" || status === "cancelled";

                const openIt = () => {
                  if (locked) return;
                  setView(
                    isPaid
                      ? { kind: "invoice", txid: o.txid }
                      : { kind: "pay", txid: o.txid }
                  );
                };

                return (
                  <motion.div
                    key={o.txid}
                    className={`cart-row${locked ? " is-locked" : ""}`}
                    variants={item}
                    custom={2 + i}
                    initial="hidden"
                    animate="show"
                    role="button"
                    tabIndex={locked ? -1 : 0}
                    onClick={openIt}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openIt();
                    }}
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

                    {isPaid ? (
                      <span className="cart-invoice-btn" title="Open invoice">
                        <Receipt size={15} strokeWidth={2.4} />
                      </span>
                    ) : (
                      <span className="cart-amount">${o.price}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
