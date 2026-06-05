import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, SectionHeading } from "../Reveal";
import { FAQ as FAQS } from "../../data";

export const Faq = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-20 lg:py-28 pt-28 sm:pt-32 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Reveal>
          <SectionHeading overline="Good to know" title="Frequently Asked Questions" />
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.03}>
                <div className="ln-card overflow-hidden" data-testid={`faq-item-${i}`}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                    data-testid={`faq-toggle-${i}`}
                  >
                    <span className="font-display font-extrabold text-lg">{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="shrink-0 grid place-items-center w-8 h-8 rounded-lg bg-[#E7EBF7] text-[#1B2A63] border-2 border-[#1B2A63]">
                      <Plus size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="px-6 pb-5 text-[#475569] leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
