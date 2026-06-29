import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Reveal, SectionHeading } from "../Reveal";
import { STEAM, HERO } from "../../data";
import { useData } from "../../i18n/useData";
import "../../WhatIsSteam.css";

const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

// Colors for stats, timeline, whoFollows, misconceptions — NOT translated, purely visual
const STAT_COLORS    = ["#3B82F6", "#10B981", "#F97316", "#A855F7"];
const TIMELINE_COLORS = ["#3B82F6", "#10B981", "#F97316", "#A855F7", "#FB7185"];
const FOLLOWER_COLORS = ["#3B82F6", "#10B981", "#F97316", "#A855F7", "#FB7185", "#E0B33C"];
const MYTH_COLORS    = ["#3B82F6", "#10B981", "#F97316"];

/* ─── TiltCard ─── */
const TiltCard = ({ children, className = "", intensity = 10 }) => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rawY, { stiffness: 180, damping: 22 });
  const scale = useSpring(1, { stiffness: 280, damping: 22 });
  const glareX = useTransform(rotateY, [-intensity, intensity], ["120%", "-20%"]);
  const glareY = useTransform(rotateX, [-intensity, intensity], ["120%", "-20%"]);
  const glareOpacity = useTransform(rotateY, [-intensity, 0, intensity], [0.15, 0, 0.15]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        rawY.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * intensity);
        rawX.set(((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -intensity);
      }}
      onMouseEnter={() => scale.set(1.03)}
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
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 65%)",
            x: glareX,
            y: glareY,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

