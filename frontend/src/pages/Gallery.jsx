import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Images } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { RAW_GALLERY_ITEMS } from "@/data/galleryItems";

const Gallery = () => {
  const { language } = useLanguage();
  const isPolish = language === "pl";

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSubLab, setActiveSubLab] = useState("all");

  const subLabFilters = [
    { key: "all", label: isPolish ? "Wszystkie" : "All" },
    { key: "Bio Lab", label: isPolish ? "Bio" : "Bio" },
    { key: "Build Lab", label: isPolish ? "Build" : "Build" },
    { key: "Planet Lab", label: isPolish ? "Planeta i środowisko" : "Planet & Environment" },
    { key: "Food Lab + Showcase", label: isPolish ? "Jedzenie" : "Food" },
  ];

  const pageText = {
    overline: isPolish ? "Galeria" : "Gallery",
    title: isPolish ? "Chwile z La Neuron" : "Moments from La Neuron",
    sub: isPolish
      ? "Krótki wgląd w praktyczną naukę STEAM, odkrycia naukowe, zajęcia w terenie oraz tematyczne warsztaty w La Neuron."
      : "A visual glimpse into hands-on STEAM learning, scientific discovery, outdoor exploration, and themed workshop moments at La Neuron.",
    helper: isPolish
      ? "zdjęć w galerii"
      : "photos in the gallery",
    close: isPolish ? "Zamknij" : "Close",
    previous: isPolish ? "Poprzednie" : "Previous",
    next: isPolish ? "Następne" : "Next",
  };

  const filters = [
    { key: "all", label: isPolish ? "Wszystkie" : "All" },
    { key: "workshop-lab", label: isPolish ? "Warsztaty i Lab" : "Workshop & Lab" },
    { key: "outdoor", label: isPolish ? "Teren" : "Outdoor" },
    { key: "events", label: isPolish ? "Wydarzenia" : "Events" },
    { key: "promotions", label: isPolish ? "Promocje" : "Promotions" },
  ];

  const galleryItems = useMemo(
    () =>
      RAW_GALLERY_ITEMS.map((item) => ({
        ...item,
        title: isPolish ? item.title.pl : item.title.en,
        blurb: isPolish ? item.blurb.pl : item.blurb.en,
        categoryLabel: isPolish
          ? item.categoryLabel.pl
          : item.categoryLabel.en,
      })),
    [isPolish]
  );

  const filteredItems = useMemo(() => {
    let items = galleryItems;

    if (activeFilter === "workshop-lab") {
      items = items.filter(
        (item) => item.section === "lab" || item.section === "workshops"
      );
      if (activeSubLab !== "all") {
        items = items.filter((item) => item.lab === activeSubLab);
      }
      return items;
    }

    if (activeFilter !== "all") {
      items = items.filter((item) => item.section === activeFilter);
    }

    return items;
  }, [activeFilter, activeSubLab, galleryItems]);

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const [shuffledItems, setShuffledItems] = useState([]);

  useEffect(() => {
    setShuffledItems(shuffleArray(filteredItems));
    setActiveIndex(null); // close lightbox if a filter changes the list
  }, [filteredItems]);

  useEffect(() => {
    const onKey = (e) => {
      if (activeIndex === null) return;

      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % shuffledItems.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex(
          (prev) => (prev - 1 + shuffledItems.length) % shuffledItems.length
        );
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, shuffledItems.length]);

  useEffect(() => {
    setActiveSubLab("all");
  }, [activeFilter]);

  const currentItem = activeIndex !== null ? shuffledItems[activeIndex] : null;

  return (
    <main className="ln-grid-bg min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-28">
      <section className="gallery-root relative py-16 sm:py-20">
        {/* Wider container so the collage breathes across the page */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        ? "bg-[#243574] text-white border-[#243574]"
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
            <div className="mt-6 text-center text-sm text-[#475569]">
              <div className="inline-flex items-center gap-2 justify-center">
                <Images size={16} className="text-[#1B2A63]" />
                <span>
                  {shuffledItems.length} {pageText.helper}
                </span>
              </div>

              {activeFilter === "workshop-lab" && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {subLabFilters.map((sub) => (
                    <button
                      key={sub.key}
                      onClick={() => setActiveSubLab(sub.key)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-bold font-mono transition-all ${
                        activeSubLab === sub.key
                          ? "bg-[#1B2A63] text-white border-[#1B2A63]"
                          : "bg-white text-[#1B2A63] border-[#CBD5F5] hover:bg-[#EEF2FF]"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/*
            MASONRY COLLAGE
            CSS multi-column layout: every photo keeps its natural
            orientation (portrait = tall, landscape = wide) and the
            columns interlock like a puzzle with no fixed rows.
            2 columns on phones, 3 on tablets, 4 on desktop.
          */}
          <div
            key={`${activeFilter}-${activeSubLab}`}
            className="mt-12 columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 [column-fill:_balance]"
          >
            {shuffledItems.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                onContextMenu={(e) => e.preventDefault()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.4) }}
                className="group relative block w-full mb-3 sm:mb-4 break-inside-avoid rounded-xl overflow-hidden bg-[#E7EBF7] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
              >
                {/* Photo at its natural aspect ratio — no cropping */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto block pointer-events-none select-none"
                  draggable={false}
                  loading="lazy"
                />

                {/* Dark gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Text chip on hover */}
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
                  <span className="inline-flex px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold font-mono mb-1">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-xs sm:text-sm font-display font-extrabold text-white leading-tight">
                    {item.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <motion.div
              className="relative mx-4 max-w-[95vw] sm:max-w-3xl rounded-[24px] bg-white shadow-[12px_12px_0_#0F172A] border-2 border-[#0F172A] p-4 sm:p-6"
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label={pageText.close}
                className="absolute top-4 right-4 z-10 grid place-items-center w-11 h-11 rounded-xl border-2 border-[#0F172A] bg-white text-[#1B2A63] hover:bg-[#E7EBF7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {shuffledItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex(
                        (prev) =>
                          (prev - 1 + shuffledItems.length) % shuffledItems.length
                      )
                    }
                    aria-label={pageText.previous}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-xl border-2 border-[#0F172A] bg-white text-[#1B2A63] hover:bg-[#E7EBF7] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((prev) => (prev + 1) % shuffledItems.length)
                    }
                    aria-label={pageText.next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-xl border-2 border-[#0F172A] bg-white text-[#1B2A63] hover:bg-[#E7EBF7] transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="flex items-center justify-center w-full">
                <img
                  src={currentItem.src}
                  alt={currentItem.title}
                  className="max-h-[70vh] max-w-full w-auto h-auto object-contain rounded-2xl border-2 border-[#1B2A63] pointer-events-none select-none"
                  draggable={false}
                />
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#64748B]">
                  <Images className="w-4 h-4" />
                  <span className="px-2 py-1 rounded-full border border-[#CBD5F5] bg-[#EEF2FF] text-[#1B2A63]">
                    {currentItem.categoryLabel}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F172A]">
                  {currentItem.title}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[#475569] max-w-3xl">
                  {currentItem.blurb}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;