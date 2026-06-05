import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Hero } from "../components/sections/Hero";
import { Reveal, SectionHeading } from "../components/Reveal";

const LINKS = [
  { to: "/about", title: "Meet the Educator", desc: "Dr. Priyadarshini Gouthaman — PhD in Anatomy, cognitive scientist, and the mind behind La Neuron.", color: "#1B2A63" },
  { to: "/what-is-steam", title: "What is STEAM?", desc: "Explore the five disciplines — Science, Technology, Engineering, Art, and Mathematics — and how they connect.", color: "#10B981" },
  { to: "/why-steam", title: "Why STEAM?", desc: "Six reasons STEAM matters for your child, plus our full investigative scientific-method approach.", color: "#A855F7" },
  { to: "/programmes", title: "Programmes", desc: "Weekly workshops, the Summer Camp, and one-to-one cognitive support sessions.", color: "#F97316" },
  { to: "/summer-camp", title: "Summer Camp 2026", desc: "A themed week of Wonder, Build, Bio, Planet, and Food labs in Kraków. Registrations open!", color: "#E0B33C" },
  { to: "/faq", title: "FAQ", desc: "Ages, language, what to bring, learning differences, siblings, and the cancellation policy.", color: "#D97706" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <SectionHeading overline="Explore the academy" title="Where would you like to start?" sub="Tap any card to dive into the details — no endless scrolling." />
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LINKS.map((l, i) => (
              <Reveal key={l.to} delay={(i % 3) * 0.06}>
                <Link
                  to={l.to}
                  className="ln-card ln-card-hover p-7 flex flex-col h-full"
                  data-testid={`home-link-${l.to.replace("/", "")}`}
                >
                  <h3 className="font-display font-extrabold text-2xl" style={{ color: l.color }}>{l.title}</h3>
                  <p className="mt-3 text-[#475569] leading-relaxed flex-1">{l.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 font-bold" style={{ color: l.color }}>
                    Explore <ArrowRight size={18} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
