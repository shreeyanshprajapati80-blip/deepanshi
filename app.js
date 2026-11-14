(function () {
'use strict';

/* ---------- setup ---------- */
const EDIT = /[?&]edit(=|&|$)/.test(location.search);
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const clone = o => JSON.parse(JSON.stringify(o));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');

let C = clone(window.SITE_CONTENT || {});
if (EDIT) { try { const d = localStorage.getItem('dx_draft'); if (d) C = Object.assign(C, JSON.parse(d)); } catch (e) {} }
function ensure() {
  C.siteTitle = C.siteTitle || 'The Deepanshi Experience';
  C.name = C.name || 'Deepanshi'; C.nickname = C.nickname || 'Kanto';
  C.birthdayDate = C.birthdayDate || '2026-11-16';
  C.titles = Object.assign({ notes: 'A Little Note', letter: 'A Letter From My Heart', memories: 'Our Memories', timeline: 'Our Little Timeline', reasons: 'Reasons You Are Special', countdown: 'The Countdown' }, C.titles);
  C.subs = Object.assign({ notes: '', memories: '', timeline: '', reasons: '', countdown: '' }, C.subs);
  ['notes', 'photos', 'timeline', 'reasons'].forEach(k => { if (!Array.isArray(C[k])) C[k] = []; });
  ['hero', 'letter', 'cake', 'feedback', 'final', 'music'].forEach(k => { C[k] = C[k] || {}; });
  if (!Array.isArray(C.final.lines)) C.final.lines = [];
  C.collageTitle = C.collageTitle || '';
}
ensure();

function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const k in (attrs || {})) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  kids.flat().forEach(c => { if (c == null || c === false) return; e.append(c.nodeType ? c : document.createTextNode(c)); });
  return e;
}
let tt;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 3400); }
const eyebrow = t => h('p', { class: 'eyebrow', text: t });

/* ---------- background: petals + stars ---------- */
(function bg() {
  const cv = $('#bg'), x = cv.getContext('2d');
  let W, H, D, run = false; const P = [], S = [];
  const cols = ['199,125,145', '243,214,223', '216,180,119', '170,64,98'];
  const mk = top => ({ x: Math.random() * W, y: top ? -20 : Math.random() * H, s: 6 + Math.random() * 9, v: .25 + Math.random() * .55, r: Math.random() * 6.28, vr: (Math.random() - .5) * .02, sw: Math.random() * 6.28, c: cols[Math.random() * cols.length | 0], a: .22 + Math.random() * .4 });
  function size() {
    D = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * D; cv.height = H * D; cv.style.width = W + 'px'; cv.style.height = H + 'px'; x.setTransform(D, 0, 0, D, 0, 0);
    P.length = S.length = 0;
    for (let i = 0; i < (W < 600 ? 16 : 30); i++) P.push(mk());
    for (let i = 0; i < (W < 600 ? 45 : 80); i++) S.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, t: Math.random() * 6.28, sp: .01 + Math.random() * .03 });
  }
  function draw() {
    x.clearRect(0, 0, W, H);
    for (const s of S) { s.t += s.sp; x.fillStyle = 'rgba(255,235,200,' + (.25 + .55 * Math.abs(Math.sin(s.t))) + ')'; x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.283); x.fill(); }
    for (const p of P) {
      if (!RM) { p.y += p.v; p.sw += .015; p.x += Math.sin(p.sw) * .5; p.r += p.vr; if (p.y > H + 20) Object.assign(p, mk(true)); }
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
      const s = p.s; x.beginPath(); x.moveTo(0, -s); x.bezierCurveTo(s * .9, -s * .6, s * .8, s * .7, 0, s); x.bezierCurveTo(-s * .8, s * .7, -s * .9, -s * .6, 0, -s); x.fill(); x.restore();
    }
  }
  function loop() { draw(); if (!RM && !document.hidden) requestAnimationFrame(loop); else run = false; }
  function kick() { if (!run) { run = true; loop(); } }
  size(); kick();
  addEventListener('resize', () => { size(); kick(); });
  document.addEventListener('visibilitychange', kick);
})();

/* ---------- confetti + hearts ---------- */
const fx = $('#fx'), fc = fx.getContext('2d'); let fp = [], fr = false;
function fxSize() { fx.width = innerWidth; fx.height = innerHeight; }
fxSize(); addEventListener('resize', fxSize);
function confetti(n = 120, ox = .5, oy = .55) {
  if (RM) n = Math.min(n, 25);
  const cols = ['#D8B477', '#C77D91', '#F3D6DF', '#FFF5F0', '#E8CB93', '#d4577a'];
  for (let i = 0; i < n; i++) fp.push({ x: innerWidth * ox, y: innerHeight * oy, vx: (Math.random() - .5) * 15, vy: -Math.random() * 15 - 3, g: .28, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[Math.random() * cols.length | 0], life: 0, heart: Math.random() < .22 });
  if (!fr) { fr = true; requestAnimationFrame(fxLoop); }
}
function fxLoop() {
  fc.clearRect(0, 0, fx.width, fx.height);
  fp = fp.filter(p => p.y < fx.height + 30 && p.life < 230);
  for (const p of fp) {
    p.vy += p.g; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
    fc.save(); fc.translate(p.x, p.y); fc.rotate(p.r); fc.globalAlpha = Math.max(0, 1 - p.life / 230); fc.fillStyle = p.c;
    if (p.heart) { fc.font = (p.s * 2) + 'px serif'; fc.fillText('❤', 0, 0); } else fc.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6);
    fc.restore();
  }
  if (fp.length) requestAnimationFrame(fxLoop); else { fr = false; fc.clearRect(0, 0, fx.width, fx.height); }
}
function hearts(n = 8, host) {
  host = host || $('#hearts'); const set = ['❤', '💗', '🌹', '✨', '💖'];
  for (let i = 0; i < n; i++) {
    const s = h('span', { class: 'heart-float', text: set[Math.random() * set.length | 0], style: 'left:' + (Math.random() * 100) + '%;font-size:' + (14 + Math.random() * 20) + 'px;animation-duration:' + (5 + Math.random() * 5) + 's;animation-delay:' + (Math.random() * .8) + 's' });
    host.appendChild(s); s.addEventListener('animationend', () => s.remove());
  }
}

