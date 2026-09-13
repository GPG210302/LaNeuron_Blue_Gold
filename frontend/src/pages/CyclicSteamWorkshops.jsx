import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, Atom, Award, Beaker, CalendarDays, Clock, Cog, Cpu,
  Leaf, Lightbulb, MapPin, Rocket, Sparkles, Users, Utensils,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";
import HoverLift from "@/animations/HoverLift";

const content = {
  en: {
    badge: "Weekly after-school · Ages 6–14",
    heroTitle: "Cyclic STEAM Workshops",
    strapline: "Hands-on learning. Independent thinking. Real-world science.",
    heroText:
      "A weekly after-school workshop for children who love to experiment, build, question and discover. Small groups, real materials, and the space to work things out for themselves.",
    heroButton: "Enquire about this workshop",
    jump: "Jump to section",
    jumpMix: "One session, many sciences",
    jumpMethod: "How we teach",
    jumpAges: "Age groups & schedule",
    jumpFacts: "Practical details",

    mixOverline: "Not one subject at a time",
    mixTitle: "One Session, Many Sciences",
    mixSub:
      "Children are not limited to chemistry one week and biology the next. A single workshop may pull together several fields at once — because real problems never arrive neatly labelled.",
    mixHint: "Select a field to see the kind of work it brings into a session",

    philosophyOverline: "How we teach",
    philosophyTitle: "We Don't Hand Out the Method",
    philosophySub:
      "The thinking is the lesson. If we give children the steps, they practise following instructions. If we give them a problem, they practise being scientists.",
    notTitle: "What we avoid",
    notItems: [
      "Ready-made procedures to copy line by line",
      "Worksheets where the answer is already implied",
      "Demonstrations children only watch",
      "Activities with exactly one acceptable result",
    ],
    doTitle: "What children actually do",
    doItems: [
      "Follow their own curiosity to a question worth answering",
      "Choose their own materials and approach",
      "Test, fail, adjust and test again",
      "Explain their reasoning in their own words",
    ],

    stagesOverline: "Inside 90 minutes",
    stagesTitle: "How a Session Unfolds",
    stagesSub:
      "Four stages, following the same scientific method used across every La Neuron workshop — compressed into a single afternoon.",
    stages: [
      { num: "01", title: "Predict", covers: "Hypothesis", text: "Before anything is touched, each child commits to what they think will happen — and why. Being wrong here is useful, not embarrassing." },
      { num: "02", title: "Prepare", covers: "Materials & methods", text: "Children work out what they need, how to use it safely, and how they will know whether their idea worked." },
      { num: "03", title: "Investigate", covers: "Investigation & observation", text: "Hands on the materials. They build, test, measure and record what actually happens — including the parts that surprise them." },
      { num: "04", title: "Make sense of it", covers: "Results & conclusion", text: "Children compare what happened with what they predicted, and explain the gap. This is where understanding is built." },
    ],
    stagesLink: "See the full six-step scientific method",
    flipHint: "Hover to read more",

    schoolOverline: "Alongside school",
    schoolTitle: "Support for Science and English",
    schoolText:
      "Practical experience makes classroom concepts concrete. Where a child needs it, we connect what they build and observe in the workshop back to what they are studying at school — in Science, and in the English they use to describe it.",
    schoolPoints: [
      "Classroom concepts met first-hand, not just read about",
      "Scientific vocabulary used in real context",
      "Confidence explaining ideas aloud in English",
      "Useful for international-school and bilingual families",
    ],

    freshOverline: "Across the year",
    freshTitle: "A Curriculum That Never Repeats",
    freshText:
      "Every module is planned to be age-appropriate, distinct and non-repetitive. A child who stays with us for a year meets new concepts, new materials and new challenges each term — never the same experiment twice.",
    freshPoints: [
      "No activity or project is repeated across the year",
      "Difficulty grows with the child, not with the calendar",
      "Children can join at their current age with no prior experience",
      "Each module introduces the concepts and tools it needs",
    ],

    agesOverline: "Two age groups",
    agesTitle: "Grouped by Age, Taught Accordingly",
    agesSub:
      "Children aged 6–10 and 11–14 work separately. The materials, challenge level, vocabulary and expected outcomes are matched to the group — so nobody is held back or left behind.",
    agesToggleHint: "Choose an age group",
    ageGroups: [
      {
        id: "junior",
        label: "Ages 6–10",
        title: "Explore & Build",
        text: "Sensory, hands-on investigation. Children observe closely, make simple predictions, build things that work, and learn that a failed attempt is information rather than defeat.",
        scheduleLabel: "Current schedule",
        scheduleValue: "Every Friday",
        scheduleTime: "90 minutes — starting 16:00 or 16:30, finishing by 18:00",
        scheduleNote: "This is our currently running slot. Places are limited to 10 children.",
        points: ["Guided observation and recording", "Building, testing and improving", "Simple cause-and-effect reasoning", "Confidence working in a small group"],
      },
      {
        id: "senior",
        label: "Ages 11–14",
        title: "Investigate & Solve",
        text: "Longer, more open-ended challenges. Older children design their own approach, handle variables deliberately, work with data, and defend their conclusions with evidence.",
        scheduleLabel: "Schedule",
        scheduleValue: "New dedicated slot opening",
        scheduleTime: "Day and time agreed directly with interested parents",
        scheduleNote: "We are forming this group now. Submit an enquiry and we will contact you to agree a day and time that works for the families joining.",
        points: ["Independent experimental design", "Working with variables and data", "Open-ended problem solving", "Explaining and defending conclusions"],
      },
    ],

    rewardOverline: "Recognition",
    rewardTitle: "Every Module Ends With Something Real",
    rewardText:
      "After each 12-week module, every child receives a certificate and an attractive prize recognising the work they have put in. Selected projects and models are chosen for the La Neuron Science & Innovation Day at the end of the year — where children present what they made to families and guests.",
    rewardItems: [
      { title: "Certificate", text: "Awarded at the close of every 12-week module." },
      { title: "An attractive prize", text: "Recognising effort, persistence and progress." },
      { title: "Science & Innovation Day", text: "Selected projects presented at our end-of-year showcase." },
    ],

    factsOverline: "Practical details",
    factsTitle: "The Essentials",
    facts: [
      { icon: Users, label: "Age groups", value: "6–10 and 11–14, taught separately" },
      { icon: CalendarDays, label: "Frequency", value: "Weekly — Fridays for ages 6–10" },
      { icon: Clock, label: "Session length", value: "90 minutes, between 16:00 and 18:00" },
      { icon: Sparkles, label: "Group size", value: "Maximum 10 children" },
      { icon: Award, label: "Module length", value: "12 continuous weeks" },
      { icon: Lightbulb, label: "Language", value: "English, with light Polish support" },
      { icon: MapPin, label: "Venue", value: "Jana i Jędrzeja Śniadeckich 3, 31-531 Kraków" },
      { icon: Beaker, label: "Fees", value: "On enquiry — we will explain the options" },
    ],

    ctaTitle: "Come and See What Your Child Makes of It",
    ctaText:
      "Places are limited to ten children per group. Send an enquiry and we will confirm availability, answer your questions, and agree a start date.",
    ctaButton: "Enquire about this workshop",
  },

  pl: {
    badge: "Zajęcia popołudniowe · Wiek 6–14 lat",
    heroTitle: "Cykliczne warsztaty STEAM",
    strapline: "Nauka przez działanie. Samodzielne myślenie. Prawdziwa nauka.",
    heroText:
      "Cotygodniowe zajęcia popołudniowe dla dzieci, które lubią eksperymentować, budować, pytać i odkrywać. Małe grupy, prawdziwe materiały i przestrzeń, by dojść do rozwiązania samodzielnie.",
    heroButton: "Zapytaj o te zajęcia",
    jump: "Przejdź do sekcji",
    jumpMix: "Wiele dziedzin naraz",
    jumpMethod: "Jak uczymy",
    jumpAges: "Grupy wiekowe i terminy",
    jumpFacts: "Informacje praktyczne",

    mixOverline: "Nie jeden przedmiot naraz",
    mixTitle: "Jedne zajęcia, wiele dziedzin nauki",
    mixSub:
      "Dzieci nie poznają chemii w jednym tygodniu, a biologii w kolejnym. Pojedyncze zajęcia mogą łączyć kilka dziedzin naraz — bo prawdziwe problemy nigdy nie są przypisane do jednego przedmiotu.",
    mixHint: "Wybierz dziedzinę, aby zobaczyć, co wnosi do zajęć",

    philosophyOverline: "Jak uczymy",
    philosophyTitle: "Nie podajemy gotowej instrukcji",
    philosophySub:
      "To myślenie jest lekcją. Gdy podamy dziecku kolejne kroki, ćwiczy wykonywanie poleceń. Gdy damy mu problem, ćwiczy bycie naukowcem.",
    notTitle: "Czego unikamy",
    notItems: [
      "Gotowych procedur do przepisania krok po kroku",
      "Kart pracy, w których odpowiedź jest z góry znana",
      "Pokazów, które dzieci tylko obserwują",
      "Zadań z jednym słusznym wynikiem",
    ],
    doTitle: "Co dzieci naprawdę robią",
    doItems: [
      "Podążają za własną ciekawością i szukają pytania, na które warto odpowiedzieć",
      "Same wybierają materiały i sposób działania",
      "Testują, popełniają błędy, poprawiają i próbują ponownie",
      "Wyjaśniają swój tok rozumowania własnymi słowami",
    ],

    stagesOverline: "W ciągu 90 minut",
    stagesTitle: "Jak przebiegają zajęcia",
    stagesSub:
      "Cztery etapy oparte na tej samej metodzie naukowej, którą stosujemy na wszystkich zajęciach La Neuron — zamknięte w jednym popołudniu.",
    stages: [
      { num: "01", title: "Przewiduj", covers: "Hipoteza", text: "Zanim dziecko czegokolwiek dotknie, zapisuje, co jego zdaniem się wydarzy i dlaczego. Błędne przewidywanie jest tu cenną informacją, a nie powodem do wstydu." },
      { num: "02", title: "Przygotuj", covers: "Materiały i metody", text: "Dzieci ustalają, czego potrzebują, jak bezpiecznie tego użyć i po czym poznają, że ich pomysł zadziałał." },
      { num: "03", title: "Badaj", covers: "Doświadczenie i obserwacja", text: "Praca z materiałami. Dzieci budują, testują, mierzą i zapisują, co faktycznie się dzieje — łącznie z tym, co je zaskoczy." },
      { num: "04", title: "Wyciągnij wnioski", covers: "Wyniki i wnioski", text: "Dzieci porównują wynik z własnym przewidywaniem i wyjaśniają różnicę. Właśnie tu buduje się zrozumienie." },
    ],
    stagesLink: "Zobacz pełną, sześciostopniową metodę naukową",
    flipHint: "Najedź, aby przeczytać",

    schoolOverline: "Wsparcie szkolne",
    schoolTitle: "Pomoc w nauce przedmiotów ścisłych i angielskiego",
    schoolText:
      "Praktyka sprawia, że szkolne pojęcia stają się zrozumiałe. Tam, gdzie dziecko tego potrzebuje, łączymy to, co buduje i obserwuje na zajęciach, z materiałem szkolnym — zarówno z przedmiotów przyrodniczych, jak i z językiem angielskim, w którym o tym opowiada.",
    schoolPoints: [
      "Szkolne pojęcia poznane w praktyce, nie tylko z podręcznika",
      "Słownictwo naukowe używane w realnym kontekście",
      "Pewność w tłumaczeniu swoich pomysłów po angielsku",
      "Przydatne dla rodzin dwujęzycznych i uczniów szkół międzynarodowych",
    ],

    freshOverline: "W skali roku",
    freshTitle: "Program, który się nie powtarza",
    freshText:
      "Każdy moduł jest zaplanowany tak, aby był dopasowany do wieku, odrębny i nie powielał wcześniejszych zajęć. Dziecko, które zostaje z nami na cały rok, w każdym semestrze poznaje nowe zagadnienia, materiały i wyzwania — żaden eksperyment nie powtarza się dwa razy.",
    freshPoints: [
      "Żadne doświadczenie ani projekt nie powtarza się w ciągu roku",
      "Poziom trudności rośnie wraz z dzieckiem",
      "Można dołączyć w swoim wieku, bez wcześniejszego doświadczenia",
      "Każdy moduł wprowadza potrzebne pojęcia i narzędzia",
    ],

    agesOverline: "Dwie grupy wiekowe",
    agesTitle: "Podział na grupy wiekowe",
    agesSub:
      "Dzieci w wieku 6–10 i 11–14 lat pracują osobno. Materiały, poziom trudności, słownictwo i oczekiwane efekty są dopasowane do grupy — nikt się nie nudzi ani nie zostaje w tyle.",
    agesToggleHint: "Wybierz grupę wiekową",
    ageGroups: [
      {
        id: "junior",
        label: "Wiek 6–10 lat",
        title: "Odkrywaj i buduj",
        text: "Praktyczne, angażujące zmysły doświadczenia. Dzieci uważnie obserwują, formułują proste przewidywania, budują działające konstrukcje i uczą się, że nieudana próba to informacja, a nie porażka.",
        scheduleLabel: "Aktualny termin",
        scheduleValue: "W każdy piątek",
        scheduleTime: "90 minut — początek o 16:00 lub 16:30, zakończenie do 18:00",
        scheduleNote: "To nasz aktualnie prowadzony termin. Liczba miejsc ograniczona do 10 dzieci.",
        points: ["Obserwacja i zapisywanie wyników pod okiem prowadzącej", "Budowanie, testowanie i ulepszanie", "Proste myślenie przyczynowo-skutkowe", "Pewność w pracy w małej grupie"],
      },
      {
        id: "senior",
        label: "Wiek 11–14 lat",
        title: "Badaj i rozwiązuj",
        text: "Dłuższe zadania o otwartym charakterze. Starsze dzieci samodzielnie planują sposób działania, świadomie pracują ze zmiennymi, analizują dane i uzasadniają swoje wnioski.",
        scheduleLabel: "Termin",
        scheduleValue: "Otwieramy nowy, dedykowany termin",
        scheduleTime: "Dzień i godzina ustalane bezpośrednio z zainteresowanymi rodzicami",
        scheduleNote: "Właśnie tworzymy tę grupę. Wyślij zgłoszenie, a skontaktujemy się, aby ustalić termin dogodny dla rodzin, które dołączą.",
        points: ["Samodzielne planowanie doświadczeń", "Praca ze zmiennymi i danymi", "Rozwiązywanie otwartych problemów", "Wyjaśnianie i uzasadnianie wniosków"],
      },
    ],

    rewardOverline: "Docenienie pracy",
    rewardTitle: "Każdy moduł kończy się czymś konkretnym",
    rewardText:
      "Po każdym 12-tygodniowym module każde dziecko otrzymuje dyplom oraz atrakcyjną nagrodę doceniającą włożoną pracę. Wybrane projekty i modele prezentowane są podczas Dnia Nauki i Innowacji La Neuron na koniec roku, gdzie dzieci pokazują swoje prace rodzinom i gościom.",
    rewardItems: [
      { title: "Dyplom", text: "Wręczany na zakończenie każdego 12-tygodniowego modułu." },
      { title: "Atrakcyjna nagroda", text: "Doceniająca zaangażowanie, wytrwałość i postępy." },
      { title: "Dzień Nauki i Innowacji", text: "Wybrane projekty prezentowane podczas naszego pokazu na koniec roku." },
    ],

    factsOverline: "Informacje praktyczne",
    factsTitle: "Najważniejsze informacje",
    facts: [
      { icon: Users, label: "Grupy wiekowe", value: "6–10 i 11–14 lat, zajęcia osobno" },
      { icon: CalendarDays, label: "Częstotliwość", value: "Co tydzień — piątki dla grupy 6–10 lat" },
      { icon: Clock, label: "Czas trwania", value: "90 minut, między 16:00 a 18:00" },
      { icon: Sparkles, label: "Liczebność grupy", value: "Maksymalnie 10 dzieci" },
      { icon: Award, label: "Długość modułu", value: "12 kolejnych tygodni" },
      { icon: Lightbulb, label: "Język", value: "Angielski, ze wsparciem po polsku" },
      { icon: MapPin, label: "Miejsce", value: "Jana i Jędrzeja Śniadeckich 3, 31-531 Kraków" },
      { icon: Beaker, label: "Opłaty", value: "Ustalane indywidualnie — zapytaj nas" },
    ],

    ctaTitle: "Zobacz, co Twoje dziecko z tego zbuduje",
    ctaText:
      "Liczba miejsc ograniczona do dziesięciorga dzieci w grupie. Wyślij zgłoszenie, a potwierdzimy dostępność, odpowiemy na pytania i ustalimy termin rozpoczęcia.",
    ctaButton: "Zapytaj o te zajęcia",
  },
};

