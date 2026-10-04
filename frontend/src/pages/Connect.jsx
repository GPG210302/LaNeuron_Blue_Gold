import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Pause,
  Play,
  ArrowRight,
  Briefcase,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  Star,
  Users,
} from "lucide-react";

import { useLanguage } from "@/i18n/LanguageContext";

/* ================================================================== */
/*  SETTINGS — everything you may want to change lives here            */
/* ================================================================== */

/* Brand colours — gold matched to the site's "Enquire Now" buttons */
const NAVY = "#1B2A63";
const GOLD = "#E0B33C";
const GOLD_LIGHT = "#F4D07A";
const GOLD_GRADIENT = `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`;
const INK = "#0F172A";

/* All destinations — add new platforms here later */
const CONTACT = {
  googleReview: "https://g.page/r/CYwos_0CjH9iEBM/review",
  instagram: "https://www.instagram.com/laneuron/",
  facebook: "https://www.facebook.com/p/La-Neuron-STEAM-Academy-61590731642982/",
  linkedin: "https://www.linkedin.com/company/laneuron/",
  whatsappMessage: "https://wa.me/message/UOGCXAUNI63MC1",
  whatsappCall: "https://call.whatsapp.com/voice/E0sTyslwioHikjhwn37Siv",
  email: "admin@laneuron.org",
  phoneDisplay: "+48 573 033 220",
  phoneRaw: "+48573033220",
};

/*
 * OFFICIAL LOGOS — put the official icon files in  frontend/public/brand/
 * with exactly these names. Until a file is there, a neutral icon is shown.
 * (.png also works — just change the extension here.)
 */
const BRAND_LOGOS = {
  google: "/brand/google.png",
  instagram: "/brand/instagram.png",
  facebook: "/brand/facebook.svg",
  linkedin: "/brand/linkedin.svg",
  whatsapp: "/brand/whatsapp.svg",
};

/*
 * LIVE POST WALL — the links are NOT in this file.
 * Edit  frontend/public/connect-posts.txt  (one link per line), then publish.
 */
const POSTS_FILE = "/connect-posts.txt";

/* Reads the posts file: keeps lines that start with http, ignores the rest */
const parsePostsFile = (raw) =>
  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^https?:\/\//i.test(line));

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

const EASE = [0.22, 1, 0.36, 1];

/* Official logo if the file exists, otherwise a neutral line icon */
const BrandIcon = ({ brand, fallback: Fallback, size = 24 }) => {
  const [failed, setFailed] = useState(false);
  const src = brand ? BRAND_LOGOS[brand] : null;
  if (!src || failed) return <Fallback size={size} />;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: "contain" }}
      draggable="false"
    />
  );
};

/* Animates on page load (not on scroll), so everything is visible at once */
const Appear = ({ children, delay = 0, className = "" }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/* Same look as the site's SectionHeading, without scroll-triggering */
const Heading = ({ overline, title }) => (
  <div className="max-w-3xl mx-auto text-center">
    <span className="ln-overline inline-flex items-center gap-2">
      <span className="inline-block h-[2px] w-5 rounded-full bg-current" />
      {overline}
    </span>
    <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">{title}</h2>
  </div>
);

const toEmbed = (url) => {
  const ig = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (ig) {
    return {
      platform: "Instagram",
      brand: "instagram",
      icon: Camera,
      embed: `https://www.instagram.com/${ig[1]}/${ig[2]}/embed/`,
      open: `https://www.instagram.com/${ig[1]}/${ig[2]}/`,
    };
  }

  if (url.includes("linkedin.com")) {
    let urn = null;
    const direct = url.match(/urn:li:(share|activity|ugcPost):(\d+)/);
    const activity = url.match(/activity-(\d+)/);
    if (direct) urn = `urn:li:${direct[1]}:${direct[2]}`;
    else if (activity) urn = `urn:li:activity:${activity[1]}`;
    if (!urn) return null;
    return {
      platform: "LinkedIn",
      brand: "linkedin",
      icon: Briefcase,
      embed: `https://www.linkedin.com/embed/feed/update/${urn}`,
      open: `https://www.linkedin.com/feed/update/${urn}/`,
    };
  }

  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    const isVideo = /\/videos\/|\/reel\/|fb\.watch|watch\/\?v=/.test(url);
    const plugin = isVideo ? "video.php" : "post.php";
    return {
      platform: "Facebook",
      brand: "facebook",
      icon: Users,
      embed: `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(
        url
      )}&show_text=true&width=380`,
      open: url,
    };
  }

  return null;
};

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/* ---------- open links in the native app where possible ---------- */
const UA = typeof navigator !== "undefined" ? navigator.userAgent : "";
const IS_ANDROID = /Android/i.test(UA);
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(UA);

