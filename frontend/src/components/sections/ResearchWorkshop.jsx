import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Clock, FileText,
  Globe, GraduationCap, Loader2, MapPin, Microscope, Send, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "../Reveal";
import { useLanguage } from "../../i18n/LanguageContext";
const CONFERENCE_URL = "https://form-handler.gpg210302-account.workers.dev/conference";

const COUNTRY_CODES = [
  { code: "+48", label: "PL +48" }, { code: "+91", label: "IN +91" },
  { code: "+49", label: "DE +49" }, { code: "+44", label: "GB +44" },
  { code: "+33", label: "FR +33" }, { code: "+39", label: "IT +39" },
  { code: "+34", label: "ES +34" }, { code: "+1", label: "US +1" },
];

const emptyConference = {
  student_name: "", student_age: "", parent_name: "", email: "",
  phone: "", interest_area: "", krakow_availability: false,
  guarantee_ack: false, message: "",
};

const inputCls =
  "w-full px-4 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition";

const DEADLINE = new Date("2026-08-31T00:00:00");
function ResearchWorkshop() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("planetary");
  const [cForm, setCForm] = useState(emptyConference);
  const [cLoading, setCLoading] = useState(false);
  const [cDone, setCDone] = useState(false);
  const [cCode, setCCode] = useState("+48");
  const daysLeft = Math.max(0, Math.ceil((DEADLINE - new Date()) / 86400000));
    useEffect(() => {
    if (window.location.hash !== "#register-conference") return;
    setActiveTab("planetary");
    const timer = setTimeout(() => {
      document.getElementById("register-conference")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => clearTimeout(timer);
  }, []);
  const { language } = useLanguage();
  const isPolish = language === "pl";

  const copy = {
    badge: isPolish
      ? "Zapisy otwarte • Ograniczona liczba miejsc"
      : "Registrations open • Limited spots",
    title: isPolish
      ? "Warsztaty Badawcze dla Młodych Naukowców"
      : "Young Scientist Research Workshop",
    intro1: isPolish
      ? "Warsztaty badawcze z opieką mentora dla młodych naukowców w wieku 13–18 lat. Uczniowie poznają, jak wygląda prawdziwa praca naukowa, i realizują własny projekt — od pierwszego pytania badawczego, przez analizę danych, aż po wnioski i gotową pracę naukową."
      : "A guided research experience for young scientists aged 13–18. Students learn how authentic scientific research works and develop a project from an initial question to data analysis, conclusions and a structured research paper.",
    intro2: isPolish
      ? "Od naukowej ciekawości, przez badania i pisanie, aż po publikację — każdy uczestnik uczy się, jak prowadzi się prawdziwe badania i jak przedstawia się ich wyniki szerszemu środowisku naukowemu."
      : "From scientific curiosity to research, writing and publication — every participant is supported in learning how real research is carried out and how findings are communicated to the wider scientific community.",
    ctaPrimary: isPolish ? "Zapytaj o program" : "Enquire about the programme",
    ctaSecondary: isPolish ? "Konferencja — październik 2026" : "October 2026 conference",
    whyOverline: isPolish ? "Dlaczego to ważne" : "Why it matters",
    whyTitle: isPolish
      ? "Dlaczego badania naukowe mają znaczenie już w młodym wieku"
      : "Why research matters at a young age",
    whySub: isPolish
      ? "To więcej niż projekt. To nowy sposób myślenia."
      : "More than a project. A new way of thinking.",
    whyLead: isPolish
      ? "W wieku 13–18 lat młodzi ludzie podejmują ważne decyzje dotyczące wyboru przedmiotów, kierunku studiów i przyszłej kariery. Praca badawcza pozwala im zgłębić wybraną dziedzinę, pracować na prawdziwych danych i odkryć, dokąd mogą prowadzić ich zainteresowania i zdolności."
      : "Between the ages of 13 and 18, young people begin making important decisions about their subjects, university pathways and future careers. Research allows them to explore an area deeply, work with real evidence and discover where their interests and abilities may lead.",
    whyFootnote: isPolish
      ? "Doświadczenie badawcze nie gwarantuje przyjęcia na studia ani nie zastępuje wymaganych ocen. Jego prawdziwa wartość polega na tym, że uczniowie stają się bardziej refleksyjni, samodzielni i kompetentni — a ich praca jest autentycznym efektem własnej ciekawości i wysiłku."
      : "Research experience does not guarantee university admission or replace the required grades. Its real value lies in helping students become more thoughtful, capable and self-directed learners — with authentic work that reflects their own curiosity and effort.",
  };

  const highlights = [
    {
      icon: Microscope,
      title: isPolish ? "Prawdziwe umiejętności badawcze" : "Authentic research skills",
      text: isPolish
        ? "Uczniowie przechodzą pełną ścieżkę badawczą — od pierwszego pytania do gotowej pracy."
        : "Students follow a complete research pathway, from the first question to a finished paper.",
    },
    {
      icon: FileText,
      title: isPolish ? "Pisanie i publikacja" : "Writing & publication",
      text: isPolish
        ? "Ukończone projekty przygotowujemy w formie uporządkowanej pracy naukowej i plakatu naukowego."
        : "Completed projects are prepared as a structured paper and a scientific poster.",
    },
    {
      icon: Globe,
      title: isPolish ? "Możliwości konferencyjne" : "Conference opportunities",
      text: isPolish
        ? "Najlepsze projekty mogą zostać przygotowane do prezentacji na wydarzeniach akademickich."
        : "Strong projects may be prepared for university and external academic events.",
    },
  ];

  const whyCards = [
      {
        num: "01",
        label: isPolish ? "SPOSÓB MYŚLENIA" : "MINDSET",
        title: isPolish ? "Samodzielne myślenie" : "Think independently",
        text: isPolish
          ? "Uczniowie uczą się zadawać trafne pytania, kwestionować założenia i wyciągać wnioski na podstawie dowodów, zamiast przyjmować informacje bez zastanowienia."
          : "Students learn to ask meaningful questions, challenge assumptions and reach conclusions based on evidence rather than simply accepting what they are told.",
        accent: "text-[#BE185D]", hover: "hover:bg-[#FFF1F6]", bar: "bg-[#EC4899]",
      },
      {
        num: "02",
        label: isPolish ? "PRAWDZIWE DANE" : "REAL EVIDENCE",
        title: isPolish ? "Praca na prawdziwych danych" : "Work with real evidence",
        text: isPolish
          ? "Uczą się wyszukiwać wiarygodne źródła naukowe, interpretować dane, dostrzegać ograniczenia badań i rzetelnie przedstawiać wyniki."
          : "They learn how to find credible scientific sources, interpret data, recognise limitations and communicate their findings accurately.",
        accent: "text-[#0F8A78]", hover: "hover:bg-[#E7FAF6]", bar: "bg-[#10B981]",
      },
      {
        num: "03",
        label: isPolish ? "WŁASNA ŚCIEŻKA" : "FUTURE DIRECTION",
        title: isPolish ? "Odkrycie własnej ścieżki" : "Discover future direction",
        text: isPolish
          ? "Zgłębienie tematu poprzez badania pomaga uczniowi zrozumieć, czy to dziedzina, którą naprawdę chce się zajmować na studiach lub w przyszłej pracy."
          : "Exploring a subject through research helps students understand whether it is an area they may genuinely wish to pursue at university or in a future career.",
        accent: "text-[#D65D16]", hover: "hover:bg-[#FFF1E7]", bar: "bg-[#F97316]",
      },
      {
        num: "04",
        label: isPolish ? "PEWNOŚĆ SIEBIE" : "CONFIDENCE",
        title: isPolish ? "Pewność akademicka" : "Build academic confidence",
        text: isPolish
          ? "Długoterminowy projekt rozwija umiejętność pisania naukowego, tworzenia bibliografii, organizacji pracy, rozwiązywania problemów i pewność w tłumaczeniu złożonych zagadnień."
          : "Completing a long-term research project develops scientific writing, referencing, organisation, problem-solving and the confidence to explain complex ideas.",
        accent: "text-[#1B2A63]", hover: "hover:bg-[#EEF2FC]", bar: "bg-[#1B2A63]",
      },
      {
        num: "05",
        label: isPolish ? "PROFIL AKADEMICKI" : "ACADEMIC PROFILE",
        title: isPolish ? "Mocniejszy profil akademicki" : "Strengthen their academic profile",
        text: isPolish
          ? "Autorska praca badawcza ucznia to wiarygodny dowód zainteresowań, inicjatywy i gotowości do samodzielnej nauki — przydatny w rekrutacji na studia, rozmowach kwalifikacyjnych i wnioskach stypendialnych."
          : "A genuine student-led research paper provides meaningful evidence of subject interest, initiative and readiness for independent learning in university applications, interviews and scholarships.",
        accent: "text-[#A76E00]", hover: "hover:bg-[#FFF8DE]", bar: "bg-[#FBBF24]",
      },
      {
        num: "06",
        label: isPolish ? "ŚWIAT NAUKI" : "WIDER WORLD",
        title: isPolish ? "Kontakt z szerszym światem nauki" : "Connect with a wider research world",
        text: isPolish
          ? "Młodzi badacze na całym świecie prezentują swoje prace w czasopismach uczniowskich, na sympozjach, konkursach naukowych i konferencjach uniwersyteckich. Pomagamy uczniom przedstawić wyniki poza salą lekcyjną."
          : "Young researchers worldwide increasingly share their work through student journals, research symposia, science fairs and university conferences. We help students communicate their findings beyond the classroom.",
        accent: "text-[#7C3AED]", hover: "hover:bg-[#F5EEFF]", bar: "bg-[#A855F7]",
      }, 
    ];
      const v = isPolish
        ? {
            name: "Podaj imię i nazwisko ucznia.",
            age: "Podaj wiek ucznia (13–18 lat).",
            parent: "Podaj imię i nazwisko rodzica lub opiekuna.",
            email: "Podaj poprawny adres e-mail.",
            krakow: "Potwierdź obecność ucznia w Krakowie 23–24 października.",
            ack: "Potwierdź, że rozumiesz warunki zgłoszenia na konferencję.",
            failed: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.",
          }
        : {
            name: "Please enter the student's full name.",
            age: "Please enter the student's age (13–18).",
            parent: "Please enter the parent or guardian's name.",
            email: "Please enter a valid email address.",
            krakow: "Please confirm the student can be in Kraków on 23–24 October.",
            ack: "Please confirm you understand the conference conditions.",
            failed: "We could not send your registration. Please try again.",
          };

      const path = {
        overline: isPolish ? "Jak to działa" : "How it works",
        title: isPolish ? "Jak przebiega ścieżka badawcza" : "How the research pathway works",
        sub: isPolish
          ? "Od pierwszego pytania do gotowej pracy naukowej — krok po kroku, z opieką mentora."
          : "From the first question to a finished paper — step by step, with a mentor alongside.",
        lead: isPolish
          ? "Ścieżka wprowadza uczniów w prawdziwą pracę naukową. Pod opieką mentora uczeń formułuje pytanie badawcze, poznaje wiarygodną literaturę naukową, dobiera metodę, analizuje dane, wyciąga wnioski i przygotowuje uporządkowaną pracę naukową."
          : "This pathway introduces students to authentic scientific research. With structured mentoring, students develop a research question, explore credible scientific literature, select an appropriate methodology, analyse evidence or data, draw conclusions and prepare a structured research paper.",
        publish: isPolish
          ? "Każdy uczeń, który ukończy pracę badawczą wraz z wymaganymi poprawkami, otrzyma wsparcie w przygotowaniu jej do publikacji — w La Neuron lub na odpowiedniej platformie uczniowskiej, młodzieżowej albo edukacyjnej. Publikacja w zewnętrznym czasopiśmie naukowym zależy od recenzji i decyzji redakcji."
          : "Every student who completes the required research and revision process will be supported in preparing their work for publication through an appropriate La Neuron, student, youth or educational publication platform. External journal publication, where pursued, remains subject to editorial review and acceptance.",
      };

      const steps = [
        {
          num: "01",
          title: isPolish ? "Pytanie badawcze" : "Research question",
          text: isPolish
            ? "Uczeń wybiera temat, który go naprawdę interesuje, i zamienia ciekawość w precyzyjne, możliwe do zbadania pytanie."
            : "The student picks a subject they genuinely care about and turns that curiosity into a precise, answerable question.",
        },
        {
          num: "02",
          title: isPolish ? "Literatura naukowa" : "Credible literature",
          text: isPolish
            ? "Uczy się wyszukiwać i czytać wiarygodne publikacje naukowe oraz poprawnie tworzyć przypisy i bibliografię."
            : "They learn to find and read credible scientific publications, and to reference sources correctly.",
        },
        {
          num: "03",
          title: isPolish ? "Metodologia" : "Methodology",
          text: isPolish
            ? "Wspólnie z mentorem dobiera metodę badawczą i źródła danych odpowiednie do pytania i dostępnego czasu."
            : "With their mentor, they choose a method and data sources suited to the question and the time available.",
        },
        {
          num: "04",
          title: isPolish ? "Analiza danych" : "Evidence & analysis",
          text: isPolish
            ? "Zbiera i analizuje dane, dostrzega ograniczenia badania i sprawdza, czy wyniki rzeczywiście odpowiadają na pytanie."
            : "They gather and analyse data, recognise the limits of their evidence and test whether results answer the question.",
        },
        {
          num: "05",
          title: isPolish ? "Wnioski" : "Conclusions",
          text: isPolish
            ? "Formułuje wnioski oparte na dowodach i uczy się odróżniać to, co wykazało badanie, od tego, co jedynie sugeruje."
            : "They draw evidence-based conclusions and learn to separate what the research shows from what it merely suggests.",
        },
        {
          num: "06",
          title: isPolish ? "Praca i publikacja" : "Paper & publication",
          text: isPolish
            ? "Pisze uporządkowaną pracę naukową, wprowadza poprawki po recenzji mentora i przygotowuje ją do publikacji lub prezentacji."
            : "They write a structured paper, revise it after mentor review and prepare it for publication or presentation.",
        },
        ];
      const facts = [
        {
          label: isPolish ? "Wiek" : "Age group",
          value: isPolish ? "13–18 lat" : "13–18 years",
        },
        {
          label: isPolish ? "Zajęcia" : "Sessions",
          value: isPolish ? "Cotygodniowe spotkania" : "Weekly sessions",
        },
        {
          label: isPolish ? "Czas tygodniowo" : "Weekly commitment",
          value: isPolish ? "Od poniżej 1 godz. do 5+ godz." : "From under 1 hour to 5+ hours",
        },
        {
          label: isPolish ? "Forma pracy" : "Group size",
          value: isPolish ? "Indywidualnie lub w grupie do 10 osób" : "One-to-one, or groups up to 10",
        },
        {
          label: isPolish ? "Języki" : "Languages",
          value: isPolish ? "Angielski i polski" : "English and Polish",
        },
        {
          label: isPolish ? "Opłaty" : "Fees",
          value: isPolish ? "Ustalane indywidualnie — zapytaj nas" : "Tailored individually — contact us",
        },
      ];
      const ev = {
        panelOverline: isPolish ? "Możliwości i wydarzenia" : "Opportunities & events",
        panelTitle: isPolish ? "Nadchodzące wydarzenia" : "Upcoming opportunities",
        panelSub: isPolish
          ? "Wybierz wydarzenie, aby poznać szczegóły i zgłosić dziecko bezpośrednio tutaj."
          : "Choose an event to see the details and register your child right here.",
        tabPlanetary: isPolish ? "Konferencja Planetarna 2026" : "Planetary Science 2026",
        tabSoon: isPolish ? "Kolejne wydarzenia wkrótce" : "More opportunities soon",
        eyebrow: isPolish ? "Od pracy naukowej do prezentacji" : "From research paper to scientific presentation",
        title: isPolish ? "Konferencja Planetarna 2026" : "Planetary Science Conference 2026",
        dates: isPolish ? "23–24 października 2026" : "23–24 October 2026",
        place: isPolish ? "Uniwersytet w Krakowie" : "University in Kraków",
        ages: isPolish ? "Wiek 13–18 lat" : "Ages 13–18",
        about1: isPolish
          ? "To ścieżka badawcza dla uczniów zainteresowanych planetologią, astronomią, astrobiologią, egzoplanetami i eksploracją kosmosu. Uczestnicy pracują pod opieką mentora nad własnym projektem, korzystając z wiarygodnej literatury naukowej i publicznie dostępnych danych."
          : "A focused research pathway for students interested in planetary science, astronomy, astrobiology, exoplanets and space exploration. Participants receive structured mentoring to develop a research project using credible scientific literature and suitable publicly available data.",
        about2: isPolish
          ? "Uczą się analizować dowody, dokumentować metodologię, interpretować wyniki i przedstawiać swoją pracę w formie pracy naukowej oraz plakatu."
          : "They learn to analyse evidence, document their methodology, interpret results and communicate their work through a scientific paper and poster.",
        guidanceTitle: isPolish ? "Co obejmuje przygotowanie" : "What the guidance covers",
        guidance: isPolish
          ? [
              "Wybór tematu i sformułowanie pytania badawczego",
              "Praca z literaturą naukową i danymi publicznymi",
              "Struktura pracy naukowej i poprawki po recenzji mentora",
              "Przygotowanie plakatu naukowego",
              "Ćwiczenie wystąpienia i odpowiedzi na pytania",
            ]
          : [
              "Choosing a topic and shaping the research question",
              "Working with scientific literature and public data",
              "Structuring the paper and revising after mentor review",
              "Preparing the scientific poster",
              "Rehearsing the talk and handling questions",
            ],
        freeTitle: isPolish ? "Przygotowanie z La Neuron — bezpłatnie" : "La Neuron guidance — free of charge",
        freeText: isPolish
          ? "Całe wsparcie merytoryczne, pomoc w przygotowaniu pracy i prezentacji ze strony La Neuron jest w ramach tej konferencji bezpłatne. Rodzice pokrywają we własnym zakresie koszty zewnętrzne: ewentualną opłatę rejestracyjną konferencji, wydruk plakatu lub pracy, dojazd na miejsce oraz inne wydatki osobiste."
          : "All research mentoring, paper preparation and presentation coaching from La Neuron is provided free of charge for this conference. Parents cover external costs directly: any conference registration fee if applicable, poster or paper printing, travel to and from the venue, and other personal expenses.",
        disclaimer: isPolish
          ? "Udział w konferencji jest dodatkową możliwością i nie jest gwarantowany. Zgłoszenie i przyjęcie pracy zależą od jej jakości i tematyki, wymagań konferencji, dostępności miejsc oraz decyzji organizatorów."
          : "Conference participation is an additional opportunity and is not guaranteed. Selection and acceptance depend on the quality and relevance of the research, conference requirements, availability and approval by the external organisers.",
        soonText: isPolish
          ? "Pracujemy nad kolejnymi konferencjami, sympozjami i konkursami naukowymi dla młodych badaczy. Nowe wydarzenia pojawią się w tym miejscu."
          : "We are working on further conferences, symposia and science competitions for young researchers. New opportunities will appear here.",
        formTitle: isPolish ? "Zgłoś ucznia na tę konferencję" : "Register a student for this conference",
        formSub: isPolish
          ? "Wypełnij formularz, a skontaktujemy się w ciągu 24 godzin."
          : "Fill in the form and we will get back to you within 24 hours.",
        fStudent: isPolish ? "Imię i nazwisko ucznia *" : "Student full name *",
        fAge: isPolish ? "Wiek ucznia (13–18) *" : "Student age (13–18) *",
        fParent: isPolish ? "Rodzic / opiekun *" : "Parent / guardian *",
        fEmail: isPolish ? "Adres e-mail *" : "Email address *",
        fPhone: isPolish ? "Telefon / WhatsApp" : "Phone / WhatsApp",
        fInterest: isPolish ? "Obszar zainteresowań" : "Area of interest",
        fMessage: isPolish ? "Wiadomość (opcjonalnie)" : "Message (optional)",
        phStudent: isPolish ? "Imię i nazwisko" : "Full name",
        phParent: isPolish ? "Imię i nazwisko" : "Full name",
        phPhone: isPolish ? "Numer telefonu" : "Phone number",
        phMessage: isPolish ? "Pytania lub dodatkowe informacje o uczniu." : "Questions, or anything else we should know.",
        select: isPolish ? "Wybierz opcję" : "Select an option",
        interests: isPolish
          ? ["Planetologia", "Astronomia", "Astrobiologia", "Egzoplanety", "Eksploracja kosmosu", "Jeszcze nie wiem"]
          : ["Planetary science", "Astronomy", "Astrobiology", "Exoplanets", "Space exploration", "Not sure yet"],
        ackKrakow: isPolish
          ? "Potwierdzam, że uczeń może być w Krakowie 23–24 października 2026 r. na prezentacji. *"
          : "I confirm the student can be in Kraków on 23–24 October 2026 for the presentation. *",
        ackGuarantee: isPolish
            ? "Rozumiem, że moje dziecko zrealizuje pełny projekt badawczy i przygotuje pracę naukową, a o wyborze prac prezentowanych na konferencji decydują organizatorzy. *"
            : "I understand my child will complete a full research project and paper, and that the conference organisers make the final decision on which projects are presented. *",
        submit: isPolish ? "Wyślij zgłoszenie" : "Send registration",
        sending: isPolish ? "Wysyłanie..." : "Sending...",
        doneTitle: isPolish ? "Zgłoszenie wysłane" : "Registration sent",
        doneText: isPolish
          ? "Dziękujemy. Odezwiemy się w ciągu 24 godzin z kolejnymi krokami."
          : "Thank you. We will be in touch within 24 hours with the next steps.",
        doneBtn: isPolish ? "Wyślij kolejne zgłoszenie" : "Send another registration",
        ctaTitle: isPolish ? "Zainteresowany długoterminowym programem badawczym?" : "Interested in the long-term research programme?",
        ctaText: isPolish
          ? "Program badawczy prowadzimy przez cały rok, niezależnie od konferencji. Napisz do nas, a zaproponujemy ścieżkę dopasowaną do zainteresowań i możliwości czasowych ucznia."
          : "The research programme runs all year, independently of any conference. Send us an enquiry and we will suggest a pathway matched to your child's interests and available time.",
        ctaBtn: isPolish ? "Zapytaj o program badawczy" : "Enquire about the programme",
      };
    
    /* ============================================================
   PART 3 — SUBMIT HANDLER
   Paste inside the component, above the `return (`.
   ============================================================ */

    const setC = (key) => (event) =>
      setCForm((current) => ({ ...current, [key]: event.target.value }));

    const toggleC = (key) => (event) =>
      setCForm((current) => ({ ...current, [key]: event.target.checked }));

    const submitConference = async (event) => {
      event.preventDefault();

      const age = Number(cForm.student_age);
      if (!cForm.student_name.trim()) return toast.error(v.name);
      if (!cForm.student_age || age < 13 || age > 18) return toast.error(v.age);
      if (!cForm.parent_name.trim()) return toast.error(v.parent);
      if (!/^\S+@\S+\.\S+$/.test(cForm.email)) return toast.error(v.email);
      if (!cForm.krakow_availability) return toast.error(v.krakow);
      if (!cForm.guarantee_ack) return toast.error(v.ack);

      setCLoading(true);
      try {
        const response = await fetch(CONFERENCE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "Planetary Science Conference 2026",
            student_name: cForm.student_name,
            student_age: cForm.student_age,
            parent_name: cForm.parent_name,
            email: cForm.email,
            phone: cForm.phone ? `${cCode} ${cForm.phone}` : "",
            interest_area: cForm.interest_area,
            krakow_availability: cForm.krakow_availability ? "Yes" : "No",
            guarantee_ack: cForm.guarantee_ack ? "Yes" : "No",
            message: cForm.message,
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error("failed");
        setCDone(true);
      } catch {
        toast.error(v.failed);
      } finally {
        setCLoading(false);
      }
    };

  return (
    <section id="research-workshop" className="py-20 lg:py-28 pt-28 sm:pt-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* ── Hero ── */}
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#1B2A63]">
              {copy.badge}
            </span>
            <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              {copy.title}
            </h1>
            <p className="mt-6 text-lg text-[#475569] leading-relaxed">{copy.intro1}</p>
            <p className="mt-4 text-lg text-[#475569] leading-relaxed">{copy.intro2}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-9 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate("/register?programme=research")}
              className="ln-btn ln-btn-primary group"
              data-testid="research-cta-enquire"
            >
              {copy.ctaPrimary}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <a href="#opportunities" className="ln-btn ln-btn-white group" data-testid="research-cta-event">
              {copy.ctaSecondary}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>

        {/* ── Three highlight cards ── */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="ln-card ln-card-hover ln-spotlight-card h-full p-7">
                  <span className="ln-spotlight-glow" aria-hidden="true" />
                  <div className="ln-spotlight-content">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#1B2A63] bg-[#E7EBF7]">
                      <Icon className="h-6 w-6 text-[#1B2A63]" />
                    </span>
                    <h3 className="mt-5 font-display font-extrabold text-xl leading-snug">{item.title}</h3>
                    <p className="mt-3 text-[#475569] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* ── Why research matters ── */}
        <section id="why-research" className="scroll-mt-32 pt-24">
          <SectionHeading
            overline={copy.whyOverline}
            title={copy.whyTitle}
            sub={copy.whySub}
            center={false}
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-3xl text-[#475569] leading-relaxed">{copy.whyLead}</p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card, index) => (
              <Reveal key={card.num} delay={index * 0.05}>
                <article
                  className={`group relative flex h-full min-h-[290px] flex-col overflow-hidden rounded-[22px] bg-white/75 px-6 py-8 shadow-[8px_8px_18px_rgba(148,163,184,0.18),-5px_-5px_14px_rgba(255,255,255,0.95)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[11px_11px_22px_rgba(148,163,184,0.24),-6px_-6px_16px_rgba(255,255,255,0.98)] sm:px-8 lg:px-9 lg:py-10 ${card.hover}`}
                >
                  <p className={`font-mono text-sm font-bold tracking-[0.18em] transition-transform duration-300 group-hover:-translate-y-0.5 ${card.accent}`}>
                    {card.num}
                  </p>
                  <p className="mt-5 text-xs font-mono font-bold tracking-[0.14em] text-[#475569]">
                    {card.label}
                  </p>
                  <h3 className={`mt-2 font-display text-2xl sm:text-3xl font-extrabold leading-tight ${card.accent}`}>
                    {card.title}
                  </h3>
                  <p className="mt-5 max-w-sm leading-relaxed text-[#475569]">{card.text}</p>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-6 right-6 h-1.5 origin-left scale-x-0 rounded-t-full transition-transform duration-300 group-hover:scale-x-100 sm:left-8 sm:right-8 lg:left-9 lg:right-9 ${card.bar}`}
                  />
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-3xl border-l-4 border-[#E0B33C] pl-5 text-sm italic text-[#475569] leading-relaxed">
              {copy.whyFootnote}
            </p>
          </Reveal>
        </section>

        {/* ── How the pathway works ── */}
        <section id="pathway" className="scroll-mt-32 pt-24">
          <SectionHeading
            overline={path.overline}
            title={path.title}
            sub={path.sub}
            center={false}
          />
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-3xl text-[#475569] leading-relaxed">{path.lead}</p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.num} delay={index * 0.05}>
                <article className="group relative h-full overflow-hidden rounded-[22px] bg-white/75 px-6 py-7 shadow-[8px_8px_18px_rgba(148,163,184,0.18),-5px_-5px_14px_rgba(255,255,255,0.95)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F7F9FF] sm:px-7">
                  <p className="font-mono text-sm font-bold tracking-[0.18em] text-[#1B2A63]">{step.num}</p>
                  <h3 className="mt-3 font-display text-xl font-extrabold leading-snug text-[#0F172A]">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-[#475569]">{step.text}</p>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-6 right-6 h-1.5 origin-left scale-x-0 rounded-t-full bg-[#E0B33C] transition-transform duration-300 group-hover:scale-x-100 sm:left-7 sm:right-7"
                  />
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-3xl border-l-4 border-[#1B2A63] pl-5 text-[#475569] leading-relaxed">
              {path.publish}
            </p>
          </Reveal>

          {/* Practical facts */}
          <Reveal delay={0.12}>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[22px] border-2 border-[#0F172A] bg-[#0F172A] sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-white px-6 py-5 transition-colors duration-300 hover:bg-[#FFF8DE]">
                  <p className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#475569]">{fact.label}</p>
                  <p className="mt-2 font-display text-lg font-extrabold text-[#1B2A63]">{fact.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── Enquiry CTA band ── */}
        <Reveal delay={0.06}>
          <div className="mt-20 rounded-[24px] border-2 border-[#0F172A] bg-[#111A34] p-8 shadow-[8px_8px_0_#E0B33C] sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-[#0F172A] bg-[#FBBF24] text-[#0F172A]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-2xl font-extrabold leading-tight text-[#FBBF24] sm:text-3xl">
                    {ev.ctaTitle}
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-[#F1F5FF]">{ev.ctaText}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/register?programme=research")}
                className="ln-btn ln-btn-primary group shrink-0"
                data-testid="research-cta-band"
              >
                {ev.ctaBtn}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── Opportunities & events panel ── */}
        <section id="opportunities" className="scroll-mt-32 pt-24">
          <SectionHeading
            overline={ev.panelOverline}
            title={ev.panelTitle}
            sub={ev.panelSub}
            center={false}
          />

          <Reveal delay={0.08}>
            <div className="mt-12 overflow-hidden rounded-[24px] border-2 border-[#0F172A] bg-white shadow-[8px_8px_0_#1B2A63]">
              {/* Tab bar */}
              <div className="flex flex-wrap gap-2 border-b-2 border-[#0F172A] bg-[#F7F9FF] p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("planetary")}
                  className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-mono font-bold transition-all duration-300 ${
                    activeTab === "planetary"
                      ? "bg-[#1B2A63] text-[#FBBF24] shadow-[3px_3px_0_#E0B33C]"
                      : "bg-white text-[#1B2A63] hover:bg-[#E7EBF7]"
                  }`}
                  data-testid="tab-planetary"
                >
                  <Globe className="h-4 w-4" />
                  {ev.tabPlanetary}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("soon")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-mono font-bold transition-all duration-300 ${
                    activeTab === "soon"
                      ? "bg-[#1B2A63] text-[#FBBF24] shadow-[3px_3px_0_#E0B33C]"
                      : "bg-white text-[#94A3B8] hover:bg-[#E7EBF7] hover:text-[#1B2A63]"
                  }`}
                  data-testid="tab-soon"
                >
                  <CalendarDays className="h-4 w-4" />
                  {ev.tabSoon}
                </button>
              </div>

              {/* Tab content */}
              <div className="p-6 sm:p-9">
                {activeTab === "soon" ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-[#1B2A63] bg-[#E7EBF7]">
                      <CalendarDays className="h-6 w-6 text-[#1B2A63]" />
                    </span>
                    <p className="mt-5 max-w-lg leading-relaxed text-[#475569]">{ev.soonText}</p>
                  </div>
                ) : (
                  <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Left: event details */}
                    <div>
                      <p className="ln-overline">{ev.eyebrow}</p>
                      <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[#1B2A63] sm:text-4xl">
                        {ev.title}
                      </h3>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="ln-tag"><CalendarDays className="h-3.5 w-3.5" />{ev.dates}</span>
                        <span className="ln-tag"><MapPin className="h-3.5 w-3.5" />{ev.place}</span>
                        <span className="ln-tag"><GraduationCap className="h-3.5 w-3.5" />{ev.ages}</span>
                      </div>

                      <p className="mt-6 leading-relaxed text-[#475569]">{ev.about1}</p>
                      <p className="mt-4 leading-relaxed text-[#475569]">{ev.about2}</p>

                      <h4 className="mt-8 font-display text-lg font-extrabold text-[#0F172A]">{ev.guidanceTitle}</h4>
                      <ul className="mt-4 space-y-2.5">
                        {ev.guidance.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-[#475569]">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Free guidance band */}
                      <div className="mt-8 rounded-[18px] border-2 border-[#10B981] bg-[#ECFDF5] p-5">
                        <p className="font-display text-base font-extrabold text-[#0F8A78]">{ev.freeTitle}</p>
                        <p className="mt-2 text-sm leading-relaxed text-[#334155]">{ev.freeText}</p>
                      </div>

                      {/* Disclaimer */}
                      <div className="mt-4 flex items-start gap-2.5 rounded-[18px] border border-amber-200 bg-amber-50 p-4">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                        <p className="text-sm leading-relaxed text-amber-900">{ev.disclaimer}</p>
                      </div>
                    </div>

                    {/* Right: registration form */}
                    <div id="register-conference" className="scroll-mt-28 rounded-[22px] border-2 border-[#0F172A] bg-[#FDFBF7] p-6 sm:p-7">
                      {cDone ? (
                        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                          <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                          <h4 className="mt-5 font-display text-2xl font-extrabold text-[#0F172A]">{ev.doneTitle}</h4>
                          <p className="mt-3 max-w-xs leading-relaxed text-[#475569]">{ev.doneText}</p>
                          <button
                            type="button"
                            onClick={() => { setCForm(emptyConference); setCDone(false); }}
                            className="mt-7 rounded-full border-2 border-[#0F172A] bg-[#FBBF24] px-6 py-3 font-bold text-[#0F172A] shadow-[3px_3px_0_#0F172A] transition hover:-translate-y-0.5"
                          >
                            {ev.doneBtn}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={submitConference} noValidate className="space-y-4">
                          <div>
                            <h4 className="font-display text-xl font-extrabold text-[#0F172A]">{ev.formTitle}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-[#475569]">{ev.formSub}</p>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-bold text-[#0F172A]">{ev.fStudent}</label>
                            <input value={cForm.student_name} onChange={setC("student_name")} className={inputCls} placeholder={ev.phStudent} data-testid="conf-student-name" />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-bold text-[#0F172A]">{ev.fAge}</label>
                            <input type="number" min="13" max="18" value={cForm.student_age} onChange={setC("student_age")} className={inputCls} placeholder="15" data-testid="conf-student-age" />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-bold text-[#0F172A]">{ev.fParent}</label>
                            <input value={cForm.parent_name} onChange={setC("parent_name")} className={inputCls} placeholder={ev.phParent} data-testid="conf-parent-name" />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-bold text-[#0F172A]">{ev.fEmail}</label>
                            <input type="email" value={cForm.email} onChange={setC("email")} className={inputCls} placeholder="you@email.com" data-testid="conf-email" />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-bold text-[#0F172A]">{ev.fPhone}</label>
                            <div className="flex gap-2">
                              <select value={cCode} onChange={(e) => setCCode(e.target.value)} className="w-24 rounded-xl border-2 border-[#0F172A] bg-white px-2 py-3 text-sm font-medium text-[#0F172A] transition focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40">
                                {COUNTRY_CODES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
                              </select>
                              <input value={cForm.phone} onChange={setC("phone")} className={inputCls} placeholder={ev.phPhone} data-testid="conf-phone" />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-bold text-[#0F172A]">{ev.fInterest}</label>
                            <select value={cForm.interest_area} onChange={setC("interest_area")} className={inputCls} data-testid="conf-interest">
                              <option value="">{ev.select}</option>
                              {ev.interests.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-bold text-[#0F172A]">{ev.fMessage}</label>
                            <textarea value={cForm.message} onChange={setC("message")} className={`${inputCls} min-h-24 resize-y`} placeholder={ev.phMessage} data-testid="conf-message" />
                          </div>

                          <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[#0F172A] bg-white p-3.5 transition hover:bg-[#FFF8DE]">
                            <input type="checkbox" checked={cForm.krakow_availability} onChange={toggleC("krakow_availability")} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1B2A63]" data-testid="conf-krakow" />
                            <span className="text-sm font-medium leading-relaxed text-[#334155]">{ev.ackKrakow}</span>
                          </label>

                          <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[#0F172A] bg-white p-3.5 transition hover:bg-[#FFF8DE]">
                            <input type="checkbox" checked={cForm.guarantee_ack} onChange={toggleC("guarantee_ack")} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1B2A63]" data-testid="conf-ack" />
                            <span className="text-sm font-medium leading-relaxed text-[#334155]">{ev.ackGuarantee}</span>
                          </label>

                          <button type="submit" disabled={cLoading} className="ln-btn ln-btn-primary group w-full disabled:opacity-70" data-testid="conf-submit">
                            {cLoading ? <><Loader2 className="h-4 w-4 animate-spin" />{ev.sending}</> : <><Send className="h-4 w-4" />{ev.submit}</>}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </section>
  );
}

export default ResearchWorkshop;
