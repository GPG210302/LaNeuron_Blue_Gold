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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: EXPO }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Hero = () => {
  const navigate = useNavigate();
  const { hero, ui, language } = useData();
  const heroRef = useRef(null);

  const scrollToWhyParents = () => {
    const target = document.getElementById("why-parents");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.hash = "why-parents";
  };

  const secondaryLabel =
    language === "pl"
      ? "Dlaczego warto wybrać La Neuron?"
      : "Why choose La Neuron?";

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={classroomBg}
          alt="La Neuron classroom"
          className="h-full w-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-white/75" />
      </div>

      {/* Subtle network overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.08),transparent_22%),radial-gradient(circle_at_85%_30%,rgba(27,42,99,0.06),transparent_20%),radial-gradient(circle_at_75%_80%,rgba(212,175,55,0.06),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <div className="max-w-2xl">
            <Floating delay={0.08}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1B2A63]/25 bg-white/95 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1B2A63] shadow-sm">
                <Sparkles size={14} />
                {hero.badge}
              </div>
            </Floating>

            <Floating delay={0.14}>
              <h1 className="max-w-[10ch] text-[clamp(3.7rem,7vw,6.2rem)] font-black leading-[0.9] tracking-[-0.05em] text-[#1B2A63]">
                {hero.headline.includes("Young Minds") ? (
                  <>
                    {hero.headline.replace("Young Minds", "")}
                    <span className="text-[#E0B33C]">Young Minds</span>
                  </>
                ) : (
                  hero.headline
                )}
              </h1>
            </Floating>

            <Floating delay={0.2}>
              <p className="mt-6 max-w-xl text-[17px] leading-8 text-slate-700">
                {hero.sub}
              </p>
            </Floating>

            <Floating delay={0.28}>
              <div className="mt-7 max-w-xl rounded-[22px] border-[2px] border-[#1B2A63] bg-white/92 p-5 shadow-[0_10px_30px_rgba(27,42,99,0.08)] backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1B2A63] text-white">
                    <Languages size={17} />
                  </div>

                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#1B2A63]/75">
                      {language === "pl"
                        ? "Zajęcia prowadzone po angielsku"
                        : "Taught entirely in English"}
                    </p>
                    <p className="mt-2 text-[15px] leading-7 text-slate-700">
                      {hero.english}
                    </p>
                  </div>
                </div>
              </div>
            </Floating>

            <Floating delay={0.34}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/programmes")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d1a92f] bg-[#E0B33C] px-6 py-3 text-sm font-extrabold text-[#1B2A63] shadow-[0_10px_24px_rgba(224,179,60,0.25)] transition-all duration-200 hover:-translate-y-0.5"
                >
                  {ui?.enquireNow || "Enquire Now"}
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={scrollToWhyParents}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1B2A63] bg-white px-6 py-3 text-sm font-extrabold text-[#1B2A63] shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  {secondaryLabel}
                  <ArrowRight size={16} />
                </button>
              </div>
            </Floating>

            <Floating delay={0.4}>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
                {(hero.stats || []).map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[18px] border-[2px] border-[#1B2A63] bg-white/95 px-4 py-4 text-center shadow-sm"
                  >
                    <div className="text-[30px] font-black leading-none text-[#1B2A63]">
                      <AnimatedCounter value={item.value} />
                    </div>
                    <div className="mt-2 text-[12px] font-semibold text-slate-600">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </Floating>
          </div>

          {/* RIGHT */}
          <div className="relative hidden min-h-[580px] lg:block">
            <Floating
              delay={0.16}
              className="absolute left-[10%] top-[17%] z-20 rounded-2xl bg-[#E0B33C] p-4 text-[#1B2A63] shadow-[0_14px_32px_rgba(224,179,60,0.26)]"
            >
              <Atom size={24} />
            </Floating>

            <Floating
              delay={0.26}
              className="absolute right-[7%] top-[46%] z-20 rounded-2xl bg-[#10B981] p-4 text-white shadow-[0_14px_32px_rgba(16,185,129,0.24)]"
            >
              <Rocket size={24} />
            </Floating>

            <Floating
              delay={0.34}
              className="absolute left-[42%] bottom-[10%] z-20 rounded-2xl bg-[#f56b8a] p-4 text-white shadow-[0_14px_32px_rgba(245,107,138,0.24)]"
            >
              <FlaskConical size={24} />
            </Floating>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.18, ease: EXPO }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full max-w-[640px]">
                <img
                  src={classroomBg}
                  alt="Young scientists at work"
                  className="w-full rounded-[34px] border border-white/60 object-cover shadow-[0_18px_60px_rgba(27,42,99,0.14)]"
                />

                <div className="absolute bottom-4 left-4 max-w-sm rounded-[22px] border border-white/40 bg-white/85 p-5 shadow-[0_12px_30px_rgba(27,42,99,0.10)] backdrop-blur-md">
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

        <Floating delay={0.46}>
          <div className="mt-10 rounded-[24px] border border-[#2b438f] bg-[#1B2A63] px-6 py-5 text-white shadow-[0_16px_36px_rgba(27,42,99,0.18)]">
            <div className="flex items-start gap-4">
              <div className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white">
                <FlaskConical size={17} />
              </div>
              <p className="text-[15px] leading-7 text-white/92">{hero.key}</p>
            </div>
          </div>
        </Floating>
      </div>
    </section>
  );
};