const disciplines = {
  en: [
    { id: "physics", icon: Atom, label: "Physics", color: "#1B2A63", tint: "#E7EBF7", example: "Balloon-powered vehicles, balancing structures, and working out why one design travels further than another." },
    { id: "chemistry", icon: Beaker, label: "Chemistry", color: "#0F8A78", tint: "#E7FAF6", example: "Colour-changing reactions, fizzing mixtures, and testing what happens when one ingredient is changed." },
    { id: "biology", icon: Leaf, label: "Biology", color: "#15803D", tint: "#ECFDF5", example: "Examining leaves, seeds and specimens under the microscope, and recording what can actually be seen." },
    { id: "engineering", icon: Cog, label: "Engineering", color: "#D65D16", tint: "#FFF1E7", example: "Bridges, towers and machines that must hold weight, move, or survive a test the children design themselves." },
    { id: "technology", icon: Cpu, label: "Technology", color: "#7C3AED", tint: "#F5EEFF", example: "Simple circuits, sensors and approachable coding — using tools to solve a problem rather than for their own sake." },
    { id: "food", icon: Utensils, label: "Food science", color: "#BE185D", tint: "#FFF1F6", example: "What happens inside the food we eat — testing, tasting and explaining the chemistry on the kitchen table." },
    { id: "planetary", icon: Rocket, label: "Planetary science", color: "#A76E00", tint: "#FFF8DE", example: "Craters, orbits and rockets — modelling how planets and spacecraft behave using everyday materials." },
  ],
  pl: [
    { id: "physics", icon: Atom, label: "Fizyka", color: "#1B2A63", tint: "#E7EBF7", example: "Pojazdy napędzane balonem, konstrukcje równoważne i szukanie odpowiedzi, dlaczego jeden projekt jedzie dalej niż inny." },
    { id: "chemistry", icon: Beaker, label: "Chemia", color: "#0F8A78", tint: "#E7FAF6", example: "Reakcje zmieniające kolor, musujące mieszaniny i sprawdzanie, co się stanie po zmianie jednego składnika." },
    { id: "biology", icon: Leaf, label: "Biologia", color: "#15803D", tint: "#ECFDF5", example: "Oglądanie liści, nasion i próbek pod mikroskopem oraz zapisywanie tego, co faktycznie widać." },
    { id: "engineering", icon: Cog, label: "Inżynieria", color: "#D65D16", tint: "#FFF1E7", example: "Mosty, wieże i maszyny, które muszą utrzymać ciężar, poruszyć się lub przejść test wymyślony przez dzieci." },
    { id: "technology", icon: Cpu, label: "Technologia", color: "#7C3AED", tint: "#F5EEFF", example: "Proste obwody, czujniki i przystępne programowanie — narzędzia służą rozwiązaniu problemu, a nie same sobie." },
    { id: "food", icon: Utensils, label: "Nauka o żywności", color: "#BE185D", tint: "#FFF1F6", example: "Co dzieje się w jedzeniu, które spożywamy — badanie, próbowanie i wyjaśnianie chemii na kuchennym stole." },
    { id: "planetary", icon: Rocket, label: "Planetologia", color: "#A76E00", tint: "#FFF8DE", example: "Kratery, orbity i rakiety — modelowanie zachowania planet i statków kosmicznych z użyciem codziennych materiałów." },
  ],
};