/* ---------- music ---------- */
const aud = $('#aud'); let audBad = false;
function musicInit() {
  const f = (C.music.file || '').trim();
  if (f && !audBad) { if (aud.getAttribute('src') !== f) aud.setAttribute('src', f); $('#btnMute').hidden = false; }
  else { $('#btnMute').hidden = true; }
  $('#btnMusic').setAttribute('aria-label', f && !audBad ? 'Music play/pause' : 'Song kholiye (' + (C.music.title || 'song') + ')');
  const t = $('#soundToggle'); if (t) t.textContent = f && !audBad ? (aud.paused ? '♪ Play song' : '❚❚ Pause song') : '♪ ' + (C.music.title || 'Song');
}
aud.addEventListener('error', () => { if (aud.getAttribute('src')) { audBad = true; toast('Music file nahi mili. Song ka link use kijiye 🎧'); musicInit(); } });
function musicAction() {
  const f = (C.music.file || '').trim();
  if (!f || audBad) { if (C.music.link) { window.open(C.music.link, '_blank', 'noopener'); toast('Song ka link khul raha hai. Wahan se play kijiye 🎧'); } return; }
  if (aud.paused) aud.play().then(() => { $('#btnMusic').textContent = '❚❚'; musicInit(); }).catch(() => toast('Music play nahi ho paya. Dobara tap kijiye.'));
  else { aud.pause(); $('#btnMusic').textContent = '♪'; musicInit(); }
}
$('#btnMusic').addEventListener('click', musicAction);
$('#btnMute').addEventListener('click', () => { aud.muted = !aud.muted; $('#btnMute').textContent = aud.muted ? '🔇' : '🔊'; });

/* ---------- navigation ---------- */
const PAGES = ['The Beginning', 'A Little Note', 'A Letter From My Heart', 'Our Memories', 'Our Little Timeline', 'Reasons You Are Special', 'The Countdown', 'Birthday Celebration', 'How Do You Feel?', 'One Last Surprise'];
let cur = 0; const seen = new Set([0]);
function go(i) {
  i = Math.max(0, Math.min(PAGES.length - 1, i));
  $$('.page').forEach((p, k) => { const a = k === i; p.classList.toggle('active', a); p.toggleAttribute('inert', !a); p.setAttribute('aria-hidden', a ? 'false' : 'true'); if (a) p.scrollTop = 0; });
  cur = i; seen.add(i);
  try { localStorage.setItem('dx_page', String(i)); } catch (e) {}
  updateUI(); onEnter(i);
}
function updateUI() {
  $('#progressBar').style.width = ((cur + 1) / PAGES.length * 100) + '%';
  $('#progress').setAttribute('aria-valuenow', cur + 1);
  $('#chapLabel').textContent = pad(cur + 1) + ' / ' + pad(PAGES.length) + ' · ' + PAGES[cur];
  $$('#dots button').forEach((b, k) => { b.classList.toggle('on', k === cur); b.classList.toggle('seen', k !== cur && seen.has(k)); b.setAttribute('aria-current', k === cur ? 'page' : 'false'); });
  $('#btnPrev').disabled = cur === 0; $('#btnNext').disabled = cur === PAGES.length - 1;
  $$('.menu-item').forEach((b, k) => b.classList.toggle('on', k === cur));
}
function onEnter(i) {
  if (i === 0) { const e = $('#env'); if (e) e.classList.remove('open'); }
  if (i === 2) { const L = $('.letter'); if (L) { L.classList.remove('play'); void L.offsetWidth; L.classList.add('play'); } }
  if (i === 6) tick();
  if (i === 7 && !RM) hearts(6);
}
function buildShell() {
  const stage = $('#stage');
  PAGES.forEach((p, i) => stage.appendChild(h('section', { class: 'page', id: 'page-' + i, 'aria-label': p, 'aria-hidden': 'true', inert: true })));
  $('#dots').replaceChildren(...PAGES.map((p, i) => h('button', { type: 'button', 'aria-label': 'Page ' + (i + 1) + ': ' + p, onclick: () => go(i) })));
  $('#menu').replaceChildren(h('div', { class: 'card menu-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Chapters' }, h('h3', { text: 'Chapters' }),
    ...PAGES.map((p, i) => h('button', { class: 'menu-item', type: 'button', onclick: () => { $('#menu').hidden = true; go(i); } }, h('b', { text: pad(i + 1) }), p))));
  $('#menu').addEventListener('click', e => { if (e.target.id === 'menu') $('#menu').hidden = true; });
}
$('#btnPrev').addEventListener('click', () => go(cur - 1));
$('#btnNext').addEventListener('click', () => go(cur + 1));
$('#btnHome').addEventListener('click', () => go(0));
$('#btnMenu').addEventListener('click', () => { $('#menu').hidden = false; });

