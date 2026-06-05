import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Atom, Rocket, Sparkles, FlaskConical, ArrowRight, Languages } from "lucide-react";
import { HERO } from "../../data";

const Floating = ({ children, className, delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
  >
    <div className="ln-float">{children}</div>
  </motion.div>
);

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative pt-36 pb-20 sm:pt-[250px] lg:pt-[260px] lg:pb-28 overflow-hidden ln-grid-bg">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E7EBF7] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-[#FFE4E4] blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center relative">
        <div>
          <motion.span
            className="ln-tag !text-sm !px-4 !py-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="hero-badge"
          >
            <Sparkles size={14} /> {HERO.badge}
          </motion.span>

          <motion.h1
            className="mt-5 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.02] text-[#1B2A63]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            Real-World Science for{" "}
            <span className="relative inline-block text-gold-shiny">
              Young Minds
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                <path d="M2 9 C50 2, 150 2, 198 9" stroke="#1B2A63" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-[#475569] leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            {HERO.sub}
          </motion.p>

          <motion.div
            className="mt-5 max-w-xl ln-card !shadow-[4px_4px_0_#0F172A] bg-[#E7EBF7] p-4 flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            data-testid="hero-english-highlight"
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#1B2A63] text-white border-2 border-[#0F172A] shrink-0">
              <Languages size={20} />
            </span>
            <p className="text-sm md:text-base text-[#0F172A] font-medium leading-relaxed">
              <span className="font-extrabold text-[#1B2A63]">Taught entirely in English.</span> {HERO.english}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <button onClick={() => navigate("/register")} className="ln-btn ln-btn-primary" data-testid="hero-cta-register">
              Reserve a Spot <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/what-is-steam")} className="ln-btn ln-btn-white" data-testid="hero-cta-learn">
              What is STEAM?
            </button>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-3 gap-4 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            {HERO.stats.map((s) => (
              <div key={s.label} className="ln-card !shadow-[3px_3px_0_#0F172A] px-3 py-3 text-center" data-testid="hero-stat">
                <div className="font-display font-extrabold text-2xl text-[#1B2A63]">{s.value}</div>
                <div className="text-xs font-semibold text-[#475569] mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <div className="ln-card overflow-hidden rotate-2">
            <img src={HERO.image} alt="Children exploring science" className="w-full h-[440px] object-cover" />
          </div>

          <Floating className="-top-5 -left-5" delay={0.4}>
            <span className="grid place-items-center w-16 h-16 rounded-2xl bg-[#FBBF24] border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]">
              <Atom size={28} className="ln-spin-slow" />
            </span>
          </Floating>
          <Floating className="top-1/3 -right-6" delay={0.55}>
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[#10B981] text-white border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]">
              <Rocket size={24} />
            </span>
          </Floating>
          <Floating className="-bottom-5 left-10" delay={0.7}>
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[#FB7185] text-white border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]">
              <FlaskConical size={24} />
            </span>
          </Floating>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-14">
        <div className="ln-card bg-[#0F172A] text-white px-6 py-5 md:px-8 md:py-6 flex items-start gap-4">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#FBBF24] text-[#0F172A] shrink-0">
            <Sparkles size={20} />
          </span>
          <p className="text-base md:text-lg font-medium leading-relaxed">{HERO.key}</p>
        </div>
      </div>
    </section>
  );
};
