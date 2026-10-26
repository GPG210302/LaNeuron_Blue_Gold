import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Loader2, Send, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

import { useLanguage } from "@/i18n/LanguageContext";

/* ================================================================== */
/*  SETTINGS                                                          */
/* ================================================================== */
const WORKER_URL = "https://form-handler.gpg210302-account.workers.dev/feedback";
const EVENTS_FILE = "/feedback-events.txt"; // English | Polish | show until (YYYY-MM-DD, optional)
const SCHOOLS_FILE = "/feedback-schools.txt"; // one school / organisation per line

const NAVY = "#1B2A63";
const INK = "#0F172A";
const GOLD = "#E0B33C";
const GOLD_GRADIENT = "linear-gradient(135deg, #F4D07A 0%, #E0B33C 100%)";

/* ================================================================== */
/*  TEXTS — English / Polish                                          */
/* ================================================================== */
const TEXT = {
  en: {
    badge: "Feedback",
    about: "Your feedback is about",
    title: "How did we do?",
    intro: "It takes about a minute. Just tap your answers, and write in English or Polish.",
    q1: "Who are you?",
    age: "Your age",
    roleOther: "Please tell us who you are",
    q2: "How was your experience with La Neuron?",
    liked: "What did you like?",
    improve: "What could we do better?",
    interests: "What interests you?",
    interestsPlaceholder: "Choose any",
    selected: (n) => `${n} selected`,
    comments: "Anything else?",
    commentsPlaceholder: "Ideas, wishes, comments, in English or Polish",
    stay: "Stay in touch",
    optional: "optional",
    guardianNote: "Please ask your parent or guardian to fill in this part.",
    name: "Your name",
    guardianName: "Parent's / guardian's name",
    organisation: "School or organisation",
    organisationPlaceholder: "Start typing…",
    email: "Email",
    guardianEmail: "Parent's / guardian's email",
    phone: "Phone",
    contactOk: "May we contact you about our workshops?",
    yes: "Yes",
    no: "No",
    consent: "I agree that La Neuron may use these details to contact me, as described in the",
    privacy: "Privacy Policy",
    quote: "You may quote my feedback (without my name) on your website or social media.",
    submit: "Send feedback",
    sending: "Sending…",
    errRole: "Please tell us who you are.",
    errRating: "Please choose a rating.",
    errConsent: "Please tick the consent box to leave your contact details.",
    errSend: "Something went wrong. Please try again.",
    thanks: "Thank you!",
    thanksText: "Your feedback helps us make hands-on STEAM learning even better for every child.",
    review: "Leave a Google review",
    follow: "Follow us",
    website: "Visit website",
    another: "Send another",
    pageTitle: "Feedback | La Neuron",
  },
  pl: {
    badge: "Opinia",
    about: "Twoja opinia dotyczy",
    title: "Jak nam poszło?",
    intro: "Zajmie to około minuty. Wystarczy kliknąć odpowiedzi – możesz pisać po polsku lub po angielsku.",
    q1: "Kim jesteś?",
    age: "Twój wiek",
    roleOther: "Napisz, kim jesteś",
    q2: "Jak oceniasz spotkanie z La Neuron?",
    liked: "Co Ci się podobało?",
    improve: "Co możemy poprawić?",
    interests: "Co Cię interesuje?",
    interestsPlaceholder: "Wybierz dowolne",
    selected: (n) => `Wybrano: ${n}`,
    comments: "Coś jeszcze?",
    commentsPlaceholder: "Pomysły, życzenia, uwagi – po polsku lub po angielsku",
    stay: "Zostańmy w kontakcie",
    optional: "opcjonalnie",
    guardianNote: "Poproś rodzica lub opiekuna o wypełnienie tej części.",
    name: "Imię i nazwisko",
    guardianName: "Imię i nazwisko rodzica / opiekuna",
    organisation: "Szkoła lub organizacja",
    organisationPlaceholder: "Zacznij pisać…",
    email: "E-mail",
    guardianEmail: "E-mail rodzica / opiekuna",
    phone: "Telefon",
    contactOk: "Czy możemy skontaktować się z Tobą w sprawie zajęć?",
    yes: "Tak",
    no: "Nie",
    consent: "Wyrażam zgodę na wykorzystanie tych danych przez La Neuron w celu kontaktu, zgodnie z",
    privacy: "Polityką prywatności",
    quote: "Możecie zacytować moją opinię (bez nazwiska) na stronie lub w mediach społecznościowych.",
    submit: "Wyślij opinię",
    sending: "Wysyłanie…",
    errRole: "Wybierz, kim jesteś.",
    errRating: "Wybierz ocenę.",
    errConsent: "Zaznacz zgodę, aby zostawić dane kontaktowe.",
    errSend: "Coś poszło nie tak. Spróbuj ponownie.",
    thanks: "Dziękujemy!",
    thanksText: "Twoja opinia pomoże nam jeszcze lepiej uczyć dzieci przez działanie.",
    review: "Wystaw opinię w Google",
    follow: "Obserwuj nas",
    website: "Przejdź na stronę",
    another: "Wyślij kolejną",
    pageTitle: "Opinia | La Neuron",
  },
};