/* ---------- page builders ---------- */
function b0() {
  const env = h('div', { class: 'env', id: 'env', role: 'button', tabindex: '0', 'aria-label': 'Envelope kholiye' },
    h('div', { class: 'env-back' }), h('div', { class: 'env-paper', text: (C.hero.envText || (C.nickname + ' ❤')) }), h('div', { class: 'env-front' }), h('div', { class: 'env-flap' }), h('div', { class: 'env-seal', text: '❤' }));
  const open = () => { if (env.classList.contains('open')) return; env.classList.add('open'); confetti(70, .5, .45); setTimeout(() => go(1), RM ? 200 : 1200); };
  env.addEventListener('click', open); env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  return h('div', { class: 'wrap' }, eyebrow('A digital love story'), h('h1', { class: 'glow', text: C.hero.heading }), h('div', { class: 'name-script', text: C.name }), h('p', { class: 'sub', text: C.hero.subtitle }), env,
    h('div', { class: 'btnrow' }, h('button', { class: 'btn', type: 'button', text: C.hero.button, onclick: open }), h('button', { class: 'btn ghost small', id: 'soundToggle', type: 'button', onclick: musicAction })));
}
function showNote(text) {
  const m = $('#noteModal');
  m.replaceChildren(h('div', { class: 'card note-card', role: 'dialog', 'aria-modal': 'true' }, h('div', { class: 'note-heart', text: '💌' }), h('p', { class: 'note-text', text }), h('button', { class: 'btn small', type: 'button', text: 'Close ❤', onclick: () => { m.hidden = true; } })));
  m.hidden = false; $('button', m).focus(); hearts(6);
}
$('#noteModal').addEventListener('click', e => { if (e.target.id === 'noteModal') e.target.hidden = true; });
function b1() {
  const grid = h('div', { class: 'env-grid' });
  C.notes.forEach((n, i) => { const b = h('button', { class: 'mini', type: 'button', 'aria-label': 'Note ' + (i + 1) + ' kholiye', onclick: () => { b.classList.add('opened'); showNote(n); } }, h('span', { class: 'mini-flap' }), h('span', { class: 'mini-num', text: i + 1 })); grid.appendChild(b); });
  return h('div', { class: 'wrap' }, eyebrow('Chapter 02'), h('h2', { text: C.titles.notes }), h('p', { class: 'sub', text: C.subs.notes }), grid);
}
function b2() {
  const paras = String(C.letter.body || '').split(/\n\s*\n/).filter(s => s.trim());
  const sheet = h('article', { class: 'letter' }, h('div', { class: 'rose r1', text: '🌹' }), h('div', { class: 'rose r2', text: '🌸' }), h('h2', { text: C.letter.heading || '' }),
    ...paras.map((p, i) => h('p', { class: 'lp', style: '--d:' + (.5 + i * .5) + 's', text: p.trim() })),
    h('p', { class: 'sign', style: '--d:' + (.5 + paras.length * .5) + 's', text: C.letter.signature || '' }));
  return h('div', { class: 'wrap' }, eyebrow('Chapter 03'), h('h2', { text: C.titles.letter }), sheet);
}

/* memories + collage */
const LAYOUTS = {
  1: [[1, 1, 9, 7]],
  2: [[1, 1, 5, 7], [5, 1, 9, 7]],
  3: [[1, 1, 5, 7], [5, 1, 9, 4], [5, 4, 9, 7]],
  4: [[1, 1, 6, 5], [1, 5, 4, 7], [4, 5, 6, 7], [6, 1, 9, 7]],
  5: [[1, 1, 5, 4], [1, 4, 3, 7], [3, 4, 5, 7], [5, 1, 9, 3], [5, 3, 9, 7]],
  6: [[1, 1, 4, 4], [1, 4, 4, 7], [4, 1, 7, 3], [4, 3, 7, 5], [4, 5, 7, 7], [7, 1, 9, 7]]
};
let memView = 'gallery';
function uploadControl(label, handler) {
  const inp = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true, onchange: async () => { await (handler || addPhotos)([...inp.files]); inp.value = ''; } });
  return h('label', { class: 'btn small upl' }, label || '📷 Photos upload karo', inp);
}
function galleryNode() {
  const items = C.photos.length ? C.photos : [0, 1, 2, 3, 4, 5].map(() => ({ src: '', caption: 'Caption yahan likho ✏️' }));
  const g = h('div', { class: 'gallery' });
  items.forEach((p, k) => {
    const rot = (((k * 37) % 7) - 3) * 1.2;
    const card = h('figure', { class: 'polaroid', style: '--r:' + rot + 'deg', tabindex: p.src ? '0' : null, role: p.src ? 'button' : null, 'aria-label': p.src ? 'Photo ' + (k + 1) + ' bada kijiye' : null },
      p.src ? h('img', { src: p.src, alt: p.caption || ('Photo ' + (k + 1)), loading: 'lazy' }) : h('div', { class: 'ph' }, h('span', { text: '📷' }), h('small', { text: 'Yahan aapki photo aayegi' })),
      h('figcaption', { class: 'hand', text: p.caption || '' }));
    if (p.src) { card.addEventListener('click', () => openLB(k)); card.addEventListener('keydown', e => { if (e.key === 'Enter') openLB(k); }); }
    g.appendChild(card);
  });
  return g;
}
let GP = [];
const collageSrc = () => (GP.length ? GP : C.photos);
async function addGuestPhotos(files) {
  let n = 0; if (files.length > 6) toast('Collage me pehli 6 photos hi aayengi'); else toast('Photos taiyaar ho rahi hain...');
  const fresh = [];
  for (const f of files.slice(0, 6)) { if (!/^image\//.test(f.type)) continue; try { fresh.push({ src: await compress(f), caption: '' }); n++; } catch (e) {} }
  if (n) { GP = fresh; memView = 'collage'; drawMem(); toast('Aapka collage taiyaar hai 💖'); } else toast('Photo load nahi ho payi. Dobara try kijiye.');
}
function collageNode() {
  const ph = collageSrc().slice(0, 6), count = ph.length || 4, L = LAYOUTS[count];
  const frame = h('div', { class: 'collage' }, ...L.map((a, k) => h('div', { class: 'cell', style: 'grid-area:' + a.join('/') }, ph[k] ? h('img', { src: ph[k].src, alt: ph[k].caption || '' }) : '❤')),
    C.collageTitle ? h('div', { class: 'collage-title hand', text: C.collageTitle }) : null);
  const row = h('div', { class: 'btnrow', style: 'margin-top:14px' }, h('button', { class: 'btn small', type: 'button', text: '⬇ Collage download kijiye', onclick: downloadCollage }));
  const mine = h('div', { class: 'btnrow', style: 'margin-top:12px' }, uploadControl('📷 Apni photos chuniye', addGuestPhotos), GP.length ? h('button', { class: 'btn small ghost', type: 'button', text: '↺ Dobara shuru', onclick: () => { GP = []; drawMem(); } }) : null);
  return h('div', {}, frame, row, mine, h('p', { class: 'hint', text: 'Gallery se 6 tak photos chuniye, collage khud ban jayega. Aapki photos sirf aapke phone me rehti hain, kahin save ya share nahi hotin.' }));
}
function drawMem() {
  const body = $('#memBody'); if (!body) return;
  body.replaceChildren(memView === 'gallery' ? galleryNode() : collageNode());
  $$('.tabs button').forEach(b => { const on = b.dataset.v === memView; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
}
function b3() {
  const tab = (v, l) => h('button', { type: 'button', role: 'tab', 'data-v': v, text: l, onclick: () => { memView = v; drawMem(); } });
  const page = h('div', { class: 'wrap' }, eyebrow('Chapter 04'), h('h2', { text: C.titles.memories }), h('p', { class: 'sub', text: C.subs.memories }),
    h('div', { class: 'tabs', role: 'tablist' }, tab('gallery', 'Polaroids'), tab('collage', 'Collage')));
  if (EDIT) page.appendChild(h('div', { class: 'editbar' }, h('span', { text: 'Edit mode:' }), uploadControl(), h('span', { text: '3-4 photo dalo, collage khud ban jayega.' })));
  page.appendChild(h('div', { class: 'mem-body', id: 'memBody' }));
  setTimeout(drawMem, 0);
  return page;
}

/* lightbox */
let lbi = 0;
function openLB(i) { lbi = i; renderLB(); $('#lightbox').hidden = false; }
function lbStep(d) { if (!C.photos.length) return; lbi = (lbi + d + C.photos.length) % C.photos.length; renderLB(); }
function renderLB() {
  const p = C.photos[lbi]; if (!p) return; const lb = $('#lightbox');
  lb.replaceChildren(h('button', { class: 'icon lb-close', type: 'button', 'aria-label': 'Band karo', text: '✕', onclick: () => { lb.hidden = true; } }),
    h('button', { class: 'icon lb-nav prev', type: 'button', 'aria-label': 'Pichhli photo', text: '‹', onclick: () => lbStep(-1) }),
    h('figure', { class: 'lb-fig' }, h('img', { src: p.src, alt: p.caption || 'Photo' }), h('figcaption', { text: p.caption || '' })),
    h('button', { class: 'icon lb-nav next', type: 'button', 'aria-label': 'Agli photo', text: '›', onclick: () => lbStep(1) }));
}
(function swipe() { let sx = 0; const lb = $('#lightbox'); lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true }); lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) lbStep(d < 0 ? 1 : -1); }); lb.addEventListener('click', e => { if (e.target === lb) lb.hidden = true; }); })();

