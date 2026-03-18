// ────────────────────────────────────────────────────────────────────────────
//  Antena África — Slides Generator
//  Figma Plugin · creates all 8 presentation slides as 1920×1080 frames
// ────────────────────────────────────────────────────────────────────────────

const W   = 1920;
const H   = 1080;
const GAP = 160;

const C = {
  ink:   { r: 0.075, g: 0.059, b: 0.039 },
  sand:  { r: 0.867, g: 0.835, b: 0.769 },
  earth: { r: 0.290, g: 0.235, b: 0.188 },
  mid:   { r: 0.137, g: 0.102, b: 0.071 },
  sand2: { r: 0.784, g: 0.745, b: 0.659 },
};

// ── Font loading (Inter always available as fallback) ─────────────────────────
const FONT_MAP = {
  'Light':   { family: 'Jost', style: 'Light' },
  'Regular': { family: 'Jost', style: 'Regular' },
  'Medium':  { family: 'Jost', style: 'Medium' },
  'Bold':    { family: 'Jost', style: 'Bold' },
  'Black':   { family: 'Jost', style: 'Black' },
};
const FALLBACK = {
  'Light':   { family: 'Inter', style: 'Regular' },
  'Regular': { family: 'Inter', style: 'Regular' },
  'Medium':  { family: 'Inter', style: 'Medium' },
  'Bold':    { family: 'Inter', style: 'Bold' },
  'Black':   { family: 'Inter', style: 'Bold' },
};
const resolvedFonts = {};

async function loadFonts() {
  for (const [key, font] of Object.entries(FONT_MAP)) {
    try {
      await figma.loadFontAsync(font);
      resolvedFonts[key] = font;
    } catch (e) {
      console.warn(`Jost ${key} not available, falling back to Inter`);
      await figma.loadFontAsync(FALLBACK[key]);
      resolvedFonts[key] = FALLBACK[key];
    }
  }
}

// ── Primitives ───────────────────────────────────────────────────────────────
function mkFrame(name, x, bg) {
  const f = figma.createFrame();
  f.name = name;
  f.x = x; f.y = 0;
  f.resize(W, H);
  f.fills = [{ type: 'SOLID', color: bg }];
  f.clipsContent = true;
  return f;
}

function mkRect(parent, x, y, w, h, color, opacity, radius) {
  if (w <= 0) w = 0.5;
  if (h <= 0) h = 0.5;
  const r = figma.createRectangle();
  r.x = x; r.y = y;
  r.resize(w, h);
  r.fills = [{ type: 'SOLID', color, opacity: opacity !== undefined ? opacity : 1 }];
  if (radius) r.cornerRadius = radius;
  parent.appendChild(r);
  return r;
}

function mkEllipse(parent, cx, cy, size, strokeColor, strokeOpacity, strokeW) {
  const e = figma.createEllipse();
  e.resize(size, size);
  e.x = cx - size / 2;
  e.y = cy - size / 2;
  e.fills = [];
  e.strokes = [{ type: 'SOLID', color: strokeColor, opacity: strokeOpacity }];
  e.strokeWeight = strokeW || 1;
  parent.appendChild(e);
  return e;
}

function mkText(parent, chars, x, y, fontSize, styleKey, color, opts) {
  opts = opts || {};
  const t = figma.createText();
  t.fontName = resolvedFonts[styleKey];
  t.fontSize = fontSize;
  t.characters = chars;
  t.fills = [{ type: 'SOLID', color }];
  t.x = x; t.y = y;
  if (opts.width) { t.textAutoResize = 'HEIGHT'; t.resize(opts.width, Math.max(t.height, 1)); }
  if (opts.lineHeight  !== undefined) t.lineHeight    = { value: opts.lineHeight,    unit: 'PERCENT' };
  if (opts.letterSpacing !== undefined) t.letterSpacing = { value: opts.letterSpacing, unit: 'PERCENT' };
  if (opts.textCase)                  t.textCase       = opts.textCase;
  parent.appendChild(t);
  return t;
}

function mkRule(parent, x, y, color, opacity, w) {
  mkRect(parent, x, y, w || 48, 1, color, opacity !== undefined ? opacity : 0.30);
}

function mkWaves(parent, x, y, color, opacity) {
  [8, 14, 20, 26, 20, 12, 7].forEach((h, i) => {
    mkRect(parent, x + i * 5, y + (26 - h) / 2, 3, h, color, opacity || 0.6);
  });
}

// ════════════════════════════════════════════════════════════════════════════
//  SLIDES
// ════════════════════════════════════════════════════════════════════════════

