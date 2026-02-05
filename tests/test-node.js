/**
 * NumConvert — Comprehensive Node.js Test Suite
 * Tests pure logic + DOM integration using jsdom
 * Run:  node tests/test-node.js
 */

// ─── Minimal test framework ────────────────────────────
let _passed = 0, _failed = 0, _total = 0;
const _failures = [];

function describe(name, fn) {
  console.log(`\n  \x1b[1m\x1b[36m${name}\x1b[0m`);
  fn();
}

function it(name, fn) {
  _total++;
  try {
    fn();
    _passed++;
    console.log(`    \x1b[32m✓\x1b[0m ${name}`);
  } catch (e) {
    _failed++;
    _failures.push({ suite: name, error: e.message });
    console.log(`    \x1b[31m✗\x1b[0m ${name}`);
    console.log(`      \x1b[31m${e.message}\x1b[0m`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toContain(substr) {
      if (typeof actual !== 'string' || !actual.includes(substr))
        throw new Error(`Expected "${actual}" to contain "${substr}"`);
    },
    toBeTruthy() { if (!actual) throw new Error(`Expected truthy, got ${JSON.stringify(actual)}`); },
    toBeFalsy() { if (actual) throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`); },
    toBeGreaterThan(n) { if (!(actual > n)) throw new Error(`Expected ${actual} > ${n}`); },
    toMatch(re) { if (!re.test(String(actual))) throw new Error(`Expected "${actual}" to match ${re}`); },
    not: {
      toBe(expected) { if (actual === expected) throw new Error(`Expected NOT ${JSON.stringify(expected)}`); },
      toBeTruthy() { if (actual) throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`); },
    }
  };
}

// ═══════════════════════════════════════════════════════
//  UNIT TESTS — Pure functions extracted from script.js
// ═══════════════════════════════════════════════════════

function groupDigits(str, groupSize) {
  const rem = str.length % groupSize;
  let result = str.substring(0, rem);
  for (let i = rem; i < str.length; i += groupSize) {
    if (result) result += " ";
    result += str.substring(i, i + groupSize);
  }
  return result;
}

function formatForBase(value, base) {
  if (!value) return value;
  const upper = value.toUpperCase();
  switch (base) {
    case 2:  return groupDigits(upper, 4);
    case 16: return groupDigits(upper, 4);
    case 8:  return groupDigits(upper, 3);
    default: return upper;
  }
}

const baseChars = {
  2: /^[01]+$/i,
  8: /^[0-7]+$/i,
  10: /^[0-9]+$/i,
  16: /^[0-9a-f]+$/i,
};

const baseNames = { 2: "BIN", 8: "OCT", 10: "DEC", 16: "HEX" };

function convertNumber(raw, fromBase, toBase) {
  if (!baseChars[fromBase].test(raw)) return { error: "invalid" };
  const decimal = parseInt(raw, fromBase);
  if (isNaN(decimal)) return { error: "NaN" };
  const result = decimal.toString(toBase).toUpperCase();
  return { result, formatted: formatForBase(result, toBase), decimal };
}

function getRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// ═══════════════════════════════════════════════════════
console.log("\x1b[1m\n══════════════════════════════════════════════════");
console.log("  NumConvert — Professional Test Suite");
console.log("══════════════════════════════════════════════════\x1b[0m");

// ───── 1. DIGIT GROUPING ─────
describe("1. Digit Grouping — groupDigits()", () => {
  it("groups 8 binary digits → 2 groups of 4", () => {
    expect(groupDigits("10110011", 4)).toBe("1011 0011");
  });
  it("groups 5 binary digits with remainder", () => {
    expect(groupDigits("10110", 4)).toBe("1 0110");
  });
  it("exact group size → no space", () => {
    expect(groupDigits("1010", 4)).toBe("1010");
  });
  it("single digit → itself", () => {
    expect(groupDigits("1", 4)).toBe("1");
  });
  it("empty string → empty", () => {
    expect(groupDigits("", 4)).toBe("");
  });
  it("12-digit binary → 3 groups of 4", () => {
    expect(groupDigits("111100001111", 4)).toBe("1111 0000 1111");
  });
  it("octal groups of 3", () => {
    expect(groupDigits("17654321", 3)).toBe("17 654 321");
  });
  it("hex groups of 4", () => {
    expect(groupDigits("DEADBEEF", 4)).toBe("DEAD BEEF");
  });
  it("2 hex digits → no space", () => {
    expect(groupDigits("FF", 4)).toBe("FF");
  });
});

