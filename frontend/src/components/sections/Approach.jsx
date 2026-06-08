import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, Gift } from "lucide-react";
import { Reveal, SectionHeading } from "../Reveal";
import { METHOD, RECEIVE, AGE_GROUPS } from "../../data";

// ─── CONSTANTS ────────────────────────────────────────────
const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

// ─── TILT CARD ────────────────────────────────────────────
const TiltCard = ({ children, className = "", intensity = 8 }) => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rawY, { stiffness: 180, damping: 22 });
  const scale = useSpring(1, { stiffness: 280, damping: 22 });
  const glareX = useTransform(rotateY, [-intensity, intensity], ["120%", "-20%"]);
  const glareY = useTransform(rotateX, [-intensity, intensity], ["120%", "-20%"]);
  const glareOpacity = useTransform(rotateY, [-intensity, 0, intensity], [0.12, 0, 0.12]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        rawY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * intensity);
        rawX.set(((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -intensity);
      }}
      onMouseEnter={() => scale.set(1.02)}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); scale.set(1); }}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 1000 }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden z-10"
        style={{ opacity: glareOpacity }}
      >
        <motion.div
          className="absolute w-[180%] h-[180%] -top-1/2 -left-1/2 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 65%)",
            x: glareX, y: glareY,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// ─── ANIMATED CONNECTOR LINE ──────────────────────────────
