// at top of Home.jsx
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

// inside Home.jsx
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tiltX = useSpring(x, { stiffness: 220, damping: 24 });
  const tiltY = useSpring(y, { stiffness: 220, damping: 24 });

  const glareX = useTransform(tiltY, [-12, 12], ["120%", "-20%"]);
  const glareY = useTransform(tiltX, [-12, 12], ["120%", "-20%"]);
  const glareOpacity = useTransform(tiltY, [-12, 0, 12], [0.12, 0, 0.12]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(((e.clientY - cy) / (rect.height / 2)) * 12);
    y.set(((e.clientX - cx) / (rect.width / 2)) * -12);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: "preserve-3d",
        perspective: 1100,
      }}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ duration: 0.28, ease: EXPO }}
      className={`relative ${className}`}
    >
      {children}

      {/* Shine / glow overlay */}
      <motion.div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: "-40%",
          background:
            "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.35), transparent 60%)",
          mixBlendMode: "soft-light",
          opacity: glareOpacity,
          translateX: glareX,
          translateY: glareY,
        }}
      />
    </motion.div>
  );
};