function buildCover(x) {
  const f = mkFrame('01 — Cover', x, C.ink);
  mkRect(f, W * 0.55, 0, W * 0.45, H, C.mid, 0.40);

  // Compass circles
  const cx = W - 260, cy = H / 2, sz = 520;
  mkEllipse(f, cx, cy, sz,       C.sand, 0.08, 1.2);
  mkEllipse(f, cx, cy, sz * 0.8, C.sand, 0.05, 0.7);
  mkRect(f, cx,           cy - sz / 2, 0.5, sz, C.sand, 0.05);
  mkRect(f, cx - sz / 2,  cy,          sz, 0.5, C.sand, 0.05);

  mkText(f, 'ANTENA ÁFRICA', 80, 80, 9, 'Light', C.earth,
    { letterSpacing: 28, textCase: 'UPPER' });
  mkText(f, 'ANTENA\nÁFRICA', 80, 340, 152, 'Black', C.sand,
    { lineHeight: 88, letterSpacing: -2 });
  mkRule(f, 80, 720, C.sand, 0.35, 48);
  mkText(f, 'Música Africana  ·  Curadoria  ·  Contexto', 80, 746, 13, 'Light', C.sand2,
    { letterSpacing: 18 });
  mkText(f, 'Lúcio Oliveira  ·  Proposta de Canal Digital', 80, 778, 9, 'Light', C.earth,
    { letterSpacing: 18, textCase: 'UPPER' });
  return f;
}

function buildIntro(x) {
  const f = mkFrame('02 — Introdução', x, C.sand);
  mkEllipse(f, W - 340, H / 2, 660, C.sand2, 0.45, 0);

  mkText(f, 'O PROJETO', 80, 80, 9, 'Light', C.earth, { letterSpacing: 28, textCase: 'UPPER' });
  mkText(f, 'MÚSICA AFRICANA\nPARA ALÉM DO RÁDIO.', 80, 180, 80, 'Black', C.ink,
    { lineHeight: 93, letterSpacing: -1.5, width: 960 });
  mkRule(f, 80, 430, C.ink, 0.28, 48);
  mkText(f,
    'Uma curadoria semanal de música africana — do afrobeat ao kuduro,\ndo highlife ao amapiano. Cada episódio conecta som, história\ne identidade cultural do continente.',
    80, 460, 17, 'Light', C.mid, { lineHeight: 168, width: 800 });
  mkText(f,
    'Lúcio Oliveira  ·  DJ Sankoffa  ·  Expansão digital do Rádio África — Educadora FM 107,5',
    80, H - 60, 9, 'Light', C.earth, { letterSpacing: 14, textCase: 'UPPER', width: W - 160 });
  return f;
}

function buildNome(x) {
  const f = mkFrame('03 — Nome do Canal', x, C.sand);

  mkText(f, '02 — IDENTIDADE', 80, 60, 9, 'Light', C.earth, { letterSpacing: 28, textCase: 'UPPER' });
  mkText(f, 'O NOME\nDO CANAL', 80, 110, 88, 'Black', C.ink, { lineHeight: 92, letterSpacing: -2 });

  const names = [
    { key: 'Antena África',     val: 'Direto. O continente primeiro, o meio depois.',               chosen: false },
    { key: 'Antena África ✓',   val: 'Nome escolhido — sintonia, alcance, presença permanente no ar.', chosen: true  },
    { key: 'Afro-Rádio',        val: 'Compacto. Reconhecível. Forte nas redes.',                   chosen: false },
    { key: 'Frequência África',  val: 'Canal e cultura — a mesma frequência.',                      chosen: false },
    { key: 'Sinal África',      val: 'Técnico e poético. Um sinal que chega e significa.',         chosen: false },
  ];
  let rowY = 380;
  for (const n of names) {
    mkRect(f, 80, rowY, W - 160, 0.5, C.ink, n.chosen ? 0.25 : 0.12);
    rowY += 14;
    if (n.chosen) mkRect(f, 80, rowY - 4, W - 160, 68, C.ink, 0.06);
    mkText(f, n.key, 80, rowY, 14, n.chosen ? 'Bold' : 'Regular',
      n.chosen ? C.ink : C.earth, { letterSpacing: 3 });
    mkText(f, n.val, 520, rowY, 14, n.chosen ? 'Regular' : 'Light',
      n.chosen ? C.mid : C.earth, { width: W - 600 });
    rowY += 72;
  }
  return f;
}

