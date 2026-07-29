import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Atom,
  Rocket,
  Sparkles,
  FlaskConical,
  ArrowRight,
  Languages,
} from "lucide-react";
import { useData } from "../../i18n/useData";
import classroomBg from "../../assets/Group_of_kids_logo.webp";

const EXPO = [0.22, 1, 0.36, 1];

const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const match = String(value).match(/^(\d+)(.*)/);
    if (!match) {
      setDisplay(value);
      return;
    }

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

  return <>{display}</>;
};

const Floating = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, delay, ease: EXPO }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Hero = () => {
  const navigate = useNavigate();
  const { hero, ui, language } = useData();

  const handleScrollToWhy = () => {
    const section = document.getElementById("why-parents");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const secondaryLabel =
    language === "pl"
      ? "Dlaczego warto wybrać La Neuron?"
      : "Why choose La Neuron?";

  return (
    <section className="relative overflow-hidden bg-[#fcfbf8] pb-12 pt-6 sm:pb-16 lg:pb-20">
      {/* Background image and overlay — same as before */}
      <div className="absolute inset-0">
        <img
          src={classroomBg}
          alt="Children exploring science together"
          className="h-full w-full object-cover object-center opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-white/74" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,179,60,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(27,42,99,0.10),transparent_28%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* LEFT COLUMN — restore original heading and text stacking */}
        <div className="max-w-2xl">
          <Floating delay={0.08}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1B2A63]/20 bg-white/90 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#1B2A63] shadow-sm">
              <Sparkles size={14} />
              {hero.badge}
            </div>
          </Floating>

          <Floating delay={0.14}>
            <h1 className="max-w-[16ch] text-[clamp(3rem,6.4vw,5.4rem)] font-black leading-[0.95] tracking-[-0.06em] text-[#1B2A63]">
              {hero.headline}
            </h1>
          </Floating>

          <Floating delay={0.2}>
            <p className="mt-6 max-w-2xl text-[16px] leading-8 text-slate-700 sm:text-[17px]">
              {hero.sub}
            </p>
          </Floating>

          <Floating delay={0.28}>
            <div className="mt-7 rounded-[26px] border-[2px] border-[#1B2A63] bg-white/92 px-6 py-5 shadow-[0_18px_50px_rgba(12,26,84,0.08)] backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#1B2A63] text-white">
                  <Languages size={18} />
                </div>

                <div>
                  <p className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#1B2A63]/70">
                    {language === "pl"
                      ? "Zajęcia prowadzone po angielsku"
                      : "Taught entirely in English"}
                  </p>
                  <p className="mt-2 text-[14px] leading-7 text-slate-700 sm:text-[15px]">
                    {hero.english}
                  </p>
                </div>
              </div>
            </div>
          </Floating>

          {/* CTA buttons — only behavior changed */}
          <Floating delay={0.34}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/programmes")}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#c9a23a] bg-[#E0B33C] px-6 py-3 text-sm font-extrabold text-[#1B2A63] shadow-[0_14px_30px_rgba(224,179,60,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(224,179,60,0.28)]"
              >
                {ui?.enquireNow || "Enquire Now"}
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleScrollToWhy}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1B2A63] bg-white/90 px-6 py-3 text-sm font-extrabold text-[#1B2A63] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#f7f8fc]"
              >
                {secondaryLabel}
                <ArrowRight size={16} />
              </button>
            </div>
          </Floating>

          <Floating delay={0.42}>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {(hero.stats || []).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] border-[2px] border-[#1B2A63] bg-white/92 px-4 py-4 text-center shadow-[0_12px_30px_rgba(12,26,84,0.06)]"
                >
                  <div className="text-2xl font-black text-[#1B2A63] sm:text-[28px]">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="mt-1 text-[12px] font-semibold text-slate-600 sm:text-[13px]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Floating>
        </div>

        {/* RIGHT COLUMN — restore image card composition */}
        <div className="relative hidden min-h-[620px] lg:block">
          <Floating
            delay={0.18}
            className="absolute left-[8%] top-[11%] rounded-2xl bg-[#E0B33C] p-4 text-[#1B2A63] shadow-[0_16px_40px_rgba(224,179,60,0.26)]"
          >
            <Atom size={26} />
          </Floating>

          <Floating
            delay={0.26}
            className="absolute right-[8%] top-[30%] rounded-2xl bg-[#10B981] p-4 text-white shadow-[0_16px_40px_rgba(16,185,129,0.22)]"
          >
            <Rocket size={24} />
          </Floating>

          <Floating
            delay={0.34}
            className="absolute left-[36%] bottom-[20%] rounded-2xl bg-[#f56b8a] p-4 text-white shadow-[0_16px_40px_rgba(245,107,138,0.20)]"
          >
            <FlaskConical size={24} />
          </Floating>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.18, ease: EXPO }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[640px]">
              <img
                src={classroomBg}
                alt="Young scientists at work"
                className="w-full rounded-[36px] border border-white/40 object-cover shadow-[0_26px_90px_rgba(27,42,99,0.16)]"
              />

              <div className="absolute bottom-4 left-4 max-w-sm rounded-[24px] border border-white/35 bg-white/86 p-5 backdrop-blur-md shadow-[0_18px_40px_rgba(27,42,99,0.10)]">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#1B2A63]/70">
                  {language === "pl"
                    ? "Młodzi naukowcy w działaniu"
                    : "Young scientists at work"}
                </p>
                <p className="mt-2 text-[14px] leading-7 text-slate-700">
                  {language === "pl"
                    ? "Praktyczna nauka, współpraca i twórcze rozwiązywanie problemów w inspirującej przestrzeni."
                    : "Hands-on science, guided teamwork, and creative problem-solving in one inspiring space."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative z-10 mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EXPO }}
          className="rounded-[28px] border border-[#253a81] bg-[linear-gradient(135deg,#1B2A63_0%,#2f4ea1_100%)] px-6 py-5 text-white shadow-[0_20px_50px_rgba(17,31,84,0.20)]"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/14">
              <FlaskConical size={18} />
            </div>
            <p className="text-[14px] leading-7 text-white/92 sm:text-[15px]">
              {hero.key}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};