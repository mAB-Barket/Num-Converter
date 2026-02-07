(() => {
  "use strict";

  // ── DOM Elements ──────────────────────────────────────
  const inputValue = document.getElementById("inputValue");
  const outputValue = document.getElementById("outputValue");
  const inputBase = document.getElementById("inputBase");
  const outputBase = document.getElementById("outputBase");
  const inputBadge = document.getElementById("inputBadge");
  const outputBadge = document.getElementById("outputBadge");
  const swapBtn = document.getElementById("swapBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");
  const errorMsg = document.getElementById("errorMsg");
  const themeToggle = document.getElementById("themeToggle");
  const historyList = document.getElementById("historyList");
  const historyCount = document.getElementById("historyCount");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const toast = document.getElementById("toast");
  const qrBin = document.getElementById("qrBin");
  const qrOct = document.getElementById("qrOct");
  const qrDec = document.getElementById("qrDec");
  const qrHex = document.getElementById("qrHex");
  const quickRef = document.getElementById("quickRef");
  const quickRefMeta = document.getElementById("quickRefMeta");

  // ── State ─────────────────────────────────────────────
  const HISTORY_KEY = "numconvert_history";
  const THEME_KEY = "numconvert_theme";
  const MAX_HISTORY = 50;
  let history = loadHistory();
  let toastTimer = null;

  // ── Base Names ────────────────────────────────────────
  const baseNames = {
    2: "BIN",
    8: "OCT",
    10: "DEC",
    16: "HEX",
  };
  const baseCssClass = {
    2: "bin",
    8: "oct",
    10: "dec",
    16: "hex",
  };
  // ── Allowed Characters Per Base ───────────────────────
  const baseChars = {
    2: /^[01]+$/i,
    8: /^[0-7]+$/i,
    10: /^[0-9]+$/i,
    16: /^[0-9a-f]+$/i,
  };

  // ── Digit Grouping ────────────────────────────────────
  function groupDigits(str, groupSize) {
    // Right-align grouping: "10110" -> "1 0110"
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
      default: return upper; // decimal: no grouping
    }
  }

  // ── Theme ─────────────────────────────────────────────
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      // Respect OS preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    // Animate the transition
    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    overlay.style.background = next === "dark"
      ? "radial-gradient(circle at var(--tx, 50%) var(--ty, 0%), #0d0d11 0%, transparent 70%)"
      : "radial-gradient(circle at var(--tx, 50%) var(--ty, 0%), #e8eaf0 0%, transparent 70%)";

    // Position from the toggle button
    const rect = themeToggle.getBoundingClientRect();
    const cx = ((rect.left + rect.width / 2) / window.innerWidth * 100).toFixed(1);
    const cy = ((rect.top + rect.height / 2) / window.innerHeight * 100).toFixed(1);
    overlay.style.setProperty("--tx", cx + "%");
    overlay.style.setProperty("--ty", cy + "%");

    document.body.appendChild(overlay);

    // Spin the toggle icon
    themeToggle.classList.add("theme-toggle--animating");

    requestAnimationFrame(() => {
      overlay.classList.add("theme-transition-overlay--active");
    });

    setTimeout(() => {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    }, 250);

    setTimeout(() => {
      overlay.classList.add("theme-transition-overlay--done");
      themeToggle.classList.remove("theme-toggle--animating");
    }, 500);

    setTimeout(() => {
      overlay.remove();
    }, 900);
  }

  // ── Badge Updates ───────────────────────────────────────────
  function updateBadges() {
    inputBadge.textContent = baseNames[parseInt(inputBase.value)];
    outputBadge.textContent = baseNames[parseInt(outputBase.value)];
  }

  // ── Sync Dropdowns (hide same base from opposite) ─────────
  function syncDropdowns() {
    const fromVal = inputBase.value;
    const toVal = outputBase.value;

    // Enable all first, then disable the matching one
    [...inputBase.options].forEach(opt => { opt.disabled = (opt.value === toVal); });
    [...outputBase.options].forEach(opt => { opt.disabled = (opt.value === fromVal); });
  }

  // ── Quick Reference Panel ────────────────────────────
  function updateQuickRef(decimal) {
    if (decimal === null || decimal === undefined || isNaN(decimal)) {
      qrBin.innerHTML = "&mdash;";
      qrOct.innerHTML = "&mdash;";
      qrDec.innerHTML = "&mdash;";
      qrHex.innerHTML = "&mdash;";
      quickRefMeta.textContent = "";
      [qrBin, qrOct, qrDec, qrHex].forEach(el => el.classList.remove("quickref__value--active"));
      return;
    }

    const bin = decimal.toString(2).toUpperCase();
    const oct = decimal.toString(8).toUpperCase();
    const dec = decimal.toString(10);
    const hex = decimal.toString(16).toUpperCase();

    qrBin.textContent = formatForBase(bin, 2);
    qrOct.textContent = formatForBase(oct, 8);
    qrDec.textContent = dec;
    qrHex.textContent = formatForBase(hex, 16);

    // Highlight the active input base
    const activeBase = parseInt(inputBase.value);
    [qrBin, qrOct, qrDec, qrHex].forEach(el => {
      el.classList.toggle("quickref__value--active", parseInt(el.dataset.base) === activeBase);
    });

    // Meta: bit length
    const bits = bin.length;
    const bytes = Math.ceil(bits / 8);
    quickRefMeta.textContent = `${bits} bit${bits !== 1 ? "s" : ""} · ${bytes} byte${bytes !== 1 ? "s" : ""}`;
  }

  // ── Conversion (with debounced history) ──────────────
  let historyDebounce = null;
  let lastHistoryEntry = "";

  function convertAndTrack() {
    // Always convert immediately for real-time feedback
    const raw = inputValue.value.trim();
    const fromBase = parseInt(inputBase.value);
    const toBase = parseInt(outputBase.value);

    errorMsg.textContent = "";

    if (!raw) {
      outputValue.value = "";
      updateQuickRef(null);
      return;
    }

    if (!baseChars[fromBase].test(raw)) {
      errorMsg.textContent = `Invalid character for ${baseNames[fromBase]} (base ${fromBase}).`;
      outputValue.value = "";
      updateQuickRef(null);
      return;
    }

    try {
      const decimal = parseInt(raw, fromBase);
      if (isNaN(decimal)) {
        errorMsg.textContent = "Conversion error – invalid input.";
        outputValue.value = "";
        updateQuickRef(null);
        return;
      }

      const result = decimal.toString(toBase).toUpperCase();
      outputValue.value = formatForBase(result, toBase);
      updateQuickRef(decimal);

      // Debounce the history entry to avoid spamming while typing
      const entryKey = `${raw}|${fromBase}|${toBase}`;
      if (entryKey === lastHistoryEntry) return;

      clearTimeout(historyDebounce);
      historyDebounce = setTimeout(() => {
        lastHistoryEntry = entryKey;
        addToHistory(raw.toUpperCase(), result, fromBase, toBase);
      }, 800);
    } catch {
      errorMsg.textContent = "Conversion error.";
      outputValue.value = "";
      updateQuickRef(null);
    }
  }

  // ── History ───────────────────────────────────────────
  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  function addToHistory(from, to, fromBase, toBase) {
    // Avoid duplicate most-recent
    if (
      history.length > 0 &&
      history[0].from === from &&
      history[0].to === to &&
      history[0].fromBase === fromBase &&
      history[0].toBase === toBase
    ) {
      return;
    }

    history.unshift({ from, to, fromBase, toBase, time: Date.now() });
    if (history.length > MAX_HISTORY) history.pop();
    saveHistory();
    renderHistory();
  }

  function renderHistory() {
    historyList.innerHTML = "";
    historyCount.textContent = history.length;

    if (history.length === 0) {
      const empty = document.createElement("li");
      empty.className = "history__empty";
      empty.innerHTML = `
        <svg class="history__empty-icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="3" ry="3"></rect>
          <line x1="2" y1="8" x2="22" y2="8"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="8" y1="16" x2="14" y2="16"></line>
        </svg>
        <span>No conversions yet</span>
        <small>Start typing to see your history here</small>
      `;
      historyList.appendChild(empty);
      return;
    }

    history.forEach((entry, idx) => {
      const li = document.createElement("li");
      li.className = "history__item";

      const fromClass = baseCssClass[entry.fromBase] || "dec";
      const toClass = baseCssClass[entry.toBase] || "dec";
      const timeAgo = getRelativeTime(entry.time);

      li.innerHTML = `
        <div class="history__item-body">
          <div class="history__item-row">
            <span class="history__item-badge history__item-badge--${fromClass}">${baseNames[entry.fromBase]}</span>
            <span class="history__item-value">${escapeHtml(entry.from)}</span>
            <span class="history__item-arrow">→</span>
            <span class="history__item-badge history__item-badge--${toClass}">${baseNames[entry.toBase]}</span>
            <span class="history__item-value">${escapeHtml(entry.to)}</span>
          </div>
          <div class="history__item-meta">
            <span class="history__item-time">${timeAgo}</span>
          </div>
        </div>
        <div class="history__item-actions">
          <button class="history__item-action" data-action="copy" data-result="${escapeHtml(entry.to)}" aria-label="Copy result" title="Copy result">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button class="history__item-action history__item-action--delete" data-action="delete" data-index="${idx}" aria-label="Delete entry" title="Delete">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;

      historyList.appendChild(li);
    });
  }

  function deleteHistoryItem(index) {
    history.splice(index, 1);
    saveHistory();
    renderHistory();
  }

  // ── Relative Time ──────────────────────────────────────────
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

  // ── Load from history into converter ──────────────────
  function loadFromHistory(entry) {
    inputBase.value = entry.fromBase;
    outputBase.value = entry.toBase;
    inputValue.value = entry.from;
    updateBadges();
    convertAndTrack();
    inputValue.focus();
    showToast("Loaded into converter");
  }

  function clearHistory() {
    history = [];
    saveHistory();
    renderHistory();
    showToast("History cleared");
  }

  // ── Swap ──────────────────────────────────────────────
  function swap() {
    const tempBase = inputBase.value;
    inputBase.value = outputBase.value;
    outputBase.value = tempBase;

    // Put the output value into input (strip grouping spaces)
    const currentOutput = outputValue.value.replace(/\s/g, "");
    if (currentOutput) {
      inputValue.value = currentOutput;
    }

    updateBadges();
    lastHistoryEntry = ""; // allow re-logging after swap
    convertAndTrack();
  }

  // ── Clear ─────────────────────────────────────────────
  function clearInput() {
    inputValue.value = "";
    outputValue.value = "";
    errorMsg.textContent = "";
    lastHistoryEntry = ""; // allow re-logging after clear
    updateQuickRef(null);
    inputValue.focus();
  }

  // ── Copy ──────────────────────────────────────────────
  async function copyToClipboard(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Copied to clipboard!");
    }
  }

  // ── Toast ─────────────────────────────────────────────
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("toast--visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, 2000);
  }

  // ── Utility ───────────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ── Page Navigation (sub-pages only) ───────────────────
  const baseSlug = { 2: "bin", 8: "oct", 10: "dec", 16: "hex" };

  function navigateToConversionPage() {
    if (!window.NUMCONVERT_DEFAULTS) return; // only on sub-pages
    const from = parseInt(inputBase.value);
    const to = parseInt(outputBase.value);
    if (from === to) return;
    const slug = `${baseSlug[from]}-to-${baseSlug[to]}.html`;
    if (window.location.href.indexOf(slug) === -1) {
      window.location.href = slug;
    }
  }

  // ── Event Listeners ───────────────────────────────────
  inputValue.addEventListener("input", convertAndTrack);
  inputBase.addEventListener("change", () => { syncDropdowns(); updateBadges(); convertAndTrack(); navigateToConversionPage(); });
  outputBase.addEventListener("change", () => { syncDropdowns(); updateBadges(); convertAndTrack(); navigateToConversionPage(); });
  swapBtn.addEventListener("click", swap);
  clearBtn.addEventListener("click", clearInput);
  copyBtn.addEventListener("click", () => copyToClipboard(outputValue.value.replace(/\s/g, "")));
  themeToggle.addEventListener("click", toggleTheme);
  clearHistoryBtn.addEventListener("click", clearHistory);

  // Delegate history action buttons
  historyList.addEventListener("click", (e) => {
    const actionBtn = e.target.closest(".history__item-action");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      if (action === "copy") {
        copyToClipboard(actionBtn.dataset.result);
      } else if (action === "delete") {
        deleteHistoryItem(parseInt(actionBtn.dataset.index));
      }
      return;
    }

    // Click on item body to reload into converter
    const itemBody = e.target.closest(".history__item-body");
    if (itemBody) {
      const item = itemBody.closest(".history__item");
      const idx = [...historyList.querySelectorAll(".history__item")].indexOf(item);
      if (idx >= 0 && history[idx]) {
        loadFromHistory(history[idx]);
      }
    }
  });

  // Quick reference copy buttons
  quickRef.addEventListener("click", (e) => {
    const qrCopyBtn = e.target.closest(".quickref__copy");
    if (qrCopyBtn) {
      const targetId = qrCopyBtn.dataset.target;
      const el = document.getElementById(targetId);
      if (el && el.textContent && el.textContent !== "\u2014") {
        // Copy the raw value without spaces
        copyToClipboard(el.textContent.replace(/\s/g, ""));
      }
    }
  });

  // Keyboard shortcut: Enter to convert (for accessibility)
  inputValue.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearInput();
    }
  });

  // ── Init ──────────────────────────────────────────────
  // Apply page-specific defaults (for conversion landing pages)
  if (window.NUMCONVERT_DEFAULTS) {
    if (window.NUMCONVERT_DEFAULTS.fromBase) inputBase.value = window.NUMCONVERT_DEFAULTS.fromBase;
    if (window.NUMCONVERT_DEFAULTS.toBase) outputBase.value = window.NUMCONVERT_DEFAULTS.toBase;
  }

  initTheme();
  syncDropdowns();
  updateBadges();
  renderHistory();

  // Update timestamps every 30s
  setInterval(() => {
    if (history.length > 0) renderHistory();
  }, 30000);

  // If there's a value already (browser autofill), convert
  if (inputValue.value.trim()) {
    convertAndTrack();
  }
})();
