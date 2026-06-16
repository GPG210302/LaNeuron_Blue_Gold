import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Reveal, SectionHeading } from "../Reveal";
import { STEAM } from "../../data";
import { HERO } from "../../data";

// ─── CONSTANTS ────────────────────────────────────────────
const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

// ─── TILT CARD ────────────────────────────────────────────
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
            x: glareX, y: glareY,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// ─── FLOATING STICKER ─────────────────────────────────────
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

// ─── STAT BADGE ───────────────────────────────────────────
const StatBadge = ({ value, label, color, delay }) => (
  <motion.div
    className="ln-card px-4 py-5 text-center"
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={VIEWPORT}
    transition={{ duration: 0.55, delay, ease: EXPO }}
    whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
  >
    <div className="font-display font-extrabold text-3xl" style={{ color }}>{value}</div>
    <div className="text-xs font-semibold text-[#475569] mt-1 leading-tight max-w-[110px] mx-auto">{label}</div>
  </motion.div>
);

// ─── TIMELINE ITEM ────────────────────────────────────────
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

// ─── WHO FOLLOWS CARD ─────────────────────────────────────
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

// ─── MISCONCEPTION CARD ───────────────────────────────────
const MythCard = ({ myth, truth, color, index }) => (
  <TiltCard>
    <motion.div
      className="ln-card p-6 md:p-8"
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: index * 0.1, ease: EXPO }}
    >
      <p className="font-bold text-lg text-[#0F172A] italic">{myth}</p>
      <div className="mt-3 h-0.5 rounded-full w-12" style={{ backgroundColor: color }} />
      <p className="mt-3 text-[#475569] leading-relaxed">{truth}</p>
    </motion.div>
  </TiltCard>
);

// ═══════════════════════════════════════════════════════════
// SECTION DATA
// ═══════════════════════════════════════════════════════════
const STEAM_STATS = [
  { value: "65%",  label: "of today's children will work in jobs that don't exist yet",       color: "#3B82F6" },
  { value: "3×",   label: "more likely to study STEAM with early childhood exposure",          color: "#10B981" },
  { value: "40+",  label: "countries now have a national STEAM education strategy",            color: "#F97316" },
  { value: "1987", label: "year Stanford proved arts integration boosts science retention",    color: "#A855F7" },
];

const ORIGIN_TIMELINE = [
  { year: "'90s", color: "#3B82F6", event: "STEM was born in the USA",               detail: "The US National Science Foundation coined STEM to address a growing skills gap in science and engineering graduates entering the workforce." },
  { year: "2001", color: "#10B981", event: "Rita Colwell formalises STEM policy",   detail: "NSF Director Rita Colwell made STEM a federal education priority, linking science literacy directly to national economic competitiveness." },
  { year: "2006", color: "#F97316", event: "Georgette Yakman adds the 'A'",         detail: "American educator Georgette Yakman introduced Arts into STEM, creating STEAM — arguing creativity is inseparable from scientific innovation." },
  { year: "2013", color: "#A855F7", event: "Rhode Island School of Design lobbies Congress", detail: "RISD led a national campaign to officially add Arts to STEM policy, arguing creativity turns scientific knowledge into world-changing products." },
  { year: "Now",  color: "#FB7185", event: "STEAM adopted globally",                detail: "Countries across Europe, Asia, and South America embed STEAM into national curricula. Poland is actively expanding STEAM in early education." },
];

const WHO_FOLLOWS = [
  { flag: "🇺🇸", country: "United States",  color: "#3B82F6", detail: "STEAM is embedded in the Every Student Succeeds Act. Thousands of schools run dedicated STEAM labs and project-based learning programmes." },
  { flag: "🇬🇧", country: "United Kingdom", color: "#10B981", detail: "The UK's STEM Learning charity supports over 3 million young people annually. Arts integration is now part of the national curriculum." },
  { flag: "🇸🇬", country: "Singapore",      color: "#F97316", detail: "Singapore's Applied Learning Programme integrates STEAM into every primary school — widely cited as a global model for 21st-century education." },
  { flag: "🇫🇮", country: "Finland",        color: "#A855F7", detail: "Finland's phenomenon-based learning model is one of the world's closest real-world implementations of STEAM — inquiry-driven and child-led." },
  { flag: "🇯🇵", country: "Japan",          color: "#FB7185", detail: "Japan introduced STEAM into National Curriculum Standards in 2022, focusing on creativity and cross-disciplinary problem solving from primary school." },
  { flag: "🇵🇱", country: "Poland",         color: "#E0B33C", detail: "Poland's Ministry of Education is actively expanding STEAM through dedicated school labs and private programmes in Kraków." },
];