// Draws a vertical SVG line with animated pathLength
const ConnectorLine = ({ color, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="flex flex-col items-center py-1 relative" style={{ height: 56 }}>
      {/* Vertical dashed track */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/10" />

      {/* Animated fill line */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2"
        width="2"
        height="56"
        viewBox="0 0 2 56"
        fill="none"
      >
        <motion.line
          x1="1" y1="0" x2="1" y2="56"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.3, ease: EXPO }}
        />
      </svg>

      {/* Animated chevron arrow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: index * 0.12 + 0.55, ease: EXPO }}
      >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <motion.path
            d="M1 1L8 8L15 1"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.12 + 0.6, ease: EXPO }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

// ─── STEP CARD ────────────────────────────────────────────
const StepCard = ({ m, i, isActive, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.6, delay: i * 0.08, ease: EXPO }}
      data-testid={`method-step-${m.n}`}
    >
      <TiltCard intensity={6}>
        <button
          onClick={onClick}
          className="w-full text-left group"
          aria-expanded={isActive}
        >
          {/* Main card row */}
          <div
            className="relative rounded-2xl border transition-all duration-300 overflow-hidden"
            style={{
              borderColor: isActive ? m.color : "rgba(255,255,255,0.08)",
              background: isActive
                ? `linear-gradient(135deg, ${m.color}18 0%, rgba(255,255,255,0.03) 100%)`
                : "rgba(255,255,255,0.04)",
              boxShadow: isActive ? `0 0 0 1px ${m.color}40, 0 8px 32px ${m.color}20` : "none",
            }}
          >
            {/* Left accent bar — animates in when active */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ backgroundColor: m.color }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isActive ? 1 : 0 }}
              transition={{ duration: 0.35, ease: EXPO }}
            />

            <div className="p-5 sm:p-6 flex items-center gap-5 pl-6">
              {/* Step number + icon */}
              <div className="relative shrink-0">
                {/* Glow ring when active */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: isActive ? `0 0 20px ${m.color}60` : "0 0 0px transparent",
                  }}
                  transition={{ duration: 0.4 }}
                />

                {/* Icon background */}
                <motion.div
                  className="grid place-items-center w-16 h-16 rounded-2xl border-2 shadow-lg"
                  style={{ background: m.color, borderColor: `${m.color}80` }}
                  whileHover={{ rotate: [-2, 2, -2, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <m.icon size={28} className="text-white" />
                </motion.div>

                {/* Step number badge */}
                <motion.span
                  className="absolute -top-2.5 -left-2.5 grid place-items-center w-7 h-7 rounded-full font-display font-extrabold text-xs border-2"
                  style={{
                    background: isActive ? m.color : "#fff",
                    color: isActive ? "#fff" : "#0F172A",
                    borderColor: isActive ? m.color : "#0F172A",
                  }}
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {m.n}
                </motion.span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className="font-display font-extrabold text-xl transition-colors"
                    style={{ color: isActive ? m.color : "#fff" }}
                  >
                    {m.title}
                  </h3>

                  {/* Expand indicator */}
                  <motion.div
                    className="shrink-0 w-6 h-6 rounded-full border border-white/20 grid place-items-center"
                    animate={{ rotate: isActive ? 180 : 0, borderColor: isActive ? m.color : "rgba(255,255,255,0.2)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke={isActive ? m.color : "rgba(255,255,255,0.5)"}
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>

                {/* Description — always visible on desktop, toggles on mobile */}
                <p className="mt-1 text-white/60 leading-relaxed text-sm hidden sm:block">
                  {m.text}
                </p>
              </div>
            </div>

            {/* Expandable mobile description */}
            <motion.div
              className="overflow-hidden sm:hidden"
              initial={false}
              animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.35, ease: EXPO }}
            >
              <p className="px-6 pb-5 text-white/60 leading-relaxed text-sm">{m.text}</p>
            </motion.div>
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
};

// ─── PROGRESS TRACK ───────────────────────────────────────
// Horizontal dot progress indicators at the top of the flow
const ProgressTrack = ({ total, active }) => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        className="h-1.5 rounded-full transition-all duration-300"
        animate={{
          width: i === active ? 28 : 8,
          backgroundColor: i <= active
            ? METHOD[i]?.color ?? "#FBBF24"
            : "rgba(255,255,255,0.15)",
        }}
        transition={{ duration: 0.3, ease: EXPO }}
      />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════
export const Approach = () => {
  const [activeStep, setActiveStep] = useState(0);

  const toggleStep = (i) => setActiveStep((prev) => (prev === i ? -1 : i));

  return (
    <section id="approach" className="py-20 lg:py-28 bg-[#0F172A] text-white relative overflow-hidden">

      {/* Subtle background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow orbs */}
      <motion.div
        className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "#3B82F6" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "#FBBF24" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">

        {/* ── HEADING ─────────────────────────────────── */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              className="ln-overline !text-[#FBBF24] inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, ease: EXPO }}
            >
              <motion.span
                className="inline-block h-[2px] bg-[#FBBF24] rounded-full"
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
                    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EXPO } },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <Reveal delay={0.2} variant="blurIn">
              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                Six clear steps turn curiosity into real discovery — the same method scientists use, made joyful for children.
              </p>
            </Reveal>
          </div>
        </Reveal>

        {/* ── PROCESS FLOW ────────────────────────────── */}
        <div className="mt-14 max-w-3xl mx-auto">
          <ProgressTrack total={METHOD.length} active={activeStep === -1 ? -1 : activeStep} />

          {METHOD.map((m, i) => (
            <div key={m.n}>
              <StepCard
                m={m}
                i={i}
                isActive={activeStep === i}
                onClick={() => toggleStep(i)}
              />
              {i < METHOD.length - 1 && (
                <ConnectorLine color={m.color} index={i} />
              )}
            </div>
          ))}

          {/* Completion badge — appears after last step */}
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: 0.3, ease: EXPO }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] font-bold text-sm">
              <CheckCircle2 size={16} />
              Investigation complete — results recorded
            </div>
          </motion.div>
        </div>

        {/* ── WHAT CHILDREN RECEIVE + AGE GROUPS ─────── */}
        <div className="mt-16 grid lg:grid-cols-2 gap-6">

          {/* What children receive */}
          <Reveal>
            <TiltCard className="h-full">
              <div className="ln-card !border-white/10 bg-white/5 p-7 h-full rounded-2xl">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="grid place-items-center w-11 h-11 rounded-xl bg-[#FBBF24] text-[#0F172A] shrink-0"
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <Gift size={22} />
                  </motion.span>
                  <h3 className="font-display font-extrabold text-2xl">What children receive</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {RECEIVE.map((r, i) => (
                    <motion.li
                      key={r}
                      className="flex gap-3 text-white/80"
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.45, delay: i * 0.07, ease: EXPO }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                      >
                        <CheckCircle2 size={20} className="text-[#10B981] shrink-0 mt-0.5" />
                      </motion.div>
                      <span>{r}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </Reveal>

          {/* Age groups */}
          <Reveal delay={0.1}>
            <div className="grid gap-6 h-full">
              {AGE_GROUPS.map((g, i) => (
                <TiltCard key={g.title}>
                  <motion.div
                    className="ln-card !border-white/10 bg-white/5 p-6 rounded-2xl overflow-hidden relative"
                    data-testid={`age-group-${g.title}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: EXPO }}
                    whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }}
                  >
                    {/* Subtle corner glow */}
                    <div
                      className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: g.color }}
                    />

                    <div className="flex items-center justify-between relative">
                      <h3 className="font-display font-extrabold text-xl">{g.title}</h3>
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs font-extrabold border-2"
                        style={{ background: `${g.color}20`, color: g.color, borderColor: `${g.color}60` }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {g.ages}
                      </motion.span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 relative">
                      {g.points.map((p, j) => (
                        <motion.span
                          key={p}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/8 text-white/75 border border-white/10"
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={VIEWPORT}
                          transition={{ duration: 0.35, delay: i * 0.05 + j * 0.04, ease: EXPO }}
                          whileHover={{
                            backgroundColor: `${g.color}25`,
                            borderColor: `${g.color}50`,
                            color: "#fff",
                          }}
                        >
                          {p}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};