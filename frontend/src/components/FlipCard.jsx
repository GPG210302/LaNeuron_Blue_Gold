import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── FLOATING SHADOW (kept — subtle depth only) ───────────
const FloatingShadow = ({ flipped }) => (
  <motion.div
    className="absolute inset-0 -z-10 rounded-[inherit]"
    animate={{ opacity: flipped ? 0.5 : 0.25 }}
    transition={{ duration: 0.5 }}
    style={{
      filter: "blur(20px)",
      background: flipped
        ? "linear-gradient(135deg, #f7456b66, #7c6ff766)"
        : "linear-gradient(135deg, #7c6ff744, #22d3ee33)",
      transform: "translateY(8%) scaleX(0.92) scaleY(0.88)",
    }}
  />
);

// ─── MAIN FLIPCARD ────────────────────────────────────────
export const FlipCard = ({
  front,
  back,
  heightClass = "h-64",
  testid,
  enableTilt = true,
}) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Spring-based tilt (only active when NOT flipped)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(rawY, { stiffness: 200, damping: 20 });
  const scale = useSpring(1, { stiffness: 300, damping: 22 });

  const handleMouseMove = (e) => {
    if (!enableTilt || flipped) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawY.set(((e.clientX - cx) / (rect.width / 2)) * 12);
    rawX.set(((e.clientY - cy) / (rect.height / 2)) * -12);
  };

  const handleMouseEnter = () => scale.set(1.03);

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
  };

  const handleFlip = () => {
    setFlipped((f) => !f);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      ref={cardRef}
      className={`relative [perspective:1400px] cursor-pointer ${heightClass}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      data-testid={testid}
      aria-pressed={flipped}
    >
      <FloatingShadow flipped={flipped} />

      {/* Card container — handles both tilt AND flip */}
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        style={{
          scale,
          // Tilt only applies when not flipped
          rotateX: flipped ? 0 : rotateX,
          // rotateY drives BOTH tilt (when not flipped) AND flip (180deg)
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] rounded-[inherit] overflow-hidden"
          // No extra transform needed — front is at rotateY: 0
        >
          {front}
        </div>

        {/* ── BACK FACE ──
            rotateY(180deg) positions it facing away initially.
            When parent animates to rotateY:180, this face comes forward.
            The content itself is NOT mirrored because it lives inside
            a face that was already pre-rotated — text renders normally. */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[inherit] overflow-hidden"
        >
          {back}
        </div>
      </motion.div>

      {/* Flip hint — subtle pulse dot, disappears after first flip */}
      {!flipped && (
        <motion.div
          className="absolute bottom-2 right-2 z-20 w-2 h-2 rounded-full bg-black/20 pointer-events-none"
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};