// ───── 2. FORMAT FOR BASE ─────
describe("2. Format for Base — formatForBase()", () => {
  it("binary → 4-digit groups", () => {
    expect(formatForBase("10110011", 2)).toBe("1011 0011");
  });
  it("hex → 4-digit groups, uppercased", () => {
    expect(formatForBase("deadbeef", 16)).toBe("DEAD BEEF");
  });
  it("octal → 3-digit groups", () => {
    expect(formatForBase("7654321", 8)).toBe("7 654 321");
  });
  it("decimal → no grouping", () => {
    expect(formatForBase("123456789", 10)).toBe("123456789");
  });
  it("empty string → falsy", () => {
    expect(formatForBase("", 2)).toBeFalsy();
  });
  it("null → falsy", () => {
    expect(formatForBase(null, 2)).toBeFalsy();
  });
  it("undefined → falsy", () => {
    expect(formatForBase(undefined, 2)).toBeFalsy();
  });
});

// ───── 3. INPUT VALIDATION ─────
describe("3. Input Validation — baseChars regex", () => {
  it("BIN: accepts 0s and 1s", () => {
    expect(baseChars[2].test("01010110")).toBe(true);
  });
  it("BIN: rejects 2", () => {
    expect(baseChars[2].test("102")).toBe(false);
  });
  it("BIN: rejects letters", () => {
    expect(baseChars[2].test("abc")).toBe(false);
  });
  it("OCT: accepts 0-7", () => {
    expect(baseChars[8].test("01234567")).toBe(true);
  });
  it("OCT: rejects 8", () => {
    expect(baseChars[8].test("8")).toBe(false);
  });
  it("OCT: rejects 9", () => {
    expect(baseChars[8].test("9")).toBe(false);
  });
  it("DEC: accepts 0-9", () => {
    expect(baseChars[10].test("0123456789")).toBe(true);
  });
  it("DEC: rejects letters", () => {
    expect(baseChars[10].test("12a")).toBe(false);
  });
  it("HEX: accepts 0-9a-fA-F", () => {
    expect(baseChars[16].test("0123456789abcdef")).toBe(true);
    expect(baseChars[16].test("ABCDEF")).toBe(true);
  });
  it("HEX: rejects g", () => {
    expect(baseChars[16].test("g")).toBe(false);
  });
  it("ALL: rejects empty string", () => {
    expect(baseChars[2].test("")).toBe(false);
    expect(baseChars[8].test("")).toBe(false);
    expect(baseChars[10].test("")).toBe(false);
    expect(baseChars[16].test("")).toBe(false);
  });
  it("ALL: rejects strings with spaces (formatting chars)", () => {
    expect(baseChars[2].test("10 11")).toBe(false);
    expect(baseChars[10].test("1 234")).toBe(false);
    expect(baseChars[16].test("DE AD")).toBe(false);
  });
});