/* collage download */
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function rr(c, x, y, w, hh, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + hh, r); c.arcTo(x + w, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
async function downloadCollage() {
  const ph = collageSrc().slice(0, 6);
  if (!ph.length) { toast('Pehle kuch photos chuniye 📷'); return; }
  try {
    const W = 1080, H = 1440, pd = 26, gap = 8, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#51182F'); g.addColorStop(1, '#2B0D1C'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    const cw = (W - 2 * pd - 5 * gap) / 6, rh = (H - 2 * pd - 7 * gap) / 8, imgs = await Promise.all(ph.map(p => loadImg(p.src)));
    LAYOUTS[ph.length].forEach((a, k) => {
      const [r1, c1, r2, c2] = a, x = pd + (c1 - 1) * (cw + gap), y = pd + (r1 - 1) * (rh + gap), w = (c2 - c1) * cw + (c2 - c1 - 1) * gap, hh = (r2 - r1) * rh + (r2 - r1 - 1) * gap, im = imgs[k];
      c.save(); rr(c, x, y, w, hh, 18); c.clip(); const s = Math.max(w / im.width, hh / im.height), dw = im.width * s, dh = im.height * s; c.drawImage(im, x + (w - dw) / 2, y + (hh - dh) / 2, dw, dh); c.restore();
    });
    c.strokeStyle = '#D8B477'; c.lineWidth = 5; rr(c, 10, 10, W - 20, H - 20, 26); c.stroke();
    if (C.collageTitle) {
      c.font = '700 56px Caveat, "Segoe Script", cursive'; const tw = c.measureText(C.collageTitle).width + 70, ty = H - 78;
      c.fillStyle = '#2B0D1C'; rr(c, (W - tw) / 2, ty - 48, tw, 76, 38); c.fill(); c.strokeStyle = '#D8B477'; c.lineWidth = 3; c.stroke();
      c.fillStyle = '#D8B477'; c.textAlign = 'center'; c.fillText(C.collageTitle, W / 2, ty + 8);
    }
    cv.toBlob(b => { const a = h('a', { href: URL.createObjectURL(b), download: 'deepanshi-collage.jpg' }); document.body.appendChild(a); a.click(); a.remove(); toast('Collage download ho gaya 💖'); }, 'image/jpeg', .92);
  } catch (e) { toast('Collage bana nahi paya. Dobara try kijiye.'); }
}

function b4() {
  const list = h('div', { class: 'tl' });
  C.timeline.forEach(t => {
    const ph = C.photos[t.photo];
    list.appendChild(h('div', { class: 'tl-item' }, h('div', { class: 'tl-dot' }), h('div', { class: 'tl-card card' }, h('div', { class: 'tl-date', text: t.date }), h('h3', { text: t.title }), h('p', { text: t.desc }), ph ? h('img', { class: 'tl-img', src: ph.src, alt: t.title || '', loading: 'lazy' }) : null)));
  });
  return h('div', { class: 'wrap' }, eyebrow('Chapter 05'), h('h2', { text: C.titles.timeline }), h('p', { class: 'sub', text: C.subs.timeline }), list);
}
function b5() {
  const g = h('div', { class: 'flips' });
  C.reasons.forEach((r, i) => {
    const b = h('button', { class: 'flip', type: 'button', 'aria-pressed': 'false', 'aria-label': r.title + '. Tap karke palat dijiye.', onclick: () => { const f = b.classList.toggle('flipped'); b.setAttribute('aria-pressed', f); } },
      h('div', { class: 'flip-in' }, h('div', { class: 'face front' }, h('div', { class: 'n', text: pad(i + 1) }), h('h3', { text: r.title }), h('span', { text: '♡' })), h('div', { class: 'face back' }, h('span', { text: '❤' }), h('div', { text: r.text }))));
    g.appendChild(b);
  });
  return h('div', { class: 'wrap' }, eyebrow('Chapter 06'), h('h2', { text: C.titles.reasons }), h('p', { class: 'sub', text: C.subs.reasons }), g);
}

/* countdown */
let wasLive = null;
function target() { const [y, m, d] = String(C.birthdayDate).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0); }
function tick() {
  const el = $('#cd-d'); if (!el) return;
  const diff = target() - Date.now(), live = diff <= 0, s = Math.floor(Math.max(0, diff) / 1000);
  el.textContent = Math.floor(s / 86400); $('#cd-h').textContent = pad(Math.floor(s % 86400 / 3600)); $('#cd-m').textContent = pad(Math.floor(s % 3600 / 60)); $('#cd-s').textContent = pad(s % 60);
  $('#cd').classList.toggle('done', live); $('#cdLive').hidden = !live;
  $('#cdSub').textContent = live ? 'Aaj hai wo din! 🎉' : C.subs.countdown;
  if (wasLive === false && live && cur === 6) confetti(220);
  wasLive = live;
}
function b6() {
  const box = (id, l) => h('div', { class: 'cd-box card' }, h('b', { id, text: '--' }), h('small', { text: l }));
  return h('div', { class: 'wrap' }, eyebrow('Chapter 07'), h('h2', { text: C.titles.countdown }), h('p', { class: 'sub', id: 'cdSub', text: C.subs.countdown }),
    h('div', { class: 'cd', id: 'cd', role: 'timer', 'aria-label': 'Birthday countdown' }, box('cd-d', 'Days'), box('cd-h', 'Hours'), box('cd-m', 'Minutes'), box('cd-s', 'Seconds')),
    h('div', { class: 'live', id: 'cdLive', hidden: true }, h('p', { text: 'Happy Birthday, ' + C.nickname + '! 🎂' }), h('button', { class: 'btn', type: 'button', text: 'Celebration shuru kijiye 🎉', onclick: () => go(7) })));
}

