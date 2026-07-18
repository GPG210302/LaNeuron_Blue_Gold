import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useData } from "@/i18n/useData";
import { useLanguage } from "@/i18n/LanguageContext";

const Documents = () => {
  const [open, setOpen] = useState(0);
  const data = useData();
  const { language } = useLanguage();
  const isPolish = language === "pl";

  const rawFaq = data?.faq || [];
  const faq = rawFaq.map((item) => ({
    q: item?.q || item?.question || "",
    a: item?.a || item?.answer || "",
  }));

  const pageText = {
    badge: isPolish ? "Dokumenty" : "Documents",
    title: isPolish
      ? "Informacje i dokumenty dla rodziców"
      : "Parent Information & Documents",
    intro: isPolish
      ? "W tym miejscu rodzice znajdą najważniejsze dokumenty, zasady uczestnictwa, informacje organizacyjne oraz odpowiedzi na najczęściej zadawane pytania."
      : "Here parents can find key documents, participation policies, practical information, and answers to the most frequently asked questions.",
    jumpLabel: isPolish ? "Przejdź do sekcji" : "Jump to section",
    jumpDocs: isPolish ? "Dokumenty" : "Documents",
    jumpFaq: "FAQ",
    docsOverline: isPolish ? "Dla rodziców" : "For parents",
    docsTitle: isPolish ? "Najważniejsze dokumenty" : "Key Documents",
    faqOverline: isPolish ? "Warto wiedzieć" : "Good to know",
    faqTitle: isPolish
      ? "Najczęściej zadawane pytania"
      : "Frequently Asked Questions",
    viewDocument: isPolish ? "Zobacz dokument" : "View document",
  };

  const documents = [
    {
      id: "rules",
      title: isPolish
        ? "Regulamin i zasady uczestnictwa"
        : "Rules & Regulations",
      description: isPolish
        ? "Najważniejsze zasady uczestnictwa, obecności, organizacji zajęć oraz przebiegu warsztatów."
        : "Important participation rules, attendance expectations, workshop conduct, and practical participation guidelines.",
    },
    {
      id: "privacy",
      title: isPolish ? "Polityka prywatności" : "Privacy Policy",
      description: isPolish
        ? "Informacje o przetwarzaniu danych osobowych, formularzach kontaktowych i komunikacji z rodzicami."
        : "How La Neuron handles personal data, enquiry submissions, and parent communication.",
    },
    {
      id: "child-protection",
      title: isPolish
        ? "Polityka ochrony dzieci"
        : "Child Protection Policy",
      description: isPolish
        ? "Zasady bezpieczeństwa, dobrostanu dziecka i standardy ochrony małoletnich."
        : "Safeguarding principles, wellbeing commitments, and child protection standards.",
    },
    {
      id: "forms",
      title: isPolish
        ? "Formularze i dokumenty dla rodziców"
        : "Parent Forms & Documents",
      description: isPolish
        ? "Niezbędne formularze i dokumenty wspierające zapis oraz uczestnictwo dziecka."
        : "Essential forms and supporting documents related to registration and participation.",
    },
  ];

  return (
    <main className="ln-grid-bg min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#1B2A63]">
              {pageText.badge}
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] text-[#0F172A]">
              {pageText.title}
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#475569]">
              {pageText.intro}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <nav
            aria-label={pageText.jumpLabel}
            className="mt-8 ln-card p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-mono font-bold text-[#1B2A63]">
                {pageText.jumpLabel}
              </span>

              <a
                href="#documents-section"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-sm font-mono font-bold text-[#1B2A63] transition hover:-translate-y-0.5"
              >
                {pageText.jumpDocs}
              </a>

              <a
                href="#faq-section"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-sm font-mono font-bold text-[#1B2A63] transition hover:-translate-y-0.5"
              >
                {pageText.jumpFaq}
              </a>
            </div>
          </nav>
        </Reveal>

        <section id="documents-section" className="scroll-mt-32 pt-16">
          <Reveal>
            <SectionHeading
              overline={pageText.docsOverline}
              title={pageText.docsTitle}
            />
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {documents.map((doc, index) => (
              <Reveal key={doc.id} delay={index * 0.04}>
                <article className="ln-card p-6 sm:p-7 h-full flex flex-col">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                    {doc.title}
                  </h2>

                  <p className="mt-3 text-[#475569] leading-relaxed text-base">
                    {doc.description}
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="ln-btn ln-btn-enquire ln-btn-no-glow !px-5 !py-3 !text-sm font-mono tracking-wide"
                    >
                      {pageText.viewDocument}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="faq-section" className="scroll-mt-32 pt-20">
          <div className="max-w-3xl">
            <Reveal>
              <SectionHeading
                overline={pageText.faqOverline}
                title={pageText.faqTitle}
              />
            </Reveal>

            <div className="mt-12 space-y-3">
              {faq.map((f, i) => {
                const isOpen = open === i;
                return (
                  <Reveal key={`${f.q}-${i}`} delay={i * 0.03}>
                    <div
                      className="ln-card overflow-hidden"
                      data-testid={`documents-faq-item-${i}`}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                        data-testid={`documents-faq-toggle-${i}`}
                      >
                        <span className="font-display font-extrabold text-lg text-[#0F172A]">
                          {f.q}
                        </span>

                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          className="shrink-0 grid place-items-center w-8 h-8 rounded-lg bg-[#E7EBF7] text-[#1B2A63] border-2 border-[#1B2A63]"
                        >
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
                            <p className="px-6 pb-5 text-[#475569] leading-relaxed">
                              {f.a}
                            </p>
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
      </div>
    </main>
  );
};

export default Documents;