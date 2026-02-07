// Generates og-preview.png (1200x630) as a pure-Node script — no dependencies needed
// Uses a minimal BMP → PNG pipeline with raw pixel manipulation

const fs = require('fs');
const zlib = require('zlib');

const W = 1200, H = 630;
const pixels = Buffer.alloc(W * H * 4); // RGBA

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = a;
}

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

// --- Draw gradient background ---
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = (x / W + y / H) / 2;
    const r = lerp(0, 0, t);
    const g = lerp(80, 162, t);
    const b = lerp(179, 255, t);
    setPixel(x, y, r, g, b);
  }
}

// --- Simple bitmap font (5x7) for text rendering ---
const FONT = {
  'A': ['01110','10001','10001','11111','10001','10001','10001'],
  'B': ['11110','10001','10001','11110','10001','10001','11110'],
  'C': ['01110','10001','10000','10000','10000','10001','01110'],
  'D': ['11100','10010','10001','10001','10001','10010','11100'],
  'E': ['11111','10000','10000','11110','10000','10000','11111'],
  'F': ['11111','10000','10000','11110','10000','10000','10000'],
  'G': ['01110','10001','10000','10111','10001','10001','01110'],
  'H': ['10001','10001','10001','11111','10001','10001','10001'],
  'I': ['01110','00100','00100','00100','00100','00100','01110'],
  'J': ['00111','00010','00010','00010','00010','10010','01100'],
  'K': ['10001','10010','10100','11000','10100','10010','10001'],
  'L': ['10000','10000','10000','10000','10000','10000','11111'],
  'M': ['10001','11011','10101','10101','10001','10001','10001'],
  'N': ['10001','10001','11001','10101','10011','10001','10001'],
  'O': ['01110','10001','10001','10001','10001','10001','01110'],
  'P': ['11110','10001','10001','11110','10000','10000','10000'],
  'Q': ['01110','10001','10001','10001','10101','10010','01101'],
  'R': ['11110','10001','10001','11110','10100','10010','10001'],
  'S': ['01111','10000','10000','01110','00001','00001','11110'],
  'T': ['11111','00100','00100','00100','00100','00100','00100'],
  'U': ['10001','10001','10001','10001','10001','10001','01110'],
  'V': ['10001','10001','10001','10001','01010','01010','00100'],
  'W': ['10001','10001','10001','10101','10101','10101','01010'],
  'X': ['10001','10001','01010','00100','01010','10001','10001'],
  'Y': ['10001','10001','01010','00100','00100','00100','00100'],
  'Z': ['11111','00001','00010','00100','01000','10000','11111'],
  '0': ['01110','10001','10011','10101','11001','10001','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'],
  '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'],
  '5': ['11111','10000','11110','00001','00001','10001','01110'],
  '6': ['00110','01000','10000','11110','10001','10001','01110'],
  '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'],
  '9': ['01110','10001','10001','01111','00001','00010','01100'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
  '-': ['00000','00000','00000','11111','00000','00000','00000'],
  '.': ['00000','00000','00000','00000','00000','00000','00100'],
  '/': ['00001','00010','00010','00100','01000','01000','10000'],
  ':': ['00000','00100','00000','00000','00000','00100','00000'],
  '&': ['01100','10010','10100','01000','10101','10010','01101'],
  '|': ['00100','00100','00100','00100','00100','00100','00100'],
  ',': ['00000','00000','00000','00000','00000','00100','01000'],
  '!': ['00100','00100','00100','00100','00100','00000','00100'],
};

function drawText(text, startX, startY, scale, r, g, b, a = 255) {
  const chars = text.toUpperCase().split('');
  let cx = startX;
  for (const ch of chars) {
    const glyph = FONT[ch];
    if (!glyph) { cx += 3 * scale; continue; }
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row][col] === '1') {
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              setPixel(cx + col * scale + sx, startY + row * scale + sy, r, g, b, a);
            }
          }
        }
      }
    }
    cx += 6 * scale;
  }
  return cx - startX; // width
}

function measureText(text, scale) {
  return text.length * 6 * scale - scale;
}

function drawTextCentered(text, cy, scale, r, g, b, a = 255) {
  const w = measureText(text, scale);
  const sx = Math.round((W - w) / 2);
  drawText(text, sx, cy, scale, r, g, b, a);
}

// --- Filled rounded rectangle ---
function fillRoundRect(x, y, w, h, radius, r, g, b, a = 255) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      // Check corners
      let inside = true;
      if (px < x + radius && py < y + radius) {
        inside = ((px - (x + radius)) ** 2 + (py - (y + radius)) ** 2) <= radius ** 2;
      } else if (px > x + w - radius && py < y + radius) {
        inside = ((px - (x + w - radius)) ** 2 + (py - (y + radius)) ** 2) <= radius ** 2;
      } else if (px < x + radius && py > y + h - radius) {
        inside = ((px - (x + radius)) ** 2 + (py - (y + h - radius)) ** 2) <= radius ** 2;
      } else if (px > x + w - radius && py > y + h - radius) {
        inside = ((px - (x + w - radius)) ** 2 + (py - (y + h - radius)) ** 2) <= radius ** 2;
      }
      if (inside) setPixel(px, py, r, g, b, a);
    }
  }
}

// --- Draw content ---

// Logo
drawTextCentered('NUMCONVERT', 110, 4, 220, 240, 255);

// Main title line 1
drawTextCentered('NUMBER SYSTEM', 190, 8, 255, 255, 255);

// Main title line 2
drawTextCentered('CONVERTER', 260 + 8 * 7 + 10 - 8 * 7 - 10, 8, 255, 255, 255);

// Subtitle
drawTextCentered('CONVERT INSTANTLY BETWEEN NUMBER SYSTEMS', 395, 3, 220, 235, 255);

// Badges
const badges = ['BINARY', 'DECIMAL', 'OCTAL', 'HEX'];
const badgeScale = 3;
const badgePadX = 20, badgePadY = 8, badgeGap = 24;
const badgeH = 7 * badgeScale + badgePadY * 2;
let totalW = badges.reduce((sum, b) => sum + measureText(b, badgeScale) + badgePadX * 2, 0) + (badges.length - 1) * badgeGap;
let bx = Math.round((W - totalW) / 2);
const badgeY = 455;

for (const label of badges) {
  const tw = measureText(label, badgeScale);
  const bw = tw + badgePadX * 2;
  fillRoundRect(bx, badgeY, bw, badgeH, 20, 255, 255, 255, 40);
  drawText(label, bx + badgePadX, badgeY + badgePadY, badgeScale, 255, 255, 255);
  bx += bw + badgeGap;
}

// URL
drawTextCentered('MAB-BARKET.GITHUB.IO/NUM-CONVERTER', 560, 3, 180, 200, 230);

// --- Encode as PNG ---
function encodePNG(width, height, pixelData) {
  // Build raw data with filter byte
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // filter: None
    pixelData.copy(rawData, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeData = Buffer.concat([Buffer.from(type), data]);
    const crc = crc32(typeData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, typeData, crcBuf]);
  }
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  
  const iend = Buffer.alloc(0);
  
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', iend)
  ]);
}

// CRC32
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const png = encodePNG(W, H, pixels);
fs.writeFileSync('og-preview.png', png);
console.log(`✅ og-preview.png created (${(png.length / 1024).toFixed(1)} KB) — ${W}x${H}`);
