import { motion } from "framer-motion";

export default function MaskedText({
  children,
  as = "h2",
  className = "",
  delay = 0,
}) {
  const MotionElement = motion[as];

  return (
    <span className="ln-text-reveal-mask">
      <MotionElement
        className={className}
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{
          duration: 0.75,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </MotionElement>
    </span>
  );
}