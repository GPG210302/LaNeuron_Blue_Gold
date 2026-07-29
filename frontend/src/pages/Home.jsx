import { Link } from "react-router-dom";
import { ArrowRight, Quote, ExternalLink } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Hero } from "../components/sections/Hero";
import { useData } from "../i18n/useData";
import MaskedText from "../animations/MaskedText";
import HoverLift from "../animations/HoverLift";
import CursorSpotlight from "../animations/CursorSpotlight";
import MagneticButton from "../animations/MagneticButton";

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

      <div className="text-3xl font-black tracking-tight text-[#1B2A63] sm:text-4xl">
        {title}
      </div>

      {sub ? (
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
          {sub}
        </p>
      ) : null}
    </motion.div>
  );
}

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

function SmartLink({
  href,
  external,
  className,
  children,
}) {
  if (!href) {
    return <div className={className}>{children}</div>;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export default function Home() {
  const { home } = useData();

  const reviews =
    home?.reviews?.items ||
    home?.featuredReview?.items || [
      {
        quote:
          "The workshop was safe, age-appropriate, hands-on and highly educational, with plenty of opportunities to explore and ask questions. My daughter had a wonderful experience at La Neuron.",
        author: "Parent review",
        source: "Workshop feedback",
      },
      {
        quote:
          "Dr Priya is knowledgeable, patient and excellent with children. The small-group environment, premium materials and personal attention made the programme feel high-quality while still being reasonably priced.",
        author: "Parent review",
        source: "Programme feedback",
      },
      {
        quote:
          "La Neuron combines science, creativity and real investigation in a very engaging way. My child gained knowledge, confidence and curiosity in a safe, welcoming environment, and the programme offers excellent value for money.",
        author: "Parent review",
        source: "Parent feedback",
      },
    ];

  const featuredReview = reviews[0];

  return (
    <>
      <Hero />

      <main className="relative bg-[#fbf7ee]">
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
              title={
                <MaskedText
                  as="h2"
                  className="text-3xl font-black tracking-tight text-[#1B2A63] sm:text-4xl"
                >
                  {home?.whyParents?.title}
                </MaskedText>
              }
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
                <motion.div key={item.title} variants={fadeUp}>
                  <HoverLift className="rounded-[22px] border-[2px] border-[#1B2A63] bg-white shadow-[0_12px_36px_rgba(27,42,99,0.08)]">
                    <CursorSpotlight className="rounded-[22px]">
                      <TiltCard className="h-full px-6 py-6">
                        <h3 className="text-lg font-black text-[#1B2A63]">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-[15px] leading-7 text-slate-600">
                          {item.desc}
                        </p>
                      </TiltCard>
                    </CursorSpotlight>
                  </HoverLift>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ENROLLING NOW */}
        <section className="relative z-10 px-4 pb-24 pt-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mx-auto max-w-7xl rounded-[28px] border border-[#d7dde9] bg-[#fdfaf1] p-6 shadow-[0_18px_60px_rgba(27,42,99,0.08)] sm:p-10"
          >
            <SectionIntro
              overline={home?.enrollingNow?.overline}
              title={
                <MaskedText
                  as="h2"
                  className="text-3xl font-black tracking-tight text-[#1B2A63] sm:text-4xl"
                >
                  {home?.enrollingNow?.title}
                </MaskedText>
              }
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
                <motion.article key={item.title} variants={fadeUp}>
                  <HoverLift className="rounded-[22px] border border-[#d7dde9] bg-white shadow-[0_12px_40px_rgba(27,42,99,0.06)]">
                    <CursorSpotlight className="rounded-[22px]">
                      <TiltCard className="flex h-full flex-col p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <motion.span
                            initial={{ opacity: 0, x: -18 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: EXPO }}
                            className="rounded-full bg-[#1B2A63] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white"
                          >
                            {item.title}
                          </motion.span>

                          {item.status ? (
                            <motion.span
                              initial={{ opacity: 0, x: 18 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.5,
                                delay: 0.1,
                                ease: EXPO,
                              }}
                              className="rounded-full border border-[#E0B33C]/60 bg-[#fff7dd] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9b7515]"
                            >
                              {item.status}
                            </motion.span>
                          ) : null}
                        </div>

                        <p className="flex-1 text-[15px] leading-7 text-slate-600">
                          {item.desc}
                        </p>

                        <SmartLink
                          href={item.href || "/programmes"}
                          external={item.external}
                          className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1B2A63]"
                        >
                          {item.cta || home?.enrollingNow?.cta || "Explore details"}
                          {item.external ? (
                            <ExternalLink
                              size={16}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          ) : (
                            <ArrowRight
                              size={16}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          )}
                        </SmartLink>
                      </TiltCard>
                    </CursorSpotlight>
                  </HoverLift>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* WHAT PARENTS SAY */}
        <section className="relative z-10 px-4 pb-24 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              overline={home?.featuredReview?.overline || "Parent reflections"}
              title={
                <MaskedText
                  as="h2"
                  className="text-3xl font-black tracking-tight text-[#1B2A63] sm:text-4xl"
                >
                  {home?.featuredReview?.title || "What parents say"}
                </MaskedText>
              }
              sub={home?.featuredReview?.sub || ""}
            />

            <motion.div
              initial={{ opacity: 0, scaleX: 0.94, y: 30 }}
              whileInView={{ opacity: 1, scaleX: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EXPO }}
              className="relative overflow-hidden rounded-[26px] border-[2px] border-[#1B2A63] bg-[#1B2A63] px-6 py-7 text-white shadow-[0_22px_70px_rgba(17,31,84,0.28)] sm:px-8 sm:py-9"
            >
              <motion.div
                className="absolute right-6 top-6 opacity-20"
                animate={{ y: [0, -4, 0], rotate: [0, 1.5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Quote size={72} strokeWidth={1.6} />
              </motion.div>

              <MaskedText
                as="p"
                delay={0.1}
                className="max-w-3xl text-[17px] leading-9 text-white/95 sm:text-[20px] sm:leading-[2rem]"
              >
                “{featuredReview?.quote}”
              </MaskedText>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/85">
                <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">
                  {featuredReview?.author}
                </span>
                <span className="rounded-full border border-white/20 px-4 py-2">
                  {featuredReview?.source}
                </span>
              </div>

              {reviews.length > 1 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {reviews.map((review, index) => (
                    <span
                      key={`${review.author}-${index}`}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        index === 0
                          ? "bg-white text-[#1B2A63]"
                          : "border border-white/20 text-white/80"
                      }`}
                    >
                      {index === 0 ? "Featured" : `Review ${index + 1}`}
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </div>
        </section>

        {/* LATEST FROM LA NEURON */}
        <section className="relative z-10 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              overline={home?.latest?.overline}
              title={
                <MaskedText
                  as="h2"
                  className="text-3xl font-black tracking-tight text-[#1B2A63] sm:text-4xl"
                >
                  {home?.latest?.title}
                </MaskedText>
              }
              sub={home?.latest?.sub}
            />

            <motion.div
              variants={staggerWrap}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="grid gap-6 lg:grid-cols-3"
            >
              {(home?.latest?.items || []).map((item, index) => (
                <motion.article key={item.title} variants={fadeUp}>
                  <HoverLift className="group h-full overflow-hidden rounded-[22px] border border-[#d7dde9] bg-white shadow-[0_16px_50px_rgba(27,42,99,0.08)]">
                    <SmartLink
                      href={item.href}
                      external={item.external}
                      className="flex h-full flex-col"
                    >
                      <div className="relative h-36 overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbe2f8,transparent_55%),radial-gradient(circle_at_bottom_right,#f4e0a6,transparent_60%)]">
                        <motion.div
                          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,28,68,0.75),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.7, ease: EXPO }}
                          className={`absolute inset-0 ${
                            index === 0
                              ? "bg-[radial-gradient(circle_at_top_left,#dbe2f8,transparent_55%),radial-gradient(circle_at_bottom_right,#f4e0a6,transparent_60%)]"
                              : index === 1
                              ? "bg-[radial-gradient(circle_at_top_left,#dce8ff,transparent_52%),radial-gradient(circle_at_bottom_right,#f2d778,transparent_62%)]"
                              : "bg-[radial-gradient(circle_at_top_left,#c8f1e4,transparent_50%),radial-gradient(circle_at_bottom_right,#93d6c5,transparent_62%)]"
                          }`}
                        />

                        <div className="absolute left-5 top-5 z-10">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1B2A63] shadow-sm">
                            {item.type}
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4 z-10 inline-flex translate-y-2 items-center gap-2 text-sm font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {item.cta || (item.external ? "Open article" : "Read more")}
                          {item.external ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#1B2A63]/70">
                          {item.kicker || item.type}
                        </p>

                        <h3 className="mt-2 text-lg font-black text-[#1B2A63]">
                          {item.title}
                        </h3>

                        <p className="mt-3 flex-1 text-[15px] leading-7 text-slate-600">
                          {item.desc}
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1B2A63]">
                          {item.cta || (item.external ? "Open article" : "Read more")}
                          {item.external ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                        </div>
                      </div>
                    </SmartLink>
                  </HoverLift>
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
            className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 overflow-hidden rounded-[26px] border border-[#e2c86e] bg-[#ffeebf] px-6 py-8 text-center shadow-[0_18px_60px_rgba(224,179,60,0.35)] sm:px-10 lg:flex-row lg:text-left"
          >
            <motion.div
              className="absolute inset-0 opacity-60"
              animate={{
                background: [
                  "linear-gradient(120deg, rgba(255,238,191,1) 0%, rgba(255,244,208,1) 45%, rgba(255,231,169,1) 100%)",
                  "linear-gradient(120deg, rgba(255,244,208,1) 0%, rgba(255,231,169,1) 45%, rgba(255,238,191,1) 100%)",
                  "linear-gradient(120deg, rgba(255,238,191,1) 0%, rgba(255,244,208,1) 45%, rgba(255,231,169,1) 100%)",
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#8a6713]">
                Start the conversation
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#1B2A63] sm:text-3xl">
                Explore the right next step for your child.
              </h3>
            </div>

            <div className="relative z-10">
              <MagneticButton href="/programmes">
                View programme details
              </MagneticButton>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}