/* Options: id, English label (sent in the email), Polish label */
const ROLES = [
  ["student", "Student", "Uczeń / uczennica"],
  ["parent", "Parent", "Rodzic"],
  ["teacher", "Teacher", "Nauczyciel / nauczycielka"],
  ["leader", "School leader", "Dyrekcja szkoły"],
  ["fablab", "FabLab / organiser", "FabLab / organizator"],
  ["company", "Company / organisation", "Firma / organizacja"],
  ["other", "Other", "Inne"],
];
const AGES = [
  ["5-7", "5–7", "5–7 lat", true],
  ["8-10", "8–10", "8–10 lat", true],
  ["11-15", "11–15", "11–15 lat", true],
  ["16-18", "16–18", "16–18 lat", false],
]; // 4th value: under 16 → details come from a parent/guardian
const RATINGS = [
  [1, "😕", "Not great", "Słabo"],
  [2, "🙂", "Okay", "Tak sobie"],
  [3, "😊", "Good", "Dobrze"],
  [4, "😃", "Very good", "Bardzo dobrze"],
  [5, "🤩", "Amazing!", "Super!"],
];
const LIKED = [
  ["hands-on", "Hands-on activities", "Zajęcia praktyczne"],
  ["models", "Models & experiments", "Modele i eksperymenty"],
  ["team", "Friendly team", "Miły zespół"],
  ["explain", "Clear explanations", "Zrozumiałe wyjaśnienia"],
  ["ideas", "Creative ideas", "Kreatywne pomysły"],
  ["all", "Everything!", "Wszystko!"],
];
const IMPROVE = [
  ["time", "More time to try things", "Więcej czasu na samodzielne próby"],
  ["age", "More for my age", "Więcej zadań dla mojego wieku"],
  ["info", "More info about classes", "Więcej informacji o zajęciach"],
  ["price", "Prices & schedule", "Ceny i terminy"],
  ["space", "Less crowded", "Mniej tłoczno"],
  ["none", "Nothing, it was great!", "Nic, było super!"],
];
const INTERESTS = [
  ["cyclic", "Cyclic STEAM workshops (Fridays)", "Cykliczne warsztaty STEAM (piątki)"],
  ["thematic", "Thematic & holiday workshops", "Warsztaty tematyczne i feryjne"],
  ["research", "Young Scientist Research Workshop", "Warsztaty badawcze „Młody Naukowiec”"],
  ["school", "Workshops at our school", "Warsztaty w naszej szkole"],
  ["club", "After-school club at our school", "Zajęcia pozalekcyjne w naszej szkole"],
  ["teachers", "Teacher training", "Szkolenia dla nauczycieli"],
  ["partner", "Partnership & events", "Współpraca i wydarzenia"],
];

const label = (opt, lang) => (lang === "pl" ? opt[2] : opt[1]);
const english = (list, ids) =>
  list.filter((o) => ids.includes(o[0])).map((o) => o[1]).join(", ");

/* Fallback if the events file can't be loaded */
const DEFAULT_EVENTS = [
  { en: "General", pl: "Ogólna opinia" },
];