function buildOrigem(x) {
  const f = mkFrame('04 — A Origem', x, C.ink);
  // Tribal border dots
  for (let i = 0; i < 8; i++) {
    const sq = figma.createRectangle();
    sq.resize(36, 36); sq.x = W - 76; sq.y = 100 + i * 68;
    sq.fills = []; sq.strokes = [{ type: 'SOLID', color: C.sand, opacity: 0.08 }];
    sq.strokeWeight = 0.8;
    f.appendChild(sq);
  }

  mkText(f, '03 — A ORIGEM', 80, 60, 9, 'Light', C.earth, { letterSpacing: 28, textCase: 'UPPER' });
  mkText(f, 'RÁDIO ÁFRICA\nNA EDUCADORA.', 80, 110, 80, 'Black', C.sand, { lineHeight: 93, letterSpacing: -1.5 });

  mkRect(f, W / 2 - 40, 370, 0.5, 360, C.earth, 0.25);

  mkText(f, 'A ORIGEM', 80, 380, 9, 'Light', C.earth, { letterSpacing: 22, textCase: 'UPPER' });
  mkText(f,
    'O Rádio África é o único programa no Brasil dedicado exclusivamente à música africana — ao ar há anos na Educadora FM 107,5, Salvador, com retransmissão pela Rádio Nacional.',
    80, 410, 14, 'Light', C.sand2, { lineHeight: 168, width: W / 2 - 160 });

  // Pills
  for (const [px, label] of [[80, 'Sábados\n107,5 FM'], [298, '3 Estados\nna Grade']]) {
    mkRect(f, px, 670, 196, 64, C.earth, 0.28, 4);
    mkText(f, label, px + 20, 682, 12, 'Regular', C.sand, { letterSpacing: 8, lineHeight: 140 });
  }

  const rx = W / 2 + 40;
  mkText(f, 'A EXPANSÃO DIGITAL', rx, 380, 9, 'Light', C.earth, { letterSpacing: 22, textCase: 'UPPER' });
  mkText(f,
    'A Antena África é a continuação desse trabalho no ambiente digital. O mesmo rigor curatorial, a mesma voz — agora no YouTube e no Instagram, alcançando quem nunca sintonizou o rádio.',
    rx, 410, 14, 'Light', C.sand2, { lineHeight: 168, width: W / 2 - 160 });
  return f;
}

function buildFormato(x) {
  const f = mkFrame('05 — Formato Digital', x, C.ink);
  mkEllipse(f, W / 2, H / 2 + 60, 500, C.sand, 0.05, 1.2);
  mkEllipse(f, W / 2, H / 2 + 60, 400, C.sand, 0.03, 0.7);

  mkText(f, '04 — FORMATO DIGITAL', 80, 60, 9, 'Light', C.earth, { letterSpacing: 28, textCase: 'UPPER' });
  mkText(f, 'DO RÁDIO\nÀS REDES.', 80, 110, 96, 'Black', C.sand, { lineHeight: 92, letterSpacing: -2 });
  mkRule(f, 80, 360, C.sand, 0.22, 48);
  mkRect(f, W / 2, 370, 0.5, 400, C.earth, 0.30);

  mkWaves(f, 80, 396, C.sand, 0.50);
  mkText(f, 'YouTube', 80, 438, 28, 'Medium', C.sand, { letterSpacing: 3 });
  mkText(f, 'Episódio semanal · 60 min\nVoz + música + visualizer\nNúcleo de toda a produção\nCâmera não precisa aparecer',
    80, 494, 15, 'Light', C.sand2, { lineHeight: 195, width: W / 2 - 160 });

  mkWaves(f, W / 2 + 80, 396, C.sand, 0.50);
  mkText(f, 'Instagram', W / 2 + 80, 438, 28, 'Medium', C.sand, { letterSpacing: 3 });
  mkText(f, 'Carrossel · Reels · Stories\nTudo deriva do episódio\nUma produção\nMúltiplas entregas na semana',
    W / 2 + 80, 494, 15, 'Light', C.sand2, { lineHeight: 195, width: W / 2 - 160 });
  return f;
}

function buildLinha(x) {
  const f = mkFrame('06 — Linha Editorial', x, C.sand);
  mkRect(f, 0, 0, W, 6, C.mid, 1);

  mkText(f, '05 — LINHA EDITORIAL', 80, 60, 9, 'Light', C.earth, { letterSpacing: 28, textCase: 'UPPER' });
  mkText(f, 'TRÊS\nEIXOS.', 80, 110, 96, 'Black', C.ink, { lineHeight: 92, letterSpacing: -2 });

  const eixos = [
    { num: '01', title: 'Histórico-formativo', body: 'Cada episódio localiza a música no seu tempo — independências, diásporas, resistências culturais.' },
    { num: '02', title: 'Cultural',             body: 'Identidade, memória e diáspora como horizonte permanente, não como tema fixo ou decorativo.' },
    { num: '03', title: 'Estético-musical',     body: 'Instrumentação, ritmo, influências — análise acessível que amplia a escuta sem virar aula.' },
  ];
  const colW = Math.floor((W - 160) / 3) - 40;
  eixos.forEach((e, i) => {
    const cx = 80 + i * (colW + 80);
    mkRect(f, cx, 390, colW, 0.5, C.ink, 0.15);
    mkText(f, e.num, cx, 410, 40, 'Light', C.earth);
    mkText(f, e.title.toUpperCase(), cx, 472, 15, 'Bold', C.ink, { letterSpacing: 4, width: colW });
    mkText(f, e.body, cx, 512, 14, 'Light', C.mid, { lineHeight: 172, width: colW });
  });

  mkRule(f, 80, H - 130, C.earth, 0.22, 48);
  mkText(f,
    '"A música é documento histórico, expressão de identidades, instrumento de resistência."',
    80, H - 100, 15, 'Light', C.earth, { letterSpacing: 2, width: W - 160 });
  return f;
}

