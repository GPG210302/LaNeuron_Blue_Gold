import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function MagneticButton({
  children,
  href = "#",
  className = "",
  strength = 0.22,
}) {
  const buttonRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 250, damping: 18 });
  const y = useSpring(rawY, { stiffness: 250, damping: 18 });

  const handlePointerMove = (event) => {
    const element = buttonRef.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const centreX = bounds.left + bounds.width / 2;
    const centreY = bounds.top + bounds.height / 2;

    rawX.set((event.clientX - centreX) * strength);
    rawY.set((event.clientY - centreY) * strength);
  };

  const resetPosition = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={`ln-magnetic-button ${className}`}
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      whileTap={{ scale: 0.97 }}
    >
      <span className="ln-magnetic-label">{children}</span>
      <span className="ln-magnetic-arrow" aria-hidden="true">
        <ArrowRight size={16} />
      </span>
    </motion.a>
  );
}