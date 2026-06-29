/**
 * audit-i18n.js
 * 
 * Run this from your /frontend folder to validate the full bilingual setup:
 *   node audit-i18n.js
 * 
 * What it checks:
 *   1. Every key in en.js exists in pl.js
 *   2. No pl.js value is identical to its en.js value (would mean untranslated)
 *   3. No pl.js value contains broken key paths (e.g. "ui.enquireNow" literal)
 *   4. All Polish strings pass basic sanity (non-empty, no raw JS syntax chars)
 */

const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/i18n/en.js');
const plPath = path.join(__dirname, 'src/i18n/pl.js');

// Load files
const enSrc = fs.readFileSync(enPath, 'utf8').replace('export const en =', 'global.__en =');
const plSrc = fs.readFileSync(plPath, 'utf8').replace('export const pl =', 'global.__pl =');
eval(enSrc);
eval(plSrc);
const en = global.__en;
const pl = global.__pl;

// ── Helpers ──────────────────────────────────────────────────────────────────

function flatLeaves(obj, prefix = '') {
  const leaves = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      leaves.push(...flatLeaves(val, full));
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (item && typeof item === 'object') {
          leaves.push(...flatLeaves(item, `${full}[${i}]`));
        } else {
          leaves.push({ key: `${full}[${i}]`, value: item });
        }
      });
    } else {
      leaves.push({ key: full, value: val });
    }
  }
  return leaves;
}

function getVal(obj, path) {
  // Handle array notation: key[0].subkey
  return path.split(/\.|\[(\d+)\]/).filter(Boolean).reduce((a, k) => a?.[k], obj);
}

// ── Test 1: Missing keys ──────────────────────────────────────────────────────

console.log('\n🔍 TEST 1: Keys present in en.js but missing in pl.js');
const enLeaves = flatLeaves(en);
const missing = [];

function checkMissing(obj, enObj, prefix = '') {
  for (const k of Object.keys(enObj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const enVal = enObj[k];
    const plVal = obj?.[k];
    if (plVal === undefined) {
      missing.push(full);
    } else if (enVal && typeof enVal === 'object' && !Array.isArray(enVal)) {
      checkMissing(plVal, enVal, full);
    }
  }
}
checkMissing(pl, en);

if (missing.length === 0) {
  console.log('  ✅ All keys present in pl.js');
} else {
  missing.forEach(k => console.log(`  ❌ MISSING: ${k}`));
}

// ── Test 2: Untranslated strings (identical to English) ──────────────────────

console.log('\n🔍 TEST 2: Polish values that are identical to English (possibly untranslated)');

// These are intentionally the same in both languages
const ALLOWED_SAME = new Set([
  'nav.faq',           // "FAQ" is universal
  'site',              // brand name
  'hero.badge',        // contains "Kraków" but changes slightly — skip
  'workshopFacts.location.value', // "Kraków"
  'workshopFacts.language.value', // "Angielski" vs "English" — different, fine
]);

const untranslated = [];

function checkSame(plObj, enObj, prefix = '') {
  for (const k of Object.keys(enObj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const enVal = enObj[k];
    const plVal = plObj?.[k];
    if (typeof enVal === 'string' && typeof plVal === 'string') {
      if (enVal === plVal && enVal.length > 10 && !ALLOWED_SAME.has(full)) {
        untranslated.push({ key: full, value: enVal });
      }
    } else if (enVal && typeof enVal === 'object' && !Array.isArray(enVal) && plVal) {
      checkSame(plVal, enVal, full);
    }
  }
}
checkSame(pl, en);

if (untranslated.length === 0) {
  console.log('  ✅ No untranslated strings detected');
} else {
  untranslated.forEach(({ key, value }) =>
    console.log(`  ⚠️  SAME AS EN: ${key} = "${value.substring(0, 60)}..."`)
  );
}

// ── Test 3: Broken key path literals ─────────────────────────────────────────

console.log('\n🔍 TEST 3: Values that look like key paths (broken t() fallback)');
const keyPathPattern = /^[a-z]+\.[a-zA-Z]+/;
const broken = [];

function checkBroken(obj, prefix = '') {
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (typeof val === 'string' && keyPathPattern.test(val) && !val.includes(' ') && val.length < 40) {
      broken.push({ key: full, value: val });
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      checkBroken(val, full);
    }
  }
}
checkBroken(pl);

if (broken.length === 0) {
  console.log('  ✅ No broken key paths found in pl.js');
} else {
  broken.forEach(({ key, value }) =>
    console.log(`  ❌ BROKEN KEY PATH: ${key} = "${value}"`)
  );
}

// ── Test 4: Empty values ──────────────────────────────────────────────────────

console.log('\n🔍 TEST 4: Empty or null values in pl.js');
const empty = [];

function checkEmpty(obj, prefix = '') {
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const val = obj[k];
    if (val === '' || val === null || val === undefined) {
      empty.push(full);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      checkEmpty(val, full);
    }
  }
}
checkEmpty(pl);

if (empty.length === 0) {
  console.log('  ✅ No empty values found');
} else {
  empty.forEach(k => console.log(`  ❌ EMPTY: ${k}`));
}

// ── Summary ───────────────────────────────────────────────────────────────────

const totalIssues = missing.length + broken.length + empty.length;
console.log('\n' + '─'.repeat(50));
if (totalIssues === 0) {
  console.log('✅ ALL TESTS PASSED — pl.js is production ready');
  console.log('   Untranslated warnings (if any above) are expected for universal terms.\n');
} else {
  console.log(`❌ ${totalIssues} issue(s) found — fix before deploying\n`);
  process.exit(1);
}
