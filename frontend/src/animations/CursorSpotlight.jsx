import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export default function CursorSpotlight({ children, className = "" }) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const rawX = useMotionValue(-300);
  const rawY = useMotionValue(-300);

  const x = useSpring(rawX, { stiffness: 280, damping: 30 });
  const y = useSpring(rawY, { stiffness: 280, damping: 30 });

  const handlePointerMove = (event) => {
    if (reduceMotion) return;

    const element = containerRef.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();

    rawX.set(event.clientX - bounds.left);
    rawY.set(event.clientY - bounds.top);
  };

  const handlePointerLeave = () => {
    rawX.set(-300);
    rawY.set(-300);
  };

  return (
    <div
      ref={containerRef}
      className={`ln-spotlight-card ${className}`}
      onPointerMove={reduceMotion ? undefined : handlePointerMove}
      onPointerLeave={reduceMotion ? undefined : handlePointerLeave}
    >
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="ln-spotlight-glow"
          style={{ left: x, top: y }}
        />
      )}

      <div className="ln-spotlight-content">{children}</div>
    </div>
  );
}