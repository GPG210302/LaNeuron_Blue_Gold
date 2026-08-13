import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Handshake } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import HoverLift from "@/animations/HoverLift";

const content = {
  en: {
    badge: "For Schools & Colleges",
    heroTitle: "Bring Meaningful STEAM Learning to Your Students",
    heroText: "La Neuron partners with schools and colleges to deliver impactful, hands-on and curriculum-relevant STEAM experiences—designed around your learners, timetable and wider educational goals.",
    heroButton: "Enquire about collaboration",
    jump: "Jump to section", approachJump: "Our approach", agesJump: "Age groups", themesJump: "Workshop themes", optionsJump: "Collaboration options",
    approachOverline: "A flexible partnership", approachTitle: "Built Around Your Learners", approachSub: "Choose a one-off enrichment workshop, a themed series, a STEAM day, or a programme designed around your institution’s learning priorities.",
    startTitle: "Every group starts at the right level.", startText: "Our workshops are not a fixed sequence that pupils must begin at a particular age. Students can join directly in their current age group, with no prior STEAM experience required. Every session introduces the relevant concepts and tools, and no hands-on experiment or project is repeated.",
    benefits: ["Fresh, age-appropriate projects", "Curriculum-relevant themes", "Flexible delivery formats", "Inclusive, hands-on learning"],
    agesOverline: "Age-responsive learning", agesTitle: "Three Independent Entry Points", agesSub: "Each workshop begins at an accessible level for its age group. The challenge, materials, language and expected outcomes are carefully adapted—so every learner can take part with confidence.", examples: "Example workshops",
    ageGroups: [
      { age: "AGES 6–9", title: "Explore & Create", text: "Children learn through stories, observation, building, play and short experiments. The focus is curiosity, confidence, collaboration and simple cause-and-effect thinking.", examples: ["Paper bridge challenge", "Balloon-powered cars", "Mini weather station"] },
      { age: "AGES 10–13", title: "Investigate & Invent", text: "Learners test ideas, compare results, record observations and improve their designs. They build independence while connecting science, technology and creativity.", examples: ["Earthquake-safe tower", "Scratch game design", "Fingerprint analysis"] },
      { age: "AGES 14+", title: "Apply & Solve", text: "Young people tackle relevant, open-ended challenges through research, collaboration, practical problem-solving and clear presentation of their ideas.", examples: ["Sustainable city design", "Arduino starter project", "Assistive technology challenge"] },
    ],
    themesOverline: "Practical STEAM", themesTitle: "Established Themes, Made Doable", themesSub: "We use familiar materials and accessible technology so every workshop is engaging, practical to run and memorable for students.",
    themes: [
      { label: "01 · ENGINEERING", title: "Design, Build, Test", text: "Bridge-building, towers, balloon vehicles and earthquake-safe structures invite students to use materials thoughtfully, test what works and improve a prototype." },
      { label: "02 · SCIENCE & ENVIRONMENT", title: "Observe, Ask, Discover", text: "Weather investigations, fingerprint analysis, water-filter models, renewable-energy ideas and sustainable-city challenges connect science to the world around us." },
      { label: "03 · ACCESSIBLE TECHNOLOGY", title: "Code, Build, Control", text: "Robots, simple circuits, Scratch games and approachable Arduino projects give students a practical, enjoyable introduction to technology and computational thinking." },
    ],
    optionsOverline: "Collaboration options", optionsTitle: "Designed to Fit Your Setting", waysTitle: "Ways we can work together", gainsTitle: "What students gain",
    ways: ["After-school STEAM club", "One-off STEAM workshop or event", "Short multi-session project series", "Curriculum-linked workshop design", "Project-based STEAM module", "Research mentoring or competition support", "Cognitive support sessions"],
    gains: ["Scientific curiosity and critical thinking", "Practical investigation and problem-solving skills", "Creativity, teamwork and communication", "Meaningful project outcomes students can explain", "Connections between learning and real life", "Exposure to future-facing STEAM pathways"],
    valueLead: "A premium educational experience, planned responsibly.", valueText: "We provide high-quality, impact-focused sessions tailored to your group size, learning goals and delivery format. Pricing is customised to each collaboration so that institutions receive a clear, appropriate proposal; multi-session partnerships and eligible school programmes may benefit from preferential rates or available discounts.",
    processOverline: "Simple to arrange", processTitle: "From Enquiry to Impact", processSub: "Tell us what your students need, and we will help shape a practical, high-value collaboration.",
    process: [{ number: "01", title: "Submit your enquiry", text: "Complete our School & College Collaboration form with your institution, age group, timeline and learning priorities." }, { number: "02", title: "Receive a tailored proposal", text: "We discuss your needs and recommend an appropriate format, workshop theme and customised price." }, { number: "03", title: "Deliver meaningful learning", text: "We coordinate the session and bring an engaging, well-prepared STEAM experience to your learners." }],
    ctaTitle: "Ready to Collaborate?", ctaText: "Use our dedicated enquiry form to share your needs. We will respond with suitable options for an impactful STEAM programme at your school or college.", ctaButton: "Open collaboration enquiry form",
  },
  pl: {
    badge: "Dla szkół i uczelni",
    heroTitle: "Wartościowe zajęcia STEAM dla Twoich uczniów",
    heroText: "La Neuron współpracuje ze szkołami i uczelniami, prowadząc angażujące, praktyczne zajęcia STEAM powiązane z programem nauczania. Każdy program dopasowujemy do potrzeb uczniów, planu lekcji i celów edukacyjnych placówki.",
    heroButton: "Zapytaj o współpracę",
    jump: "Przejdź do sekcji", approachJump: "Nasze podejście", agesJump: "Grupy wiekowe", themesJump: "Tematy warsztatów", optionsJump: "Formy współpracy",
    approachOverline: "Elastyczna współpraca", approachTitle: "Dopasowane do potrzeb Twoich uczniów", approachSub: "Możesz wybrać pojedynczy warsztat, cykl zajęć, dzień STEAM lub program przygotowany zgodnie z priorytetami edukacyjnymi Twojej placówki.",
    startTitle: "Każda grupa zaczyna na odpowiednim poziomie.", startText: "Nasze warsztaty nie wymagają wcześniejszego udziału ani zaczynania od najmłodszej grupy. Uczniowie mogą dołączyć w swoim wieku, bez wcześniejszego doświadczenia ze STEAM. Na każdych zajęciach poznają potrzebne pojęcia i narzędzia, a żaden eksperyment ani projekt praktyczny nie jest powtarzany.",
    benefits: ["Nowe projekty dopasowane do wieku", "Tematy związane z programem nauczania", "Elastyczne formy zajęć", "Praktyczna i dostępna nauka dla każdego"],
    agesOverline: "Nauka dopasowana do wieku", agesTitle: "Trzy poziomy dopasowane do wieku", agesSub: "Każdy warsztat zaczyna się od poziomu odpowiedniego dla danej grupy. Stopień trudności, materiały, język i oczekiwane efekty są starannie dopasowane, aby każdy uczeń mógł pracować z pewnością siebie.", examples: "Przykładowe warsztaty",
    ageGroups: [
      { age: "WIEK 6–9 LAT", title: "Odkrywaj i twórz", text: "Dzieci uczą się przez opowieści, obserwację, budowanie, zabawę i krótkie eksperymenty. Rozwijają ciekawość, pewność siebie, współpracę i rozumienie prostych zależności przyczynowo-skutkowych.", examples: ["Wyzwanie: papierowy most", "Samochody napędzane balonem", "Mała stacja pogodowa"] },
      { age: "WIEK 10–13 LAT", title: "Badaj i wynajduj", text: "Uczniowie testują pomysły, porównują wyniki, zapisują obserwacje i ulepszają swoje projekty. Rozwijają samodzielność, łącząc naukę, technologię i kreatywność.", examples: ["Wieża odporna na trzęsienia ziemi", "Projektowanie gry w Scratch", "Analiza odcisków palców"] },
      { age: "WIEK 14+", title: "Stosuj wiedzę i rozwiązuj problemy", text: "Młodzież pracuje nad otwartymi, praktycznymi wyzwaniami poprzez badania, współpracę, szukanie rozwiązań i jasne przedstawianie własnych pomysłów.", examples: ["Projekt zrównoważonego miasta", "Pierwszy projekt z Arduino", "Technologie wspierające osoby z potrzebami"] },
    ],
    themesOverline: "STEAM w praktyce", themesTitle: "Sprawdzone tematy STEAM w praktycznym wydaniu", themesSub: "Korzystamy ze znanych materiałów i przystępnej technologii, dzięki czemu każdy warsztat jest ciekawy dla uczniów i łatwy do zorganizowania w placówce.",
    themes: [
      { label: "01 · INŻYNIERIA", title: "Projektuj, buduj, testuj", text: "Mosty, wieże, pojazdy napędzane balonem i konstrukcje odporne na wstrząsy uczą rozsądnego korzystania z materiałów, testowania pomysłów i ulepszania prototypów." },
      { label: "02 · NAUKA I ŚRODOWISKO", title: "Obserwuj, pytaj, odkrywaj", text: "Badanie pogody, analiza odcisków palców, modele filtrów do wody, energia odnawialna i wyzwania związane ze zrównoważonym miastem łączą naukę z codziennym światem." },
      { label: "03 · PRZYSTĘPNA TECHNOLOGIA", title: "Programuj, buduj, steruj", text: "Roboty, proste obwody elektryczne, gry w Scratch i łatwe projekty z Arduino wprowadzają uczniów w świat technologii i logicznego myślenia." },
    ],
    optionsOverline: "Formy współpracy", optionsTitle: "Współpraca dopasowana do Twojej placówki", waysTitle: "Jak możemy współpracować", gainsTitle: "Co zyskują uczniowie",
    ways: ["Pozalekcyjny klub STEAM", "Jednorazowy warsztat lub wydarzenie STEAM", "Krótki cykl zajęć projektowych", "Warsztaty powiązane z programem nauczania", "Moduł STEAM oparty na projekcie", "Wsparcie w przygotowaniu badań lub konkursów", "Sesje wspierające rozwój poznawczy"],
    gains: ["Ciekawość naukową i krytyczne myślenie", "Umiejętność praktycznego badania i rozwiązywania problemów", "Kreatywność, współpracę i komunikację", "Projekty, które potrafią wyjaśnić i zaprezentować", "Połączenie szkolnej wiedzy z codziennym życiem", "Kontakt z przyszłościowymi ścieżkami STEAM"],
    valueLead: "Wysokiej jakości zajęcia, zaplanowane odpowiedzialnie.", valueText: "Prowadzimy dopracowane, angażujące zajęcia dostosowane do liczebności grupy, celów edukacyjnych i wybranej formy współpracy. Cenę ustalamy indywidualnie, aby placówka otrzymała jasną propozycję dopasowaną do swoich potrzeb. Przy dłuższej współpracy i wybranych programach szkolnych mogą być dostępne korzystniejsze warunki lub rabaty.",
    processOverline: "Prosto i wygodnie", processTitle: "Od zgłoszenia do wartościowych zajęć", processSub: "Opowiedz nam, czego potrzebują Twoi uczniowie, a przygotujemy praktyczną i wartościową propozycję współpracy.",
    process: [{ number: "01", title: "Wyślij zgłoszenie", text: "Wypełnij formularz współpracy dla szkół i uczelni, podając dane placówki, wiek uczniów, planowany termin i cele zajęć." }, { number: "02", title: "Otrzymaj ofertę dopasowaną do potrzeb", text: "Omówimy Twoje potrzeby i zaproponujemy odpowiednią formę zajęć, temat warsztatu oraz indywidualną wycenę." }, { number: "03", title: "Zrealizuj wartościowe zajęcia", text: "Ustalimy szczegóły organizacyjne i przeprowadzimy angażujące, dobrze przygotowane zajęcia STEAM dla Twoich uczniów." }],
    ctaTitle: "Gotowi na współpracę?", ctaText: "Wypełnij formularz i opisz swoje potrzeby. Odpowiemy z propozycją wartościowego programu STEAM dla Twojej szkoły lub uczelni.", ctaButton: "Otwórz formularz współpracy",
  },
};