// ───── 4. CORE CONVERSIONS ─────
describe("4. Core Number Conversion", () => {
  // DEC → BIN
  it("DEC 0 → BIN 0", () => expect(convertNumber("0", 10, 2).result).toBe("0"));
  it("DEC 1 → BIN 1", () => expect(convertNumber("1", 10, 2).result).toBe("1"));
  it("DEC 255 → BIN 11111111", () => expect(convertNumber("255", 10, 2).result).toBe("11111111"));
  it("DEC 1024 → BIN 10000000000", () => expect(convertNumber("1024", 10, 2).result).toBe("10000000000"));

  // BIN → DEC
  it("BIN 1010 → DEC 10", () => expect(convertNumber("1010", 2, 10).result).toBe("10"));
  it("BIN 11111111 → DEC 255", () => expect(convertNumber("11111111", 2, 10).result).toBe("255"));

  // DEC → HEX
  it("DEC 255 → HEX FF", () => expect(convertNumber("255", 10, 16).result).toBe("FF"));
  it("DEC 16 → HEX 10", () => expect(convertNumber("16", 10, 16).result).toBe("10"));
  it("DEC 3735928559 → HEX DEADBEEF", () => expect(convertNumber("3735928559", 10, 16).result).toBe("DEADBEEF"));

  // HEX → DEC
  it("HEX FF → DEC 255", () => expect(convertNumber("FF", 16, 10).result).toBe("255"));
  it("HEX A → DEC 10", () => expect(convertNumber("A", 16, 10).result).toBe("10"));
  it("HEX ff (lowercase) → DEC 255", () => expect(convertNumber("ff", 16, 10).result).toBe("255"));

  // DEC → OCT
  it("DEC 8 → OCT 10", () => expect(convertNumber("8", 10, 8).result).toBe("10"));
  it("DEC 255 → OCT 377", () => expect(convertNumber("255", 10, 8).result).toBe("377"));
  it("DEC 0 → OCT 0", () => expect(convertNumber("0", 10, 8).result).toBe("0"));

  // OCT → DEC
  it("OCT 377 → DEC 255", () => expect(convertNumber("377", 8, 10).result).toBe("255"));
  it("OCT 10 → DEC 8", () => expect(convertNumber("10", 8, 10).result).toBe("8"));

  // BIN → HEX
  it("BIN 11111111 → HEX FF", () => expect(convertNumber("11111111", 2, 16).result).toBe("FF"));
  it("BIN 1010 → HEX A", () => expect(convertNumber("1010", 2, 16).result).toBe("A"));

  // HEX → BIN
  it("HEX FF → BIN 11111111", () => expect(convertNumber("FF", 16, 2).result).toBe("11111111"));
  it("HEX A → BIN 1010", () => expect(convertNumber("A", 16, 2).result).toBe("1010"));

  // OCT ↔ HEX
  it("OCT 377 → HEX FF", () => expect(convertNumber("377", 8, 16).result).toBe("FF"));
  it("HEX FF → OCT 377", () => expect(convertNumber("FF", 16, 8).result).toBe("377"));

  // BIN ↔ OCT
  it("BIN 11111111 → OCT 377", () => expect(convertNumber("11111111", 2, 8).result).toBe("377"));
  it("OCT 377 → BIN 11111111", () => expect(convertNumber("377", 8, 2).result).toBe("11111111"));

  // Identity (same base)
  it("DEC → DEC identity", () => expect(convertNumber("42", 10, 10).result).toBe("42"));
  it("BIN → BIN identity", () => expect(convertNumber("1010", 2, 2).result).toBe("1010"));
  it("HEX → HEX identity", () => expect(convertNumber("FF", 16, 16).result).toBe("FF"));
  it("OCT → OCT identity", () => expect(convertNumber("77", 8, 8).result).toBe("77"));
});

// ───── 5. EDGE CASES ─────
describe("5. Edge Cases — Conversion", () => {
  it("0 in all cross-base combinations", () => {
    const bases = [2, 8, 10, 16];
    for (const from of bases) {
      for (const to of bases) {
        expect(convertNumber("0", from, to).result).toBe("0");
      }
    }
  });
  it("large number: DEC 1000000 → HEX F4240", () => {
    expect(convertNumber("1000000", 10, 16).result).toBe("F4240");
  });
  it("max 16-bit: DEC 65535 → HEX FFFF", () => {
    expect(convertNumber("65535", 10, 16).result).toBe("FFFF");
  });
  it("max 16-bit: DEC 65535 → BIN all 1s", () => {
    expect(convertNumber("65535", 10, 2).result).toBe("1111111111111111");
  });
  it("max 16-bit: DEC 65535 → OCT 177777", () => {
    expect(convertNumber("65535", 10, 8).result).toBe("177777");
  });
  it("powers of 2: 1,2,4,8,16,256", () => {
    expect(convertNumber("1", 10, 2).result).toBe("1");
    expect(convertNumber("2", 10, 2).result).toBe("10");
    expect(convertNumber("4", 10, 2).result).toBe("100");
    expect(convertNumber("8", 10, 2).result).toBe("1000");
    expect(convertNumber("16", 10, 2).result).toBe("10000");
    expect(convertNumber("256", 10, 2).result).toBe("100000000");
  });
  it("rejects invalid characters → error", () => {
    expect(convertNumber("102", 2, 10).error).toBe("invalid");
    expect(convertNumber("89", 8, 10).error).toBe("invalid");
    expect(convertNumber("GH", 16, 10).error).toBe("invalid");
  });
  it("rejects spaces in input", () => {
    expect(convertNumber("1010 1100", 2, 10).error).toBe("invalid");
    expect(convertNumber("12 34", 10, 2).error).toBe("invalid");
  });
});

