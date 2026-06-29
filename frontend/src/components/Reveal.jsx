import { motion, useReducedMotion } from "framer-motion";
import { useRef, Children } from "react";


const EASE_OUT_EXPO = [0.22, 1, 0.36, 1];
const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1];
const VIEWPORT = { once: true, margin: "-60px" };


const variants = {
  fadeUp: (delay, y) => ({
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: EASE_OUT_EXPO } },
  }),
  fadeLeft: (delay) => ({
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.65, delay, ease: EASE_OUT_EXPO } },
  }),
  fadeRight: (delay) => ({
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.65, delay, ease: EASE_OUT_EXPO } },
  }),
  scaleUp: (delay) => ({
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay, ease: EASE_OUT_BACK } },
  }),
  wipe: (delay) => ({
    hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
    visible: { clipPath: "inset(0% 0 0 0)", opacity: 1, transition: { duration: 0.7, delay, ease: EASE_OUT_EXPO } },
  }),
  wipeLeft: (delay) => ({
    hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    visible: { clipPath: "inset(0 0% 0 0)", opacity: 1, transition: { duration: 0.7, delay, ease: EASE_OUT_EXPO } },
  }),
  blurIn: (delay) => ({
    hidden: { opacity: 0, filter: "blur(12px)", y: 16 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.75, delay, ease: EASE_OUT_EXPO } },
  }),
};


// ─── REVEAL ───────────────────────────────────────────────
export const Reveal = ({
  children,
  delay = 0,
  y = 28,
  className = "",
  variant = "fadeUp",
}) => {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  const selected = variants[variant]?.(delay, y) ?? variants.fadeUp(delay, y);
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={selected}
    >
      {children}
    </motion.div>
  );
};


// ─── STAGGER REVEAL ───────────────────────────────────────
export const StaggerReveal = ({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  className = "",
  variant = "fadeUp",
  y = 24,
}) => {
  const prefersReduced = useReducedMotion();
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay, delayChildren: initialDelay },
    },
  };
  const itemVariants = variants[variant]?.(0, y) ?? variants.fadeUp(0, y);
  if (prefersReduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={containerVariants}
    >
      {Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};


// ─── SECTION HEADING ──────────────────────────────────────
export const SectionHeading = ({
  overline,
  title,
  sub,
  center = true,
  titleVariant = "fadeUp",
  animateWords = true,
  titleClassName = "",   // 👈 NEW PROP
}) => {
  const prefersReduced = useReducedMotion();
  const words = title?.split(" ") ?? [];


  const wordVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, delay: i * 0.07, ease: EASE_OUT_EXPO },
    }),
  };


  return (
    <div className={center ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}>
      {overline && (
        <Reveal variant="wipeLeft" delay={0}>
          <span className="ln-overline inline-flex items-center gap-2" data-testid="section-overline">
            <motion.span
              className="inline-block h-[2px] bg-current rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 20, opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            />
            {overline}
          </span>
        </Reveal>
      )}


      {/* 👇 titleClassName added here */}
      <h2 className={`mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight ${titleClassName}`}>
        {animateWords && !prefersReduced ? (
          <motion.span
            className="inline"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em] last:mr-0"
                custom={i}
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        ) : (
          <Reveal variant={titleVariant} delay={overline ? 0.1 : 0}>
            {title}
          </Reveal>
        )}
      </h2>


      {sub && (
        <Reveal variant="blurIn" delay={overline ? 0.25 : 0.15}>
          <p className="mt-5 text-lg md:text-xl text-[#475569] leading-relaxed">{sub}</p>
        </Reveal>
      )}
    </div>
  );
};