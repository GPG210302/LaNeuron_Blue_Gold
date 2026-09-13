# La Neuron — Design Guide

Reference for laneuron.org. Written from the shipped code, not from intent.
When code and this document disagree, fix one of them the same day.

**Last reviewed:** September 2026

---

## 1. The one rule

**No new hex values in components.** Every colour must already exist in
`src/index.css` `:root`. If you need a colour that isn't there, add it to
`:root` first with a name, then use it. This is the rule that keeps five
pages looking like one site.

The same applies to fonts, radii and container widths below.

---

## 2. Colour

### Core palette — in `:root`, use everywhere

| Token | Hex | Used for |
|---|---|---|
| `--ln-bg` | `#FDFBF7` | Page background (cream). Set on `body`; never re-declare. |
| `--ln-ink` | `#0F172A` | Borders, hard shadows, darkest text |
| `--ln-science` | `#1B2A63` | **Navy. All headings** (set globally on `h1–h6`) |
| `--ln-science-light` | `#E7EBF7` | Navy tint — badges, pills, soft panels |
| `--ln-muted` | `#475569` | Body text |
| `--ln-gold` | `#E0B33C` | Gold accents, dividers |
| `--ln-gold-bright` | `#FBBF24` | Gold on dark backgrounds, highlights |

### Secondary palette — now in `:root`

| Hex | Name to give it | Used for |
|---|---|---|
| `#D4A514` | `--ln-gold-deep` | `✦` list markers, straplines on cream |
| `#334155` | `--ln-ink-soft` | Secondary body text |
| `#94A3B8` | `--ln-ink-faint` | Captions, disabled states |
| `#111A34` | `--ln-navy-deep` | Dark panel backgrounds |
| `#F1F5FF` | `--ln-on-navy` | Body text on dark panels |

### Accent set — one per card, never two in the same card

Text colours are darkened for contrast; tints are for backgrounds.

| Accent | Text | Tint | Bar/solid |
|---|---|---|---|
| Navy | `#1B2A63` | `#E7EBF7` | `#1B2A63` |
| Teal | `#0F8A78` | `#E7FAF6` | `#10B981` |
| Green | `#15803D` | `#ECFDF5` | `#15803D` |
| Orange | `#D65D16` | `#FFF1E7` | `#F97316` |
| Purple | `#7C3AED` | `#F5EEFF` | `#A855F7` |
| Rose | `#BE185D` | `#FFF1F6` | `#EC4899` |
| Gold | `#A76E00` | `#FFF8DE` | `#FBBF24` |

Accents are assigned **per card or per item**, not per section. Keep the
same accent for the same subject across pages — the Cyclic workshop is
teal everywhere, Research is navy, School & College is purple, Cognitive
Support is rose, Thematic is orange.

### Legacy — do not use in new work

`#3B82F6`, `#FB7185`, `#8B5CF6` and other bright blues/pinks survive in
older components (`STEAM`, `WHY`, `METHOD` arrays in `data.js`, and the
`WhyParentsSection` palettes on the home page). They predate the
navy/gold identity. Leave them until those sections are redesigned;
never copy them into new components.

`--ln-coral` is an alias of gold and means nothing. Remove it.

---

## 3. Type

- **Headings:** Outfit — applied via `h1–h6` and `.font-display`
- **Body:** DM Sans — set on `body`
- **Mono:** used for small labels, pills, step numbers and eyebrows.
  Apply with `font-mono` + `font-bold` + `tracking-[0.14em]` or wider.

Never introduce a third family.

| Element | Classes |
|---|---|
| Page H1 | `font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95]` |
| Section H2 | Use `<SectionHeading>` — do not hand-roll |
| Card H3 | `font-display text-xl sm:text-2xl font-extrabold` |
| Body | `text-base sm:text-lg leading-relaxed text-[#475569]` |
| Eyebrow | `.ln-overline` |
| Small label | `text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#475569]` |

Headings are navy automatically. Only override for a deliberate accent
(gold on navy panels, an accent colour on a coloured card).

---

## 4. Layout

**Container:** two widths, chosen by content type — both are correct.

| Width | Use for | Currently |
|---|---|---|
| `max-w-6xl mx-auto px-6 lg:px-8` | Pages people read — workshop pages, policy and document pages | Documents, SchoolCollege, ResearchWorkshop, Cyclic |
| `max-w-7xl mx-auto px-6 lg:px-8` | Card grids, galleries, and site chrome | Home, Hero, Programmes, Events, Gallery, Footer |

Prose wants a narrower measure; grids want room. Match the page you are
building to the closest existing one rather than picking by preference.

**Page shell:**

```jsx
<main className="min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-28">
  <div className="max-w-6xl mx-auto px-6 lg:px-8">
```

The `pt-28 sm:pt-32` clears the fixed navbar. Always include it.

**Section rhythm:**

```jsx
<section id="anchor" className="scroll-mt-32 pt-20">
```

`pt-16` for the first section after the hero, `pt-20` between major
sections. `scroll-mt-32` on anything a jump-link targets.

**Grids:** `grid gap-6 md:grid-cols-2 lg:grid-cols-3`. Five or more
items across is too narrow below 1280px — use `lg:grid-cols-3` and let
them wrap.

---

## 5. Components

### Use the class, not a copy of it

| Class | What it is |
|---|---|
| `.ln-card` | White, 2px ink border, `rounded-2xl`, `6px 6px 0` hard shadow |
| `.ln-card-hover` | Adds lift + deeper shadow on hover |
| `.ln-btn` | Base button — pill, ink border, hard shadow |
| `.ln-btn-primary` | Gold gradient fill |
| `.ln-btn-dark` / `.ln-btn-white` | Ink or white fill |
| `.ln-btn-enquire` | Pulsing gold glow — **navbar CTA only**. On other CTAs pair with `.ln-btn-no-glow` |
| `.ln-tag` | Small navy pill with icon |
| `.ln-overline` | Section eyebrow |

