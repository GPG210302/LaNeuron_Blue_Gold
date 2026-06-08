import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const FlipCard = ({
  front,
  back,
  heightClass = "h-64",
  testid,
  enableTilt = true,
}) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Spring-based tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(rawY, { stiffness: 200, damping: 20 });
  const scale = useSpring(1, { stiffness: 300, damping: 22 });

  // Hard offset shadow springs — animate x/y offset independently
  const shadowX = useSpring(5, { stiffness: 250, damping: 24 });
  const shadowY = useSpring(5, { stiffness: 250, damping: 24 });

  const handleMouseMove = (e) => {
    if (!enableTilt || flipped) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * 12;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * -12;
    rawY.set(dx);
    rawX.set(dy);
    // Shadow shifts opposite to tilt — grounds the card physically
    shadowX.set(5 + dx * 0.35);
    shadowY.set(5 - dy * 0.35);
  };

  const handleMouseEnter = () => {
    scale.set(1.03);
    shadowX.set(8);
    shadowY.set(8);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
    shadowX.set(5);
    shadowY.set(5);
  };

  const handleFlip = () => {
    setFlipped((f) => !f);
    rawX.set(0);
    rawY.set(0);
    // Shadow collapses on flip then restores
    shadowX.set(2);
    shadowY.set(2);
    setTimeout(() => {
      shadowX.set(5);
      shadowY.set(5);
    }, 420);
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
      {/* ── HARD OFFSET SHADOW ──────────────────────────────────
          Sits OUTSIDE the perspective container so it never
          bleeds through the card faces. Pure CSS box-shadow
          driven by spring-animated inline style. No dark fill. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          x: shadowX,
          y: shadowY,
          // Matches the dark navy border colour visible on your cards
          boxShadow: "0 0 0 100vmax transparent",
          backgroundColor: "#1a1a2e",
          borderRadius: "inherit",
          zIndex: -1,
        }}
      />

      {/* ── CARD FLIP CONTAINER ─────────────────────────────────
          transform-style:preserve-3d lives here only.
          NO background or colour set here — prevents bleed. */}
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        style={{
          scale,
          rotateX: flipped ? 0 : rotateX,
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] rounded-[inherit] overflow-hidden"
        >
          {front}
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[inherit] overflow-hidden"
        >
          {back}
        </div>
      </motion.div>

      {/* ── FLIP HINT PULSE ── */}
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