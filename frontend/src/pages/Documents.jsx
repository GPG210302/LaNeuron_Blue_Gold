import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { renderAsync } from "docx-preview";

import rulesCombinedDoc from "@/assets/documents/rules-PL_EN.docx";
import privacyCombinedDoc from "@/assets/documents/privacy_PL_EN.docx";
import formsCombinedDoc from "@/assets/documents/forms-PL_EN.docx";
import childProtectionShortCombinedDoc from "@/assets/documents/child-protection-short-PL_EN.docx";
import childProtectionDetailedEnDoc from "@/assets/documents/child-protection-detailed-EN.docx";
import childProtectionDetailedPlDoc from "@/assets/documents/child-protection-detailed-PL.docx";

import { Reveal, SectionHeading } from "@/components/Reveal";
import { useData } from "@/i18n/useData";
import { useLanguage } from "@/i18n/LanguageContext";

const Documents = () => {
  const [open, setOpen] = useState(0);
  const [activeDocument, setActiveDocument] = useState(null);
  const [childProtectionVersion, setChildProtectionVersion] = useState("detailed");
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [docError, setDocError] = useState("");

  const docxContainerRef = useRef(null);

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
    close: isPolish ? "Zamknij" : "Close",
    watermark: isPolish ? "La Neuron • Tylko do wglądu" : "La Neuron • View Only",
    versionDetailed: isPolish ? "Wersja szczegółowa" : "Detailed version",
    versionShort: isPolish ? "Wersja krótka" : "Short version",
    loading: isPolish ? "Ładowanie dokumentu..." : "Loading document...",
    loadError: isPolish
      ? "Nie udało się załadować dokumentu."
      : "Could not load the document.",
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

  const getDocumentSource = useMemo(() => {
    return () => {
      if (!activeDocument) return null;

      if (activeDocument === "rules") {
        return rulesCombinedDoc;
      }

      if (activeDocument === "privacy") {
        return privacyCombinedDoc;
      }

      if (activeDocument === "forms") {
        return formsCombinedDoc;
      }

      if (activeDocument === "child-protection") {
        if (childProtectionVersion === "short") {
          return childProtectionShortCombinedDoc;
        }

        return isPolish
          ? childProtectionDetailedPlDoc
          : childProtectionDetailedEnDoc;
      }

      return null;
    };
  }, [activeDocument, childProtectionVersion, isPolish]);

  const activeDocumentMeta = activeDocument
    ? documents.find((doc) => doc.id === activeDocument)
    : null;

  const handleOpenDocument = (docId) => {
    setActiveDocument(docId);
    setDocError("");
    if (docId === "child-protection") {
      setChildProtectionVersion("detailed");
    }
  };

  const handleCloseModal = () => {
    setActiveDocument(null);
    setDocError("");
    setIsDocLoading(false);

    if (docxContainerRef.current) {
      docxContainerRef.current.innerHTML = "";
    }
  };

  useEffect(() => {
    if (!activeDocument) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeDocument]);

  useEffect(() => {
    const loadDocument = async () => {
      const source = getDocumentSource();
      const container = docxContainerRef.current;

      if (!activeDocument || !source || !container) return;

      setIsDocLoading(true);
      setDocError("");
      container.innerHTML = "";

      try {
        const response = await fetch(source);
        const blob = await response.blob();

        await renderAsync(blob, container, undefined, {
          className: "docx-viewer-render",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
        });
        const renderedPages = container.querySelectorAll(
        ".docx_page, .docx-section, section.docx, .docx-wrapper > div"
        );

        renderedPages.forEach((page) => {
        const existingWatermark = page.querySelector(".page-watermark-layer");
        if (existingWatermark) {
            existingWatermark.remove();
        }

        const watermarkLayer = document.createElement("div");
        watermarkLayer.className = "page-watermark-layer";
        watermarkLayer.innerHTML = `
            <div class="page-watermark-stripes"></div>
            <p class="page-watermark-text top">${pageText.watermark}</p>
            <p class="page-watermark-text middle">${pageText.watermark}</p>
            <p class="page-watermark-text bottom">${pageText.watermark}</p>
        `;

        page.style.position = "relative";
        page.appendChild(watermarkLayer);
        });
      } catch (error) {
        console.error("DOCX render error:", error);
        setDocError(pageText.loadError);
      } finally {
        setIsDocLoading(false);
      }
    };

    loadDocument();
    }, [
    activeDocument,
    childProtectionVersion,
    getDocumentSource,
    pageText.loadError,
    pageText.watermark,
    ]);

  return (
    <>
      <style>{`
        .docx-modal-content {
            position: relative;
            z-index: 1;
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
        }

        .docx-modal-content .docx-wrapper {
            background: transparent !important;
            padding: 0 !important;
            position: relative !important;
            z-index: 1 !important;
            user-select: none !important;
            -webkit-user-select: none !important;
        }

        .docx-modal-content .docx {
            margin: 0 auto 24px auto !important;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08) !important;
            border-radius: 18px !important;
            overflow: hidden !important;
            max-width: 100% !important;
            position: relative !important;
            z-index: 1 !important;
            background: rgba(255, 255, 255, 0.90) !important;
            user-select: none !important;
            -webkit-user-select: none !important;
        }

        .docx-modal-content .docx * {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
        }

        .docx-modal-content .docx table {
            border-collapse: collapse !important;
            width: 100% !important;
        }

        .docx-modal-content .docx img {
            max-width: 100% !important;
            height: auto !important;
            pointer-events: none !important;
            -webkit-user-drag: none !important;
        }

        .docx-modal-content .docx p,
        .docx-modal-content .docx span,
        .docx-modal-content .docx td,
        .docx-modal-content .docx th,
        .docx-modal-content .docx li {
            word-break: break-word;
        }

        .docx-modal-content .docx .docx_page,
        .docx-modal-content .docx section.docx {
            background: rgba(255, 255, 255, 0.88) !important;
        }



        @media (min-width: 640px) {
            .docx-watermark-text {
            font-size: 32px;
            }
        }

 

        .docx-modal-content .docx .docx_page {
            position: relative !important;
            overflow: hidden !important;
        }

        .page-watermark-layer {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 30;
            overflow: hidden;
        }

        .page-watermark-stripes {
            position: absolute;
            inset: 0;
            opacity: 0.12;
            background-image: repeating-linear-gradient(
                -32deg,
                transparent,
                transparent 120px,
                rgba(27, 42, 99, 0.26) 120px,
                rgba(27, 42, 99, 0.26) 190px
            );
        }

        .page-watermark-text {
            position: absolute;
            left: 50%;
            transform: translateX(-50%) rotate(-32deg);
            white-space: nowrap;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.35em;
            color: rgba(27, 42, 99, 0.22);
            font-size: 22px;
        }

        @media (min-width: 640px) {
            .page-watermark-text {
                font-size: 32px;
            }
        }

        .page-watermark-text.top {
            top: 12%;
        }

        .page-watermark-text.middle {
            top: 50%;
            transform: translateX(-50%) translateY(-50%) rotate(-32deg);
        }

        .page-watermark-text.bottom {
            bottom: 12%;
        }
     `}</style>
        

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
                        onClick={() => handleOpenDocument(doc.id)}
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

        <AnimatePresence>
        {activeDocument && (
            <motion.div
            className="fixed inset-0 z-[120] bg-[#0F172A]/60 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            >
            <motion.div
                className="relative mx-auto flex h-full max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border-2 border-[#0F172A] bg-white shadow-[8px_8px_0_#0F172A]"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b-2 border-[#E2E8F0] px-5 sm:px-7 py-5">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#1B2A63]">
                    {pageText.badge}
                    </p>
                    <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                    {activeDocumentMeta?.title}
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={handleCloseModal}
                    aria-label={pageText.close}
                    className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] text-[#1B2A63] transition hover:-translate-y-0.5"
                >
                    <X size={20} />
                </button>
                </div>

                {activeDocument === "child-protection" && (
                <div className="border-b-2 border-[#E2E8F0] px-5 sm:px-7 py-4">
                    <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setChildProtectionVersion("detailed")}
                        className={`inline-flex items-center justify-center rounded-full border-2 px-4 py-2 text-sm font-mono font-bold transition ${
                        childProtectionVersion === "detailed"
                            ? "border-[#1B2A63] bg-[#1B2A63] text-white"
                            : "border-[#1B2A63] bg-[#E7EBF7] text-[#1B2A63]"
                        }`}
                    >
                        {pageText.versionDetailed}
                    </button>

                    <button
                        type="button"
                        onClick={() => setChildProtectionVersion("short")}
                        className={`inline-flex items-center justify-center rounded-full border-2 px-4 py-2 text-sm font-mono font-bold transition ${
                        childProtectionVersion === "short"
                            ? "border-[#1B2A63] bg-[#1B2A63] text-white"
                            : "border-[#1B2A63] bg-[#E7EBF7] text-[#1B2A63]"
                        }`}
                    >
                        {pageText.versionShort}
                    </button>
                    </div>
                </div>
                )}

                <div className="relative flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6">
                <div className="relative z-10 docx-modal-content">
                    {isDocLoading && (
                    <div className="flex min-h-[280px] items-center justify-center">
                        <div className="inline-flex items-center gap-3 rounded-full border-2 border-[#1B2A63] bg-white px-5 py-3 text-[#1B2A63] shadow-sm">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm font-mono font-bold">
                            {pageText.loading}
                        </span>
                        </div>
                    </div>
                    )}

                    {docError && !isDocLoading && (
                    <div className="flex min-h-[280px] items-center justify-center">
                        <div className="max-w-md rounded-[24px] border-2 border-red-200 bg-red-50 px-6 py-5 text-center text-red-700">
                        {docError}
                        </div>
                    </div>
                    )}

                    <div
                    ref={docxContainerRef}
                    className={isDocLoading ? "hidden" : "block"}
                    />
                </div>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    </>
  );
};

export default Documents;