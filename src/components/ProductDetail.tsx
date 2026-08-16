import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileBox,
  Package,
  RefreshCcw,
  ShoppingCart,
  Star,
  Tag,
} from "lucide-react";
import Checkout from "./Checkout";
import { REVIEWS, TAG_META, type Order, type Product } from "../data";

const SLIDES = [0, 1, 2, 3];

const AVG_RATING =
  REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={2.2}
          className={n <= Math.round(value) ? "star-on" : "star-off"}
        />
      ))}
    </span>
  );
}

export default function ProductDetail({
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
  const [slide, setSlide] = useState(0);
  const [buying, setBuying] = useState(false);
  const meta = TAG_META[product.tag];

  if (buying) {
    return (
      <Checkout
        product={product}
        onPlaceOrder={onPlaceOrder}
        onOpenOrders={onOpenOrders}
        onBack={() => setBuying(false)}
      />
    );
  }

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
        Back to products
      </button>

      <div className="detail-grid scroll-y">
        {/* left: carousel */}
        <div className="detail-left">
          <div className="detail-carousel">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={slide}
                className="detail-slide"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Package size={40} strokeWidth={1.6} />
                <span className="detail-slide-num">
                  Preview {slide + 1}
                </span>
              </motion.div>
            </AnimatePresence>

            <button
              className="carousel-nav nav-prev"
              onClick={() =>
                setSlide((slide - 1 + SLIDES.length) % SLIDES.length)
              }
            >
              <ChevronLeft size={18} strokeWidth={2.4} />
            </button>
            <button
              className="carousel-nav nav-next"
              onClick={() => setSlide((slide + 1) % SLIDES.length)}
            >
              <ChevronRight size={18} strokeWidth={2.4} />
            </button>

            <div className="carousel-dots">
              {SLIDES.map((s) => (
                <button
                  key={s}
                  className={`carousel-dot${s === slide ? " active" : ""}`}
                  onClick={() => setSlide(s)}
                />
              ))}
            </div>
          </div>

          <div className="detail-thumbs">
            {SLIDES.map((s) => (
              <button
                key={s}
                className={`detail-thumb${s === slide ? " active" : ""}`}
                onClick={() => setSlide(s)}
              >
                <Package size={16} strokeWidth={2} />
              </button>
            ))}
          </div>

          {/* title + long description below the carousel */}
          <h2 className="detail-name">{product.name}</h2>
          <p className="detail-desc">
            {meta.blurb} Built and maintained by the AXZY team — every asset
            ships with documentation, example setups, and lifetime updates.
            Works out of the box with the latest Roblox Studio version, and the
            source is fully open for you to modify and extend for your own
            projects.
          </p>
        </div>

        {/* right: info */}
        <div className="detail-info">
          {/* rating summary box */}
          <div className="rating-box">
            <div className="rating-big">
              <b>{AVG_RATING.toFixed(1)}</b>
              <Stars value={AVG_RATING} />
              <span className="detail-rating-count">
                {REVIEWS.length} reviews
              </span>
            </div>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((n) => {
                const count = REVIEWS.filter((r) => r.rating === n).length;
                const pct = (count / REVIEWS.length) * 100;
                return (
                  <div key={n} className="rating-bar-row">
                    <span className="rating-bar-num">{n}</span>
                    <div className="rating-bar-track">
                      <div
                        className="rating-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="detail-specs">
            <div className="detail-spec">
              <FileBox size={15} strokeWidth={2.2} />
              <span className="spec-label">Files</span>
              <span className="spec-value">{meta.files}</span>
            </div>
            <div className="detail-spec">
              <Tag size={15} strokeWidth={2.2} />
              <span className="spec-label">Version</span>
              <span className="spec-value">v2.4.0</span>
            </div>
            <div className="detail-spec">
              <RefreshCcw size={15} strokeWidth={2.2} />
              <span className="spec-label">Updated</span>
              <span className="spec-value">Aug 10, 2026</span>
            </div>
            <div className="detail-spec">
              <Download size={15} strokeWidth={2.2} />
              <span className="spec-label">Downloads</span>
              <span className="spec-value">1.2K+</span>
            </div>
          </div>

          <div className="detail-buy">
            <div className="detail-price">
              ${product.price}
            </div>
            <button className="detail-buy-btn" onClick={() => setBuying(true)}>
              <ShoppingCart size={16} strokeWidth={2.4} />
              Buy now
            </button>
          </div>

          <div className="detail-reviews">
            <span className="aside-section-title">Reviews</span>
            {REVIEWS.map((r) => (
              <div key={r.user} className="review-item">
                <div className="review-head">
                  <span className="review-avatar">
                    {r.user.charAt(0).toUpperCase()}
                  </span>
                  <span className="review-user">{r.user}</span>
                  <Stars value={r.rating} size={11} />
                  <span className="review-time">{r.time}</span>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