/* "English | Polish | 2026-11-30" → event, hidden after its date */
const parseEvents = (lines) => {
  const today = new Date();
  return lines
    .map((line) => {
      const [en, pl, until] = line.split("|").map((p) => (p || "").trim());
      return { en, pl: pl || en, until };
    })
    .filter((e) => e.en)
    .filter((e) => !e.until || new Date(`${e.until}T23:59:59`) >= today);
};

const readLines = (raw) =>
  raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

/* ================================================================== */
/*  Small building blocks                                             */
/* ================================================================== */
const Appear = ({ children, delay = 0 }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const Block = ({ n, title, hint, children }) => (
  <div className="ln-card p-5 sm:p-6">
    <div className="flex items-baseline gap-3">
      {n && (
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-black"
          style={{ borderColor: INK, background: GOLD_GRADIENT, color: INK }}
        >
          {n}
        </span>
      )}
      <h2 className="font-display text-xl sm:text-2xl font-extrabold leading-tight text-[#0F172A]">
        {title}
        {hint && <span className="ml-2 text-sm font-mono font-bold text-[#64748B]">({hint})</span>}
      </h2>
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-sm font-bold transition active:scale-95 ${
      active ? "text-[#0F172A] shadow-[3px_3px_0_#0F172A]" : "bg-white text-[#1B2A63] hover:bg-[#E7EBF7]"
    }`}
    style={{ borderColor: active ? INK : NAVY, background: active ? GOLD_GRADIENT : undefined }}
  >
    {active && <Check size={15} />}
    {children}
  </button>
);

const inputCls =
  "w-full px-4 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition";

/* Dropdown with checkboxes */
const MultiSelect = ({ options, values, onToggle, lang, placeholder, selectedText }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${inputCls} flex items-center justify-between text-left`}
        aria-expanded={open}
      >
        <span className={values.length ? "text-[#0F172A]" : "text-[#94A3B8]"}>
          {values.length ? selectedText(values.length) : placeholder}
        </span>
        <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border-2 border-[#0F172A] bg-white shadow-[4px_4px_0_#0F172A]"
          >
            {options.map((opt) => {
              const checked = values.includes(opt[0]);
              return (
                <label
                  key={opt[0]}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-semibold text-[#0F172A] hover:bg-[#E7EBF7]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(opt[0])}
                    className="h-5 w-5 accent-[#1B2A63]"
                  />
                  {label(opt, lang)}
                </label>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {values.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {options
            .filter((o) => values.includes(o[0]))
            .map((o) => (
              <span
                key={o[0]}
                className="rounded-full border px-3 py-1 text-xs font-bold text-[#1B2A63]"
                style={{ borderColor: GOLD, background: "#FFF8E6" }}
              >
                {label(o, lang)}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

/* ================================================================== */
/*  Page                                                              */
/* ================================================================== */
const empty = {
  role: "",
  role_other: "",
  age: "",
  rating: 0,
  liked: [],
  improve: [],
  interests: [],
  comments: "",
  name: "",
  organisation: "",
  email: "",
  phone: "",
  contact_ok: "",
  consent: false,
  quote_ok: false,
  website: "", // spam trap
};

const Feedback = () => {
  const { language, setLanguage } = useLanguage();
  const lang = language === "pl" ? "pl" : "en";
  const t = TEXT[lang];
  const [params] = useSearchParams();

  const [form, setForm] = useState(empty);
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [eventName, setEventName] = useState("");
  const [schools, setSchools] = useState([]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  /* Polish phones open the form in Polish (once per visit) */
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("ln-fb-lang") && navigator.language?.toLowerCase().startsWith("pl")) {
        setLanguage("pl");
      }
      sessionStorage.setItem("ln-fb-lang", "1");
    } catch {
      /* storage blocked — ignore */
    }
  }, [setLanguage]);

  /* Event name + school suggestions from text files */
  useEffect(() => {
    fetch(EVENTS_FILE, { cache: "no-cache" })
      .then((r) => (r.ok ? r.text() : ""))
      .then((raw) => {
        const list = parseEvents(readLines(raw));
        const usable = list.length ? list : DEFAULT_EVENTS;
        setEvents(usable);
        // ?event=… in the link pre-selects an event; otherwise the first one in the file
        const wanted = (params.get("event") || "").toLowerCase();
        const match = usable.find((e) => e.en.toLowerCase() === wanted || e.pl.toLowerCase() === wanted);
        setEventName((match || usable[0]).en);
      })
      .catch(() => setEventName("General"));
    fetch(SCHOOLS_FILE, { cache: "no-cache" })
      .then((r) => (r.ok ? r.text() : ""))
      .then((raw) => setSchools(readLines(raw)))
      .catch(() => {});
  }, [params]);

  /* Title + keep out of search engines */
  useEffect(() => {
    const prevTitle = document.title;
    document.title = t.pageTitle;
    let robots = document.querySelector('meta[name="robots"]');
    const prevRobots = robots ? robots.getAttribute("content") : null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
    return () => {
      document.title = prevTitle;
      if (prevRobots === null) robots.remove();
      else robots.setAttribute("content", prevRobots);
    };
  }, [t.pageTitle]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const pick = (key, value) => setForm((f) => ({ ...f, [key]: f[key] === value ? "" : value }));
  const toggle = (key, value) =>
    setForm((f) => {
      let next = f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value];
      // "Everything!" / "Nothing" stand alone
      if (value === "all" || value === "none") next = next.includes(value) ? [value] : [];
      else next = next.filter((v) => v !== "all" && v !== "none");
      return { ...f, [key]: next };
    });

  const isStudent = form.role === "student";
  const ageInfo = AGES.find((a) => a[0] === form.age);
  const isMinor = isStudent && (ageInfo ? ageInfo[3] : true);
  const gaveContact = form.email.trim() || form.phone.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.role) return toast.error(t.errRole);
    if (!form.rating) return toast.error(t.errRating);
    if (gaveContact && !form.consent) return toast.error(t.errConsent);

    setSending(true);
    try {
      const roleOpt = ROLES.find((r) => r[0] === form.role);
      const payload = new FormData();
      const add = (k, v) => payload.append(k, v ?? "");
      add("event", eventName || "General");
      add("language", lang === "pl" ? "Polish" : "English");
      add("role", roleOpt ? roleOpt[1] : form.role);
      add("role_other", form.role === "other" ? form.role_other : "");
      add("student_age", isStudent && ageInfo ? ageInfo[1] : "");
      add("rating", String(form.rating));
      add("liked", english(LIKED, form.liked));
      add("improve", english(IMPROVE, form.improve));
      add("interests", english(INTERESTS, form.interests));
      add("comments", form.comments);
      add("name", form.name);
      add("organisation", form.organisation);
      add("email", form.email);
      add("phone", form.phone);
      add("guardian", isMinor && (form.name || gaveContact) ? "Yes" : "No");
      add("contact_ok", form.contact_ok === "yes" ? "Yes" : "No");
      add("consent", form.consent ? "Yes" : "No");
      add("quote_ok", form.quote_ok ? "Yes" : "No");
      add("website", form.website);

      const res = await fetch(WORKER_URL, { method: "POST", body: payload });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Feedback submit failed:", err);
      toast.error(t.errSend);
    } finally {
      setSending(false);
    }
  };

  const schoolListId = useMemo(() => "ln-feedback-schools", []);

  return (
    <main className="ln-grid-bg min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        {/* Language box */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-full border-2 border-[#0F172A] bg-white p-1 shadow-[3px_3px_0_#0F172A]">
            {[
              ["en", "🇬🇧 English"],
              ["pl", "🇵🇱 Polski"],
            ].map(([code, text]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`rounded-full px-4 py-1.5 text-sm font-mono font-bold transition ${
                  lang === code ? "bg-[#1B2A63] text-white" : "text-[#1B2A63] hover:bg-[#E7EBF7]"
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {done ? (
          /* ---------------- Thank you ---------------- */
          <Appear>
            <div className="mt-10 ln-card p-8 sm:p-10 text-center">
              <span
                className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2"
                style={{ borderColor: INK, background: GOLD_GRADIENT, boxShadow: `3px 3px 0 ${INK}` }}
              >
                <Sparkles size={30} color={INK} />
              </span>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl font-extrabold text-[#0F172A]">
                {t.thanks}
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#475569]">{t.thanksText}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="https://g.page/r/CYwos_0CjH9iEBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ln-btn ln-btn-enquire !px-5 !py-3 !text-sm font-mono inline-flex items-center gap-2"
                >
                  <Star size={16} /> {t.review}
                </a>
                <Link
                  to="/connect"
                  className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-5 py-3 text-sm font-mono font-bold text-[#1B2A63] transition hover:-translate-y-0.5"
                >
                  {t.follow}
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-white px-5 py-3 text-sm font-mono font-bold text-[#1B2A63] transition hover:-translate-y-0.5"
                >
                  {t.website}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm(empty);
                  setDone(false);
                }}
                className="mt-6 text-sm font-mono font-bold text-[#64748B] underline"
              >
                {t.another}
              </button>
            </div>
          </Appear>
        ) : (
          <>
            {/* ---------------- Header ---------------- */}
            <Appear>
              <div className="mt-6">
                <span className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#1B2A63]">
                  {t.badge}
                  {eventName && eventName !== "General" && (
                    <span className="ml-2 text-[#B8860B]">
                      · {lang === "pl" ? events.find((e) => e.en === eventName)?.pl || eventName : eventName}
                    </span>
                  )}
                </span>
                <h1 className="mt-5 font-display text-4xl sm:text-5xl font-extrabold leading-[0.95] text-[#0F172A]">
                  {t.title}
                </h1>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#475569]">{t.intro}</p>
              </div>
            </Appear>

            <form onSubmit={submit} noValidate className="mt-8 space-y-5">
              {/* spam trap — hidden from people */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={set("website")}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* 0. What the feedback is about */}
              <Appear delay={0.03}>
                <div className="ln-card p-4 sm:p-5">
                  <label className="block text-sm font-bold text-[#0F172A]">
                    <span className="block mb-2">{t.about}</span>
                    <div className="relative">
                      <select
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className={`${inputCls} appearance-none pr-10 font-bold`}
                      >
                        {events.map((ev) => (
                          <option key={ev.en} value={ev.en}>
                            {lang === "pl" ? ev.pl : ev.en}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </label>
                </div>
              </Appear>

              {/* 1. Who */}
              <Appear delay={0.05}>
                <Block n="1" title={t.q1}>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((r) => (
                      <Chip key={r[0]} active={form.role === r[0]} onClick={() => pick("role", r[0])}>
                        {label(r, lang)}
                      </Chip>
                    ))}
                  </div>
                  <AnimatePresence initial={false}>
                    {isStudent && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="mt-4 mb-2 text-sm font-bold text-[#0F172A]">{t.age}</p>
                        <div className="flex flex-wrap gap-2">
                          {AGES.map((a) => (
                            <Chip key={a[0]} active={form.age === a[0]} onClick={() => pick("age", a[0])}>
                              {label(a, lang)}
                            </Chip>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {form.role === "other" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <input value={form.role_other} onChange={set("role_other")} className={`${inputCls} mt-4`} placeholder={t.roleOther} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Block>
              </Appear>

              {/* 2. Rating + liked */}
              <Appear delay={0.1}>
                <Block n="2" title={t.q2}>
                  <div className="grid grid-cols-5 gap-2">
                    {RATINGS.map((r) => {
                      const active = form.rating === r[0];
                      return (
                        <button
                          key={r[0]}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, rating: r[0] }))}
                          aria-pressed={active}
                          className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-1 py-3 transition active:scale-95 ${
                            active ? "shadow-[3px_3px_0_#0F172A] -translate-y-0.5" : "bg-white hover:bg-[#E7EBF7]"
                          }`}
                          style={{ borderColor: active ? INK : NAVY, background: active ? GOLD_GRADIENT : undefined }}
                        >
                          <span className={`text-2xl sm:text-3xl transition ${active ? "scale-125" : ""}`}>{r[1]}</span>
                          <span className="text-[0.65rem] sm:text-xs font-bold leading-tight text-[#0F172A] text-center">
                            {lang === "pl" ? r[3] : r[2]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-5 mb-2 text-sm font-bold text-[#0F172A]">{t.liked}</p>
                  <div className="flex flex-wrap gap-2">
                    {LIKED.map((o) => (
                      <Chip key={o[0]} active={form.liked.includes(o[0])} onClick={() => toggle("liked", o[0])}>
                        {label(o, lang)}
                      </Chip>
                    ))}
                  </div>
                </Block>
              </Appear>

              {/* 3. Improve */}
              <Appear delay={0.15}>
                <Block n="3" title={t.improve}>
                  <div className="flex flex-wrap gap-2">
                    {IMPROVE.map((o) => (
                      <Chip key={o[0]} active={form.improve.includes(o[0])} onClick={() => toggle("improve", o[0])}>
                        {label(o, lang)}
                      </Chip>
                    ))}
                  </div>
                </Block>
              </Appear>

              {/* 4. Interests + comments */}
              <Appear delay={0.2}>
                <Block n="4" title={t.interests}>
                  <MultiSelect
                    options={INTERESTS}
                    values={form.interests}
                    onToggle={(id) => toggle("interests", id)}
                    lang={lang}
                    placeholder={t.interestsPlaceholder}
                    selectedText={t.selected}
                  />
                  <p className="mt-5 mb-2 text-sm font-bold text-[#0F172A]">{t.comments}</p>
                  <textarea value={form.comments} onChange={set("comments")} rows={3} className={`${inputCls} resize-y`} placeholder={t.commentsPlaceholder} />
                </Block>
              </Appear>

              {/* 5. Contact */}
              <Appear delay={0.25}>
                <Block n="5" title={t.stay} hint={t.optional}>
                  {isMinor && (
                    <p className="mb-4 rounded-xl border px-4 py-3 text-sm font-bold text-[#1B2A63]" style={{ borderColor: GOLD, background: "#FFF8E6" }}>
                      👋 {t.guardianNote}
                    </p>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input value={form.name} onChange={set("name")} className={inputCls} placeholder={isMinor ? t.guardianName : t.name} autoComplete="name" />
                    <div>
                      <input value={form.organisation} onChange={set("organisation")} className={inputCls} placeholder={`${t.organisation} – ${t.organisationPlaceholder}`} list={schoolListId} autoComplete="organization" />
                      <datalist id={schoolListId}>
                        {schools.map((s) => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                    </div>
                    <input type="email" inputMode="email" value={form.email} onChange={set("email")} className={inputCls} placeholder={isMinor ? t.guardianEmail : t.email} autoComplete="email" />
                    <input type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder={`${t.phone} (${t.optional})`} autoComplete="tel" />
                  </div>

                  <p className="mt-5 mb-2 text-sm font-bold text-[#0F172A]">{t.contactOk}</p>
                  <div className="flex gap-2">
                    <Chip active={form.contact_ok === "yes"} onClick={() => pick("contact_ok", "yes")}>{t.yes}</Chip>
                    <Chip active={form.contact_ok === "no"} onClick={() => pick("contact_ok", "no")}>{t.no}</Chip>
                  </div>

                  <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-[#0F172A]">
                    <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1B2A63]" />
                    <span>
                      {t.consent}{" "}
                      <Link to="/documents" className="font-bold underline text-[#1B2A63]">{t.privacy}</Link>.
                    </span>
                  </label>
                  <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-[#0F172A]">
                    <input type="checkbox" checked={form.quote_ok} onChange={(e) => setForm((f) => ({ ...f, quote_ok: e.target.checked }))} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1B2A63]" />
                    <span>{t.quote}</span>
                  </label>
                </Block>
              </Appear>

              {/* Submit */}
              <Appear delay={0.3}>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex justify-center items-center gap-2 px-6 py-4 rounded-full border-2 border-[#0F172A] text-[#0F172A] font-extrabold text-lg shadow-[4px_4px_0_#0F172A] transition hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: GOLD_GRADIENT }}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      {t.submit}
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </Appear>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default Feedback;
