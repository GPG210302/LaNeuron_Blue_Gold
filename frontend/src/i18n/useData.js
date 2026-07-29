/**
 * useData.js
 *
 * Returns translated versions of all data arrays/objects.
 * Components import from this hook instead of data.js directly.
 * data.js (English originals) is NEVER modified — it stays as the source of truth
 * for non-text values (icons, colors, paths, images, links).
 *
 * HOW TO UPDATE CONTENT IN THE FUTURE:
 *   - Edit the English text in data.js  AND  the matching key in i18n/en.js
 *   - Edit the Polish text in i18n/pl.js
 *   - Both language versions will update automatically.
 */

import { useLanguage } from "./LanguageContext";
import {
  SITE,
  NAV,
  HERO,
  EDUCATOR,
  STEAM,
  WHY,
  METHOD,
  RECEIVE,
  AGE_GROUPS,
  PROGRAMMES,
  WORKSHOP_DAYS,
  WORKSHOP_FACTS,
  WEEKS,
  PROGRAMME_OPTIONS,
  FAQ,
} from "../data";

export function useData() {
  const { t, language } = useLanguage();

  const nav = NAV.map((n) => {
    const keyMap = {
      "/": "nav.home",
      "/about": "nav.about",
      "/what-is-steam": "nav.whatIsSteam",
      "/why-steam": "nav.whySteam",
      "/programmes": "nav.programmes",
      "/Thematic Workshop": "nav.summerProgram",
      "/faq": "nav.faq",
    };
    return { ...n, label: t(keyMap[n.path]) || n.label };
  });

  const site = {
    ...SITE,
    tagline: t("site.tagline"),
  };

  const heroStats = (t("hero.stats") || HERO.stats).map
    ? t("hero.stats") || HERO.stats
    : HERO.stats;

  const hero = {
    ...HERO,
    badge: t("hero.badge"),
    headline: t("hero.headline"),
    sub: t("hero.sub"),
    english: t("hero.english"),
    key: t("hero.key"),
    stats: (t("hero.stats") && Array.isArray(t("hero.stats")))
      ? t("hero.stats")
      : HERO.stats,
  };

  const educator = {
    ...EDUCATOR,
    overline: t("educator.overline"),
    intro: t("educator.intro"),
    philosophyTitle: t("educator.philosophyTitle"),
    philosophy: t("educator.philosophy"),
    backgroundTitle: t("educator.backgroundTitle"),
    background: t("educator.background") || EDUCATOR.background,
    highlight: t("educator.highlight"),
    badgeLabel: t("educator.badgeLabel"),
    badgeSubLabel: t("educator.badgeSubLabel"),
    tags: t("educator.tags") || EDUCATOR.tags,
    publishedTitle: t("educator.publishedTitle"),
  };

  const steam = STEAM.map((item) => {
    const trans = t(`steam.${item.word}`);
    return {
      ...item,
      word: trans?.title || item.word,
      text: trans?.description || item.text,
    };
  });

  const why = WHY.map((item) => {
    const trans = t(`why.${item.title}`);
    return {
      ...item,
      title: trans?.title || item.title,
      text: trans?.description || item.text,
    };
  });

  const method = METHOD.map((item, i) => {
    const trans = t("method");
    const transItem = Array.isArray(trans) ? trans[i] : null;
    return {
      ...item,
      title: transItem?.title || item.title,
      text: transItem?.description || item.text,
    };
  });

  const receive = RECEIVE.map((item, i) => {
    const trans = t("receive");
    const transText = Array.isArray(trans) ? trans[i] : null;
    return typeof item === "object"
      ? { ...item, text: transText || item.text }
      : transText || item;
  });

  const ageGroups = AGE_GROUPS.map((group) => {
    const trans = t(`ageGroups.${group.title}`);
    return {
      ...group,
      title: trans?.title || group.title,
      ages: trans?.ageRange || group.ages,
      points: trans?.activities || group.points,
    };
  });

  const programmes = PROGRAMMES.map((prog) => {
    const trans = t(`programmes.${prog.title}`);
    return {
      ...prog,
      title: trans?.title || prog.title,
      tag: trans?.type || prog.tag,
      text: trans?.description || prog.text,
    };
  });

  const workshopDays = WORKSHOP_DAYS.map((day, i) => {
    const trans = t("workshopDays");
    const transDay = Array.isArray(trans) ? trans[i] : null;
    return {
      ...day,
      day: transDay?.day || day.day,
      lab: transDay?.lab || day.lab,
      tagline: transDay?.theme || day.tagline,
      text: transDay?.description || day.text,
    };
  });

  const workshopFactsKeys = [
    "startDate",
    "endDate",
    "duration",
    "dailyTiming",
    "days",
    "groupSize",
    "location",
    "language",
  ];

  const workshopFacts = WORKSHOP_FACTS.map((fact, i) => {
    const key = workshopFactsKeys[i];
    const trans = t(`workshopFacts.${key}`);
    return {
      label: trans?.label || fact.label,
      value: trans?.value || fact.value,
    };
  });

  const weeksKeys = [
    "week1",
    "week2",
    "week3",
    "week4",
    "week5",
    "week6",
    "week7",
    "week8",
    "multiple",
  ];
  const weeks = WEEKS.map((w, i) => t(`weeks.${weeksKeys[i]}`) || w);

  const programmeOptions = PROGRAMME_OPTIONS.map((opt, i) => {
    const trans = t("programmeOptions");
    return Array.isArray(trans) && trans[i] ? trans[i] : opt;
  });

  const faq = FAQ.map((item, i) => {
    const trans = t("faq");
    const transItem = Array.isArray(trans) ? trans[i] : null;
    return {
      q: transItem?.question || item.q,
      a: transItem?.answer || item.a,
    };
  });

  const footer = {
    description: t("footer.description"),
    exploreTitle: t("footer.exploreTitle"),
    contactTitle: t("footer.contactTitle"),
    enquireBtn: t("footer.enquireBtn"),
    copyright: t("footer.copyright"),
    designerCredit:
      t("footer.designerCredit") ||
      "Website crafted by G3 Creative Labs · Ghavish V G · +48 579 156 009",
    facts:
      t("footer.facts") || [
        "Ages 6–13",
        "Mon–Fri 9AM–12PM",
        "Max 10 per week",
        "Starts 6 July 2026",
        "Kraków",
      ],
  };

  const register = {
    overline: t("register.overline"),
    heading: t("register.heading"),
    subtext: t("register.subtext"),
    promises: t("register.promises") || [],
    labels: t("register.labels") || {},
    placeholders: t("register.placeholders") || {},
    submit: t("register.submit"),
    sending: t("register.sending"),
    privacy: t("register.privacy"),
    successHeading: t("register.successHeading"),
    successText: t("register.successText"),
    successBtn: t("register.successBtn"),
    errorRequired: t("register.errorRequired"),
    errorGeneral: t("register.errorGeneral"),
  };

  const events = {
    overline: t("events.overline"),
    heading: t("events.heading"),
    tag: t("events.tag"),
    intro: t("events.intro"),
    weekHeading: t("events.weekHeading"),
    weekSub: t("events.weekSub"),
    tapExplore: t("events.tapExplore"),
    workshopDetailsHeading: t("events.workshopDetailsHeading"),
    statEducator: t("events.statEducator"),
    statAgeGroup: t("events.statAgeGroup"),
    statDiscount: t("events.statDiscount"),
    suitableNote: t("events.suitableNote"),
    reserveBtn: t("events.reserveBtn"),
  };

  const whatIsSteamI18n = {
    s1Overline: t("whatIsSteam.s1Overline"),
    s1Title: t("whatIsSteam.s1Title"),
    s1Sub: t("whatIsSteam.s1Sub"),
    s2Overline: t("whatIsSteam.s2Overline"),
    s2Title: t("whatIsSteam.s2Title"),
    s2Sub: t("whatIsSteam.s2Sub"),
    s3Overline: t("whatIsSteam.s3Overline"),
    s3Title: t("whatIsSteam.s3Title"),
    s3TimelineHeading: t("whatIsSteam.s3TimelineHeading"),
    s3Body1: t("whatIsSteam.s3Body1"),
    s3Body2: t("whatIsSteam.s3Body2"),
    s3Body3: t("whatIsSteam.s3Body3"),
    s3Quote: t("whatIsSteam.s3Quote"),
    s3QuoteCite: t("whatIsSteam.s3QuoteCite"),
    s4Overline: t("whatIsSteam.s4Overline"),
    s4Title: t("whatIsSteam.s4Title"),
    s4Sub: t("whatIsSteam.s4Sub"),
    s5Overline: t("whatIsSteam.s5Overline"),
    s5Title: t("whatIsSteam.s5Title"),
    s5Sub: t("whatIsSteam.s5Sub"),
    stats: t("whatIsSteam.stats") || [],
    timeline: t("whatIsSteam.timeline") || [],
    whoFollows: t("whatIsSteam.whoFollows") || [],
    misconceptions: t("whatIsSteam.misconceptions") || [],
  };

  const whySteamI18n = {
    overline: t("whySteam.overline"),
    title: t("whySteam.title"),
    sub: t("whySteam.sub"),
    tapExplore: t("whySteam.tapExplore"),
  };

  const approachI18n = {
    overline: t("approach.overline"),
    heading: t("approach.heading"),
    sub: t("approach.sub"),
    receiveHeading: t("approach.receiveHeading"),
  };

  const home = {
    whyParents: {
      overline: t("home.whyParents.overline"),
      title: t("home.whyParents.title"),
      sub: t("home.whyParents.sub"),
      items: t("home.whyParents.items") || [],
    },

    enrollingNow: {
      overline: t("home.enrollingNow.overline"),
      title: t("home.enrollingNow.title"),
      sub: t("home.enrollingNow.sub"),
      cta: t("home.enrollingNow.cta"),
      items: t("home.enrollingNow.items") || [],
    },

    featuredReview: {
      overline: t("home.featuredReview.overline"),
      title: t("home.featuredReview.title"),
      sub: t("home.featuredReview.sub"),
      items: t("home.featuredReview.items") || [],
    },

    latest: {
      overline: t("home.latest.overline"),
      title: t("home.latest.title"),
      sub: t("home.latest.sub"),
      items: t("home.latest.items") || [],
    },
  };

  const ui = {
    enquireNow: t("ui.enquireNow"),
  };

  return {
    site,
    nav,
    hero,
    educator,
    steam,
    why,
    method,
    receive,
    ageGroups,
    programmes,
    workshopDays,
    workshopFacts,
    weeks,
    programmeOptions,
    faq,
    footer,
    home,
    events,
    whatIsSteamI18n,
    whySteamI18n,
    approachI18n,
    register,
    ui,
    language,
  };
}