import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Hero } from "../components/sections/Hero";
import { useData } from "../i18n/useData";

const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EXPO },
  },
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

function SectionIntro({ overline, title, sub }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className="mx-auto mb-10 max-w-3xl text-center"
    >
      {overline ? (
        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#1B2A63]/70">
          {overline}
        </p>
      ) : null}
      <h2 className="text-3xl font-black tracking-tight text-[#1B2A63] sm:text-4xl">
        {title}
      </h2>
      {sub ? (
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
          {sub}
        </p>
      ) : null}
    </motion.div>
  );
}

// ─── TILT CARD WITH SHINE ─────────────────────────────────
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const tiltX = useSpring(rawX, { stiffness: 220, damping: 24 });
  const tiltY = useSpring(rawY, { stiffness: 220, damping: 24 });

  const glareX = useTransform(tiltY, [-12, 12], ["120%", "-20%"]);
  const glareY = useTransform(tiltX, [-12, 12], ["120%", "-20%"]);
  const glareOpacity = useTransform(tiltY, [-12, 0, 12], [0.14, 0, 0.14]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    rawX.set((-dy / (rect.height / 2)) * 12);
    rawY.set((dx / (rect.width / 2)) * 12);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: "preserve-3d",
        perspective: 1100,
      }}
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ duration: 0.28, ease: EXPO }}
      className={`relative ${className}`}
    >
      {children}

      {/* Shine / glow overlay */}
      <motion.div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: "-40%",
          background:
            "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.45), transparent 60%)",
          mixBlendMode: "soft-light",
          opacity: glareOpacity,
          translateX: glareX,
          translateY: glareY,
        }}
      />
    </motion.div>
  );
};

export default function Home() {
  const { home } = useData();

  return (
    <>
      {/* Hero unchanged */}
      <Hero />

      <main className="relative bg-[#fbf7ee]">
        {/* soft background glows */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute left-[-8%] top-[8%] h-64 w-64 rounded-full bg-[#E0B33C] blur-3xl" />
          <div className="absolute right-[-10%] top-[26%] h-72 w-72 rounded-full bg-[#1B2A63] blur-3xl" />
          <div className="absolute bottom-[12%] left-[20%] h-64 w-64 rounded-full bg-[#10B981] blur-3xl" />
        </div>

        {/* WHY PARENTS CHOOSE LA NEURON */}
        <section
          id="why-parents"
          className="relative z-10 px-4 pb-20 pt-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              overline={home?.whyParents?.overline}
              title={home?.whyParents?.title}
              sub={home?.whyParents?.sub}
            />

            <motion.div
              variants={staggerWrap}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            >
              {(home?.whyParents?.items || []).map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-[22px] border-[2px] border-[#1B2A63] bg-white shadow-[0_12px_36px_rgba(27,42,99,0.08)]"
                >
                  <TiltCard className="h-full px-6 py-6">
                    <h3 className="text-lg font-black text-[#1B2A63]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-slate-600">
                      {item.desc}
                    </p>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ENROLLING NOW */}
        <section className="relative z-10 px-4 pb-24 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-[#d7dde9] bg-[#fdfaf1] p-6 shadow-[0_18px_60px_rgba(27,42,99,0.08)] sm:p-10">
            <SectionIntro
              overline={home?.enrollingNow?.overline}
              title={home?.enrollingNow?.title}
              sub={home?.enrollingNow?.sub}
            />

            <motion.div
              variants={staggerWrap}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            >
              {(home?.enrollingNow?.items || []).map((item) => (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-[22px] border border-[#d7dde9] bg-white shadow-[0_12px_40px_rgba(27,42,99,0.06)]"
                >
                  <TiltCard className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#1B2A63] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
                        {item.title}
                      </span>
                      <span className="rounded-full border border-[#E0B33C]/60 bg-[#fff7dd] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b7515]">
                        {item.status}
                      </span>
                    </div>

                    <p className="flex-1 text-[15px] leading-7 text-slate-600">
                      {item.desc}
                    </p>

                    <Link
                      to="/programmes"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1B2A63]"
                    >
                      {home?.enrollingNow?.cta}
                      <ArrowRight size={16} />
                    </Link>
                  </TiltCard>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* WHAT PARENTS SAY */}
        <section className="relative z-10 px-4 pb-24 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              overline={home?.featuredReview?.overline}
              title={home?.featuredReview?.title}
              sub=""
            />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="relative overflow-hidden rounded-[26px] border-[2px] border-[#1B2A63] bg-[#1B2A63] px-6 py-7 text-white shadow-[0_22px_70px_rgba(17,31,84,0.28)] sm:px-8 sm:py-9"
            >
              <div className="absolute right-6 top-6 opacity-20">
                <Quote size={72} strokeWidth={1.6} />
              </div>

              <p className="max-w-3xl text-[17px] leading-9 text-white/95 sm:text-[20px] sm:leading-[2rem]">
                “{home?.featuredReview?.quote}”
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/85">
                <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
                  {home?.featuredReview?.author}
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2">
                  {home?.featuredReview?.source}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* LATEST FROM LA NEURON */}
        <section className="relative z-10 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              overline={home?.latest?.overline}
              title={home?.latest?.title}
              sub={home?.latest?.sub}
            />

            <motion.div
              variants={staggerWrap}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="grid gap-6 lg:grid-cols-3"
            >
              {(home?.latest?.items || []).map((item) => (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  className="overflow-hidden rounded-[22px] border border-[#d7dde9] bg-white shadow-[0_16px_50px_rgba(27,42,99,0.08)]"
                >
                  <div className="h-36 bg-[radial-gradient(circle_at_top_left,#dbe2f8,transparent_55%),radial-gradient(circle_at_bottom_right,#f4e0a6,transparent_60%)]" />
                  <div className="p-6">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#1B2A63]/70">
                      {item.type}
                    </p>
                    <h3 className="mt-2 text-lg font-black text-[#1B2A63]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA BAND */}
        <section className="relative z-10 px-4 pb-32 pt-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-[26px] border border-[#e2c86e] bg-[#ffeebf] px-6 py-8 text-center shadow-[0_18px_60px_rgba(224,179,60,0.35)] sm:px-10 lg:flex-row lg:text-left"
          >
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#8a6713]">
                Start the conversation
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#1B2A63] sm:text-3xl">
                Explore the right next step for your child.
              </h3>
            </div>

            <Link
              to="/programmes"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#1B2A63] bg-[#1B2A63] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(27,42,99,0.28)] transition-all duration-200 hover:-translate-y-1"
            >
              View programme details
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}