import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Images } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";

const sizeMap = {
  large: "sm:col-span-2 lg:col-span-2 row-span-1 min-h-[320px]",
  medium: "sm:col-span-1 lg:col-span-1 min-h-[300px]",
  tall: "sm:col-span-1 lg:col-span-1 min-h-[420px]",
  wide: "sm:col-span-2 lg:col-span-2 min-h-[280px]",
};

const Gallery = () => {
  const { language } = useLanguage();
  const isPolish = language === "pl";

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(null);

  const pageText = {
    overline: isPolish ? "Galeria" : "Gallery",
    title: isPolish ? "Chwile z La Neuron" : "Moments from La Neuron",
    sub: isPolish
      ? "Krótki wgląd w praktyczną naukę STEAM, odkrycia naukowe, zajęcia w terenie oraz tematyczne warsztaty w La Neuron."
      : "A visual glimpse into hands-on STEAM learning, scientific discovery, outdoor exploration, and themed workshop moments at La Neuron.",
    helper: isPolish
      ? "bloków galerii gotowych na prawdziwe zdjęcia"
      : "gallery blocks ready for real photos later",
    placeholderBadge: isPolish ? "Podgląd zastępczy" : "Placeholder preview",
    viewPreview: isPolish ? "Zobacz podgląd" : "View preview",
    lightboxHint: isPolish
      ? "Podgląd układu galerii · Później można tu dodać prawdziwe zdjęcie"
      : "Placeholder gallery preview · Replace with real image later",
    close: isPolish ? "Zamknij" : "Close",
    previous: isPolish ? "Poprzednie" : "Previous",
    next: isPolish ? "Następne" : "Next",
  };

  const filters = [
    { key: "all", label: isPolish ? "Wszystkie" : "All" },
    { key: "workshops", label: isPolish ? "Warsztaty" : "Workshops" },
    { key: "lab", label: isPolish ? "Laboratorium" : "Lab" },
    { key: "outdoor", label: isPolish ? "Teren" : "Outdoor" },
    { key: "projects", label: isPolish ? "Projekty" : "Projects" },
  ];

  const galleryItems = [
    {
      id: 1,
      title: isPolish ? "Chwile z warsztatów" : "Workshop moments",
      category: "workshops",
      categoryLabel: isPolish ? "Warsztaty" : "Workshops",
      blurb: isPolish
        ? "Praktyczne zajęcia, prowadzone odkrywanie i wspólne aktywności STEAM."
        : "Hands-on sessions, guided discovery, and team-based STEAM activities.",
      size: "large",
      tone: "from-[#DBEAFE] via-[#E7EBF7] to-[#FEF3C7]",
    },
    {
      id: 2,
      title: isPolish ? "Odkrywanie nauki" : "Science exploration",
      category: "lab",
      categoryLabel: isPolish ? "Laboratorium" : "Lab",
      blurb: isPolish
        ? "Obserwacja, badanie i momenty naukowych odkryć z bliska."
        : "Observation, investigation, and close-up scientific discovery moments.",
      size: "medium",
      tone: "from-[#E0F2FE] via-[#DBEAFE] to-[#E2E8F0]",
    },
    {
      id: 3,
      title: isPolish ? "Odkrywanie w terenie" : "Outdoor discovery",
      category: "outdoor",
      categoryLabel: isPolish ? "Teren" : "Outdoor",
      blurb: isPolish
        ? "Spacery badawcze, zbieranie próbek i nauka poza salą zajęć."
        : "Nature walks, collecting samples, and learning beyond the classroom.",
      size: "tall",
      tone: "from-[#DCFCE7] via-[#E0F2FE] to-[#FEF3C7]",
    },
    {
      id: 4,
      title: isPolish ? "Migawki z projektów" : "Project snapshots",
      category: "projects",
      categoryLabel: isPolish ? "Projekty" : "Projects",
      blurb: isPolish
        ? "Twórcze konstrukcje, zadania problemowe i efekty pracy dzieci."
        : "Creative builds, problem-solving tasks, and student-made outcomes.",
      size: "medium",
      tone: "from-[#FCE7F3] via-[#E7EBF7] to-[#DBEAFE]",
    },
    {
      id: 5,
      title: isPolish ? "Tematyczne warsztaty" : "Thematic workshops",
      category: "workshops",
      categoryLabel: isPolish ? "Warsztaty" : "Workshops",
      blurb: isPolish
        ? "Specjalne zajęcia tematyczne z angażującymi aktywnościami opartymi na nauce."
        : "Special themed sessions with immersive science-led activities.",
      size: "wide",
      tone: "from-[#FEF3C7] via-[#FDE68A] to-[#DBEAFE]",
    },
    {
      id: 6,
      title: isPolish ? "Chwile z laboratorium" : "Lab activity moments",
      category: "lab",
      categoryLabel: isPolish ? "Laboratorium" : "Lab",
      blurb: isPolish
        ? "Stanowiska eksperymentalne, materiały i prawdziwy przebieg badania."
        : "Experiment stations, tools, materials, and real investigation flow.",
      size: "medium",
      tone: "from-[#E2E8F0] via-[#DBEAFE] to-[#E7EBF7]",
    },
    {
      id: 7,
      title: isPolish ? "Mali odkrywcy" : "Young explorers",
      category: "projects",
      categoryLabel: isPolish ? "Projekty" : "Projects",
      blurb: isPolish
        ? "Aktywności budujące pewność siebie i ciekawość młodszych dzieci."
        : "Confidence-building activities designed for younger curious minds.",
      size: "tall",
      tone: "from-[#FEF3C7] via-[#FDE68A] to-[#F8FAFC]",
    },
    {
      id: 8,
      title: isPolish ? "STEAM w działaniu" : "STEAM in action",
      category: "outdoor",
      categoryLabel: isPolish ? "Teren" : "Outdoor",
      blurb: isPolish
        ? "Ruch, ciekawość, współpraca i eksperymentowanie uchwycone w jednym miejscu."
        : "A visual glimpse of movement, curiosity, teamwork, and experimentation.",
      size: "medium",
      tone: "from-[#DBEAFE] via-[#E0F2FE] to-[#DCFCE7]",
    },
  ];

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return galleryItems;
    return galleryItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, galleryItems]);

  useEffect(() => {
    const onKey = (e) => {
      if (activeIndex === null) return;

      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, filteredItems.length]);

  useEffect(() => {
    setActiveIndex(null);
  }, [activeFilter, language]);

  const currentItem = activeIndex !== null ? filteredItems[activeIndex] : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] ln-grid-bg pt-28 sm:pt-32 pb-20">
      <section className="relative py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              overline={pageText.overline}
              title={pageText.title}
              sub={pageText.sub}
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-bold font-mono transition-all ${
                      isActive
                        ? "bg-[#243574] text-white border-[#243574] shadow-[3px_3px_0_#0F172A]"
                        : "bg-white text-[#1B2A63] border-[#1B2A63] hover:bg-[#E7EBF7]"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#475569]">
              <Images size={16} className="text-[#1B2A63]" />
              <span>
                {filteredItems.length} {pageText.helper}
              </span>
            </div>
          </Reveal>

          <motion.div
            layout
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(240px,auto)]"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.button
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative text-left rounded-[28px] border-2 border-[#0F172A] bg-white shadow-[6px_6px_0_#0F172A] overflow-hidden ${sizeMap[item.size]}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.tone}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_35%)]" />
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#1B2A63]/80 transition-opacity duration-300" />
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-between p-6"
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex px-3 py-1 rounded-full border-2 border-[#1B2A63] bg-white text-[#1B2A63] text-[11px] font-bold font-mono">
                        {item.categoryLabel}
                      </span>
                      <span className="w-10 h-10 rounded-xl border-2 border-[#1B2A63] bg-white/80 backdrop-blur grid place-items-center text-[#1B2A63] font-black">
                        {String(item.id).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <div className="h-24 sm:h-32 rounded-2xl border border-white/40 bg-white/20 backdrop-blur-[2px] group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>

                    <div className="relative z-10">
                      <div className="inline-flex mb-3 px-3 py-1 rounded-full bg-white/80 text-[#475569] text-xs font-semibold">
                        {pageText.placeholderBadge}
                      </div>
                      <h3 className="text-xl font-display font-extrabold text-[#0F172A] group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#475569] group-hover:text-white/90 transition-colors max-w-md">
                        {item.blurb}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1B2A63] group-hover:text-[#F8D24A] transition-colors">
                        {pageText.viewPreview}
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {currentItem && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#0F172A]/75 backdrop-blur-md px-4 py-6 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <div className="max-w-5xl mx-auto h-full flex items-center justify-center">
              <motion.div
                initial={{ y: 20, scale: 0.97, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 16, scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative w-full rounded-[32px] overflow-hidden border-2 border-[#0F172A] bg-white shadow-[8px_8px_0_#0F172A]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`h-[280px] sm:h-[360px] md:h-[440px] bg-gradient-to-br ${currentItem.tone} relative`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_30%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[72%] h-[62%] rounded-[28px] border-2 border-[#1B2A63] bg-white/40 backdrop-blur-sm shadow-inner" />
                  </div>

                  <button
                    onClick={() => setActiveIndex(null)}
                    aria-label={pageText.close}
                    className="absolute top-4 right-4 grid place-items-center w-11 h-11 rounded-xl border-2 border-[#0F172A] bg-white text-[#1B2A63] hover:bg-[#E7EBF7] transition-colors"
                  >
                    <X size={20} />
                  </button>

                  {filteredItems.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
                        }
                        aria-label={pageText.previous}
                        className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-xl border-2 border-[#0F172A] bg-white text-[#1B2A63] hover:bg-[#E7EBF7] transition-colors"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActiveIndex((prev) => (prev + 1) % filteredItems.length)}
                        aria-label={pageText.next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-xl border-2 border-[#0F172A] bg-white text-[#1B2A63] hover:bg-[#E7EBF7] transition-colors"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex px-3 py-1 rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] text-[#1B2A63] text-xs font-bold font-mono">
                      {currentItem.categoryLabel}
                    </span>
                    <span className="text-sm text-[#475569]">
                      {pageText.lightboxHint}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl sm:text-3xl font-display font-extrabold text-[#0F172A]">
                    {currentItem.title}
                  </h2>
                  <p className="mt-3 text-[#475569] leading-relaxed max-w-2xl">
                    {currentItem.blurb}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;