const MISCONCEPTIONS = [
  { myth: "\"STEAM is just fun experiments — not real learning.\"",      truth: "Every La Neuron STEAM session follows a complete scientific method: hypothesis, experiment, results, and conclusion. Children produce documented investigations — the same structure used in real research.", color: "#3B82F6" },
  { myth: "\"My child needs to be good at maths to enjoy STEAM.\"",      truth: "STEAM starts with curiosity, not ability. The Arts component ensures that creative thinkers, visual learners, and storytellers are equally at home in every session.", color: "#10B981" },
  { myth: "\"STEAM is only for older children.\"",                       truth: "Ages 6–9 benefit the most from early STEAM exposure. Young Explorers sessions are sensory-led and visual, designed precisely for how young brains form foundational concepts.", color: "#F97316" },
];

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════
export const WhatIsSteam = () => {
  const [active, setActive] = useState("S");
  const current = STEAM.find((s) => s.key === active);

  return (
    /*
      ── PAGE WRAPPER ──────────────────────────────────────
      The two-girls image is fixed here as a full-page background blend.
      Every section inside renders on top of it.
      - position: relative + overflow-hidden on the wrapper
      - The image div is absolute inset-0 z-0
      - All sections already have bg-white/75 or bg-[#F8FAFC]/70 with
        backdrop-blur-sm, so they partially reveal the blended image beneath
    */
    <div className="relative overflow-hidden">

      {/* ── BLENDED BACKGROUND — two girls science image ── */}
      {/*
        mixBlendMode: "multiply" fuses the photo into the white/light
        section backgrounds. The sections' own semi-transparent bg colours
        (bg-white/75, bg-[#F8FAFC]/70) act as tinted filters on top,
        so the image feels ambient — present but not overpowering.
        Increase opacity (max ~0.32) if you want it more visible.
        object-position: center 25% keeps the girls' faces in frame.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <img
          src={HERO.image}
          alt=""
          className="w-full h-full"
          style={{
            objectFit: "contain",        /* contain = no zoom/crop, full image visible */
            objectPosition: "center top",
            mixBlendMode: "normal",      /* normal = most reliable, no blend tricks */
            opacity: 0.12,               /* increase this 0.12 → 0.20 → 0.28 to taste */
            position: "sticky",          /* sticky keeps image in viewport as user scrolls */
            top: 0,
          }}
        />
        {/* Light overlay to soften edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(253,251,247,0.3) 0%, rgba(253,251,247,0.1) 40%, rgba(253,251,247,0.3) 100%)",
          }}
        />
      </div>

      {/* ── ALL SECTIONS (z-10 so they render above the bg image) ── */}
      <div className="relative z-10">

        {/* ───────────────────────────────────────────────────
            SECTION 1 — DISCIPLINES
        ─────────────────────────────────────────────────── */}
        <section
          id="what-is-steam"
          className="relative py-20 lg:py-28 pt-28 sm:pt-32 bg-white/75 backdrop-blur-sm border-b-2 border-[#0F172A] overflow-hidden"
        >
          <motion.div
            className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#DBEAFE] blur-3xl opacity-40"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#FEF3C7] blur-3xl opacity-40"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          <FloatingSticker emoji="🔬" label="Science"     className="top-24 left-[3%]    hidden xl:block" delay={0.5} rotation={-8} />
          <FloatingSticker emoji="⚙️"  label="Engineering" className="top-28 right-[4%]   hidden xl:block" delay={0.7} rotation={6}  />
          <FloatingSticker emoji="🎨" label="Art"         className="bottom-28 left-[5%]  hidden xl:block" delay={0.9} rotation={-5} />
          <FloatingSticker emoji="💡" label="Innovation"  className="bottom-20 right-[3%] hidden xl:block" delay={1.1} rotation={7}  />

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                overline="The five disciplines"
                title="What is STEAM Education?"
                sub="STEAM stands for Science, Technology, Engineering, Art, and Mathematics — an integrated way of thinking that connects five disciplines into one investigative approach. Rather than teaching subjects in isolation, STEAM shows children how everything is connected."
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
                {STEAM.map((s) => {
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
                        borderColor: on ? s.color : "#0F172A",
                        boxShadow: on ? `5px 5px 0 ${s.color}80` : "3px 3px 0 #0F172A",
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
                    className="grid place-items-center w-20 h-20 rounded-2xl border-2 border-[#0F172A] text-white shrink-0 shadow-[4px_4px_0_#0F172A]"
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
                    <p className="mt-3 text-lg text-[#0F172A]/80 leading-relaxed">{current.text}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <Reveal delay={0.1}>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
                {STEAM.map((s, i) => (
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
        </section>

        {/* ───────────────────────────────────────────────────
            SECTION 2 — BY THE NUMBERS
        ─────────────────────────────────────────────────── */}
        <section className="py-16 bg-[#F8FAFC]/70 backdrop-blur-sm border-b border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                overline="Why it matters globally"
                title="STEAM by the Numbers"
                sub="The research case for integrated science and arts education."
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {STEAM_STATS.map((s, i) => (
                <StatBadge key={i} {...s} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────
            SECTION 3 — ORIGIN STORY + TIMELINE
        ─────────────────────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-white/75 backdrop-blur-sm border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <div>
                <Reveal>
                  <SectionHeading
                    overline="The origin story"
                    title="Birth of STEAM"
                    center={false}
                  />
                </Reveal>
                <Reveal delay={0.1} variant="blurIn">
                  <p className="mt-5 text-[#475569] leading-relaxed">
                    STEAM did not emerge from a single idea — it evolved over three decades of research,
                    policy-making, and classroom practice across four continents. It began as{" "}
                    <strong>STEM</strong> in the United States in the early 1990s, driven by concerns that
                    students were not developing the scientific and technical skills the modern economy needed.
                  </p>
                </Reveal>
                <Reveal delay={0.15} variant="blurIn">
                  <p className="mt-4 text-[#475569] leading-relaxed">
                    The pivotal shift came in <strong>2006</strong>, when American educator{" "}
                    <strong className="text-[#1B2A63]">Georgette Yakman</strong> published her landmark
                    framework arguing that <em>Art</em> — creative thinking, design, and expression — was
                    the missing ingredient. Without it, STEM produced technically capable graduates who
                    struggled to innovate, communicate, or think outside structured problems.
                  </p>
                </Reveal>
                <Reveal delay={0.2} variant="blurIn">
                  <p className="mt-4 text-[#475569] leading-relaxed">
                    Stanford University's research in the 1980s had already shown that children who engage
                    in arts-integrated learning retain science concepts significantly longer. STEAM simply
                    made that connection official — and built it into the curriculum.
                  </p>
                </Reveal>
                <Reveal delay={0.25} variant="wipeLeft">
                  <blockquote className="mt-8 ln-card bg-[#EEF2FF] p-5 border-l-4 border-[#1B2A63]">
                    <p className="text-[#1B2A63] font-medium italic leading-relaxed">
                      "STEAM is not about adding art to STEM. It is about recognising that creative
                      thinking is the engine that makes science meaningful."
                    </p>
                    <cite className="mt-2 block text-sm font-bold text-[#475569] not-italic">
                      — Georgette Yakman, founder of the STEAM framework (2006)
                    </cite>
                  </blockquote>
                </Reveal>
              </div>

              <div>
                <Reveal delay={0.1}>
                  <h3 className="font-display font-extrabold text-xl text-[#1B2A63] mb-6">
                    A timeline of STEAM
                  </h3>
                </Reveal>
                {ORIGIN_TIMELINE.map((item, i) => (
                  <TimelineItem
                    key={i}
                    {...item}
                    index={i}
                    isLast={i === ORIGIN_TIMELINE.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────
            SECTION 4 — WHO FOLLOWS STEAM
        ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#F8FAFC]/70 backdrop-blur-sm border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                overline="Global adoption"
                title="Who Follows STEAM?"
                sub="From government policy to classroom practice — STEAM is the world's fastest-growing education movement."
              />
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHO_FOLLOWS.map((f, i) => (
                <FollowerCard key={f.country} {...f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────
            SECTION 5 — CLEARING UP MYTHS
        ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-white/75 backdrop-blur-sm border-b-2 border-[#0F172A]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                overline="Common questions"
                title="Clearing Up the Myths"
                sub="Three things parents often wonder — answered honestly."
              />
            </Reveal>
            <div className="mt-10 flex flex-col gap-5">
              {MISCONCEPTIONS.map((m, i) => (
                <MythCard key={i} {...m} index={i} />
              ))}
            </div>
          </div>
        </section>

      </div>{/* end z-10 wrapper */}
    </div>/* end page wrapper */
  );
};