function buildPassos(x) {
  const f = mkFrame('07 — Próximos Passos', x, C.mid);
  mkText(f, '06 — PRÓXIMOS PASSOS', 80, 60, 9, 'Light', C.earth, { letterSpacing: 28, textCase: 'UPPER' });
  mkText(f, 'O QUE\nFALTA\nDEFINIR.', 80, 130, 76, 'Black', C.sand, { lineHeight: 92, letterSpacing: -1.5 });
  mkRect(f, Math.round(W * 0.42), 100, 0.5, H - 200, C.earth, 0.18);

  const steps = [
    { num: '01', label: 'Nome do Canal Digital' },
    { num: '02', label: 'Episódios Piloto — 3 primeiros temas' },
    { num: '03', label: 'Identidade Visual' },
    { num: '04', label: 'Equipe e Parceiros' },
    { num: '05', label: 'Calendário de Lançamento' },
  ];
  const rx = Math.round(W * 0.42) + 60;
  let rowY = 240;
  for (const s of steps) {
    mkRect(f, rx, rowY, W - rx - 80, 0.5, C.earth, 0.18);
    rowY += 12;
    mkText(f, s.num, rx, rowY, 11, 'Light', C.earth, { letterSpacing: 8 });
    mkText(f, s.label.toUpperCase(), rx + 80, rowY, 20, 'Medium', C.sand, { letterSpacing: 4 });
    rowY += 96;
  }

  mkWaves(f, 80, H - 56, C.earth, 0.45);
  mkText(f, 'ANTENA ÁFRICA  ·  LÚCIO OLIVEIRA', 136, H - 50, 8, 'Bold', C.earth,
    { letterSpacing: 25, textCase: 'UPPER' });
  return f;
}

function buildBackCover(x) {
  const f = mkFrame('08 — Back Cover', x, C.ink);
  mkRect(f, 0, 0, W * 0.50, H, C.mid, 0.90);

  mkEllipse(f, Math.round(W * 0.25), H / 2, 360, C.sand, 0.10, 1.2);
  mkEllipse(f, Math.round(W * 0.25), H / 2, 288, C.sand, 0.06, 0.7);
  mkRect(f, Math.round(W * 0.25), H / 2 - 180, 0.5, 360, C.sand, 0.06);
  mkRect(f, Math.round(W * 0.25) - 180, H / 2, 360, 0.5, C.sand, 0.06);

  mkText(f, 'ANTENA\nÁFRICA', 80, H / 2 - 200, 120, 'Black', C.sand, { lineHeight: 88, letterSpacing: -2 });
  mkRule(f, 80, H / 2 + 90, C.sand, 0.32, 48);
  mkText(f, 'Expansão digital do Rádio África\nCuradoria  ·  Contexto  ·  Conexão',
    80, H / 2 + 120, 16, 'Light', C.sand2, { lineHeight: 168 });
  mkText(f, 'Lúcio Oliveira', 80, H - 80, 12, 'Light', C.earth, { letterSpacing: 20, textCase: 'UPPER' });

  mkRect(f, W * 0.50, 0, W * 0.50, H, C.earth, 0.07);
  return f;
}


// ════════════════════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('[Antena África] Loading fonts…');
  await loadFonts();
  console.log('[Antena África] Fonts loaded:', JSON.stringify(resolvedFonts));

  const slides = [];
  let xOff = 0;

  console.log('[Antena África] Building slides…');
  slides.push(buildCover(xOff));     xOff += W + GAP;
  slides.push(buildIntro(xOff));     xOff += W + GAP;
  slides.push(buildNome(xOff));      xOff += W + GAP;
  slides.push(buildOrigem(xOff));    xOff += W + GAP;
  slides.push(buildFormato(xOff));   xOff += W + GAP;
  slides.push(buildLinha(xOff));     xOff += W + GAP;
  slides.push(buildPassos(xOff));    xOff += W + GAP;
  slides.push(buildBackCover(xOff));

  console.log('[Antena África] Done — ' + slides.length + ' slides created');

  figma.currentPage.selection = slides;
  figma.viewport.scrollAndZoomIntoView(slides);
  figma.closePlugin('✓ Antena África — 8 slides criados');
}

main().catch(err => {
  console.error('[Antena África] FATAL:', err);
  figma.closePlugin('Erro: ' + err.message);
});
