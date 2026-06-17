import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Atom, Rocket, Sparkles, FlaskConical, ArrowRight, Languages } from "lucide-react";
import { HERO } from "../../data";

import classroomBg from "../../assets/Group_of_kids.png";

// ─── EASING ───────────────────────────────────────────────
const EXPO = [0.22, 1, 0.36, 1];

// ─── ANIMATED COUNTER ─────────────────────────────────────
const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);

  useEffect(() => {
    const match = String(value).match(/^(\d+)(.*)/);
    if (!match) { setDisplay(value); return; }
    const end = parseInt(match[1], 10);
    const suffix = match[2] ?? "";
    const controls = animate(0, end, {
      duration: 1.8,
      ease: "easeOut",
      delay: 0.4,
      onUpdate: (v) => setDisplay(Math.round(v) + suffix),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{display}</span>;
};

// ─── FLOATING BADGE ───────────────────────────────────────
const Floating = ({ children, className, delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, scale: 0.5, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: EXPO }}
  >
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// ─── ANIMATED BACKGROUND ORBS ────────────────────────────
const Orbs = () => (
  <>
    <motion.div
      className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E7EBF7] blur-3xl"
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-[#FFE4E4] blur-3xl"
      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.75, 0.6] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.div
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#EEF2FF] blur-[100px]"
      animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.3, 0.45, 0.3] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
  </>
);

// ─── HERO ─────────────────────────────────────────────────
export const Hero = () => {
  const navigate = useNavigate();
  const words = "Real-World Science for".split(" ");

  return (
    <section
      id="home"
      className="relative pt-36 pb-20 sm:pt-[250px] lg:pt-[260px] lg:pb-28 overflow-hidden ln-grid-bg"
    >
      {/* ── BLENDED BACKGROUND IMAGE — fixed throughout scroll ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"  {/* ← changed: absolute → fixed */}
        aria-hidden="true"
      >
        <img
          src={classroomBg}
          alt=""
          className="w-full h-full object-right object-contain"
          style={{
            objectPosition: "70% top",
            mixBlendMode: "multiply",
            opacity: 0.35,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(247,248,252,0.97) 0%, transparent 10%)",  {/* ← changed: radial removed, bottom-fade only */}
          }}
        />
      </div>

      <Orbs />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center relative z-10">

        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div>
          <motion.span
            className="ln-tag !text-sm !px-4 !py-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EXPO }}
            data-testid="hero-badge"
          >
            <Sparkles size={14} /> {HERO.badge}
          </motion.span>

          <h1 className="mt-5 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.02] text-[#1B2A63]">
            <motion.span
              className="inline"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
              }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.22em]"
                  variants={{
                    hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
                    visible: {
                      opacity: 1, y: 0, filter: "blur(0px)",
                      transition: { duration: 0.65, ease: EXPO },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>

            <motion.span
              className="relative inline-block pb-2 text-outlined"
              style={{ lineHeight: "1.2" }}
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.45, duration: 0.7, ease: EXPO }}
            >
              {" "}Young Minds
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
              >
                <motion.path
                  d="M2 9 C50 2, 150 2, 198 9"
                  stroke="#1B2A63"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.7, ease: EXPO }}
                />
              </motion.svg>
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-[#475569] leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.7, ease: EXPO }}
          >
            {HERO.sub}
          </motion.p>

          <motion.div
            className="mt-5 max-w-xl ln-card !shadow-[4px_4px_0_#0F172A] bg-[#E7EBF7] p-4 flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6, ease: EXPO }}
            data-testid="hero-english-highlight"
          >
            <motion.span
              className="grid place-items-center w-10 h-10 rounded-xl bg-[#1B2A63] text-white border-2 border-[#0F172A] shrink-0"
              whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
            >
              <Languages size={20} />
            </motion.span>
            <p className="text-sm md:text-base text-[#0F172A] font-medium leading-relaxed">
              <span className="font-extrabold text-[#1B2A63]">Taught entirely in English.</span>{" "}
              {HERO.english}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.6, ease: EXPO }}
          >
            <motion.button
              onClick={() => navigate("/register")}
              className="ln-btn ln-btn-primary"
              data-testid="hero-cta-register"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Reserve a Spot <ArrowRight size={18} />
            </motion.button>
            <motion.button
              onClick={() => navigate("/what-is-steam")}
              className="ln-btn ln-btn-white"
              data-testid="hero-cta-learn"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              What is STEAM?
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-3 gap-4 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            {HERO.stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="ln-card !shadow-[3px_3px_0_#0F172A] px-3 py-3 text-center"
                data-testid="hero-stat"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: EXPO }}
                whileHover={{
                  y: -4,
                  boxShadow: "4px 6px 0 #0F172A",
                  transition: { type: "spring", stiffness: 300, damping: 18 },
                }}
              >
                <div className="font-display font-extrabold text-2xl text-[#1B2A63]">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-xs font-semibold text-[#475569] mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN — floating badges only ─────────── */}
        <motion.div
          className="relative h-[480px] lg:h-[540px]"
          initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.2, duration: 0.8, ease: EXPO }}
        >
          <Floating className="-top-5 -left-5" delay={0.5}>
            <span className="grid place-items-center w-16 h-16 rounded-2xl bg-[#FBBF24] border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Atom size={28} />
              </motion.div>
            </span>
          </Floating>

          <Floating className="top-1/3 -right-6" delay={0.65}>
            <motion.span
              className="grid place-items-center w-14 h-14 rounded-2xl bg-[#10B981] text-white border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]"
              whileHover={{ rotate: -15, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Rocket size={24} />
            </motion.span>
          </Floating>

          <Floating className="-bottom-5 left-10" delay={0.8}>
            <motion.span
              className="grid place-items-center w-14 h-14 rounded-2xl bg-[#FB7185] text-white border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]"
              whileHover={{ rotate: 15, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FlaskConical size={24} />
            </motion.span>
          </Floating>
        </motion.div>

      </div>

      {/* ── KEY BANNER ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-14">
        <motion.div
          className="ln-card bg-[#0F172A] text-white px-6 py-5 md:px-8 md:py-6 flex items-start gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EXPO }}
          whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 300 } }}
        >
          <motion.span
            className="grid place-items-center w-10 h-10 rounded-xl bg-[#FBBF24] text-[#0F172A] shrink-0"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Sparkles size={20} />
          </motion.span>
          <p className="text-base md:text-lg font-medium leading-relaxed">{HERO.key}</p>
        </motion.div>
      </div>
    </section>
  );
};