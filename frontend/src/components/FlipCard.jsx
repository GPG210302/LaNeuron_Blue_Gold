import { useState } from "react";
import { motion } from "framer-motion";

// Click/tap to flip card. `front` and `back` are full-height nodes.
export const FlipCard = ({ front, back, heightClass = "h-64", testid }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`group [perspective:1400px] cursor-pointer ${heightClass}`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={testid}
      aria-pressed={flipped}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </motion.div>
    </div>
  );
};
