import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 28, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ overline, title, sub, center = true }) => (
  <div className={center ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}>
    {overline && <span className="ln-overline" data-testid="section-overline">{overline}</span>}
    <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">{title}</h2>
    {sub && <p className="mt-5 text-lg md:text-xl text-[#475569] leading-relaxed">{sub}</p>}
  </div>
);