/* ─── FloatingSticker ─── */
const FloatingSticker = ({ emoji, label, className, delay = 0, rotation = 0 }) => (
  <motion.div
    className={`absolute z-20 select-none pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.4, rotate: rotation - 12 }}
    whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
    viewport={VIEWPORT}
    transition={{ delay, duration: 0.7, ease: EXPO }}
  >
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [rotation, rotation + 3, rotation] }}
      transition={{ duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.15))" }}
    >
      <div className="text-5xl leading-none">{emoji}</div>
      {label && (
        <div className="mt-1 text-center text-[10px] font-bold text-[#1B2A63] bg-white/90 rounded-full px-2 py-0.5 shadow-sm">
          {label}
        </div>
      )}
    </motion.div>
  </motion.div>
);

/* ─── StatBadge ─── */
const StatBadge = ({ value, label, color, delay }) => (
  <motion.div
    className="ln-card px-4 py-5 text-center"
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={VIEWPORT}
    transition={{ duration: 0.55, delay, ease: EXPO }}
    whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
  >
    <div className="font-display font-extrabold text-3xl" style={{ color }}>
      {value}
    </div>
    <div className="text-xs font-semibold text-[#475569] mt-1 leading-tight max-w-[110px] mx-auto">
      {label}
    </div>
  </motion.div>
);

/* ─── TimelineItem ─── */
const TimelineItem = ({ year, event, detail, color, index, isLast }) => (
  <motion.div
    className="flex gap-5 items-start"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={VIEWPORT}
    transition={{ duration: 0.55, delay: index * 0.1, ease: EXPO }}
  >
    <div className="flex flex-col items-center shrink-0">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-md text-center leading-tight px-1"
        style={{ backgroundColor: color }}
      >
        {year}
      </div>
      {!isLast && <div className="w-0.5 h-10 bg-[#E2E8F0] mt-1" />}
    </div>
    <div className="pt-2 pb-6">
      <p className="font-bold text-[#1B2A63] text-base">{event}</p>
      <p className="text-sm text-[#475569] mt-1 leading-relaxed">{detail}</p>
    </div>
  </motion.div>
);

/* ─── FollowerCard ─── */
const FollowerCard = ({ flag, country, detail, color, index }) => (
  <TiltCard>
    <motion.div
      className="ln-card p-5 h-full"
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: index * 0.07, ease: EXPO }}
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 300 } }}
    >
      <div className="text-4xl mb-3">{flag}</div>
      <h4 className="font-extrabold text-base text-[#1B2A63]">{country}</h4>
      <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">{detail}</p>
      <div className="mt-3 h-1 rounded-full w-12" style={{ backgroundColor: color }} />
    </motion.div>
  </TiltCard>
);

/* ─── MythCard ─── */
const MythCard = ({ myth, truth, color, index }) => (
  <TiltCard>
    <motion.div
      className="ln-card p-6 md:p-8"
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: index * 0.1, ease: EXPO }}
    >
      <p className="font-bold text-lg text-[#1B2A63] italic">{myth}</p>
      <div className="mt-3 h-0.5 rounded-full w-12" style={{ backgroundColor: color }} />
      <p className="mt-3 text-[#475569] leading-relaxed">{truth}</p>
    </motion.div>
  </TiltCard>
);

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export const WhatIsSteam = () => {
  const [active, setActive] = useState("S");
  const { steam, whatIsSteamI18n } = useData();
  const current = steam.find((s) => s.key === active);

  // Merge i18n text with static colors
  const steamStats = (whatIsSteamI18n.stats || []).map((s, i) => ({
    ...s,
    color: STAT_COLORS[i] || "#3B82F6",
  }));
  const originTimeline = (whatIsSteamI18n.timeline || []).map((t, i) => ({
    ...t,
    color: TIMELINE_COLORS[i] || "#3B82F6",
  }));
  const whoFollows = (whatIsSteamI18n.whoFollows || []).map((f, i) => ({
    ...f,
    color: FOLLOWER_COLORS[i] || "#3B82F6",
  }));
  const misconceptions = (whatIsSteamI18n.misconceptions || []).map((m, i) => ({
    ...m,
    color: MYTH_COLORS[i] || "#3B82F6",
  }));

  return (
    <div
      className="what-is-steam-wrapper"
      style={{ "--steam-bg-image": `url(${HERO.image})` }}
    >
      <div className="what-is-steam-fade" aria-hidden="true" />

      <div className="what-is-steam-content">

        {/* ── Section 1: What is STEAM ── */}
        <section id="what-is-steam" className="relative py-20 lg:py-28 pt-28 sm:pt-32">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#DBEAFE] blur-3xl opacity-40"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#FEF3C7] blur-3xl opacity-40"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          <div className="relative z-10">
            <FloatingSticker emoji="🔬" label="Science"     className="top-32 left-[12%]  hidden xl:block" delay={0.5} rotation={-8} />
            <FloatingSticker emoji="🤖" label="Robot"       className="top-64 left-[14%]  hidden xl:block" delay={1.3} rotation={-4} />
            <FloatingSticker emoji="⚙️"  label="Engineering" className="top-80 left-[22%]  hidden xl:block" delay={0.9} rotation={5}  />
            <FloatingSticker emoji="🎨" label="Art"         className="top-40 right-[18%] hidden xl:block" delay={0.7} rotation={-6} />
            <FloatingSticker emoji="🧬" label="DNA"         className="top-60 right-[22%] hidden xl:block" delay={1.5} rotation={7}  />
            <FloatingSticker emoji="💡" label="Innovation"  className="top-86 right-[12%] hidden xl:block" delay={1.1} rotation={8}  />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <Reveal>
                <SectionHeading
                  overline={whatIsSteamI18n.s1Overline}
                  title={whatIsSteamI18n.s1Title}
                  sub={whatIsSteamI18n.s1Sub}
                />
              </Reveal>

              <Reveal delay={0.1}>
                <motion.div
                  className="mt-12 flex flex-wrap justify-center gap-3"
                  data-testid="steam-selector"
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                  }}
                >
                  {steam.map((s) => {
                    const on = s.key === active;
                    return (
                      <motion.button
                        key={s.key}
                        onClick={() => setActive(s.key)}
                        data-testid={`steam-tab-${s.key}`}
                        variants={{
                          hidden: { opacity: 0, y: 24, scale: 0.8 },
                          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EXPO } },
                        }}
                        whileHover={{ scale: 1.12, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative font-display font-extrabold text-3xl md:text-4xl w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 transition-all"
                        style={{
                          background: on ? s.color : s.bg,
                          color: on ? "#fff" : s.color,
                          borderColor: on ? s.color : "#1B2A63",
                          boxShadow: on ? `5px 5px 0 ${s.color}80` : "3px 3px 0 #1B2A63",
                        }}
                      >
                        {s.key}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </Reveal>

              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: EXPO }}
                className="mt-10 max-w-4xl mx-auto"
              >
                <TiltCard>
                  <div
                    className="ln-card p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start"
                    style={{ background: current.bg }}
                  >
                    <motion.span
                      className="grid place-items-center w-20 h-20 rounded-2xl border-2 border-[#1B2A63] text-white shrink-0 shadow-[4px_4px_0_#1B2A63]"
                      style={{ background: current.color }}
                      animate={{ rotate: [0, -3, 3, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <current.icon size={36} />
                    </motion.span>
                    <div>
                      <h3 className="font-display font-extrabold text-3xl" style={{ color: current.color }}>
                        {current.word}
                      </h3>
                      <p className="mt-3 text-lg text-[#1B2A63]/80 leading-relaxed">{current.text}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

              <Reveal delay={0.1}>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {steam.map((s, i) => (
                    <TiltCard key={s.key}>
                      <motion.button
                        onClick={() => setActive(s.key)}
                        className="ln-card ln-card-hover p-5 text-left w-full h-full"
                        style={{ background: s.bg }}
                        data-testid={`steam-card-${s.key}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={VIEWPORT}
                        transition={{ delay: i * 0.06, duration: 0.5, ease: EXPO }}
                        whileHover={{ y: -3 }}
                      >
                        <s.icon size={26} style={{ color: s.color }} />
                        <div className="mt-3 font-display font-extrabold text-lg">{s.word}</div>
                      </motion.button>
                    </TiltCard>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Section 2: STEAM by the Numbers ── */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                overline={whatIsSteamI18n.s2Overline}
                title={whatIsSteamI18n.s2Title}
                sub={whatIsSteamI18n.s2Sub}
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {steamStats.map((s, i) => (
                <StatBadge key={i} {...s} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Birth of STEAM ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <div>
                <Reveal>
                  <SectionHeading overline={whatIsSteamI18n.s3Overline} title={whatIsSteamI18n.s3Title} center={false} />
                </Reveal>
                <Reveal delay={0.1} variant="blurIn">
                  <p className="mt-5 text-[#475569] leading-relaxed">
                    {whatIsSteamI18n.s3Body1}
                  </p>
                </Reveal>
                <Reveal delay={0.15} variant="blurIn">
                  <p className="mt-4 text-[#475569] leading-relaxed">
                    {whatIsSteamI18n.s3Body2}
                  </p>
                </Reveal>
                <Reveal delay={0.2} variant="blurIn">
                  <p className="mt-4 text-[#475569] leading-relaxed">
                    {whatIsSteamI18n.s3Body3}
                  </p>
                </Reveal>
                <Reveal delay={0.25} variant="wipeLeft">
                  <blockquote className="mt-8 ln-card bg-[#EEF2FF] p-5 border-l-4 border-[#1B2A63]">
                    <p className="text-[#1B2A63] font-medium italic leading-relaxed">
                      {whatIsSteamI18n.s3Quote}
                    </p>
                    <cite className="mt-2 block text-sm font-bold text-[#475569] not-italic">
                      {whatIsSteamI18n.s3QuoteCite}
                    </cite>
                  </blockquote>
                </Reveal>
              </div>

              <div>
                <Reveal delay={0.1}>
                  <h3 className="font-display font-extrabold text-xl text-[#1B2A63] mb-6">
                    {whatIsSteamI18n.s3TimelineHeading}
                  </h3>
                </Reveal>
                {originTimeline.map((item, i) => (
                  <TimelineItem key={i} {...item} index={i} isLast={i === originTimeline.length - 1} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Who Follows STEAM ── */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                overline={whatIsSteamI18n.s4Overline}
                title={whatIsSteamI18n.s4Title}
                sub={whatIsSteamI18n.s4Sub}
              />
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whoFollows.map((f, i) => (
                <FollowerCard key={f.country} {...f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Clearing Up the Myths ── */}
        <section className="py-20 border-b-2 border-[#1B2A63]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                overline={whatIsSteamI18n.s5Overline}
                title={whatIsSteamI18n.s5Title}
                sub={whatIsSteamI18n.s5Sub}
              />
            </Reveal>
            <div className="mt-10 flex flex-col gap-5">
              {misconceptions.map((m, i) => (
                <MythCard key={i} {...m} index={i} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
