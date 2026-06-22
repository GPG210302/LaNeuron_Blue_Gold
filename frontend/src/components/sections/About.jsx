import { CheckCircle2, GraduationCap, Bone, Award } from "lucide-react";
import { Reveal } from "../Reveal";
import { useData } from "../../i18n/useData";
import educatorImg from "../../assets/educator.png";

// Static non-translatable fields (name stays in English always)
import { EDUCATOR } from "../../data";

export const About = () => {
  const { educator } = useData();

  return (
    <section id="about" className="py-20 lg:py-28 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-5 gap-12 items-start">
        {/* Image */}
        <Reveal className="lg:col-span-2 lg:sticky lg:top-28">
          <div className="relative">
            <div className="ln-card overflow-hidden -rotate-2">
              <img src={educatorImg} alt={EDUCATOR.name} className="w-full h-[480px] object-cover object-top" />
            </div>
            <div className="absolute -bottom-5 -right-3 ln-card bg-white px-4 py-3 rotate-2" data-testid="educator-badge">
              <div className="flex items-center gap-2">
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-[#1B2A63] text-white">
                  <GraduationCap size={18} />
                </span>
                <div className="leading-tight">
                  <div className="font-display font-extrabold text-sm">{educator.badgeLabel}</div>
                  <div className="text-xs text-[#475569] font-semibold">{educator.badgeSubLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="lg:col-span-3">
          <Reveal>
            <span className="ln-overline">{educator.overline}</span>
            {/* Name is always English — proper noun */}
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">{EDUCATOR.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {educator.tags.map((tag) => (
                <span key={tag} className="ln-tag">
                  {tag === educator.tags[0] && <Bone size={13} />} {tag}
                </span>
              ))}
            </div>
            <p className="mt-6 text-lg text-[#475569] leading-relaxed">{educator.intro}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-7 ln-card p-6 bg-[#E7EBF7]">
              <h3 className="font-display font-extrabold text-lg mb-4">{educator.backgroundTitle}</h3>
              <ul className="space-y-3">
                {educator.background.map((b) => (
                  <li key={b} className="flex gap-3 text-[#0F172A] font-medium">
                    <CheckCircle2 size={20} className="text-[#1B2A63] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-6 ln-card p-6 bg-[#0F172A] text-white" data-testid="educator-highlight">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-[#FBBF24] text-[#0F172A] border-2 border-white/20 shrink-0">
                  <Award size={22} />
                </span>
                <h3 className="font-display font-extrabold text-lg text-[#FBBF24]">{educator.publishedTitle}</h3>
              </div>
              <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed">{educator.highlight}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-6 ln-card p-6 border-l-[6px] border-l-[#E0B33C]">
              <h3 className="font-display font-extrabold text-lg text-[#E0B33C]">{educator.philosophyTitle}</h3>
              <p className="mt-3 text-lg text-[#475569] leading-relaxed">{educator.philosophy}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