/* cake */
const CAKE_SVG = '<svg viewBox="0 0 320 300" class="cake" role="group" aria-label="Birthday cake">' +
'<defs><clipPath id="cL"><rect x="-100" y="-100" width="325" height="460"/></clipPath><clipPath id="cR"><rect x="225" y="-100" width="200" height="460"/></clipPath>' +
'<linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF5F0"/><stop offset="1" stop-color="#F3D6DF"/></linearGradient>' +
'<g id="body"><rect x="40" y="190" width="240" height="72" rx="12" fill="#51182F"/><rect x="40" y="222" width="240" height="7" fill="#C77D91" opacity=".55"/>' +
'<rect x="55" y="132" width="210" height="64" rx="12" fill="#C77D91"/><rect x="55" y="162" width="210" height="6" fill="#F3D6DF" opacity=".5"/>' +
'<rect x="70" y="86" width="180" height="52" rx="12" fill="#F3D6DF"/>' +
'<path d="M70 100 q15 22 30 0 q15 24 30 0 q15 20 30 0 q15 24 30 0 q15 20 30 0 q15 22 30 0 v-14 h-180z" fill="#FFF5F0"/>' +
'<circle cx="95" cy="214" r="5" fill="#D8B477"/><circle cx="135" cy="236" r="5" fill="#D8B477"/><circle cx="185" cy="214" r="5" fill="#D8B477"/><circle cx="225" cy="238" r="5" fill="#D8B477"/><circle cx="260" cy="214" r="5" fill="#D8B477"/>' +
'<circle cx="95" cy="148" r="4" fill="#FFF5F0"/><circle cx="160" cy="180" r="4" fill="#FFF5F0"/><circle cx="230" cy="150" r="4" fill="#FFF5F0"/></g>' +
'<g id="face"><rect x="40" y="190" width="240" height="72" rx="12" fill="url(#gF)" stroke="#C77D91" stroke-width="2"/><rect x="40" y="222" width="240" height="6" fill="#C77D91" opacity=".6"/>' +
'<rect x="55" y="132" width="210" height="64" rx="12" fill="url(#gF)" stroke="#C77D91" stroke-width="2"/><rect x="55" y="162" width="210" height="6" fill="#d4577a" opacity=".6"/>' +
'<rect x="70" y="86" width="180" height="52" rx="12" fill="url(#gF)" stroke="#C77D91" stroke-width="2"/></g></defs>' +
'<ellipse cx="160" cy="268" rx="152" ry="15" fill="#D8B477"/><ellipse cx="160" cy="264" rx="146" ry="12" fill="#E8CB93"/>' +
'<g clip-path="url(#cR)"><use href="#face"/></g><g clip-path="url(#cL)"><use href="#body"/></g>' +
'<g id="slice"><g clip-path="url(#cR)"><use href="#body"/></g></g>' +
[95, 125, 155, 185, 210].map((x, i) => '<g class="candle" tabindex="0" role="button" aria-label="Candle ' + (i + 1) + ' bujhaiye" transform="translate(' + x + ',0)"><rect x="-15" y="30" width="30" height="62" fill="transparent"/><rect x="-4" y="58" width="8" height="30" rx="2" fill="#D8B477"/><rect x="-4" y="68" width="8" height="4" fill="#51182F" opacity=".4"/><path class="flame" d="M0 36 C-8 46 -6 58 0 58 C6 58 8 46 0 36Z" fill="#FFB347"/><path class="flame-in" d="M0 45 C-4 50 -3 56 0 56 C3 56 4 50 0 45Z" fill="#FFF1B8"/><path class="smoke" d="M0 50 q-6 -10 0 -18 q6 -8 0 -18"/></g>').join('') +
'<g class="knife"><rect x="219" y="-60" width="12" height="70" rx="4" fill="#51182F"/><rect x="217" y="6" width="16" height="6" fill="#D8B477"/><path d="M222 12 L229 12 L229 264 Q225.5 272 222 264 Z" fill="#e9edf2" stroke="#9aa3ad" stroke-width="1"/></g></svg>';

