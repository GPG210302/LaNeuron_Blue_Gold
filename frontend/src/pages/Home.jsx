import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Hero } from "../components/sections/Hero";
import { SectionHeading } from "../components/Reveal";
import { useData } from "../i18n/useData";

// ─── EASING ───────────────────────────────────────────────
const EXPO = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-60px" };

// ─── TILT CARD (same logic as Hero.jsx) ───────────────────
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rawY, { stiffness: 180, damping: 22 });
  const scale = useSpring(1, { stiffness: 280, damping: 22 });

  const glareX = useTransform(rotateY, [-12, 12], ["120%", "-20%"]);
  const glareY = useTransform(rotateX, [-12, 12], ["120%", "-20%"]);
  const glareOpacity = useTransform(rotateY, [-12, 0, 12], [0.15, 0, 0.15]);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawY.set(((e.clientX - cx) / (rect.width / 2)) * 12);
    rawX.set(((e.clientY - cy) / (rect.height / 2)) * -12);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => scale.set(1.03)}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); scale.set(1); }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden z-10"
        style={{ opacity: glareOpacity }}
      >
        <motion.div
          className="absolute w-[180%] h-[180%] -top-1/2 -left-1/2 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 65%)",
            x: glareX,
            y: glareY,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────
export default function Home() {
  const { home } = useData();

  return (
    <>
      <Hero />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Section heading — scroll reveal */}
          <motion.div
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EXPO }}
          >
            <SectionHeading
              overline={home.overline}
              title={home.sectionTitle}
              sub={home.sectionSub}
            />
          </motion.div>

          {/* Cards grid */}
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {home.links.map((l, i) => (
              <TiltCard key={l.to}>
                {/* Scroll-reveal + hover lift on the inner card */}
                <motion.div
                  initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: 0.6,
                    delay: (i % 3) * 0.08,
                    ease: EXPO,
                  }}
                  whileHover={{
                    y: -4,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className="h-full"
                >
                  <Link
                    to={l.to}
                    className="ln-card ln-card-hover p-7 flex flex-col h-full"
                    data-testid={`home-link-${l.to.replace("/", "")}`}
                  >
                    <h3
                      className="font-display font-extrabold text-2xl"
                      style={{ color: l.color }}
                    >
                      {l.title}
                    </h3>
                    <p className="mt-3 text-[#475569] leading-relaxed flex-1">
                      {l.desc}
                    </p>
                    <motion.span
                      className="mt-5 inline-flex items-center gap-1 font-bold"
                      style={{ color: l.color }}
                      whileHover={{ x: 4, transition: { type: "spring", stiffness: 400 } }}
                    >
                      {home.exploreBtn}{" "}
                      <motion.span
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight size={18} />
                      </motion.span>
                    </motion.span>
                  </Link>
                </motion.div>
              </TiltCard>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