// ───── 6. SWAP LOGIC ─────
describe("6. Swap Logic — Space Stripping", () => {
  it("stripping spaces from binary output → valid binary", () => {
    const formatted = formatForBase("11111111", 2);
    const stripped = formatted.replace(/\s/g, "");
    expect(baseChars[2].test(stripped)).toBe(true);
    expect(stripped).toBe("11111111");
  });
  it("stripping spaces from hex output → valid hex", () => {
    const formatted = formatForBase("DEADBEEF", 16);
    const stripped = formatted.replace(/\s/g, "");
    expect(baseChars[16].test(stripped)).toBe(true);
  });
  it("stripping spaces from octal output → valid octal", () => {
    const formatted = formatForBase("7654321", 8);
    const stripped = formatted.replace(/\s/g, "");
    expect(baseChars[8].test(stripped)).toBe(true);
  });
  it("decimal is not grouped, stripping is a no-op", () => {
    const formatted = formatForBase("123456789", 10);
    expect(formatted.replace(/\s/g, "")).toBe("123456789");
  });
});

// ───── 7. ROUND-TRIP INTEGRITY ─────
describe("7. Round-trip Conversion Integrity", () => {
  it("BIN→DEC→BIN lossless", () => {
    const r1 = convertNumber("10110011", 2, 10);
    const r2 = convertNumber(r1.result, 10, 2);
    expect(r2.result).toBe("10110011");
  });
  it("HEX→OCT→DEC→BIN→HEX lossless", () => {
    const orig = "1A3F";
    const s1 = convertNumber(orig, 16, 8);
    const s2 = convertNumber(s1.result, 8, 10);
    const s3 = convertNumber(s2.result, 10, 2);
    const s4 = convertNumber(s3.result, 2, 16);
    expect(s4.result).toBe(orig);
  });
  it("all-base round trip for 42", () => {
    const dec = "42";
    const bin = convertNumber(dec, 10, 2).result;
    const oct = convertNumber(dec, 10, 8).result;
    const hex = convertNumber(dec, 10, 16).result;
    expect(convertNumber(bin, 2, 10).result).toBe(dec);
    expect(convertNumber(oct, 8, 10).result).toBe(dec);
    expect(convertNumber(hex, 16, 10).result).toBe(dec);
  });
  it("swap simulation: convert → format → strip → re-convert", () => {
    // DEC 255 → BIN
    const r1 = convertNumber("255", 10, 2);
    const formatted = r1.formatted; // "1111 1111"
    const stripped = formatted.replace(/\s/g, ""); // "11111111"
    // Now BIN → DEC (swap)
    const r2 = convertNumber(stripped, 2, 10);
    expect(r2.result).toBe("255");
  });
});

// ───── 8. RELATIVE TIME ─────
describe("8. Relative Time Utility", () => {
  it("just now (< 5s)", () => {
    expect(getRelativeTime(Date.now() - 2000)).toBe("just now");
  });
  it("seconds ago", () => {
    expect(getRelativeTime(Date.now() - 30000)).toBe("30s ago");
  });
  it("minutes ago", () => {
    expect(getRelativeTime(Date.now() - 300000)).toBe("5m ago");
  });
  it("hours ago", () => {
    expect(getRelativeTime(Date.now() - 3 * 60 * 60 * 1000)).toBe("3h ago");
  });
  it("days ago", () => {
    expect(getRelativeTime(Date.now() - 2 * 24 * 60 * 60 * 1000)).toBe("2d ago");
  });
  it("old dates return a date string", () => {
    const old = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const result = getRelativeTime(old);
    expect(typeof result).toBe("string");
    // Should NOT contain 'ago' pattern for >7d
    expect(result.includes("d ago")).toBe(false);
  });
});

