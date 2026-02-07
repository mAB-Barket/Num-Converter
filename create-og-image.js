const { createCanvas } = require('canvas');
const fs = require('fs');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// --- Background gradient ---
const grad = ctx.createLinearGradient(0, 0, W, H);
grad.addColorStop(0, '#003d82');
grad.addColorStop(0.45, '#0071e3');
grad.addColorStop(1, '#00b4ff');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

// --- Subtle hex pattern in background ---
ctx.save();
ctx.globalAlpha = 0.04;
ctx.fillStyle = '#ffffff';
ctx.font = '22px monospace';
const codes = '01 0A F3 10 1F 00 11 AB FF 7C 3E 5D B2 08 CC DD EE 42 9A 01 0B 1C 2D 3E 4F 50 61 72 83 94 A5 B6 C7 D8 E9 FA';
for (let y = 30; y < H; y += 40) {
  const offset = (y / 40) % 2 === 0 ? 0 : 60;
  ctx.fillText(codes, -offset, y);
}
ctx.restore();

// --- Decorative circles ---
ctx.save();
ctx.globalAlpha = 0.07;
ctx.fillStyle = '#ffffff';
ctx.beginPath(); ctx.arc(100, 530, 200, 0, Math.PI * 2); ctx.fill();
ctx.beginPath(); ctx.arc(1100, 100, 250, 0, Math.PI * 2); ctx.fill();
ctx.restore();

// --- Logo text ---
ctx.fillStyle = 'rgba(255,255,255,0.8)';
ctx.font = '600 28px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('\u26A1 NUMCONVERT', W / 2, 145);

// --- Main title ---
ctx.fillStyle = '#ffffff';
ctx.font = '800 78px sans-serif';
ctx.textAlign = 'center';
ctx.shadowColor = 'rgba(0,0,0,0.15)';
ctx.shadowBlur = 20;
ctx.fillText('Number System', W / 2, 255);
ctx.fillText('Converter', W / 2, 345);
ctx.shadowBlur = 0;

// --- Subtitle ---
ctx.fillStyle = 'rgba(255,255,255,0.85)';
ctx.font = '400 26px sans-serif';
ctx.fillText('Convert instantly between number systems \u2014 free & open source', W / 2, 405);

// --- Badges ---
const badges = ['Binary', 'Decimal', 'Octal', 'Hexadecimal'];
const badgeHeight = 44, badgePadX = 28, badgeGap = 18;
ctx.font = '600 20px monospace';

const badgeWidths = badges.map(label => ctx.measureText(label).width + badgePadX * 2);
const totalW = badgeWidths.reduce((s, w) => s + w, 0) + (badges.length - 1) * badgeGap;

let bx = (W - totalW) / 2;
const badgeY = 445;

badges.forEach((label, i) => {
  const bw = badgeWidths[i];
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, bx, badgeY, bw, badgeHeight, 22);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, bx + bw / 2, badgeY + 29);
  bx += bw + badgeGap;
});

// --- URL at bottom ---
ctx.fillStyle = 'rgba(255,255,255,0.5)';
ctx.font = '400 20px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('mab-barket.github.io/Num-Converter', W / 2, 570);

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('og-preview.png', buffer);
console.log(`Done! og-preview.png (${(buffer.length / 1024).toFixed(1)} KB) - ${W}x${H}`);