function makeWish() {
  const m = $('#noteModal'); const txt = h('p', { class: 'note-text', text: C.cake.wishIntro || '' });
  const btn = h('button', { class: 'btn small', type: 'button', text: 'Meri wish ho gayi ✨', onclick: () => {
    if (btn.dataset.done) { m.hidden = true; return; }
    btn.dataset.done = '1'; txt.textContent = C.cake.wishDone || ''; btn.textContent = 'Close ❤'; confetti(160, .5, .4); hearts(12);
  } });
  m.replaceChildren(h('div', { class: 'card note-card', role: 'dialog', 'aria-modal': 'true' }, h('div', { class: 'note-heart', text: '🌠' }), txt, btn)); m.hidden = false; btn.focus();
}
function b7() {
  const wrap = h('div', { class: 'cake-wrap' }); wrap.innerHTML = CAKE_SVG;
  const svg = $('svg', wrap), candles = $$('.candle', wrap);
  const msg = h('p', { class: 'cake-msg', 'aria-live': 'polite', text: 'Candles pe tap kijiye ya neeche ka button dabaiye 🕯️' });
  const title = h('h2', { class: 'bday-title', 'aria-label': C.cake.title }, ...[...(C.cake.title || '')].map((ch, i) => h('span', { 'aria-hidden': 'true', style: '--i:' + i, text: ch === ' ' ? '\u00a0' : ch })));
  let out = 0;
  const blow = c => { if (c.classList.contains('out')) return; c.classList.add('out'); out++; if (out === candles.length) { confetti(180); hearts(10); msg.textContent = C.cake.message; } };
  candles.forEach(c => { c.addEventListener('click', () => blow(c)); c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(c); } }); });
  const blowAll = h('button', { class: 'btn small', type: 'button', text: '💨 Saari candles bujhaiye', onclick: () => { candles.forEach((c, i) => setTimeout(() => blow(c), RM ? 0 : i * 180)); } });
  let cut = false;
  const cutBtn = h('button', { class: 'btn small', type: 'button', text: '🔪 Cake kaatiye', onclick: () => {
    if (!cut) { cut = true; cutBtn.textContent = '↺ Cake wapas jodiye'; svg.classList.remove('cut'); svg.classList.add('cutting'); setTimeout(() => { svg.classList.add('cut'); confetti(170, .5, .55); hearts(8); msg.textContent = C.cake.cutMessage; }, RM ? 0 : 900); }
    else { cut = false; cutBtn.textContent = '🔪 Cake kaatiye'; svg.classList.remove('cut', 'cutting'); }
  } });
  const relight = h('button', { class: 'btn small ghost', type: 'button', text: '🕯️ Candles dobara jalaiye', onclick: () => { candles.forEach(c => c.classList.remove('out')); out = 0; msg.textContent = 'Candles pe tap kijiye ya neeche ka button dabaiye 🕯️'; } });
  return h('div', { class: 'wrap' }, eyebrow('Chapter 08'), title, wrap, msg,
    h('div', { class: 'btnrow' }, blowAll, cutBtn, h('button', { class: 'btn small', type: 'button', text: '🌠 Make a Wish', onclick: makeWish }), relight),
    h('button', { class: 'btn ghost small', type: 'button', text: '🎉 Confetti', onclick: () => confetti(200) }));
}

/* feedback */
function b8() {
  let mood = '';
  const moods = [['😊', 'Happy'], ['🥹', 'Emotional'], ['😲', 'Surprised'], ['😶', 'Speechless'], ['🥰', 'Loved']];
  const grid = h('div', { class: 'moods', role: 'radiogroup', 'aria-label': 'Aapka mood' });
  moods.forEach(([e, l]) => { const b = h('button', { type: 'button', class: 'mood', role: 'radio', 'aria-checked': 'false', 'aria-label': l, onclick: () => { mood = l; $$('.mood', grid).forEach(x => { const on = x === b; x.classList.toggle('sel', on); x.setAttribute('aria-checked', on); }); } }, h('span', { class: 'em', text: e }), h('small', { text: l })); grid.appendChild(b); });
  const ta = h('textarea', { rows: '5', maxlength: '1500', placeholder: C.feedback.placeholder || '', 'aria-label': 'Aapka message' });
  const status = h('p', { class: 'fb-status', role: 'status' });
  const btn = h('button', { class: 'btn', type: 'submit', text: C.feedback.button || 'Send ❤️' });
  const ep = (C.feedback.endpoint || '').trim();
  const thanks = sent => {
    form.replaceWith(h('div', { class: 'card thanks' }, h('div', { class: 'big-heart', text: '💖' }), h('p', { class: 'note-text', text: C.feedback.thanks || '' }),
      sent ? null : h('p', { class: 'warn', text: 'ℹ️ Online bhejne ka setup abhi nahi hua hai, isliye ye jawab sirf is phone me save hua hai.' })));
    confetti(140, .5, .5); hearts(10);
  };
  const form = h('form', { class: 'fb card', novalidate: true, onsubmit: async e => {
    e.preventDefault();
    if (!mood && !ta.value.trim()) { status.textContent = 'Mood chuniye ya kuch likhiye 🙂'; return; }
    const rec = { from: C.name, mood, message: ta.value.trim(), at: new Date().toISOString() };
    try { const a = JSON.parse(localStorage.getItem('dx_feedback') || '[]'); a.push(rec); localStorage.setItem('dx_feedback', JSON.stringify(a)); } catch (x) {}
    if (!ep) { thanks(false); return; }
    btn.disabled = true; status.textContent = 'Bhej rahe hain...';
    try { const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(rec) }); if (!r.ok) throw new Error('bad'); thanks(true); }
    catch (x) { btn.disabled = false; status.textContent = 'Abhi bhej nahi paye 😕 Internet check karke dobara try kijiye.'; }
  } }, grid, ta, status, btn);
  return h('div', { class: 'wrap' }, eyebrow('Chapter 09'), h('h2', { text: C.feedback.heading }), EDIT && !ep ? h('p', { class: 'warn', text: '⚠️ Edit mode: Formspree endpoint set nahi hai, toh jawab tumhe nahi milenge. Editor > Feedback me link daalo.' }) : null, form);
}

/* final */
function openGift() {
  const g = $('.gift'); if (!g || g.classList.contains('open')) return;
  g.classList.add('open'); confetti(220, .5, .5); hearts(14); setTimeout(showFinale, RM ? 200 : 1300);
}
function closeFinale() { $('#finale').hidden = true; const g = $('.gift'); if (g) g.classList.remove('open'); }
function showFinale() {
  const f = $('#finale'), L = C.final.lines;
  f.replaceChildren(h('div', { class: 'fin-inner' }, h('div', { class: 'fin-rose', text: '🌹' }),
    h('h2', { class: 'fin-title', style: 'animation:rise2 1.2s .2s both', text: L[0] || '' }),
    ...L.slice(1).map((t, i) => h('p', { class: 'fin-line', style: '--d:' + (1 + i * 1.1) + 's', text: t })),
    C.final.wish ? h('p', { class: 'fin-wish hand', style: '--d:' + (1 + L.length * 1.1) + 's', text: C.final.wish }) : null,
    h('div', { class: 'btnrow', style: 'margin-top:12px' }, h('button', { class: 'btn small', type: 'button', text: 'Wapas', onclick: closeFinale }), h('button', { class: 'btn ghost small', type: 'button', text: 'Shuru se dekhiye', onclick: () => { closeFinale(); go(0); } }))));
  f.hidden = false; hearts(16, f);
}
function b9() {
  const gift = h('button', { class: 'gift', type: 'button', 'aria-label': 'Gift box kholiye', onclick: openGift }, h('span', { class: 'g-box' }), h('span', { class: 'g-lid' }), h('span', { class: 'g-rib' }));
  return h('div', { class: 'wrap' }, eyebrow('Chapter 10'), h('h1', { class: 'glow', text: C.final.heading }), gift, h('p', { class: 'sub', text: 'Tap kijiye aur kholiye 🎁' }));
}

