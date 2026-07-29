import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Languages,
  FlaskConical,
  Users,
  CalendarDays,
  BookOpenText,
  Quote,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Hero } from "../components/sections/Hero";
import { useData } from "../i18n/useData";

const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" };

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
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

const proofIcons = [Brain, Languages, FlaskConical, Users];
const enrollIcons = [Sparkles, CalendarDays, Brain, BookOpenText];
const latestColors = ["#1B2A63", "#E0B33C", "#10B981"];

function SectionIntro({ overline, title, sub, align = "center" }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={`mx-auto mb-10 max-w-3xl ${align === "center" ? "text-center" : "text-left"}`}
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

export default function Home() {
  const { home } = useData();

  return (
    <>
      <Hero />

      <main className="relative overflow-hidden bg-[#fcfbf8]">
        {/* soft background rhythm */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <div className="absolute left-[-8%] top-[8%] h-64 w-64 rounded-full bg-[#E0B33C] blur-3xl" />
          <div className="absolute right-[-10%] top-[26%] h-72 w-72 rounded-full bg-[#1B2A63] blur-3xl" />
          <div className="absolute bottom-[12%] left-[20%] h-64 w-64 rounded-full bg-[#10B981] blur-3xl" />
        </div>

        {/* WHY PARENTS */}
        <section id="why-parents" className="relative z-10 px-4 py-20 sm:px-6 lg:px-8"
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
              {(home?.whyParents?.items || []).map((item, i) => {
                const Icon = proofIcons[i] || Brain;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ duration: 0.28, ease: EXPO }}
                    className="group relative overflow-hidden rounded-[28px] border-[2.5px] border-[#1B2A63] bg-white p-6 shadow-[0_20px_60px_rgba(12,26,84,0.08)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1B2A63] via-[#E0B33C] to-[#10B981]" />
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f2e8] text-[#1B2A63] transition-transform duration-300 group-hover:scale-110">
                      <Icon size={22} strokeWidth={2.1} />
                    </div>
                    <h3 className="text-xl font-black text-[#1B2A63]">{item.title}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-slate-600">{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ENROLLING NOW */}
        <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[34px] border border-[#d8ddeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,246,240,0.96))] p-6 shadow-[0_24px_80px_rgba(12,26,84,0.08)] sm:p-10">
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
              {(home?.enrollingNow?.items || []).map((item, i) => {
                const Icon = enrollIcons[i] || Sparkles;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.28, ease: EXPO }}
                    className="flex h-full flex-col rounded-[26px] border border-[#d8ddeb] bg-white/95 p-6 shadow-[0_16px_50px_rgba(12,26,84,0.06)]"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1B2A63] text-white">
                        <Icon size={20} />
                      </span>
                      <span className="rounded-full border border-[#E0B33C]/50 bg-[#fff7df] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a7415]">
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#1B2A63]">{item.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-7 text-slate-600">{item.desc}</p>

                    <Link
                      to="/programmes"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1B2A63] transition-transform duration-200 hover:translate-x-1"
                    >
                      {home?.enrollingNow?.cta}
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* FEATURED REVIEW */}
        <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
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
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: EXPO }}
              className="relative overflow-hidden rounded-[32px] border-[2.5px] border-[#1B2A63] bg-[linear-gradient(135deg,#1B2A63_0%,#263b82_55%,#314998_100%)] p-8 text-white shadow-[0_30px_90px_rgba(17,31,84,0.18)] sm:p-10"
            >
              <div className="absolute right-6 top-6 opacity-20">
                <Quote size={82} strokeWidth={1.5} />
              </div>

              <div className="relative max-w-3xl">
                <p className="text-lg leading-8 text-white/95 sm:text-[22px] sm:leading-10">
                  “{home?.featuredReview?.quote}”
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/80">
                  <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
                    {home?.featuredReview?.author}
                  </span>
                  <span className="rounded-full border border-white/15 px-4 py-2">
                    {home?.featuredReview?.source}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* LATEST */}
        <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
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
              {(home?.latest?.items || []).map((item, i) => (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.28, ease: EXPO }}
                  className="group overflow-hidden rounded-[28px] border border-[#d6dceb] bg-white shadow-[0_18px_60px_rgba(12,26,84,0.07)]"
                >
                  <div
                    className="relative h-44 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${latestColors[i % latestColors.length]} 0%, #f2efe8 180%)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_35%)]" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#1B2A63]">
                      {item.type}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-[#1B2A63] transition-colors duration-200 group-hover:text-[#0d8b74]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-slate-600">{item.desc}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA BAND */}
        <section className="relative z-10 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-[32px] border border-[#e2c86e] bg-[linear-gradient(135deg,#fff3c8_0%,#f5e5a8_45%,#ecd170_100%)] px-6 py-8 text-center shadow-[0_22px_70px_rgba(224,179,60,0.18)] sm:px-10 lg:flex-row lg:text-left"
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
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#1B2A63] bg-[#1B2A63] px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(27,42,99,0.22)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#13204e]"
            >
              View programmes
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}