import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, SectionHeading } from "../Reveal";
import { STEAM } from "../../data";

export const WhatIsSteam = () => {
  const [active, setActive] = useState("S");
  const current = STEAM.find((s) => s.key === active);

  return (
    <section id="what-is-steam" className="py-20 lg:py-28 pt-28 sm:pt-32 bg-white border-b-2 border-[#0F172A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            overline="The five disciplines"
            title="What is STEAM Education?"
            sub="STEAM stands for Science, Technology, Engineering, Art, and Mathematics — an integrated way of thinking that connects five disciplines into one investigative approach. Rather than teaching subjects in isolation, STEAM shows children how everything is connected."
          />
        </Reveal>

        {/* Big letter selector */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap justify-center gap-3" data-testid="steam-selector">
            {STEAM.map((s) => {
              const on = s.key === active;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  data-testid={`steam-tab-${s.key}`}
                  className="relative font-display font-extrabold text-3xl md:text-4xl w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-[#0F172A] transition-transform hover:-translate-y-1"
                  style={{
                    background: on ? s.color : s.bg,
                    color: on ? "#fff" : s.color,
                    boxShadow: on ? `5px 5px 0 #0F172A` : `3px 3px 0 #0F172A`,
                  }}
                >
                  {s.key}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 max-w-4xl mx-auto"
        >
          <div className="ln-card p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start" style={{ background: current.bg }}>
            <span
              className="grid place-items-center w-20 h-20 rounded-2xl border-2 border-[#0F172A] text-white shrink-0 shadow-[4px_4px_0_#0F172A]"
              style={{ background: current.color }}
            >
              <current.icon size={36} />
            </span>
            <div>
              <h3 className="font-display font-extrabold text-3xl" style={{ color: current.color }}>
                {current.word}
              </h3>
              <p className="mt-3 text-lg text-[#0F172A]/80 leading-relaxed">{current.text}</p>
            </div>
          </div>
        </motion.div>

        {/* Bento grid overview */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            {STEAM.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className="ln-card ln-card-hover p-5 text-left"
                style={{ background: s.bg }}
                data-testid={`steam-card-${s.key}`}
              >
                <s.icon size={26} style={{ color: s.color }} />
                <div className="mt-3 font-display font-extrabold text-lg">{s.word}</div>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