/* ---------- render ---------- */
const BUILD = [b0, b1, b2, b3, b4, b5, b6, b7, b8, b9];
function renderAll() {
  ensure(); document.title = C.siteTitle + ' ❤️'; $('#brand').textContent = C.siteTitle + ' ❤️';
  BUILD.forEach((f, i) => $('#page-' + i).replaceChildren(f()));
  musicInit(); wasLive = null; tick(); updateUI();
  const L = $('.letter'); if (L && cur === 2) L.classList.add('play');
}

/* ---------- photos ---------- */
function compress(file, max = 1100, q = .78) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', q)); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('img')); };
    img.src = url;
  });
}
let onPhotosChanged = () => {};
async function addPhotos(files) {
  let n = 0; toast('Photos process ho rahi hain...');
  for (const f of files) { if (!/^image\//.test(f.type)) continue; try { C.photos.push({ src: await compress(f), caption: '' }); n++; } catch (e) { toast('Ek photo load nahi ho payi'); } }
  if (n) { saveDraft(); renderAll(); onPhotosChanged(); memView = 'collage'; drawMem(); toast(n + ' photo add ✅ Edit mode se Export karna mat bhoolna'); if (C.photos.length > 14) toast('Photos zyada hain, site slow ho sakti hai. 10-12 rakho.'); }
}

/* ---------- editor (sirf ?edit mode me) ---------- */
let ct;
function changed() { clearTimeout(ct); ct = setTimeout(() => { renderAll(); saveDraft(); }, 300); }
function saveDraft() { try { localStorage.setItem('dx_draft', JSON.stringify(C)); } catch (e) { toast('Phone ki storage bhar gayi. Abhi "Export content.js" kar lo.'); } }
function F(label, obj, key, o = {}) {
  const el = o.multi ? h('textarea', { rows: String(o.rows || 3) }) : h('input', { type: o.type || 'text' });
  el.value = obj[key] == null ? '' : obj[key];
  el.addEventListener('input', () => { obj[key] = el.value; changed(); });
  return h('label', { class: 'fld' }, h('span', { text: label }), el);
}
function FA(label, obj, key, rows) {
  const el = h('textarea', { rows: String(rows || 4) }); el.value = (obj[key] || []).join('\n');
  el.addEventListener('input', () => { obj[key] = el.value.split('\n').map(s => s.trim()).filter(Boolean); changed(); });
  return h('label', { class: 'fld' }, h('span', { text: label }), el);
}
const sec = (t, ...k) => h('details', {}, h('summary', { text: t }), ...k);
const sm = (t, fn, lab) => h('button', { type: 'button', text: t, 'aria-label': lab || t, onclick: fn });
function listBox(arr, rowFn, makeNew, addLabel) {
  const box = h('div');
  const draw = () => box.replaceChildren(...arr.map((it, i) => rowFn(it, i, draw)), addLabel ? h('button', { class: 'btn small', type: 'button', style: 'margin-top:12px', text: addLabel, onclick: () => { arr.push(makeNew()); changed(); draw(); } }) : null);
  draw(); return { box, draw };
}
function exportContent() {
  const txt = '// The Deepanshi Experience: site content. Is file ko GitHub me purani content.js ki jagah daalo.\nwindow.SITE_CONTENT = ' + JSON.stringify(C, null, 2) + ';\n';
  const a = h('a', { href: URL.createObjectURL(new Blob([txt], { type: 'text/javascript' })), download: 'content.js' }); document.body.appendChild(a); a.click(); a.remove();
  toast('content.js download ho gayi. GitHub me replace karo 💾');
}
function buildEditor() {
  const ed = $('#editor');
  const photos = listBox(C.photos, (p, i, draw) => h('div', { class: 'row' }, h('img', { class: 'thumb', src: p.src, alt: '' }), h('div', { class: 'grow' }, F('Caption ' + (i + 1), p, 'caption')),
    h('div', { class: 'rowbtns' }, sm('↑', () => { if (i > 0) { [C.photos[i - 1], C.photos[i]] = [C.photos[i], C.photos[i - 1]]; changed(); onPhotosChanged(); } }, 'Upar'), sm('↓', () => { if (i < C.photos.length - 1) { [C.photos[i + 1], C.photos[i]] = [C.photos[i], C.photos[i + 1]]; changed(); onPhotosChanged(); } }, 'Neeche'),
      sm('✕', () => { C.photos.splice(i, 1); C.timeline.forEach(t => { if (t.photo >= C.photos.length) t.photo = -1; }); changed(); onPhotosChanged(); }, 'Hatao'))), () => ({}), '');
  const tl = listBox(C.timeline, (t, i, draw) => {
    const sel = h('select', {}, h('option', { value: '-1', text: 'Koi photo nahi' }), ...C.photos.map((_, k) => h('option', { value: String(k), text: 'Photo ' + (k + 1) })));
    sel.value = String(t.photo == null ? -1 : t.photo); sel.addEventListener('change', () => { t.photo = Number(sel.value); changed(); });
    return h('div', { class: 'row' }, h('div', { class: 'grow' }, F('Date', t, 'date'), F('Title', t, 'title'), F('Description', t, 'desc', { multi: true }), h('label', { class: 'fld' }, h('span', { text: 'Photo' }), sel)),
      h('div', { class: 'rowbtns' }, sm('✕', () => { C.timeline.splice(i, 1); changed(); draw(); }, 'Hatao')));
  }, () => ({ date: 'Date', title: 'Title', desc: 'Description', photo: -1 }), '+ Naya milestone');
  const notes = listBox(C.notes, (n, i, draw) => { const ta = h('textarea', { rows: '2', 'aria-label': 'Note ' + (i + 1) }); ta.value = n; ta.addEventListener('input', () => { C.notes[i] = ta.value; changed(); });
    return h('div', { class: 'row' }, h('div', { class: 'grow' }, ta), h('div', { class: 'rowbtns' }, sm('✕', () => { C.notes.splice(i, 1); changed(); draw(); }, 'Hatao'))); }, () => 'Naya note', '+ Naya note');
  const reasons = listBox(C.reasons, (r, i, draw) => h('div', { class: 'row' }, h('div', { class: 'grow' }, F('Card ' + (i + 1) + ' title', r, 'title'), F('Back text', r, 'text', { multi: true, rows: 2 })), h('div', { class: 'rowbtns' }, sm('✕', () => { C.reasons.splice(i, 1); changed(); draw(); }, 'Hatao'))), () => ({ title: 'Title', text: 'Text' }), '+ Naya card');
  onPhotosChanged = () => { photos.draw(); tl.draw(); };
  ed.replaceChildren(
    h('div', { class: 'ed-head' }, h('b', { text: '✏️ Edit Mode' }), h('div', { class: 'ed-actions' }, h('button', { class: 'btn small', type: 'button', text: '⬇ Export content.js', onclick: exportContent }), h('button', { class: 'btn small ghost', type: 'button', text: '✕ Close', onclick: () => { ed.hidden = true; } }))),
    h('p', { class: 'hint', text: 'Jo badlaav karoge wo is phone me draft ke roop me save hote hain. Deepanshi ko dikhane ke liye "Export content.js" dabao aur wo file GitHub me replace karo (photos bhi usi file me hoti hain).' }),
    sec('Basic', F('Site title', C, 'siteTitle'), F('Uska naam', C, 'name'), F('Nickname', C, 'nickname'), F('Birthday date', C, 'birthdayDate', { type: 'date' }), F('Page 1 heading', C.hero, 'heading', { multi: true, rows: 2 }), F('Page 1 subtitle', C.hero, 'subtitle', { multi: true }), F('Page 1 button', C.hero, 'button')),
    sec('Page titles aur subtitles', ...['notes', 'letter', 'memories', 'timeline', 'reasons', 'countdown'].map(k => F('Title: ' + k, C.titles, k)), ...['notes', 'memories', 'timeline', 'reasons', 'countdown'].map(k => F('Subtitle: ' + k, C.subs, k))),
    sec('Page 2: Notes', notes.box),
    sec('Page 3: Letter (yahan apna letter likho)', F('Heading (jaise Dear Kanto,)', C.letter, 'heading'), F('Letter. Har paragraph ke beech ek khali line chhodo', C.letter, 'body', { multi: true, rows: 16 }), F('Signature', C.letter, 'signature', { multi: true, rows: 2 })),
    sec('Page 4: Photos aur Collage', uploadControl(), h('p', { class: 'hint', text: 'Collage me pehli 6 photos use hoti hain. ↑↓ se order badlo.' }), F('Collage ke neeche ka title', C, 'collageTitle'), photos.box),
    sec('Page 5: Timeline', tl.box),
    sec('Page 6: Reasons', reasons.box),
    sec('Page 8: Birthday + Cake', F('Title', C.cake, 'title'), F('Candles bujhne ke baad message', C.cake, 'message', { multi: true }), F('Cake kat jaane ke baad message', C.cake, 'cutMessage', { multi: true }), F('Wish intro', C.cake, 'wishIntro', { multi: true }), F('Wish ke baad message', C.cake, 'wishDone', { multi: true })),
    sec('Page 9: Feedback', F('Heading', C.feedback, 'heading', { multi: true, rows: 2 }), F('Textbox placeholder', C.feedback, 'placeholder'), F('Button text', C.feedback, 'button'), F('Thank-you message', C.feedback, 'thanks', { multi: true }), F('Formspree link (jawab tumhe email par aane ke liye)', C.feedback, 'endpoint')),
    sec('Page 10: Final', F('Heading', C.final, 'heading'), FA('Ending lines (har line alag)', C.final, 'lines', 5), F('Final birthday wish', C.final, 'wish', { multi: true })),
    sec('Music', F('Song name', C.music, 'title'), F('Song link (Spotify/YouTube Music)', C.music, 'link'), F('Apni audio file ka path (optional)', C.music, 'file')),
    h('div', { class: 'btnrow', style: 'margin-top:20px' }, h('button', { class: 'btn small ghost', type: 'button', text: 'Draft reset karo', onclick: () => { if (confirm('Saare draft badlaav hata dein?')) { try { localStorage.removeItem('dx_draft'); } catch (e) {} location.reload(); } } })));
}

/* ---------- global events ---------- */
function anyOverlay() { return ['#menu', '#noteModal', '#finale', '#editor', '#lightbox'].some(s => !$(s).hidden); }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { ['#menu', '#noteModal', '#lightbox'].forEach(s => { $(s).hidden = true; }); if (!$('#finale').hidden) closeFinale(); $('#editor').hidden = true; return; }
  if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) return;
  if (!$('#lightbox').hidden) { if (e.key === 'ArrowRight') lbStep(1); if (e.key === 'ArrowLeft') lbStep(-1); return; }
  if (anyOverlay()) return;
  if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1);
});
setInterval(() => { if (document.hidden || RM) return; const f = $('#finale'); if (!f.hidden) hearts(1, f); else if (cur === 7 || cur === 9) hearts(1); }, 900);
setInterval(tick, 1000);

/* ---------- init ---------- */
buildShell(); renderAll();
let start = 0; try { start = parseInt(localStorage.getItem('dx_page') || '0', 10) || 0; } catch (e) {}
for (let k = 0; k <= start; k++) seen.add(k);
go(start);
if (start > 0) toast('Wahin se shuru jahan chhoda tha 💫');
if (EDIT) { buildEditor(); const fab = $('#editFab'); fab.hidden = false; fab.addEventListener('click', () => { $('#editor').hidden = false; }); setTimeout(() => toast('Edit mode ON. Neeche ✏️ Edit button dabao'), start > 0 ? 3800 : 600); }
})();
