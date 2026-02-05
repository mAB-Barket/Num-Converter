# NumConvert — Number System Converter

A sleek, single-page web app for converting numbers between **Binary**, **Decimal**, **Octal**, and **Hexadecimal** in real time. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

![License](https://img.shields.io/badge/license-MIT-blue)
![Tests](https://img.shields.io/badge/tests-106%20passed-brightgreen)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Real-time Conversion** | Results update instantly as you type — no submit button needed |
| **All 4 Number Systems** | Binary (Base 2), Octal (Base 8), Decimal (Base 10), Hexadecimal (Base 16) |
| **Quick Reference Panel** | See the current number in all 4 bases simultaneously |
| **Digit Grouping** | Binary & hex grouped in 4s, octal in 3s for readability |
| **Bit/Byte Info** | Shows bit length and byte count for each conversion |
| **Swap Button** | One-click swap of input/output bases and values |
| **Copy to Clipboard** | Copy any result with a single click |
| **Conversion History** | Persistent history (localStorage) with timestamps, up to 50 entries |
| **Click-to-Reload** | Click any history entry to load it back into the converter |
| **Dark / Light Theme** | Toggle manually or auto-detect from OS preference |
| **Input Validation** | Real-time character validation with clear error messages |
| **Keyboard Shortcuts** | `Esc` to clear, `Tab` to navigate |
| **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 🎨 Design

- **Glassmorphism** — Frosted-glass cards with `backdrop-filter` blur and iridescent shimmer accents
- **LCD Display Aesthetic** — Dark metallic bezels around inputs with scanline and pixel-grid overlays
- **Phosphor Glow** — Green neon text glow in dark mode for a retro LCD feel
- **Typography** — [Inter](https://rsms.me/inter/) for UI, [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for monospace/LCD displays

---

## 📁 Project Structure

```
Number System Converter/
├── index.html          # Main HTML page
├── style.css           # All styles (glassmorphism, LCD, themes, responsive)
├── script.js           # All logic (conversion, history, theming, UI)
├── tests/
│   ├── test-node.js    # Node.js test suite (run in terminal)
│   └── test-runner.html# Browser-based test suite (open in browser)
└── README.md           # This file
```

---

## 🚀 Getting Started

### Option 1 — Just open it
No build step required. Simply open `index.html` in any modern browser.

### Option 2 — Local server
```bash
# Using Node.js http-server
npx http-server -p 8080 -c-1

# Or Python
python -m http.server 8080
```

Then navigate to `http://localhost:8080`.

---

## 🧪 Testing

The project includes **106 automated tests** covering:

| Category | Count | What's tested |
|----------|-------|---------------|
| Digit Grouping | 9 | `groupDigits()` for all group sizes and edge cases |
| Format for Base | 7 | `formatForBase()` including null/empty handling |
| Input Validation | 12 | Regex per base, space rejection, empty string rejection |
| Core Conversions | 30 | All base-pair directions (BIN↔DEC↔OCT↔HEX) |
| Edge Cases | 8 | Zero, powers of 2, max 16-bit, large numbers |
| Swap Logic | 4 | Space-stripping ensures valid re-input after swap |
| Round-trip Integrity | 4 | Multi-hop lossless conversion chains |
| Relative Time | 6 | Timestamp formatting (just now, Xs ago, Xm ago, etc.) |
| Bit/Byte Calculation | 6 | Bit length and byte count accuracy |
| Base Names | 1 | Name mapping completeness |
| Full Conversion Matrix | 16 | All 16 base-pair combinations for value 170 |
| Stress Tests | 4 | 0–255 all-base round-trips, 0–1000 format/strip validation |

### Run tests in terminal
```bash
node tests/test-node.js
```

### Run tests in browser
Open `tests/test-runner.html` in any browser.

---

## 🛠 Tech Stack

- **HTML5** — Semantic markup with ARIA labels
- **CSS3** — Custom properties, `backdrop-filter`, CSS Grid, Flexbox, `@keyframes`
- **Vanilla JavaScript** — IIFE pattern, no dependencies
- **localStorage** — Theme preference and conversion history persistence
- **Google Fonts** — Inter + JetBrains Mono (loaded via CDN)

---

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 88+ |
| Firefox | 103+ |
| Safari | 15.4+ |
| Edge | 88+ |
| Mobile Safari | 15.4+ |
| Chrome Android | 88+ |

> `scrollbar-width` / `scrollbar-color` require Chrome 121+ / Firefox 64+. Older browsers gracefully fall back to default scrollbars.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Clear the input field |
| `Tab` | Move to the next field |

---

## 📄 License

MIT — free for personal and commercial use.
