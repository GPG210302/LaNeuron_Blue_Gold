import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const FlipCard = ({
  front,
  back,
  heightClass = "h-64",
  testid,
  enableTilt = true,
}) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  // Spring tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(rawY, { stiffness: 200, damping: 20 });
  const scale = useSpring(1, { stiffness: 300, damping: 22 });

  // Shadow intensity spring: 0 = resting, 1 = hovered
  const shadowProgress = useSpring(0, { stiffness: 250, damping: 24 });

  // Interpolate to a soft multi-layer drop shadow (no hard edge)
  const boxShadow = useTransform(
    shadowProgress,
    [0, 1],
    [
      // Resting — subtle soft shadow matching your card style
      "0 2px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
      // Hovered — deeper lift, still soft no hard edge
      "0 8px 16px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.12)",
    ]
  );

  const handleMouseMove = (e) => {
    if (!enableTilt || flipped) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawY.set(((e.clientX - cx) / (rect.width / 2)) * 12);
    rawX.set(((e.clientY - cy) / (rect.height / 2)) * -12);
  };

  const handleMouseEnter = () => {
    scale.set(1.03);
    shadowProgress.set(1);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
    shadowProgress.set(0);
  };

  const handleFlip = () => {
    setFlipped((f) => !f);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    // Outermost: owns box-shadow ONLY — completely outside 3D context
    <motion.div
      style={{ boxShadow }}
      className={`relative rounded-[inherit] cursor-pointer ${heightClass}`}
    >
      {/* Perspective wrapper: 3D context only, no background, no shadow */}
      <div
        ref={cardRef}
        className="relative w-full h-full [perspective:1400px]"
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
        {/* Flip + tilt container */}
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
          {/* FRONT */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-[inherit] overflow-hidden">
            {front}
          </div>

          {/* BACK */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[inherit] overflow-hidden">
            {back}
          </div>
        </motion.div>
      </div>

      {/* Flip hint pulse */}
      {!flipped && (
        <motion.div
          className="absolute bottom-2 right-2 z-20 w-2 h-2 rounded-full bg-black/20 pointer-events-none"
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
};