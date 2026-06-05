import { motion } from "framer-motion";
import { CheckCircle2, Gift, ArrowDown } from "lucide-react";
import { Reveal } from "../Reveal";
import { METHOD, RECEIVE, AGE_GROUPS } from "../../data";

export const Approach = () => {
  return (
    <section id="approach" className="py-20 lg:py-28 bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <span className="ln-overline !text-[#FBBF24]">Our investigative approach</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
              Every Session Follows the Scientific Method
            </h2>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">
              Six clear steps turn curiosity into real discovery — the same method scientists use, made joyful for children.
            </p>
          </div>
        </Reveal>

        {/* Process flow with connecting arrows */}
        <div className="mt-14 max-w-3xl mx-auto">
          {METHOD.map((m, i) => (
            <div key={m.n}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45 }}
                className="bg-white/5 rounded-2xl border border-white/10 p-5 sm:p-6 flex items-start gap-4"
                data-testid={`method-step-${m.n}`}
              >
                <div className="relative shrink-0">
                  <span
                    className="grid place-items-center w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg"
                    style={{ background: m.color }}
                  >
                    <m.icon size={28} className="text-white" />
                  </span>
                  <span className="absolute -top-2 -left-2 grid place-items-center w-7 h-7 rounded-full bg-white text-[#0F172A] font-display font-extrabold text-sm border-2 border-[#0F172A]">
                    {m.n}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-display font-extrabold text-xl"
                    style={{ color: m.color === "#FBBF24" ? "#FDE68A" : "#fff" }}
                  >
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-white/70 leading-relaxed">{m.text}</p>
                </div>
              </motion.div>

              {i < METHOD.length - 1 && (
                <motion.div
                  className="flex justify-center py-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-[#FBBF24] text-[#0F172A] border-2 border-[#0F172A]">
                    <ArrowDown size={18} />
                  </span>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* What children receive + age groups */}
        <div className="mt-16 grid lg:grid-cols-2 gap-6">
          <Reveal>
            <div className="ln-card !border-white/10 bg-white/5 p-7 h-full">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#FBBF24] text-[#0F172A]">
                  <Gift size={22} />
                </span>
                <h3 className="font-display font-extrabold text-2xl">What children receive</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {RECEIVE.map((r) => (
                  <li key={r} className="flex gap-3 text-white/80">
                    <CheckCircle2 size={20} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-6 h-full">
              {AGE_GROUPS.map((g) => (
                <div key={g.title} className="ln-card !border-white/10 bg-white/5 p-6" data-testid={`age-group-${g.title}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-xl">{g.title}</h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-extrabold border-2"
                      style={{ background: g.color, color: "#fff", borderColor: g.color }}
                    >
                      {g.ages}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.points.map((p) => (
                      <span key={p} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white/80">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