const Pill = ({ href, children }) => (
  <a
    href={href}
    className="inline-flex items-center justify-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-sm font-mono font-bold text-[#1B2A63] transition hover:-translate-y-0.5 hover:bg-[#FBE49A]"
  >
    {children}
  </a>
);

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

const PointList = ({ items, className = "", marker = "✦" }) => {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <motion.li
          key={item}
          initial={reduceMotion ? false : { opacity: 0, x: -14, y: 6 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.38, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-3"
        >
          <span className="text-[#D4A514]">{marker}</span>
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
};

const CyclicSteamWorkshops = () => {
  const { language } = useLanguage();
  const isPolish = language === "pl";
  const t = content[isPolish ? "pl" : "en"];
  const fields = disciplines[isPolish ? "pl" : "en"];

  const [activeField, setActiveField] = useState(fields[0].id);
  const [activeAge, setActiveAge] = useState("junior");
  const [flippedStage, setFlippedStage] = useState(null);

  const reduceMotion = useReducedMotion();
  const heroMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      };

  const field = fields.find((item) => item.id === activeField) || fields[0];
  const FieldIcon = field.icon;
  const age = t.ageGroups.find((item) => item.id === activeAge) || t.ageGroups[0];

  return (
    <main className="ln-grid-bg min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* ── Hero ── */}
        <motion.div {...heroMotion} className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#1B2A63]">
            {t.badge}
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] text-[#0F172A]">
            {t.heroTitle}
          </h1>
          <p className="mt-5 font-display text-lg sm:text-xl font-extrabold text-[#D4A514]">
            {t.strapline}
          </p>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#475569]">
            {t.heroText}
          </p>
          <div className="mt-7">
            <Link
              to="/register?programme=cyclic"
              className="ln-btn ln-btn-enquire ln-btn-no-glow inline-flex items-center gap-2 !px-5 !py-3 !text-sm font-mono tracking-wide"
              data-testid="cyclic-hero-cta"
            >
              {t.heroButton} <ArrowUpRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* ── Jump nav ── */}
        <Reveal delay={0.08}>
          <nav aria-label={t.jump} className="mt-8 ln-card p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-mono font-bold text-[#1B2A63]">{t.jump}</span>
              <Pill href="#mix">{t.jumpMix}</Pill>
              <Pill href="#method">{t.jumpMethod}</Pill>
              <Pill href="#ages">{t.jumpAges}</Pill>
              <Pill href="#facts">{t.jumpFacts}</Pill>
            </div>
          </nav>
        </Reveal>

        {/* ── One session, many sciences ── */}
        <section id="mix" className="scroll-mt-32 pt-16">
          <Reveal>
            <SectionHeading
              overline={t.mixOverline}
              title={t.mixTitle}
              sub={t.mixSub}
              center={false}
            />
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#475569]">
              {t.mixHint}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {fields.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeField;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveField(item.id)}
                    className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      borderColor: item.color,
                      background: isActive ? item.color : item.tint,
                      color: isActive ? "#FFFFFF" : item.color,
                      boxShadow: isActive ? `4px 4px 0 ${item.color}33` : "none",
                    }}
                    data-testid={`cyclic-field-${item.id}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div
              className="mt-7 overflow-hidden rounded-[24px] border-2 border-[#0F172A] p-7 sm:p-9 transition-colors duration-500"
              style={{ background: field.tint, boxShadow: `8px 8px 0 ${field.color}` }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={field.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-5 sm:flex-row sm:items-start"
                >
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-[#0F172A] bg-white"
                    style={{ color: field.color }}
                  >
                    <FieldIcon className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold" style={{ color: field.color }}>
                      {field.label}
                    </h3>
                    <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-[#334155]">
                      {field.example}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </section>

        {/* ── We don't hand out the method ── */}
        <section id="method" className="scroll-mt-32 pt-20">
          <Reveal>
            <SectionHeading
              overline={t.philosophyOverline}
              title={t.philosophyTitle}
              sub={t.philosophySub}
              center={false}
            />
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal delay={0.05}>
              <div className="h-full rounded-[24px] border-2 border-[#0F172A] bg-white p-7 sm:p-8">
                <p className="ln-overline">{t.notTitle}</p>
                <PointList
                  items={t.notItems}
                  marker="✕"
                  className="mt-5 space-y-3 text-[#475569] leading-relaxed"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-[24px] border-2 border-[#0F172A] bg-[#111A34] p-7 sm:p-8 shadow-[8px_8px_0_#E0B33C]">
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#FBBF24]">
                  {t.doTitle}
                </p>
                <PointList
                  items={t.doItems}
                  className="mt-5 space-y-3 leading-relaxed text-[#F1F5FF]"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── How a session unfolds ── */}
        <section className="pt-20">
          <Reveal>
            <SectionHeading
              overline={t.stagesOverline}
              title={t.stagesTitle}
              sub={t.stagesSub}
              center={false}
            />
          </Reveal>

          <div className="relative mt-12">
            <svg
              className="pointer-events-none absolute left-0 right-0 top-[54px] hidden h-2 w-full lg:block"
              aria-hidden="true"
            >
              <line
                x1="0" y1="4" x2="100%" y2="4"
                stroke="#E0B33C" strokeWidth="3" className="ln-dash"
              />
            </svg>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {t.stages.map((stage, index) => (
                <Reveal key={stage.num} delay={index * 0.07}>
                  <div
                    className="group h-[300px] [perspective:1400px]"
                    onClick={() => setFlippedStage(flippedStage === stage.num ? null : stage.num)}
                  >
                    <div
                      className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${
                        flippedStage === stage.num ? "[transform:rotateY(180deg)]" : ""
                      }`}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 flex flex-col rounded-[22px] border-2 border-[#0F172A] bg-white p-6 [backface-visibility:hidden]">
                        <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#0F172A] bg-[#FBBF24] font-mono text-sm font-black text-[#0F172A]">
                          {stage.num}
                        </span>
                        <h3 className="mt-5 font-display text-xl font-extrabold text-[#1B2A63]">
                          {stage.title}
                        </h3>
                        <p className="mt-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                          {stage.covers}
                        </p>
                        <p className="mt-auto text-xs font-mono font-bold text-[#D4A514]">
                          {t.flipHint}
                        </p>
                      </div>

                      {/* Back */}
                      <div className="absolute inset-0 flex flex-col justify-center rounded-[22px] border-2 border-[#0F172A] bg-[#111A34] p-6 shadow-[8px_8px_0_#E0B33C] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#FBBF24]">
                          {stage.num} · {stage.title}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-[#F1F5FF]">{stage.text}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8">
              <Link
                to="/what-is-steam"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1B2A63] hover:underline"
              >
                {t.stagesLink} <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── Supports school learning + never repeats ── */}
        <section className="pt-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <LiftCard className="bg-[#EFF6FF] hover:bg-[#DBEAFE]">
              <article className="h-full p-7 sm:p-8">
                <p className="ln-overline">{t.schoolOverline}</p>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {t.schoolTitle}
                </h2>
                <p className="mt-4 leading-relaxed text-[#475569]">{t.schoolText}</p>
                <PointList
                  items={t.schoolPoints}
                  className="mt-6 space-y-3 text-sm font-semibold text-[#334155]"
                />
              </article>
            </LiftCard>

            <LiftCard delay={0.06} className="bg-[#F0FDFA] hover:bg-[#CCFBF1]">
              <article className="h-full p-7 sm:p-8">
                <p className="ln-overline">{t.freshOverline}</p>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {t.freshTitle}
                </h2>
                <p className="mt-4 leading-relaxed text-[#475569]">{t.freshText}</p>
                <PointList
                  items={t.freshPoints}
                  className="mt-6 space-y-3 text-sm font-semibold text-[#334155]"
                />
              </article>
            </LiftCard>
          </div>
        </section>

        {/* ── Age groups & schedule ── */}
        <section id="ages" className="scroll-mt-32 pt-20">
          <Reveal>
            <SectionHeading
              overline={t.agesOverline}
              title={t.agesTitle}
              sub={t.agesSub}
              center={false}
            />
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#475569]">
              {t.agesToggleHint}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {t.ageGroups.map((group) => {
                const isActive = group.id === activeAge;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveAge(group.id)}
                    className={`rounded-full border-2 border-[#1B2A63] px-6 py-3 text-sm font-mono font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive
                        ? "bg-[#1B2A63] text-[#FBBF24] shadow-[4px_4px_0_#E0B33C]"
                        : "bg-white text-[#1B2A63] hover:bg-[#E7EBF7]"
                    }`}
                    data-testid={`cyclic-age-${group.id}`}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={age.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
                >
                  <div className="ln-card p-7 sm:p-8">
                    <p className="ln-overline">{age.label}</p>
                    <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                      {age.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-[#475569]">{age.text}</p>
                    <PointList
                      items={age.points}
                      className="mt-6 space-y-3 text-sm font-semibold text-[#334155]"
                    />
                  </div>

                  <div className="rounded-[24px] border-2 border-[#0F172A] bg-[#E7EBF7] p-7 sm:p-8 shadow-[8px_8px_0_#1B2A63]">
                    <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-[#0F172A] bg-[#1B2A63] text-[#FBBF24]">
                      <CalendarDays className="h-6 w-6" />
                    </span>
                    <p className="mt-5 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#475569]">
                      {age.scheduleLabel}
                    </p>
                    <p className="mt-2 font-display text-2xl font-extrabold text-[#1B2A63]">
                      {age.scheduleValue}
                    </p>
                    <p className="mt-3 font-semibold leading-relaxed text-[#334155]">
                      {age.scheduleTime}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                      {age.scheduleNote}
                    </p>
                    <Link
                      to="/register?programme=cyclic"
                      className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#0F172A] bg-[#FBBF24] px-5 py-2.5 text-sm font-bold text-[#0F172A] shadow-[3px_3px_0_#0F172A] transition hover:-translate-y-0.5"
                    >
                      {t.heroButton} <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </section>

        {/* ── Recognition ── */}
        <section className="pt-20">
          <Reveal>
            <SectionHeading
              overline={t.rewardOverline}
              title={t.rewardTitle}
              center={false}
            />
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-6 max-w-3xl leading-relaxed text-[#475569]">{t.rewardText}</p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.rewardItems.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="group h-full rounded-[22px] border-2 border-[#0F172A] bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[8px_8px_0_#E0B33C]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border-2 border-[#0F172A] bg-[#FFF8DE] text-[#A76E00] transition-transform duration-300 group-hover:-rotate-6">
                    <Award className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-extrabold text-[#1B2A63]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Practical facts ── */}
        <section id="facts" className="scroll-mt-32 pt-20">
          <Reveal>
            <SectionHeading overline={t.factsOverline} title={t.factsTitle} center={false} />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 grid gap-px overflow-hidden rounded-[24px] border-2 border-[#0F172A] bg-[#0F172A] sm:grid-cols-2 lg:grid-cols-4">
              {t.facts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div
                    key={fact.label}
                    className="group bg-white px-6 py-6 transition-colors duration-300 hover:bg-[#FFF8DE]"
                  >
                    <Icon className="h-5 w-5 text-[#D4A514] transition-transform duration-300 group-hover:scale-110" />
                    <p className="mt-3 text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#475569]">
                      {fact.label}
                    </p>
                    <p className="mt-1.5 font-display text-base font-extrabold leading-snug text-[#1B2A63]">
                      {fact.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* ── Closing CTA ── */}
        <Reveal delay={0.06}>
          <div className="mt-20 rounded-[24px] border-2 border-[#0F172A] bg-[#E7EBF7] p-8 text-center shadow-[8px_8px_0_#1B2A63] sm:p-12">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border-2 border-[#0F172A] bg-[#1B2A63] text-[#FBBF24] shadow-[3px_3px_0_#0F172A]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl font-extrabold leading-tight text-[#1B2A63]">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#334155]">{t.ctaText}</p>
            <div className="mt-7">
              <Link
                to="/register?programme=cyclic"
                className="ln-btn ln-btn-enquire ln-btn-no-glow inline-flex items-center gap-2 !px-5 !py-3 !text-sm font-mono tracking-wide"
                data-testid="cyclic-footer-cta"
              >
                {t.ctaButton} <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
};

export default CyclicSteamWorkshops;
