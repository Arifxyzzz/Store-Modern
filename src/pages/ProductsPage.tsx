import { useMemo, useState } from "react";
import { Package, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../components/Reveal";
import ProductDetail from "../components/ProductDetail";
import { PRODUCTS, type Order, type Product } from "../data";

export default function ProductsPage({
  active,
  onPlaceOrder,
  onOpenOrders,
}: {
  active: boolean;
  onPlaceOrder: (order: Order) => void;
  onOpenOrders: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
    );
  }, [query]);

  if (selected) {
    return (
      <AnimatePresence mode="wait">
        <ProductDetail
          key={selected.name}
          product={selected}
          onPlaceOrder={onPlaceOrder}
          onOpenOrders={onOpenOrders}
          onBack={() => setSelected(null)}
        />
      </AnimatePresence>
    );
  }

  return (
    <>
      <div className="products-head">
        <Reveal active={active} delay={0.05}>
          <p className="page-kicker">Products</p>
        </Reveal>
        <Reveal active={active} delay={0.1}>
          <h2 className="page-title-sm">Browse the collection.</h2>
        </Reveal>
        <Reveal active={active} delay={0.16}>
          <div className="search-box">
            <Search size={16} strokeWidth={2.4} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or tags…"
              spellCheck={false}
            />
            <span className="search-count">{filtered.length}</span>
          </div>
        </Reveal>
      </div>

      <div className="product-grid scroll-y">
        {filtered.map((p, i) => (
          <motion.div
            key={p.name}
            className="product-tile"
            initial={false}
            animate={
              active
                ? {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.45,
                      delay: 0.2 + Math.min(i, 12) * 0.03,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }
                : { opacity: 0, y: 20 }
            }
            layout
            onClick={() => setSelected(p)}
          >
            <div className="tile-img">
              <Package size={22} strokeWidth={2} />
              <span className="tile-tag">{p.tag}</span>
            </div>
            <div className="tile-body">
              <span className="tile-name">{p.name}</span>
              <span className="tile-price">${p.price}</span>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="product-empty">No products found for "{query}"</p>
        )}
      </div>
    </>
  );
}
