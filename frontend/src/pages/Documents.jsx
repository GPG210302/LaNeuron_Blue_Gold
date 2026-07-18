import React from "react";
import { useData } from "@/i18n/useData";
import { useLanguage } from "@/i18n/LanguageContext";

const Documents = () => {
  const data = useData();
  const { language } = useLanguage();
  const faq = data?.faq || [];
  const isPolish = language === "pl";

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
    faqBadge: "FAQ",
    faqTitle: isPolish
      ? "Najczęściej zadawane pytania"
      : "Frequently Asked Questions",
    faqIntro: isPolish
      ? "Poniżej znajdują się odpowiedzi na pytania, które rodzice zadają najczęściej przed zapisaniem dziecka na zajęcia."
      : "Below are the answers to the questions parents ask most often before registering their child.",
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
    <main className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <span className="inline-block px-4 py-2 rounded-full border-2 border-[#0F172A] bg-white text-[#1B2A63] text-sm font-bold font-mono">
            {pageText.badge}
          </span>

          <h1 className="mt-5 text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
            {pageText.title}
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-[#334155] leading-relaxed">
            {pageText.intro}
          </p>
        </header>

        <nav
          aria-label={pageText.jumpLabel}
          className="mb-12 rounded-3xl border-2 border-[#0F172A] bg-white shadow-[6px_6px_0_#0F172A] p-4 md:p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold font-mono text-[#1B2A63]">
              {pageText.jumpLabel}
            </span>

            <a
              href="#documents-section"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border-2 border-[#0F172A] bg-[#E7EBF7] text-[#0F172A] font-bold font-mono text-sm hover:bg-[#D8E0F5] transition"
            >
              {pageText.jumpDocs}
            </a>

            <a
              href="#faq-section"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border-2 border-[#0F172A] bg-[#E7EBF7] text-[#0F172A] font-bold font-mono text-sm hover:bg-[#D8E0F5] transition"
            >
              {pageText.jumpFaq}
            </a>
          </div>
        </nav>

        <section id="documents-section" className="scroll-mt-32 mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <article
                key={doc.id}
                className="rounded-3xl border-2 border-[#0F172A] bg-white shadow-[6px_6px_0_#0F172A] p-6"
              >
                <h2 className="text-2xl font-extrabold text-[#0F172A]">
                  {doc.title}
                </h2>

                <p className="mt-3 text-[#475569] leading-relaxed">
                  {doc.description}
                </p>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center justify-center px-5 py-3 rounded-full border-2 border-[#0F172A] bg-[#1B2A63] text-white font-bold font-mono hover:opacity-90 transition"
                >
                  {pageText.viewDocument}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="faq-section" className="scroll-mt-32">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 rounded-full border-2 border-[#0F172A] bg-white text-[#1B2A63] text-sm font-bold font-mono">
              {pageText.faqBadge}
            </span>

            <h2 className="mt-5 text-3xl md:text-4xl font-black text-[#0F172A] leading-tight">
              {pageText.faqTitle}
            </h2>

            <p className="mt-3 max-w-3xl text-[#475569] leading-relaxed">
              {pageText.faqIntro}
            </p>
          </div>

          <div className="grid gap-5">
            {faq.map((item, index) => (
              <details
                key={`${item.question}-${index}`}
                className="group rounded-3xl border-2 border-[#0F172A] bg-white shadow-[6px_6px_0_#0F172A] overflow-hidden"
              >
                <summary className="list-none cursor-pointer px-6 py-5 flex items-start justify-between gap-4">
                  <span className="text-left text-lg font-extrabold text-[#0F172A]">
                    {item.question}
                  </span>

                  <span className="mt-1 text-[#1B2A63] font-black text-xl leading-none transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="px-6 pb-6 border-t-2 border-[#E2E8F0]">
                  <p className="pt-4 text-[#475569] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Documents;