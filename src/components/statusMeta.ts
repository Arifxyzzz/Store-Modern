import {
  Bitcoin,
  CheckCircle2,
  Clock4,
  CreditCard,
  QrCode,
  RefreshCcw,
  Wallet,
  XCircle,
} from "lucide-react";
import type { OrderStatus, PayMethod } from "../data";

/* single source of truth for payment status + method visuals —
   used by both the checkout receipt and the profile cart panel */

export const METHOD_ICONS: Record<PayMethod, typeof Wallet> = {
  QRIS: QrCode,
  "E-Wallet": Wallet,
  Crypto: Bitcoin,
  PayPal: CreditCard,
};

export const METHOD_DETAILS: Record<PayMethod, string> = {
  QRIS: "QRIS — Scan & Pay",
  "E-Wallet": "DANA · GoPay · OVO",
  Crypto: "USDT (BEP-20)",
  PayPal: "PayPal Checkout",
};

export const STATUS_UI: Record<
  OrderStatus,
  { label: string; cls: string; icon: typeof Clock4 }
> = {
  awaiting: { label: "Awaiting payment", cls: "st-awaiting", icon: Clock4 },
  processing: { label: "Processing", cls: "st-processing", icon: RefreshCcw },
  paid: { label: "Paid", cls: "st-paid", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", cls: "st-cancelled", icon: XCircle },
  expired: { label: "Expired", cls: "st-expired", icon: XCircle },
};
