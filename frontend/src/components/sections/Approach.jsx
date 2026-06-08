import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Gift } from "lucide-react";
import { Reveal } from "../Reveal";
import { METHOD, RECEIVE, AGE_GROUPS } from "../../data";

// ─── CONSTANTS ────────────────────────────────────────────
const EXPO = [0.22, 1, 0.36, 1];
const GOLD = "#FBBF24";
const VP   = { once: true, margin: "-30px" };

// ─── ANIMATED GOLDEN ARROW ────────────────────────────────
// A fat pulsing downward arrow between each step — unmistakably "next step"
const FlowArrow = ({ delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, VP);

  return (
    <motion.div
      ref={ref}
      className="flex justify-center items-center py-1 relative"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3, delay }}
    >
      {/* Vertical stem */}
      <motion.div
        className="absolute w-[3px] rounded-full origin-top"
        style={{
          height: 28,
          background: `linear-gradient(to bottom, ${GOLD}, ${GOLD}aa)`,
          boxShadow: `0 0 6px ${GOLD}80`,
        }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.35, delay: delay + 0.05, ease: EXPO }}
      />

      {/* Arrowhead — SVG chevron, fat and clear */}
      <motion.div
        className="mt-7"
        initial={{ opacity: 0, y: -6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: delay + 0.25, ease: EXPO }}
      >
        {/* Pulse animation on the arrowhead */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path
              d="M2 2L10 11L18 2"
              stroke={GOLD}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ─── STEP CARD ────────────────────────────────────────────
// One unified pill — number badge + coloured icon + title + description all together
const StepCard = ({ m, i }) => {
  const ref  = useRef(null);
  const inView = useInView(ref, VP);

  return (
    <motion.div
      ref={ref}
      data-testid={`method-step-${m.n}`}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.55, delay: i * 0.07, ease: EXPO }}
      whileHover={{ y: -2, transition: { type: "spring", stiffness: 300 } }}
    >
      <div
        className="relative flex items-center gap-4 px-5 py-4 rounded-2xl border transition-colors duration-300"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.09)",
          backdropFilter: "blur(6px)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${m.color}50`;
          e.currentTarget.style.background  = `${m.color}0d`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.background  = "rgba(255,255,255,0.04)";
        }}
      >
        {/* Left accent bar — step colour */}
        <div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
          style={{ background: m.color, boxShadow: `0 0 8px ${m.color}80` }}
        />

        {/* Step number badge */}
        <div
          className="absolute -top-2.5 left-4 w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[11px] border-2"
          style={{ background: "#0F172A", borderColor: GOLD, color: GOLD }}
        >
          {m.n}
        </div>

        {/* Icon — compact coloured square */}
        <motion.div
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border"
          style={{ background: `${m.color}22`, borderColor: `${m.color}50` }}
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          <m.icon size={22} style={{ color: m.color }} />
        </motion.div>

        {/* Text — title + description inline */}
        <div className="flex-1 min-w-0">
          <span
            className="font-display font-extrabold text-base"
            style={{ color: m.color }}
          >
            {m.title}
          </span>
          <span className="text-white/55 text-sm ml-2 leading-snug">
            {m.text}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── COMPLETION BADGE ─────────────────────────────────────
const CompletionBadge = () => {
  const ref = useRef(null);
  const inView = useInView(ref, VP);

  return (
    <motion.div
      ref={ref}
      className="flex justify-center mt-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.2, ease: EXPO }}
    >
      <motion.div
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border font-bold text-sm"
        style={{
          background: `${GOLD}15`,
          borderColor: `${GOLD}50`,
          color: GOLD,
          boxShadow: `0 0 20px ${GOLD}25`,
        }}
        animate={{ boxShadow: [`0 0 10px ${GOLD}20`, `0 0 28px ${GOLD}45`, `0 0 10px ${GOLD}20`] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CheckCircle2 size={17} />
        </motion.div>
        Investigation complete — results recorded
      </motion.div>
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
    {/* Subtle dot grid */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    />

    {/* Ambient glow */}
    <motion.div
      className="pointer-events-none absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.07]"
      style={{ background: "#3B82F6" }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="pointer-events-none absolute bottom-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.06]"
      style={{ background: GOLD }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />

    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

      {/* ── HEADING ─────────────────────────────────────── */}
      <Reveal>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.span
            className="ln-overline inline-flex items-center gap-2"
            style={{ color: GOLD }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.5, ease: EXPO }}
          >
            <motion.span
              className="inline-block h-[2px] rounded-full"
              style={{ backgroundColor: GOLD }}
              initial={{ width: 0 }}
              whileInView={{ width: 20 }}
              viewport={VP}
              transition={{ duration: 0.5, ease: EXPO }}
            />
            Our investigative approach
          </motion.span>

          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Every Session Follows the{" "}
            <span style={{ color: GOLD }}>Scientific Method</span>
          </h2>

          <p className="mt-4 text-lg text-white/60 leading-relaxed">
            Six clear steps turn curiosity into real discovery — the same method
            scientists use, made joyful for children.
          </p>
        </div>
      </Reveal>

      {/* ── PROCESS FLOW ────────────────────────────────── */}
      <div className="max-w-2xl mx-auto">
        {METHOD.map((m, i) => (
          <div key={m.n}>
            <StepCard m={m} i={i} />
            {i < METHOD.length - 1 && (
              <FlowArrow delay={i * 0.08 + 0.15} />
            )}
          </div>
        ))}
        <CompletionBadge />
      </div>

      {/* ── BOTTOM GRID ─────────────────────────────────── */}
      <div className="mt-16 grid lg:grid-cols-2 gap-6">

        {/* What children receive */}
        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full">
            <div className="flex items-center gap-3 mb-5">
              <motion.span
                className="grid place-items-center w-10 h-10 rounded-xl shrink-0"
                style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40` }}
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
                  viewport={VP}
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
                viewport={VP}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EXPO }}
                whileHover={{ borderColor: `${g.color}50`, transition: { duration: 0.2 } }}
              >
                <div
                  className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none"
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
                      viewport={VP}
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