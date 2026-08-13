import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  active?: boolean;
  className?: string;
};

/** Fade + slide-up reveal, replays every time its page becomes active. */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  active = true,
  className,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={
        active
          ? { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } }
          : { opacity: 0, y }
      }
    >
      {children}
    </motion.div>
  );
}
