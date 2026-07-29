import { motion, useReducedMotion } from "framer-motion";

export default function HoverLift({
  children,
  className = "",
  lift = 8,
  scale = 1.015,
  as = "div",
  href,
}) {
  const reduceMotion = useReducedMotion();
  const MotionElement = motion[as];

  return (
    <MotionElement
      className={className}
      href={href}
      whileHover={reduceMotion ? undefined : { y: -lift, scale }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 23,
      }}
    >
      {children}
    </MotionElement>
  );
}