import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV } from "../data";
import logo from "../assets/logo.png";

const slug = (path) => (path === "/" ? "home" : path.slice(1));

const SCRAMBLE_CHARS = "ABCDE01234!@#$%^&*";
const SCRAMBLE_INTERVAL = 30;

function useScramble() {
  return useCallback((element, original) => {
    let i = 0;
    const iv = setInterval(() => {
      element.textContent = original
        .split("")
        .map((ch, idx) =>
          idx < i ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        )
        .join("");
      if (i++ >= original.length) clearInterval(iv);
    }, SCRAMBLE_INTERVAL);
  }, []);
}

function ScrambleButton({ label, onClick, className, style, "data-testid": testId }) {
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
      style={style}            {/* ← pass through style prop */}
    >
      {label}
    </button>
  );
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const big = isHome && !scrolled;

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
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
          big ? "h-28 sm:h-[220px]" : "h-20"
        }`}
      >
        <button onClick={() => goTo("/")} data-testid="logo" className="flex items-center">
          <img
            src={logo}
            alt="La Neuron – STEAM Academy"
            className={`w-auto transition-all duration-300 ${big ? "h-24 sm:h-[200px]" : "h-12 sm:h-16"}`}
          />
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => {
            const active = n.path === pathname;
            return (
              <ScrambleButton
                key={n.path}
                label={n.label}
                data-testid={`nav-${slug(n.path)}`}
                onClick={() => goTo(n.path)}
                className={`px-3 py-2 text-sm font-bold rounded-full transition-colors font-mono tracking-wide ${
                  active ? "bg-[#1B2A63] text-white" : "text-[#0F172A] hover:bg-[#E7EBF7]"
                }`}
              />
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* ── CHANGED: ln-btn-primary → ln-btn-enquire (glow, no shadow, navy border) ── */}
          <ScrambleButton
            label="Enquire Now"
            data-testid="nav-register-btn"
            onClick={() => goTo("/register")}
            className="hidden sm:inline-flex ln-btn ln-btn-enquire !px-5 !py-2.5 !text-sm font-mono tracking-wide"
            style={{ animationPlayState: "running", animationName: "goldGlow" }}
          />
          <button
            className="lg:hidden grid place-items-center w-10 h-10 rounded-xl border-2 border-[#0F172A] bg-white"
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
              {NAV.map((n) => (
                <ScrambleButton
                  key={n.path}
                  label={n.label}
                  onClick={() => goTo(n.path)}
                  className={`text-left px-3 py-3 font-bold rounded-xl font-mono tracking-wide ${
                    n.path === pathname ? "bg-[#1B2A63] text-white" : "hover:bg-[#E7EBF7]"
                  }`}
                />
              ))}
              {/* ── CHANGED: ln-btn-primary → ln-btn-enquire in mobile menu too ── */}
              <ScrambleButton
                label="Enquire Now"
                onClick={() => goTo("/register")}
                className="ln-btn ln-btn-enquire mt-2 font-mono tracking-wide"
                style={{ animationPlayState: "running", animationName: "goldGlow" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};