/* Android: ask for the app directly, fall back to the browser if it is missing */
const ANDROID_APPS = [
  [/linkedin\.com/i, "com.linkedin.android"],
  [/instagram\.com/i, "com.instagram.android"],
  [/facebook\.com|fb\.watch/i, "com.facebook.katana"],
  [/wa\.me|whatsapp\.com/i, "com.whatsapp"],
];

const toIntent = (url, pkg) => {
  const u = new URL(url);
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=${u.protocol.replace(
    ":",
    ""
  )};package=${pkg};S.browser_fallback_url=${encodeURIComponent(url)};end`;
};

/* Props for an outside link: app on phones, new tab on computers */
const extLink = (url) => {
  if (!/^https?:/i.test(url)) return { href: url };
  if (IS_ANDROID) {
    const match = ANDROID_APPS.find(([re]) => re.test(url));
    if (match) return { href: toIntent(url, match[1]) };
  }
  if (IS_MOBILE) return { href: url }; // same tab lets iPhone hand over to the app
  return { href: url, target: "_blank", rel: "noopener noreferrer" };
};

/* Seconds each post / channel stays on screen (top strip and post wall move together) */
const SLIDE_MS = 4000;

/* Shuffle, then alternate platforms so the top strip flips every time */
const interleave = (items) => {
  const groups = {};
  shuffle(items).forEach((item) => {
    (groups[item.brand] = groups[item.brand] || []).push(item);
  });
  const queues = shuffle(Object.values(groups));
  const out = [];
  while (queues.some((q) => q.length)) {
    queues.forEach((q) => {
      if (q.length) out.push(q.shift());
    });
  }
  return out;
};

/* Clipboard with fallback for older / in-app browsers */
const copyText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
};

/* ================================================================== */
/*  Channel card                                                       */
/* ================================================================== */
const ChannelCard = ({ channel, text, wide = false }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const ok = await copyText(channel.copy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const linkProps = channel.external ? extLink(channel.href) : { href: channel.href };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group relative ln-card h-full overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[4px] w-0 transition-all duration-500 ease-out group-hover:w-full"
        style={{ background: GOLD_GRADIENT }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "rgba(224, 179, 60, 0.18)" }}
      />

      <a
        {...linkProps}
        className={`relative flex h-full flex-col p-6 sm:p-7 ${
          channel.copy ? "pr-16 sm:pr-20" : ""
        } focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1B2A63]/30`}
      >
        <div className="flex items-start gap-4">
          <span
            className={`relative grid shrink-0 place-items-center rounded-2xl border-2 bg-white transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 ${
              wide ? "h-16 w-16" : "h-14 w-14"
            }`}
            style={{ borderColor: NAVY, color: NAVY, boxShadow: `3px 3px 0 ${INK}` }}
          >
            <BrandIcon brand={channel.brand} fallback={channel.icon} size={wide ? 34 : 28} />
            {channel.badge && (
              <span
                className="absolute -bottom-2 -right-2 grid h-6 w-6 place-items-center rounded-full border-2 bg-white"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                <channel.badge size={12} />
              </span>
            )}
          </span>

          <div className="min-w-0">
            {channel.tag && (
              <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-[#1B2A63]">
                {channel.tag}
              </p>
            )}
            <h3
              className={`font-display font-extrabold leading-tight text-[#0F172A] ${
                wide ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
              }`}
            >
              {channel.label}
            </h3>
            {channel.meta && (
              <p className="mt-1 break-all font-mono text-sm font-bold text-[#1B2A63]">
                {channel.meta}
              </p>
            )}
          </div>
        </div>

        <p
          className={`mt-4 flex-1 leading-relaxed text-[#475569] ${
            wide ? "text-base sm:text-lg max-w-2xl" : "text-base"
          }`}
        >
          {channel.sub}
        </p>

        {channel.stars && (
          <div className="mt-5 flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={wide ? 32 : 26}
                className="fill-current transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12"
                style={{ color: GOLD, transitionDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        )}

        <span
          className={`mt-6 inline-flex items-center gap-2 font-mono font-bold ${
            channel.stars
              ? "ln-btn ln-btn-enquire self-start !px-5 !py-3 !text-sm"
              : "text-sm text-[#1B2A63]"
          }`}
        >
          {channel.cta}
          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
          />
        </span>
      </a>

      {channel.copy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`${text.copy}: ${channel.meta}`}
          title={copied ? text.copied : text.copy}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white text-[#1B2A63] transition hover:-translate-y-0.5"
          style={{ borderColor: NAVY }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "ok" : "copy"}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
            >
              {copied ? <Check size={18} /> : <Copy size={16} />}
            </motion.span>
          </AnimatePresence>
        </button>
      )}
    </motion.article>
  );
};

/* ================================================================== */
/*  Live post wall (real embeds, random order, auto-flick)             */
/* ================================================================== */
const PostWall = ({
  text,
  posts,
  index,
  onSelect,
  onHover,
  paused,
  onTogglePause,
  wallRef,
  reloadKeys,
}) => {
  const count = posts.length;
  const go = (next) => onSelect((next + count) % count);

  if (!count) return null;

  const current = posts[index];

  return (
    <div
      className="mx-auto w-full max-w-[400px]"
      ref={wallRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHover(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#1B2A63]">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: GOLD }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: GOLD }}
            />
          </span>
          {text.live}
        </span>
        <a
          {...extLink(current.open)}
          className="group inline-flex items-center gap-1.5 font-mono text-sm font-bold text-[#1B2A63]"
        >
          <BrandIcon brand={current.brand} fallback={current.icon} size={16} />
          {text.openOn} {current.platform}
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>

      <div className="relative">
        {/* stacked-deck effect */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rotate-[-4deg] rounded-[28px] border-2 bg-[#E7EBF7]"
          style={{ borderColor: NAVY }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rotate-[3deg] rounded-[28px] border-2 bg-white"
          style={{ borderColor: GOLD }}
        />

        <div
          className="relative h-[600px] overflow-hidden rounded-[28px] border-2 bg-white"
          style={{ borderColor: INK, boxShadow: `8px 8px 0 ${INK}` }}
        >
          {posts.map((post, i) => (
              <div
                key={`${post.embed}-${reloadKeys[i] || 0}`}
                className={`absolute inset-0 transition-all duration-500 ease-out ${
                  i === index
                    ? "opacity-100 translate-x-0 scale-100"
                    : "pointer-events-none opacity-0 translate-x-8 scale-95"
                }`}
                aria-hidden={i !== index}
              >
                <iframe
                  src={post.embed}
                  title={`${post.platform} post ${i + 1}`}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  allow="encrypted-media; picture-in-picture; clipboard-write"
                  allowFullScreen
                />
              </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={text.previous}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] text-[#1B2A63] transition hover:-translate-y-0.5"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {posts.map((post, i) => (
              <button
                key={post.embed}
                type="button"
                onClick={() => go(i)}
                aria-label={`${post.platform} ${i + 1}`}
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 22 : 10,
                  background: i === index ? GOLD_GRADIENT : "rgba(27, 42, 99, 0.25)",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={paused ? text.resume : text.pause}
            title={paused ? text.resume : text.pause}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1B2A63] text-[#0F172A] transition hover:-translate-y-0.5"
            style={{ background: paused ? GOLD_GRADIENT : "#fff" }}
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={text.next}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] text-[#1B2A63] transition hover:-translate-y-0.5"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */
const Connect = () => {
  const { language } = useLanguage();
  const isPolish = language === "pl";
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  /* The small QR code opens /CONNECT (uppercase keeps the code smaller):
     tidy the address to /connect */
  useEffect(() => {
    if (location.pathname !== "/connect") {
      navigate(`/connect${location.search}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const text = {
    badge: isPolish ? "Dziękujemy" : "Thank you",
    title: isPolish
      ? "Podobały się zajęcia w La Neuron?"
      : "Enjoyed your time at La Neuron?",
    intro: isPolish
      ? "Twoja opinia pomaga innym rodzicom w Krakowie odkryć naukę przez działanie. Zajmie to mniej niż minutę."
      : "Your review helps other parents in Kraków discover hands-on STEAM learning. It takes less than a minute.",
    tickerLabel: isPolish ? "Na naszych kanałach" : "On our channels",
    followOverline: isPolish ? "Bądź na bieżąco" : "Follow along",
    followTitle: isPolish ? "Zobacz, co tworzymy" : "See what we're building",
    live: isPolish ? "Z naszych kanałów" : "From our channels",
    openOn: isPolish ? "Otwórz w" : "Open on",
    previous: isPolish ? "Poprzedni" : "Previous",
    pause: isPolish ? "Zatrzymaj przewijanie" : "Pause slideshow",
    resume: isPolish ? "Wznów przewijanie" : "Resume slideshow",
    next: isPolish ? "Następny" : "Next",
    siteTitle: isPolish ? "Poznaj całą stronę" : "Explore the full website",
    siteText: isPolish
      ? "Warsztaty, badania, galeria i dokumenty dla rodziców."
      : "Workshops, research, gallery and documents for parents.",
    siteButton: isPolish ? "Przejdź na stronę" : "Visit website",
    talkOverline: isPolish ? "Porozmawiajmy" : "Talk to us",
    talkTitle: isPolish ? "Napisz lub zadzwoń" : "Message or call",
    copy: isPolish ? "Kopiuj" : "Copy",
    copied: isPolish ? "Skopiowano" : "Copied",
    pageTitle: isPolish ? "Kontakt | La Neuron" : "Connect | La Neuron",
  };

  /* 1 — Google review */
  const review = {
    id: "google-review",
    icon: Star,
    brand: "google",
    tag: "Google",
    label: isPolish ? "Wystaw nam opinię" : "Leave us a review",
    sub: isPolish
      ? "Napisz kilka słów o tym, co Twoje dziecko zbudowało, odkryło lub polubiło w La Neuron."
      : "Share a few words about what your child built, discovered or loved at La Neuron.",
    cta: isPolish ? "Napisz opinię w Google" : "Write a Google review",
    href: CONTACT.googleReview,
    external: true,
    stars: true,
  };

  /* 2 — Social */
  const follow = [
    {
      id: "instagram",
      icon: Camera,
      brand: "instagram",
      label: "Instagram",
      meta: "@laneuron",
      sub: isPolish
        ? "Chwile z warsztatów, eksperymenty i rolki."
        : "Workshop moments, experiments and reels.",
      cta: isPolish ? "Obserwuj" : "Follow",
      href: CONTACT.instagram,
      external: true,
    },
    {
      id: "facebook",
      icon: Users,
      brand: "facebook",
      label: "Facebook",
      meta: "La Neuron – STEAM Academy",
      sub: isPolish
        ? "Aktualności, wydarzenia i informacje dla rodziców."
        : "News, events and updates for parents.",
      cta: isPolish ? "Polub stronę" : "Like our page",
      href: CONTACT.facebook,
      external: true,
    },
    {
      id: "linkedin",
      icon: Briefcase,
      brand: "linkedin",
      label: "LinkedIn",
      meta: "La Neuron",
      sub: isPolish
        ? "Badania, współpraca ze szkołami i partnerstwa."
        : "Research, school collaborations and partnerships.",
      cta: isPolish ? "Obserwuj" : "Follow",
      href: CONTACT.linkedin,
      external: true,
    },
  ];

  /* 4 — Contact (in the requested order) */
  const talk = [
    {
      id: "whatsapp-message",
      icon: MessageCircle,
      brand: "whatsapp",
      tag: "WhatsApp",
      label: isPolish ? "Napisz na WhatsApp" : "Message on WhatsApp",
      sub: isPolish
        ? "Szybkie pytania o zajęcia, terminy i wolne miejsca."
        : "Quick questions about workshops, dates and available places.",
      cta: isPolish ? "Otwórz czat" : "Open chat",
      href: CONTACT.whatsappMessage,
      external: true,
    },
    {
      id: "whatsapp-call",
      icon: PhoneCall,
      brand: "whatsapp",
      badge: Phone,
      tag: "WhatsApp",
      label: isPolish ? "Zadzwoń przez WhatsApp" : "Call on WhatsApp",
      sub: isPolish
        ? "Porozmawiaj z nami przez internet, bez kosztów połączenia."
        : "Talk to us over the internet, with no call charges.",
      cta: isPolish ? "Rozpocznij rozmowę" : "Start a call",
      href: CONTACT.whatsappCall,
      external: true,
    },
    {
      id: "email",
      icon: Mail,
      tag: "E-mail",
      label: isPolish ? "Napisz e-mail" : "Write an email",
      meta: CONTACT.email,
      copy: CONTACT.email,
      sub: isPolish
        ? "W sprawie zapisów, dokumentów i dłuższych pytań."
        : "For enrolment, documents and longer questions.",
      cta: isPolish ? "Napisz wiadomość" : "Write an email",
      href: `mailto:${CONTACT.email}`,
      external: false,
    },
    {
      id: "phone",
      icon: Phone,
      tag: isPolish ? "Telefon" : "Phone",
      label: isPolish ? "Zadzwoń do nas" : "Call us",
      meta: CONTACT.phoneDisplay,
      copy: CONTACT.phoneRaw,
      sub: isPolish
        ? "Wolisz zwykłe połączenie? Zadzwoń bezpośrednio."
        : "Prefer a regular call? Ring us directly.",
      cta: isPolish ? "Zadzwoń" : "Call now",
      href: `tel:${CONTACT.phoneRaw}`,
      external: false,
    },
  ];

  /* load post links from public/connect-posts.txt */
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let cancelled = false;
    fetch(POSTS_FILE, { cache: "no-cache" })
      .then((res) => (res.ok ? res.text() : ""))
      .then((raw) => {
        if (cancelled) return;
        const unique = [...new Set(parsePostsFile(raw))];
        setPosts(interleave(unique.map(toEmbed).filter(Boolean)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const hasPosts = posts.length > 0;

  /* one shared timer drives the top strip AND the post wall */
  const [slide, setSlide] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false); // mouse over the wall
  const [engaged, setEngaged] = useState(false); // viewer tapped into a post / video
  const [userPaused, setUserPaused] = useState(false); // pause button
  const [reloadKeys, setReloadKeys] = useState({});
  const wallRef = useRef(null);
  const touchedRef = useRef(new Set());
  const prevSlideRef = useRef(0);
  const paused = hoverPaused || engaged || userPaused;
  const slideCount = hasPosts ? posts.length : follow.length;

  /* Tapping into an embedded post moves focus into its frame: pause until
     the viewer comes back to the page (or after 3 minutes at the latest). */
  useEffect(() => {
    const onBlur = () =>
      setTimeout(() => {
        const el = document.activeElement;
        if (el && el.tagName === "IFRAME" && wallRef.current?.contains(el)) {
          touchedRef.current.add(prevSlideRef.current);
          setEngaged(true);
        }
      }, 0);
    const onFocus = () => setEngaged(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    if (!engaged) return undefined;
    const id = setTimeout(() => setEngaged(false), 180000);
    return () => clearTimeout(id);
  }, [engaged]);

  useEffect(() => {
    setSlide(0);
  }, [slideCount]);

  useEffect(() => {
    if (reduceMotion || paused || slideCount < 2) return undefined;
    const id = setInterval(() => setSlide((n) => (n + 1) % slideCount), SLIDE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, paused, slideCount]);

  const safeSlide = slide % slideCount;

  /* When moving away from a post the viewer played, reload it so the
     video stops instead of playing on in the background. */
  useEffect(() => {
    const prev = prevSlideRef.current;
    if (prev !== safeSlide && touchedRef.current.has(prev)) {
      touchedRef.current.delete(prev);
      setReloadKeys((keys) => ({ ...keys, [prev]: (keys[prev] || 0) + 1 }));
      setEngaged(false);
    }
    prevSlideRef.current = safeSlide;
  }, [safeSlide]);
  const current = hasPosts
    ? follow.find((f) => f.id === posts[safeSlide]?.brand) || follow[0]
    : follow[safeSlide];

  const pickChannel = (i) => {
    if (!hasPosts) return setSlide(i);
    const target = posts.findIndex((p) => p.brand === follow[i].id);
    if (target >= 0) setSlide(target);
    return undefined;
  };

  /* page title + keep this page out of search results */
  useEffect(() => {
    const previousTitle = document.title;
    document.title = text.pageTitle;

    let robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots ? robots.getAttribute("content") : null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");

    return () => {
      document.title = previousTitle;
      if (previousRobots === null) robots.remove();
      else robots.setAttribute("content", previousRobots);
    };
  }, [text.pageTitle]);

  /* orbit decoration */
  const orbitIcons = [
    { brand: "google", Icon: Star, deg: 0 },
    { brand: "instagram", Icon: Camera, deg: 72 },
    { brand: "facebook", Icon: Users, deg: 144 },
    { brand: "linkedin", Icon: Briefcase, deg: 216 },
    { brand: "whatsapp", Icon: MessageCircle, deg: 288 },
  ];
  const spin = reduceMotion ? undefined : { rotate: 360 };
  const counterSpin = reduceMotion ? undefined : { rotate: -360 };
  const spinTransition = { duration: 28, repeat: Infinity, ease: "linear" };

  return (
    <main className="ln-grid-bg min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-28 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* ============ 1. HERO + GOOGLE REVIEW ============ */}
        <div className="relative">
          <div
            className="pointer-events-none absolute -top-4 right-4 hidden lg:block"
            aria-hidden="true"
          >
            <div className="relative h-64 w-64">
              <div
                className="absolute inset-4 rounded-full border-2 border-dashed"
                style={{ borderColor: "rgba(224, 179, 60, 0.75)" }}
              />
              <div
                className="absolute inset-16 rounded-full border-2"
                style={{ borderColor: GOLD }}
              />
              <motion.div className="absolute inset-0" animate={spin} transition={spinTransition}>
                {orbitIcons.map(({ brand, Icon, deg }) => (
                  <div
                    key={deg}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-112px) rotate(${-deg}deg)`,
                    }}
                  >
                    <motion.div
                      animate={counterSpin}
                      transition={spinTransition}
                      className="grid h-12 w-12 place-items-center rounded-xl border-2"
                      style={{
                        borderColor: NAVY,
                        color: NAVY,
                        background: "#fff",
                        boxShadow: `3px 3px 0 ${INK}`,
                      }}
                    >
                      <BrandIcon brand={brand} fallback={Icon} size={24} />
                    </motion.div>
                  </div>
                ))}
              </motion.div>
              <motion.span
                className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: GOLD_GRADIENT }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        boxShadow: [
                          "0 0 0 0 rgba(224,179,60,0.55)",
                          "0 0 0 18px rgba(224,179,60,0)",
                        ],
                      }
                }
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </div>
          </div>

          <Appear>
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border-2 border-[#1B2A63] bg-[#E7EBF7] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#1B2A63]">
                {text.badge}
              </span>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] text-[#0F172A] lg:max-w-2xl">
                {text.title}
              </h1>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#475569] lg:max-w-xl">
                {text.intro}
              </p>
            </div>
          </Appear>

          <div className="mt-10">
            <Appear delay={0.1}>
              <div className="relative">
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2 rounded-[32px] blur-xl"
                  style={{ background: GOLD_GRADIENT }}
                  initial={{ opacity: 0.25 }}
                  animate={reduceMotion ? { opacity: 0.35 } : { opacity: [0.2, 0.65, 0.2] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative">
                  <ChannelCard channel={review} text={text} wide />
                </div>
              </div>
            </Appear>
          </div>
        </div>

        {/* ============ 2. SOCIAL MEDIA ============ */}
        <section className="pt-20">
          <Appear delay={0.2}>
            <Heading overline={text.followOverline} title={text.followTitle} />
          </Appear>

          {/* flicking teaser */}
          <Appear delay={0.25}>
            <div className="mt-10 ln-card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-mono font-bold text-[#1B2A63]">
                  {text.tickerLabel}
                </span>
                <div className="flex gap-1.5">
                  {follow.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pickChannel(i)}
                      aria-label={item.label}
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: item.id === current.id ? 22 : 10,
                        background: item.id === current.id ? GOLD_GRADIENT : "rgba(27, 42, 99, 0.25)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="relative mt-3 h-[64px] overflow-hidden" style={{ perspective: 600 }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.a
                    key={current.id}
                    {...extLink(current.href)}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="group absolute inset-0 flex items-center gap-4"
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 bg-white transition-transform duration-300 group-hover:-rotate-6"
                      style={{ borderColor: NAVY, color: NAVY }}
                    >
                      <BrandIcon brand={current.brand} fallback={current.icon} size={26} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-extrabold leading-tight text-[#0F172A]">
                        {current.label}{" "}
                        <span className="font-mono text-sm font-bold text-[#1B2A63]">
                          {current.meta}
                        </span>
                      </span>
                      <span className="block truncate text-sm text-[#475569]">{current.sub}</span>
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-[#1B2A63] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                    />
                  </motion.a>
                </AnimatePresence>
              </div>
            </div>
          </Appear>

          {hasPosts ? (
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_400px]">
              <div className="grid gap-6">
                {follow.map((channel, index) => (
                  <Appear key={channel.id} delay={0.3 + index * 0.05}>
                    <ChannelCard channel={channel} text={text} />
                  </Appear>
                ))}
              </div>
              <Appear delay={0.35}>
                <PostWall
                  text={text}
                  posts={posts}
                  index={safeSlide}
                  onSelect={setSlide}
                  onHover={setHoverPaused}
                  paused={paused}
                  onTogglePause={() => {
                    if (paused) {
                      setUserPaused(false);
                      setEngaged(false);
                    } else {
                      setUserPaused(true);
                    }
                  }}
                  wallRef={wallRef}
                  reloadKeys={reloadKeys}
                />
              </Appear>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {follow.map((channel, index) => (
                <Appear key={channel.id} delay={0.3 + index * 0.05}>
                  <ChannelCard channel={channel} text={text} />
                </Appear>
              ))}
            </div>
          )}
        </section>

        {/* ============ 3. MAIN WEBSITE ============ */}
        <section className="pt-20">
          <Appear delay={0.45}>
            <div
              className="relative overflow-hidden rounded-[28px] border-2 px-6 py-10 sm:px-10 sm:py-12"
              style={{ background: NAVY, borderColor: INK, boxShadow: `8px 8px 0 ${INK}` }}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-2 border-dashed"
                style={{ borderColor: "rgba(224, 179, 60, 0.5)" }}
                animate={spin}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 bg-white"
                    style={{ borderColor: GOLD, color: NAVY }}
                  >
                    <Globe size={24} />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                      {text.siteTitle}
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-white/80">{text.siteText}</p>
                  </div>
                </div>
                <Link
                  to="/"
                  className="group ln-btn ln-btn-enquire ln-btn-no-glow inline-flex shrink-0 items-center justify-center gap-2 !px-6 !py-3 !text-sm font-mono tracking-wide"
                >
                  {text.siteButton}
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </Appear>
        </section>

        {/* ============ 4. CONTACT ============ */}
        <section className="pt-20">
          <Appear delay={0.5}>
            <Heading overline={text.talkOverline} title={text.talkTitle} />
          </Appear>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {talk.map((channel, index) => (
              <Appear key={channel.id} delay={0.55 + index * 0.05}>
                <ChannelCard channel={channel} text={text} />
              </Appear>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Connect;