const Pill = ({ href, children }) => <a href={href} className="inline-flex items-center justify-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-sm font-mono font-bold text-[#1B2A63] transition hover:-translate-y-0.5 hover:bg-[#FBE49A]">{children}</a>;
const LiftCard = ({ children, delay = 0, className = "" }) => (
  <Reveal delay={delay}>
    <HoverLift className="h-full" lift={7} scale={1.015}>
      <div
        className={`ln-card h-full overflow-hidden transition-all duration-300 hover:-rotate-[0.35deg] hover:border-[#1B2A63] hover:shadow-[10px_10px_0_#1B2A63] ${className}`}
      >
        {children}
      </div>
    </HoverLift>
  </Reveal>
);
const ageCardStyles = [
  "bg-[#ECFDF5] hover:bg-[#D1FAE5]",
  "bg-[#EFF6FF] hover:bg-[#DBEAFE]",
  "bg-[#FAF5FF] hover:bg-[#F3E8FF]",
];

const themeCardStyles = [
  "bg-[#FFF7ED] hover:bg-[#FFEDD5]",
  "bg-[#F0FDFA] hover:bg-[#CCFBF1]",
  "bg-[#FFFBEB] hover:bg-[#FEF3C7]",
];
const PointList = ({
  items,
  className = "",
  showMarker = true,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <motion.li
          key={item}
          initial={
            reduceMotion
              ? false
              : { opacity: 0, x: -14, y: 6 }
          }
          whileInView={
            reduceMotion
              ? undefined
              : { opacity: 1, x: 0, y: 0 }
          }
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.38,
            delay: index * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex gap-3"
        >
          {showMarker && (
            <span className="text-[#D4A514]">✦</span>
          )}

          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
};

const SchoolCollegeCollaboration = () => {
  const { language } = useLanguage();
  const t = content[language === "pl" ? "pl" : "en"];
  const reduceMotion = useReducedMotion();
  const heroMotion = reduceMotion ? {} : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } };

  return <main className="ln-grid-bg min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-28"><div className="max-w-6xl mx-auto px-6 lg:px-8">
    <motion.div {...heroMotion} className="max-w-3xl"><span className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#1B2A63]">{t.badge}</span><h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] text-[#0F172A]">{t.heroTitle}</h1><p className="mt-5 text-base sm:text-lg leading-relaxed text-[#475569]">{t.heroText}</p><div className="mt-7"> <Link to="/register?programme=collaboration" className="ln-btn ln-btn-enquire ln-btn-no-glow inline-flex items-center gap-2 !px-5 !py-3 !text-sm font-mono tracking-wide" > {t.ctaButton} <ArrowUpRight size={18} /> </Link></div></motion.div>
    <Reveal delay={0.08}><nav aria-label={t.jump} className="mt-8 ln-card p-4 sm:p-5"><div className="flex flex-wrap items-center gap-3"><span className="text-sm font-mono font-bold text-[#1B2A63]">{t.jump}</span><Pill href="#approach">{t.approachJump}</Pill><Pill href="#age-groups">{t.agesJump}</Pill><Pill href="#themes">{t.themesJump}</Pill><Pill href="#collaboration">{t.optionsJump}</Pill></div></nav></Reveal>
    <section id="approach" className="scroll-mt-32 pt-16"><Reveal><SectionHeading overline={t.approachOverline} title={t.approachTitle} sub={t.approachSub} /></Reveal><LiftCard delay={0.06} className="mt-12"><article className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"><div><h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight text-[#FBBF24]">{t.startTitle}</h2><p className="mt-4 leading-relaxed text-[#475569]">{t.startText}</p></div><PointList items={t.benefits} className="space-y-3 text-sm font-semibold leading-relaxed text-[#334155]"/></article></LiftCard></section>
    <section id="age-groups" className="scroll-mt-32 pt-20"><Reveal><SectionHeading overline={t.agesOverline} title={t.agesTitle} sub={t.agesSub} /></Reveal><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{t.ageGroups.map((group, i) => <LiftCard key={group.age} delay={i * 0.05} className={ageCardStyles[i]}><article className="h-full flex flex-col p-6 sm:p-7"><p className="text-xs font-mono font-bold tracking-[0.16em] text-[#1B2A63]">{group.age}</p><h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{group.title}</h2><p className="mt-3 leading-relaxed text-[#475569]">{group.text}</p><div className="mt-auto pt-7"><p className="text-xs font-mono font-bold tracking-[0.12em] text-[#D4A514]">{t.examples}</p><PointList items={group.examples} showMarker={false} className="mt-3 space-y-1.5 text-sm font-semibold text-[#334155]"/></div></article></LiftCard>)}</div></section>
    <section id="themes" className="scroll-mt-32 pt-20">
      <Reveal>
        <SectionHeading
          overline={t.themesOverline}
          title={t.themesTitle}
          sub={t.themesSub}
        />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {t.themes.map((theme, index) => {
            const railStyles = [
              {
                number: "text-[#D65D16]",
                heading: "text-[#D65D16]",
                hover: "hover:bg-[#FFF1E7]",
                bar: "bg-[#F97316]",
              },
              {
                number: "text-[#0F8A78]",
                heading: "text-[#0F8A78]",
                hover: "hover:bg-[#E7FAF6]",
                bar: "bg-[#14B8A6]",
              },
              {
                number: "text-[#A76E00]",
                heading: "text-[#A76E00]",
                hover: "hover:bg-[#FFF8DE]",
                bar: "bg-[#EAB308]",
              },
            ];

            const style = railStyles[index];

            return (
              <motion.article
                key={theme.label}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 22 }
                }
                whileInView={
                  reduceMotion
                    ? undefined
                    : { opacity: 1, y: 0 }
                }
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -4 }
                }
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.42,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group relative min-h-[290px] overflow-hidden rounded-[22px] bg-white/75 px-6 py-8 shadow-[8px_8px_18px_rgba(148,163,184,0.18),-5px_-5px_14px_rgba(255,255,255,0.95)] transition-[background-color,box-shadow] duration-300 sm:px-8 lg:px-9 lg:py-10 hover:shadow-[11px_11px_22px_rgba(148,163,184,0.24),-6px_-6px_16px_rgba(255,255,255,0.98)] ${style.hover}`}
              >
                <p
                  className={`font-mono text-base font-bold tracking-[0.16em] ${style.number}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p className="mt-5 text-xs font-mono font-bold tracking-[0.14em] text-[#475569]">
                  {theme.label.replace(/^\d+\s·\s/, "")}
                </p>

                <h3
                  className={`mt-3 font-display text-3xl font-extrabold leading-[0.98] tracking-tight ${style.heading}`}
                >
                  {theme.title}
                </h3>

                <p className="mt-5 max-w-sm leading-relaxed text-[#475569]">
                  {theme.text}
                </p>

                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-6 right-6 h-1.5 origin-left scale-x-0 rounded-t-full transition-transform duration-300 group-hover:scale-x-100 sm:left-8 sm:right-8 lg:left-9 lg:right-9 ${style.bar}`}
                />
              </motion.article>
            );
          })}
      </div>
    </section>
        <section id="collaboration" className="scroll-mt-32 pt-20"><Reveal><SectionHeading overline={t.optionsOverline} title={t.optionsTitle} /></Reveal><div className="mt-12 grid gap-6 md:grid-cols-2"><LiftCard><article className="relative z-10 h-full p-6 sm:p-7"><h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{t.waysTitle}</h2><PointList items={t.ways} className="mt-5 space-y-3 text-[#475569]"/></article></LiftCard><LiftCard delay={0.05}><article className="relative z-10 h-full p-6 sm:p-7"><h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{t.gainsTitle}</h2><PointList items={t.gains} className="mt-5 space-y-3 text-[#475569]"/></article></LiftCard></div><Reveal delay={0.08}>
            <motion.article
                whileHover={
                reduceMotion ? undefined : { y: -4, scale: 1.01 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="mt-8 rounded-[24px] border-2 border-[#0F172A] bg-[#111A34] p-6 sm:p-8 shadow-[8px_8px_0_#E0B33C]"
            >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-[#0F172A] bg-[#FBBF24] text-[#0F172A] shadow-[3px_3px_0_#E0B33C]">
                    <Handshake size={23} strokeWidth={2.4} />
                </div>

                <div>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#FBBF24]">
                    {t.valueLead}
                    </h3>

                    <p className="mt-3 leading-relaxed text-[#F1F5FF]">
                    {t.valueText}
                    </p>
                </div>
                </div>
            </motion.article>
            </Reveal></section>
        <section className="pt-20"><Reveal><SectionHeading overline={t.processOverline} title={t.processTitle} sub={t.processSub} /></Reveal><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{t.process.map((step, i) => <LiftCard key={step.number} delay={i * 0.05}><article className="h-full p-6 sm:p-7"><p className="font-mono text-sm font-bold text-[#1B2A63]">{step.number}</p><h2 className="mt-3 font-display text-2xl font-extrabold text-[#0F172A]">{step.title}</h2><p className="mt-3 leading-relaxed text-[#475569]">{step.text}</p></article></LiftCard>)}</div></section>
        <section className="pt-20">
            <Reveal>
                <motion.article
                whileHover={
                    reduceMotion ? undefined : { y: -4, scale: 1.01 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="rounded-[24px] border-2 border-[#0F172A] bg-[#E7EBF7] p-7 text-center shadow-[8px_8px_0_#1B2A63] sm:p-10"
                >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border-2 border-[#0F172A] bg-[#1B2A63] text-[#FBBF24] shadow-[3px_3px_0_#0F172A]">
                    <Handshake size={23} strokeWidth={2.4} />
                </div>

                <h2 className="mt-5 font-display text-3xl sm:text-4xl font-extrabold leading-tight text-[#1B2A63]">
                    {t.ctaTitle}
                </h2>

                <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#334155]">
                    {t.ctaText}
                </p>

                <motion.div
                    whileHover={
                    reduceMotion ? undefined : { y: -3, scale: 1.02 }
                    }
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="mt-7 inline-flex"
                >
                    <Link
                    to="/register?programme=collaboration"
                    className="ln-btn ln-btn-enquire ln-btn-no-glow inline-flex items-center gap-2 !px-5 !py-3 !text-sm font-mono tracking-wide"
                    >
                    {t.ctaButton}
                    <ArrowUpRight size={18} />
                    </Link>
                </motion.div>
                </motion.article>
            </Reveal>
        </section>
  </div></main>;
};

export default SchoolCollegeCollaboration;