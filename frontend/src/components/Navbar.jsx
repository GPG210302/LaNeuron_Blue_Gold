import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { useData } from "../i18n/useData";
import logo from "../assets/logo.png";

const slug = (path) =>
  path === "/" ? "home" : path.replace(/\s+/g, "-").slice(1).toLowerCase();

const SCRAMBLE_CHARS = "ABCDE01234!@#$%^&*";
const SCRAMBLE_INTERVAL = 30;

const FLAG = {
  en: "🇬🇧",
  pl: "🇵🇱",
};

function useScramble() {
  return useCallback((element, original) => {
    let i = 0;
    const iv = setInterval(() => {
      element.textContent = original
        .split("")
        .map((ch, idx) =>
          idx < i
            ? ch
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        )
        .join("");
      if (i++ >= original.length) clearInterval(iv);
    }, SCRAMBLE_INTERVAL);
  }, []);
}

function ScrambleButton({ label, onClick, className, "data-testid": testId }) {
  const ref = useRef(null);
  const scramble = useScramble();

  const handleMouseEnter = () => {
    if (ref.current) scramble(ref.current, label);
  };

  return (
    <button
      ref={ref}
      data-testid={testId}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {label}
    </button>
  );
}

function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    { code: "en", label: "English", flag: FLAG.en },
    { code: "pl", label: "Polski", flag: FLAG.pl },
  ];

  const current = options.find((o) => o.code === language) || options[0];

  return (
    <div ref={ref} className="relative" data-testid="language-switcher">
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="language-switcher-btn"
        className={`flex items-center gap-1.5 font-mono font-bold text-sm rounded-full border-2 border-[#0F172A] bg-white hover:bg-[#E7EBF7] transition-colors ${
          compact ? "px-2.5 py-1.5" : "px-3 py-2"
        }`}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <span role="img" aria-label={current.label}>
          {current.flag}
        </span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-white border-2 border-[#0F172A] rounded-2xl shadow-[4px_4px_0_#0F172A] overflow-hidden z-50"
            data-testid="language-dropdown"
          >
            {options.map((opt) => (
              <button
                key={opt.code}
                data-testid={`lang-option-${opt.code}`}
                onClick={() => {
                  setLanguage(opt.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold font-mono transition-colors ${
                  language === opt.code
                    ? "bg-[#1B2A63] text-white"
                    : "hover:bg-[#E7EBF7] text-[#0F172A]"
                }`}
              >
                <span role="img" aria-label={opt.label}>
                  {opt.flag}
                </span>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { ui, nav } = useData();
  const { language } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const big = isHome && !scrolled;

  const topNav = useMemo(() => {
    return [
      { path: "/", label: nav?.home || "Home" },
      { path: "/about", label: nav?.about || "About" },
      { path: "/what-is-steam", label: nav?.steam || "STEAM" },
      { path: "/programmes", label: nav?.workshops || "Workshops" },
      { path: "/gallery", label: nav?.gallery || "Gallery" },
      { path: "/documents", label: nav?.documents || "Documents" },
    ];
  }, [nav]);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        big ? "bg-transparent" : "bg-white/95 backdrop-blur border-b-2 border-[#0F172A]"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          big ? "h-24 sm:h-[190px]" : "h-20"
        }`}
      >
        <button
          onClick={() => goTo("/")}
          data-testid="logo"
          className="flex items-center shrink-0"
        >
          <img
            src={logo}
            alt="La Neuron – STEAM Academy"
            className={`w-auto transition-all duration-300 ${
              big ? "h-24 sm:h-[200px]" : "h-12 sm:h-16"
            }`}
          />
        </button>

        <nav className="hidden lg:flex items-center gap-0.5 ml-4">
          {topNav.map((n) => {
            const active = isActive(n.path);
            return (
              <ScrambleButton
                key={n.path}
                label={n.label}
                data-testid={`nav-${slug(n.path)}`}
                onClick={() => goTo(n.path)}
                className={`px-3 py-2 text-sm font-bold rounded-full transition-colors font-mono tracking-wide whitespace-nowrap ${
                  active
                    ? "bg-[#1B2A63] text-white"
                    : "text-[#0F172A] hover:bg-[#E7EBF7]"
                }`}
              />
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3 ml-4 shrink-0">
          <LanguageSwitcher />
          <ScrambleButton
            label={ui?.enquireNow || "Enquire Now"}
            data-testid="nav-register-btn"
            onClick={() => goTo("/register")}
            className="ln-btn ln-btn-enquire !px-5 !py-2.5 !text-sm font-mono tracking-wide whitespace-nowrap"
          />
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher compact />
          <button
            className="grid place-items-center w-10 h-10 rounded-xl border-2 border-[#0F172A] bg-white"
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-b-2 border-[#0F172A]"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {topNav.map((n) => (
                <ScrambleButton
                  key={n.path}
                  label={n.label}
                  onClick={() => goTo(n.path)}
                  className={`text-left px-3 py-3 font-bold rounded-xl font-mono tracking-wide ${
                    isActive(n.path)
                      ? "bg-[#1B2A63] text-white"
                      : "hover:bg-[#E7EBF7]"
                  }`}
                />
              ))}
              <ScrambleButton
                label={ui?.enquireNow || "Enquire Now"}
                onClick={() => goTo("/register")}
                className="ln-btn ln-btn-enquire mt-2 font-mono tracking-wide"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};