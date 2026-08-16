import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Hash,
  ShoppingBag,
} from "lucide-react";
import Reveal from "../components/Reveal";
import { PURCHASES } from "../data";
import { METHOD_ICONS } from "../components/statusMeta";

export default function SalesPage({ active }: { active: boolean }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="center-wrap">
      <Reveal active={active} delay={0.05}>
        <p className="page-kicker">Sales</p>
      </Reveal>
      <Reveal active={active} delay={0.12}>
        <h2 className="page-title-sm">Recent purchases.</h2>
      </Reveal>

      <Reveal active={active} delay={0.18} className="sales-card-reveal">
        <div className="sales-card scroll-y">
          <div className="sale-row sale-head">
            <span className="sale-avatar-space" />
            <span className="sale-user">Buyer</span>
            <span className="sale-product">Product</span>
            <span className="sale-method">Payment</span>
            <span className="sale-price">Price</span>
            <span className="sale-time">When</span>
          </div>
          {PURCHASES.map((s, i) => {
            const MethodIcon = METHOD_ICONS[s.method];
            const isOpen = open === s.txid;
            return (
              <Reveal
                key={s.txid}
                active={active}
                delay={0.24 + i * 0.045}
                y={14}
              >
                <div
                  className={`sale-entry${isOpen ? " open" : ""}`}
                  onClick={() => setOpen(isOpen ? null : s.txid)}
                >
                  <div className="sale-row">
                    <span className="sale-avatar">
                      <ShoppingBag size={13} strokeWidth={2.4} />
                    </span>
                    <span className="sale-user">{s.user}</span>
                    <span className="sale-product">{s.product}</span>
                    <span className="sale-method">
                      <MethodIcon size={13} strokeWidth={2.4} />
                      {s.method}
                    </span>
                    <span className="sale-price">{s.price}</span>
                    <span className="sale-time">{s.time}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={2.6}
                      className="sale-chevron"
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="sale-detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div className="sale-detail-inner">
                          <span className="sale-detail-item">
                            <MethodIcon size={13} strokeWidth={2.4} />
                            {s.methodDetail}
                          </span>
                          <span className="sale-detail-item">
                            <Hash size={13} strokeWidth={2.4} />
                            {s.txid}
                          </span>
                          <span className="sale-detail-item status-ok">
                            <CheckCircle2 size={13} strokeWidth={2.4} />
                            Completed
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
