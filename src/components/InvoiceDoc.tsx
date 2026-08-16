import { BadgeCheck } from "lucide-react";
import type { InvoiceData } from "./invoice";

/* the invoice as an in-app document — a white "paper" card.
   Download/print is a separate action (printInvoice) offered by the parent. */
export default function InvoiceDoc({ inv }: { inv: InvoiceData }) {
  return (
    <div className="inv-doc">
      <div className="inv-head">
        <div className="inv-brand">
          AXZY
          <small>Digital Asset Store</small>
        </div>
        <div className="inv-title">
          <b>Invoice</b>
          <span className="inv-paid-badge">
            <BadgeCheck size={11} strokeWidth={2.6} />
            Paid
          </span>
        </div>
      </div>

      <div className="inv-meta">
        <div className="inv-row">
          <span>Invoice no.</span>
          <b>INV-{inv.txid.replace(/^AXZ-/, "")}</b>
        </div>
        <div className="inv-row">
          <span>Transaction ID</span>
          <b>{inv.txid}</b>
        </div>
        <div className="inv-row">
          <span>Date</span>
          <b>{inv.date}</b>
        </div>
        <div className="inv-row">
          <span>Billed to</span>
          <b>{inv.customer}</b>
        </div>
        <div className="inv-row">
          <span>Payment</span>
          <b>{inv.methodDetail}</b>
        </div>
      </div>

      <div className="inv-item">
        <div className="inv-item-info">
          <b>{inv.product}</b>
          <span>{inv.tag} · one-time license</span>
        </div>
        <span className="inv-item-price">${inv.price.toFixed(2)}</span>
      </div>

      <div className="inv-total">
        <span>Total paid</span>
        <b>${inv.price.toFixed(2)}</b>
      </div>

      <p className="inv-foot">
        Thank you for your purchase — licenses are delivered digitally to your
        profile. Questions? hello@axzy.store
      </p>
    </div>
  );
}