### Three card styles — pick by purpose

1. **Tactile** (`.ln-card`) — default. Structural, bordered, hard shadow.
2. **Soft** — `rounded-[22px] bg-white/75` with a dual neumorphic shadow
   and an accent bar wiping in on hover. For grids of 3+ light,
   scannable cards.
3. **Flip** — `[perspective:1400px]` + `[transform-style:preserve-3d]`,
   front face with heading, back face with detail. Use sparingly: the
   back face is invisible on print and needs an `onClick` fallback for
   touch.

Never mix styles 1 and 2 in the same grid.

### Radii — standardise on three

| Use | Radius |
|---|---|
| Pills, buttons, badges | `rounded-full` |
| Icon chips, inputs | `rounded-xl` |
| Cards and panels | `rounded-[22px]` |

Currently seven different custom radii are in use (`22px`, `24px`,
`2rem`, `28px`, `18px`, `1.75rem`, `2.5rem`). Collapse to the above when
editing a file. Don't do a sweeping rename — fix as you go.

### Shadows

| Purpose | Value |
|---|---|
| Tactile card | `6px 6px 0 #0F172A` → `8px 8px 0` on hover |
| Emphasis panel | `8px 8px 0 #1B2A63` or `8px 8px 0 #E0B33C` |
| Soft card | `8px 8px 18px rgba(148,163,184,0.18), -5px -5px 14px rgba(255,255,255,0.95)` |

---

## 6. Motion

Reusable components — import, don't reinvent:

| Component | Path | Purpose |
|---|---|---|
| `Reveal` | `@/components/Reveal` | Scroll-in. Variants: `fadeUp`, `fadeLeft`, `fadeRight`, `scaleUp`, `wipe`, `wipeLeft`, `blurIn` |
| `StaggerReveal` | same file | Staggers direct children |
| `SectionHeading` | same file | Overline + animated word-by-word title + sub |
| `HoverLift` | `@/animations/HoverLift` | Lift + scale on hover |
| `CursorSpotlight` | `@/animations/CursorSpotlight` | Gold glow following the cursor |
| `MagneticButton` | `@/animations/MagneticButton` | Button with sheen sweep |
| `MaskedText` | `@/animations/MaskedText` | Text revealed from a mask |
| `FlipCard` | `@/components/FlipCard` | Prebuilt flip card |

CSS helpers: `.ln-float`, `.ln-spin-slow`, `.ln-dash` (animated SVG
dashes), `.ln-spotlight-card` + `.ln-spotlight-glow`.

**Conventions**

- Stagger grids with `delay={index * 0.05}` — never above `0.08`,
  the last card takes too long.
- Easing is `[0.22, 1, 0.36, 1]` everywhere. Don't introduce new curves.
- Hover transitions `200–300ms`. Flips `700ms`.
- **Always honour `useReducedMotion()`** in custom animation. `Reveal`
  already does.

---

## 7. Bilingual content

Two patterns exist. **Use the second for new pages.**

1. **Shared keys** — `src/i18n/en.js` + `pl.js`, read via `useData()`.
   For content used in more than one place (programme cards, FAQ,
   navigation, footer).

2. **Local content object** — a `const content = { en: {...}, pl: {...} }`
   at the top of the page file, selected with
   `content[language === "pl" ? "pl" : "en"]`. For page-specific copy.
   Keeps both languages side by side and can't break i18n parity tests.

**Rules**

- Both languages always change together. Never ship an English-only string.
- Polish must be written for Polish parents, not translated literally.
  Have a native speaker review before launch.
- Keys in `en.js` and `pl.js` must match exactly — `audit-i18n.js`
  checks this.
- **Trap:** `useData()` looks up programme translations by their English
  title (`t('programmes.' + title)`). Renaming a programme in `data.js`
  silently breaks its Polish. Rename in all three files together.

---

## 8. Accessibility

- Focus rings: `focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40`
- Every interactive element gets a `data-testid`
- Decorative spans get `aria-hidden="true"`
- Icon-only buttons need `aria-label`
- Body text is `#475569` on cream — passes AA. `#94A3B8` does not; use
  it only for large or non-essential text.
- Content must never live only on a hover state. Flip-card backs need a
  click fallback.

---

## 9. Known debt

Fix opportunistically; don't schedule a sweep.

- **`ln-grid-bg` is undefined.** Used on `SchoolCollegeCollaboration` and
  `CyclicSteamWorkshops`; does nothing. Either define it or remove it.
- **Seven radii** where three would do.
- **Routed pages in `components/sections/`** — `ResearchWorkshop`,
  `Register`, `Events`, `Programmes` are pages.
- **`ResearchWorkshop.jsx` is 46KB** — copy and components in one file.
- **Worker URL hardcoded** in two components; should be one constant.
- **Hotlinked Pexels images** on two programme cards — slow, and they
  break if the URL changes. Convert to local `.webp`.
- **`--ln-coral`** is a meaningless alias of gold.
- **shadcn `--radius: 0.75rem`** is unused — every card hardcodes its own.

---

## 10. Before you ship

- [ ] Renders in EN and PL, no untranslated strings
- [ ] 375px, 768px, 1280px
- [ ] No new hex outside `:root`
- [ ] Hover and focus states on every interactive element
- [ ] `yarn build` clean
- [ ] Forms submit and the email arrives
- [ ] New page added to nav if it should be reachable
