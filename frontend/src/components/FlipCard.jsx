import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── HOLOGRAPHIC GLARE OVERLAY ──────────────────────────────
const GlareOverlay = ({ rotateX, rotateY }) => {
  const glareX = useTransform(rotateY, [-25, 25], ["150%", "-50%"]);
  const glareY = useTransform(rotateX, [-25, 25], ["150%", "-50%"]);
  const glareOpacity = useTransform(
    rotateY,
    [-25, 0, 25],
    [0.35, 0.05, 0.35]
  );
  return (
    <motion.div
      className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 overflow-hidden"
      style={{ opacity: glareOpacity }}
    >
      <motion.div
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)",
          x: glareX,
          y: glareY,
        }}
      />
    </motion.div>
  );
};

// ─── HOLOGRAPHIC SHIMMER BORDER ────────────────────────────
const HoloBorder = ({ flipped }) => (
  <motion.div
    className="absolute -inset-[1.5px] rounded-[inherit] z-0 pointer-events-none"
    animate={{
      backgroundPosition: flipped ? ["0% 50%", "100% 50%"] : ["100% 50%", "0% 50%"],
    }}
    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    style={{
      background:
        "linear-gradient(135deg, #7c6ff7, #f7456b, #22d3ee, #f59e0b, #7c6ff7)",
      backgroundSize: "300% 300%",
      borderRadius: "inherit",
    }}
  >
    <div className="absolute inset-[1.5px] rounded-[inherit] bg-inherit" />
  </motion.div>
);

// ─── FLOATING SHADOW ───────────────────────────────────────
const FloatingShadow = ({ flipped, rotateX, rotateY }) => {
  const shadowX = useTransform(rotateY, [-25, 25], ["-12px", "12px"]);
  const shadowY = useTransform(rotateX, [-25, 25], ["12px", "-12px"]);
  return (
    <motion.div
      className="absolute inset-0 -z-10 rounded-[inherit]"
      style={{
        filter: "blur(24px)",
        opacity: flipped ? 0.65 : 0.35,
        background: flipped
          ? "linear-gradient(135deg, #f7456b88, #7c6ff788)"
          : "linear-gradient(135deg, #7c6ff766, #22d3ee44)",
        x: shadowX,
        y: shadowY,
        scaleX: 0.92,
        scaleY: 0.88,
        translateY: "8%",
      }}
      animate={{ opacity: flipped ? 0.65 : 0.35 }}
      transition={{ duration: 0.5 }}
    />
  );
};

// ─── MAIN FLIPCARD ─────────────────────────────────────────
export const FlipCard = ({
  front,
  back,
  heightClass = "h-64",
  testid,
  enableTilt = true,
}) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Spring-based tilt values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(rawY, { stiffness: 200, damping: 20 });

  // Scale spring for hover lift
  const scale = useSpring(1, { stiffness: 300, damping: 22 });

  const handleMouseMove = (e) => {
    if (!enableTilt || flipped) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * 14;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * -14;
    rawY.set(dx);
    rawX.set(dy);
  };

  const handleMouseEnter = () => {
    scale.set(1.04);
  };

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
      {/* Floating glow shadow beneath card */}
      <FloatingShadow flipped={flipped} rotateX={rotateX} rotateY={rotateY} />

      {/* Outer wrapper: tilt + scale */}
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        style={{
          rotateX: flipped ? 0 : rotateX,
          rotateY: flipped ? 180 : rotateY,
          scale,
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          rotateY: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {/* ── FRONT ── */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-[inherit] overflow-hidden">
          {/* Holo border ring */}
          <HoloBorder flipped={false} />
          {/* Glare overlay */}
          <GlareOverlay rotateX={rotateX} rotateY={rotateY} />
          {/* Depth edge shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[5] rounded-[inherit]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)",
            }}
          />
          <div className="relative z-[1] w-full h-full">{front}</div>
        </div>

        {/* ── BACK ── */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[inherit] overflow-hidden">
          <HoloBorder flipped={true} />
          <motion.div
            className="absolute inset-0 pointer-events-none z-[5] rounded-[inherit]"
            style={{
              background:
                "linear-gradient(315deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)",
            }}
          />
          <div className="relative z-[1] w-full h-full">{back}</div>
        </div>
      </motion.div>

      {/* Flip hint pulse on first render */}
      {!flipped && (
        <motion.div
          className="absolute bottom-2 right-2 z-20 w-5 h-5 rounded-full bg-white/20 pointer-events-none"
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
};