// ───── 9. BIT/BYTE META ─────
describe("9. Quick Reference — Bit/Byte Calculation", () => {
  function getBitInfo(decimal) {
    const bin = decimal.toString(2);
    const bits = bin.length;
    const bytes = Math.ceil(bits / 8);
    return { bits, bytes };
  }

  it("255 → 8 bits, 1 byte", () => {
    const { bits, bytes } = getBitInfo(255);
    expect(bits).toBe(8);
    expect(bytes).toBe(1);
  });
  it("256 → 9 bits, 2 bytes", () => {
    const { bits, bytes } = getBitInfo(256);
    expect(bits).toBe(9);
    expect(bytes).toBe(2);
  });
  it("0 → 1 bit, 1 byte", () => {
    const { bits, bytes } = getBitInfo(0);
    expect(bits).toBe(1);
    expect(bytes).toBe(1);
  });
  it("65535 → 16 bits, 2 bytes", () => {
    const { bits, bytes } = getBitInfo(65535);
    expect(bits).toBe(16);
    expect(bytes).toBe(2);
  });
  it("1 → 1 bit, 1 byte", () => {
    const { bits, bytes } = getBitInfo(1);
    expect(bits).toBe(1);
    expect(bytes).toBe(1);
  });
  it("16777215 (2^24-1) → 24 bits, 3 bytes", () => {
    const { bits, bytes } = getBitInfo(16777215);
    expect(bits).toBe(24);
    expect(bytes).toBe(3);
  });
});

// ───── 10. BASE NAMES MAPPING ─────
describe("10. Base Names & CSS Classes", () => {
  it("all 4 bases have names", () => {
    expect(baseNames[2]).toBe("BIN");
    expect(baseNames[8]).toBe("OCT");
    expect(baseNames[10]).toBe("DEC");
    expect(baseNames[16]).toBe("HEX");
  });
});

// ───── 11. COMPREHENSIVE CONVERSION MATRIX ─────
describe("11. Full Conversion Matrix (all base pairs)", () => {
  // Test value: decimal 170 = 10101010 bin = 252 oct = AA hex
  const testDecimal = 170;
  const expected = {
    2: "10101010",
    8: "252",
    10: "170",
    16: "AA"
  };
  const bases = [2, 8, 10, 16];

  for (const from of bases) {
    for (const to of bases) {
      it(`${baseNames[from]} ${expected[from]} → ${baseNames[to]} ${expected[to]}`, () => {
        expect(convertNumber(expected[from], from, to).result).toBe(expected[to]);
      });
    }
  }
});

// ───── 12. STRESS TEST ─────
describe("12. Stress Test — Many Values", () => {
  it("converts 0-255 DEC→BIN→DEC losslessly", () => {
    for (let i = 0; i <= 255; i++) {
      const bin = convertNumber(String(i), 10, 2).result;
      const back = convertNumber(bin, 2, 10).result;
      if (back !== String(i)) throw new Error(`Failed for ${i}: got ${back}`);
    }
  });
  it("converts 0-255 DEC→HEX→DEC losslessly", () => {
    for (let i = 0; i <= 255; i++) {
      const hex = convertNumber(String(i), 10, 16).result;
      const back = convertNumber(hex, 16, 10).result;
      if (back !== String(i)) throw new Error(`Failed for ${i}: got ${back}`);
    }
  });
  it("converts 0-255 DEC→OCT→DEC losslessly", () => {
    for (let i = 0; i <= 255; i++) {
      const oct = convertNumber(String(i), 10, 8).result;
      const back = convertNumber(oct, 8, 10).result;
      if (back !== String(i)) throw new Error(`Failed for ${i}: got ${back}`);
    }
  });
  it("all formatted values strip back to valid input (0-1000)", () => {
    for (let i = 0; i <= 1000; i++) {
      for (const base of [2, 8, 10, 16]) {
        const raw = i.toString(base).toUpperCase();
        const formatted = formatForBase(raw, base);
        const stripped = formatted.replace(/\s/g, "");
        if (stripped !== raw) throw new Error(`Base ${base}, value ${i}: "${stripped}" !== "${raw}"`);
        if (!baseChars[base].test(stripped)) throw new Error(`Base ${base}, value ${i}: stripped "${stripped}" fails validation`);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════
//  RESULTS SUMMARY
// ═══════════════════════════════════════════════════════
console.log("\n══════════════════════════════════════════════════");
if (_failed === 0) {
  console.log(`\x1b[1m\x1b[32m  ALL ${_total} TESTS PASSED ✓\x1b[0m`);
} else {
  console.log(`\x1b[1m\x1b[31m  ${_failed} FAILED\x1b[0m, \x1b[32m${_passed} passed\x1b[0m out of ${_total}`);
  console.log("\n  Failed tests:");
  _failures.forEach(f => console.log(`    \x1b[31m✗\x1b[0m ${f.suite}: ${f.error}`));
}
console.log("══════════════════════════════════════════════════\n");

process.exit(_failed > 0 ? 1 : 0);
