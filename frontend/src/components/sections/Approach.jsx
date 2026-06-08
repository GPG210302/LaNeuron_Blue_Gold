import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, Gift } from "lucide-react";
import { Reveal, StaggerReveal } from "../Reveal";
import { METHOD, RECEIVE, AGE_GROUPS } from "../../data";

// ─── CONSTANTS ────────────────────────────────────────────
const EXPO   = [0.22, 1, 0.36, 1];
const GOLD   = "#FBBF24";
const VIEWPORT = { once: true, margin: "-40px" };

// ═══════════════════════════════════════════════════════════
// ANIMATED VERTICAL TIMELINE
// A single golden line that draws top-to-bottom as user scrolls
// ═══════════════════════════════════════════════════════════
const TimelineFlow = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  // Scroll-driven line draw: fills gold as user scrolls through section
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">

      {/* ── GOLDEN SPINE LINE ── */}
      {/* Track (dim) */}
      <div className="absolute left-[28px] top-5 bottom-5 w-px bg-white/10" />
      {/* Animated fill */}
      <motion.div
        className="absolute left-[28px] top-5 w-px origin-top"
        style={{
          scaleY,
          height: "calc(100% - 2.5rem)",
          background: `linear-gradient(to bottom, ${GOLD}, ${GOLD}cc, ${GOLD}66)`,
          boxShadow: `0 0 8px ${GOLD}80`,
        }}
      />

      {/* ── STEPS ── */}
      <div className="relative flex flex-col gap-2">
        {METHOD.map((m, i) => (
          <StepRow key={m.n} m={m} i={i} isLast={i === METHOD.length - 1} />
        ))}
      </div>

      {/* ── END NODE ── */}
      <motion.div
        className="relative flex items-center gap-4 pt-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, delay: 0.2, ease: EXPO }}
      >
        {/* Gold circle cap */}
        <div
          className="relative z-10 w-14 h-14 shrink-0 flex items-center justify-center rounded-full border-2"
          style={{
            background: `radial-gradient(circle, ${GOLD}40, ${GOLD}10)`,
            borderColor: GOLD,
            boxShadow: `0 0 20px ${GOLD}60, 0 0 40px ${GOLD}20`,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle2 size={22} style={{ color: GOLD }} />
          </motion.div>
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: GOLD }}>Investigation complete</p>
          <p className="text-white/50 text-xs mt-0.5">Results recorded — conclusions drawn</p>
        </div>
      </motion.div>
    </div>
  );
};

// ─── SINGLE STEP ROW ──────────────────────────────────────
const StepRow = ({ m, i, isLast }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex items-start gap-4 group"
      initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.55, delay: i * 0.09, ease: EXPO }}
      data-testid={`method-step-${m.n}`}
    >
      {/* ── NODE: step number + icon stacked on the spine ── */}
      <div className="relative z-10 flex flex-col items-center shrink-0">
        {/* Step number — sits on the gold spine */}
        <motion.div
          className="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs border-2 mb-2"
          style={{ background: "#0F172A", borderColor: GOLD, color: GOLD }}
          animate={inView ? { scale: [0.6, 1.1, 1] } : {}}
          transition={{ duration: 0.4, delay: i * 0.09 + 0.1 }}
        >
          {m.n}
        </motion.div>

        {/* Icon chip — compact, not oversized */}
        <motion.div
          className="w-[42px] h-[42px] rounded-xl flex items-center justify-center border border-white/15 shadow-md"
          style={{ background: `${m.color}22`, borderColor: `${m.color}40` }}
          whileHover={{ scale: 1.1, borderColor: m.color }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <m.icon size={20} style={{ color: m.color }} />
        </motion.div>
      </div>

      {/* ── CONTENT: compact inline text ── */}
      <div
        className="flex-1 min-w-0 rounded-xl px-4 py-3 mb-2 border transition-all duration-300 group-hover:border-white/20"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className="font-display font-extrabold text-base leading-tight"
            style={{ color: m.color }}
          >
            {m.title}
          </span>
          <span className="text-white/50 text-sm leading-relaxed">{m.text}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════
export const Approach = () => (
  <section
    id="approach"
    className="py-20 lg:py-28 bg-[#0F172A] text-white relative overflow-hidden"
  >
    {/* Subtle grid texture */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    />

    {/* Ambient glow orbs */}
    <motion.div
      className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl"
      style={{ background: "#3B82F620" }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl"
      style={{ background: `${GOLD}15` }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />

    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

      {/* ── HEADING ─────────────────────────────────────── */}
      <Reveal>
        <div className="max-w-3xl mx-auto text-center mb-14">
          <motion.span
            className="ln-overline inline-flex items-center gap-2"
            style={{ color: GOLD }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EXPO }}
          >
            <motion.span
              className="inline-block h-[2px] rounded-full"
              style={{ backgroundColor: GOLD }}
              initial={{ width: 0 }}
              whileInView={{ width: 20 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, ease: EXPO }}
            />
            Our investigative approach
          </motion.span>

          <motion.h2
            className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
            }}
          >
            {["Every", "Session", "Follows", "the", "Scientific", "Method"].map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.22em]"
                variants={{
                  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
                  visible: {
                    opacity: 1, y: 0, filter: "blur(0px)",
                    transition: { duration: 0.55, ease: EXPO },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

          <Reveal delay={0.2} variant="blurIn">
            <p className="mt-4 text-lg text-white/60 leading-relaxed">
              Six clear steps turn curiosity into real discovery — the same method scientists
              use, made joyful for children.
            </p>
          </Reveal>
        </div>
      </Reveal>

      {/* ── PROCESS FLOW ────────────────────────────────── */}
      <TimelineFlow />

      {/* ── WHAT CHILDREN RECEIVE + AGE GROUPS ─────────── */}
      <div className="mt-16 grid lg:grid-cols-2 gap-6">

        {/* What children receive */}
        <Reveal>
          <div
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <motion.span
                className="grid place-items-center w-10 h-10 rounded-xl shrink-0"
                style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}40` }}
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gift size={20} style={{ color: GOLD }} />
              </motion.span>
              <h3 className="font-display font-extrabold text-xl">What children receive</h3>
            </div>
            <ul className="space-y-2.5">
              {RECEIVE.map((r, i) => (
                <motion.li
                  key={r}
                  className="flex gap-3 items-start text-white/70 text-sm"
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: EXPO }}
                >
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                  {r}
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Age groups */}
        <Reveal delay={0.08}>
          <div className="flex flex-col gap-4 h-full">
            {AGE_GROUPS.map((g, i) => (
              <motion.div
                key={g.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 relative overflow-hidden"
                data-testid={`age-group-${g.title}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EXPO }}
                whileHover={{ borderColor: `${g.color}50`, transition: { duration: 0.2 } }}
              >
                {/* Corner glow */}
                <div
                  className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-25 pointer-events-none"
                  style={{ backgroundColor: g.color }}
                />
                <div className="flex items-center justify-between mb-3 relative">
                  <h3 className="font-display font-extrabold text-lg">{g.title}</h3>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-extrabold"
                    style={{ background: `${g.color}20`, color: g.color, border: `1px solid ${g.color}40` }}
                  >
                    {g.ages}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 relative">
                  {g.points.map((p, j) => (
                    <motion.span
                      key={p}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-white/60"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.3, delay: i * 0.05 + j * 0.04, ease: EXPO }}
                      whileHover={{ background: `${g.color}20`, borderColor: `${g.color}40`, color: "#fff" }}
                    >
                      {p}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);