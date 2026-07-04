import { describe, it, expect } from "vitest";
import { en } from "../i18n/en";
import { pl } from "../i18n/pl";

/**
 * Helper: strip actual strings, keep only shape of objects
 */
const normalizeShape = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "string" ? "__STRING__" : value
    )
  );

describe("i18n structural sync", () => {
  it("en and pl have matching shapes", () => {
    const enShape = normalizeShape(en);
    const plShape = normalizeShape(pl);

    // en must contain everything pl has
    expect(enShape).toMatchObject(plShape);
    // pl must contain everything en has
    expect(plShape).toMatchObject(enShape);
  });

  it("programmeOptions length matches", () => {
    expect(en.programmeOptions.length).toBe(pl.programmeOptions.length);
  });

    it("register.labels keys match", () => {
    const enKeys = Object.keys(en.register.labels).sort();
    const plKeys = Object.keys(pl.register.labels).sort();
    expect(enKeys).toEqual(plKeys);
    });

  it("register.placeholders keys match", () => {
    const enKeys = Object.keys(en.register.placeholders).sort();
    const plKeys = Object.keys(pl.register.placeholders).sort();
    expect(enKeys).toEqual(plKeys);
  });
});

/**
 * Guard: no explicit week-based wording in PL form sections
 */
const bannedWeekWords = [
  "tydzień",
  "tygodniowy",
  "tygodniowe",
  "tygodniowych",
];

const containsBanned = (text) => {
  const lower = text.toLowerCase();
  return bannedWeekWords.some((w) => lower.includes(w));
};

describe("PL week-free form language", () => {
  it("PL register section has no week-based wording", () => {
    const regStrings = JSON.stringify(pl.register);
    expect(containsBanned(regStrings)).toBe(false);
  });

  it("PL programmeOptions has no week-based wording", () => {
    const progStrings = JSON.stringify(pl.programmeOptions);
    expect(containsBanned(progStrings)).toBe(false);
  });
});

/**
 * Stronger alignment rules for STEAM Thematic Workshop
 */
describe("STEAM Thematic Workshop wording alignment", () => {
  const enProg = en.programmes["STEAM Thematic Workshop 2026"];
  const plProg = pl.programmes["STEAM Thematic Workshop 2026"];

  it("PL title mentions STEAM and workshop", () => {
    const title = (plProg?.title || "").toLowerCase();

    // Ensure some form of STEAM appears
    expect(title.includes("steam")).toBe(true);

    // Ensure some form of warsztat/warsztaty appears
    const hasWorkshopWord =
      title.includes("warsztat") || title.includes("warsztaty");
    expect(hasWorkshopWord).toBe(true);
  });

  it("PL description avoids week-based and camp wording", () => {
    const desc = (plProg?.description || "").toLowerCase();

    // no 'jednotygodniowy' or similar, no 'obóz'
    expect(desc.includes("jednotygodni")).toBe(false);
    expect(desc.includes("obóz")).toBe(false);
  });
});

/**
 * Alignment rules for events.intro
 */
describe("events.intro alignment", () => {
  const enIntro = (en.events?.intro || "").toLowerCase();
  const plIntro = (pl.events?.intro || "").toLowerCase();

  it("PL intro mentions STEAM and labs (laboratoria)", () => {
    expect(plIntro.includes("steam")).toBe(true);

    const hasLabWord =
      plIntro.includes("laboratorium") ||
      plIntro.includes("laboratoria") ||
      plIntro.includes("lab");
    expect(hasLabWord).toBe(true);
  });

  it("PL intro avoids week/camp wording not present in EN", () => {
    // Only ban if EN doesn't talk about weeks/camps
    const banned = ["jednotygodni", "obóz", "obozy"];
    const hasBanned = banned.some((w) => plIntro.includes(w));
    expect(hasBanned).toBe(false);
  });
});

/**
 * Optional: global ban on legacy 'program letni' / 'jednotygodniowy obóz'
 * outside clearly intentional places.
 */
const bannedGlobalPhrases = ["jednotygodniowy", "program letni", "obóz"];

describe("PL has no legacy weekly/summer-program wording", () => {
  it("pl.js has no legacy week/camp phrases", () => {
    const text = JSON.stringify(pl).toLowerCase();
    const hits = bannedGlobalPhrases.filter((w) => text.includes(w));

    // If you want to allow some paths (e.g. events.weekHeading),
    // you can relax this later, but start strict now.
    expect(hits).toEqual([]);
  });
});

/**
 * Review helper: print EN vs PL pairs for manual wording review
 */
const collectStrings = (obj, prefix = "") => {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out.push({ path, value });
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === "string") {
          out.push({ path: `${path}[${i}]`, value: v });
        } else if (v && typeof v === "object") {
          out.push(...collectStrings(v, `${path}[${i}]`));
        }
      });
    } else if (value && typeof value === "object") {
      out.push(...collectStrings(value, path));
    }
  }
  return out;
};

const toMap = (arr) =>
  arr.reduce((acc, { path, value }) => {
    acc[path] = value;
    return acc;
  }, {});

describe("i18n manual review helper", () => {
  it("prints EN vs PL strings for review", () => {
    const enStrings = toMap(collectStrings(en));
    const plStrings = toMap(collectStrings(pl));

    const paths = Object.keys(enStrings).filter((p) => plStrings[p]);

    for (const path of paths) {
      console.log(
        `PATH: ${path}\n  EN: ${enStrings[path]}\n  PL: ${plStrings[path]}\n`
      );
    }
  });
});