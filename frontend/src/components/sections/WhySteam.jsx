import { RotateCw } from "lucide-react";
import { Reveal, SectionHeading } from "../Reveal";
import { FlipCard } from "../FlipCard";
import { useData } from "../../i18n/useData";

export const WhySteam = () => {
  const { why, whySteamI18n } = useData();

  return (
    <section id="why-steam" className="py-20 lg:py-28 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            overline={whySteamI18n.overline}
            title={whySteamI18n.title}
            sub={whySteamI18n.sub}
          />
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {why.map((w, i) => (
            <FlipCard
              key={w.title}
              heightClass="h-64"
              testid={`why-card-${i}`}
              front={
                <div className="ln-card h-full p-7 flex flex-col">
                  <span
                    className="grid place-items-center w-14 h-14 rounded-2xl border-2 border-[#1B2A63] text-white shadow-[3px_3px_0_#1B2A63]"
                    style={{ background: w.color }}
                  >
                    <w.icon size={26} />
                  </span>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="font-display font-extrabold text-sm text-[#475569]">0{i + 1}</span>
                    <h3 className="font-display font-extrabold text-xl">{w.title}</h3>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: w.color }}>
                    <RotateCw size={14} /> {whySteamI18n.tapExplore}
                  </span>
                </div>
              }
              back={
                <div className="ln-card h-full p-7 flex flex-col text-white" style={{ background: w.color }}>
                  <h3 className="font-display font-extrabold text-xl">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/90 overflow-y-auto">{w.text}</p>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};
