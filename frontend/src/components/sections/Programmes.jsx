import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "../Reveal";
import { useData } from "../../i18n/useData";

export const Programmes = () => {
  const navigate = useNavigate();
  const { programmes, ui } = useData();

  // Keep original programme data for images and links (non-translatable)
  // programmes from useData() already has translated title/tag/text
  // but preserves image and color from data.js via spread

  return (
    <section id="programmes" className="py-20 lg:py-28 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            overline="What we offer"
            title="Our STEAM Programmes"
            sub="Three ways for your child to learn, build, and grow — from weekly workshops to one-to-one cognitive support."
          />
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-3 gap-7">
          {programmes.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="ln-card ln-card-hover overflow-hidden flex flex-col"
              data-testid={`programme-card-${i}`}
            >
              <div className="relative h-48 overflow-hidden border-b-2 border-[#0F172A]">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-extrabold text-white border-2 border-[#0F172A]"
                  style={{ background: p.color }}
                >
                  {p.tag}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                {p.link ? (
                  <Link
                    to={p.link}
                    className="font-display font-extrabold text-2xl inline-flex items-center gap-1 hover:underline w-fit"
                    style={{ color: p.color }}
                    data-testid="programme-summer-link"
                  >
                    {p.title} <ArrowUpRight size={20} />
                  </Link>
                ) : (
                  <h3 className="font-display font-extrabold text-2xl">{p.title}</h3>
                )}
                <p className="mt-3 text-[#475569] leading-relaxed flex-1">{p.text}</p>
                <button
                  onClick={() => navigate("/register")}
                  className="mt-5 inline-flex items-center gap-1 font-bold self-start"
                  style={{ color: p.color }}
                  data-testid={`programme-enquire-${i}`}
                >
                  {ui.enquireNow} <ArrowUpRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
