// ===== CONFIGURE AQUI =====
const WHATSAPP = '5518996759497';
const WA_URL = 'https://wa.me/5518996759497?text=Ol%C3%A1%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es?%20';
document.querySelectorAll('a.wa').forEach(a => { a.href = WA_URL; a.target = '_blank'; a.rel = 'noopener'; });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---------- Header: sombra + encolhe ao rolar, botão "topo", parallax, scrollspy ----------
const header = $('#header'), toTop = $('#toTop');
const links = $$('#nav a[href^="#"]').filter(a => a.getAttribute('href').length > 1 && !a.classList.contains('btn') && !a.classList.contains('nav-extra'));
const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
let ticking = false;
function onScroll() {
  const y = scrollY;
  header.classList.toggle('scrolled', y > 60);
  toTop.classList.toggle('show', y > 700);
  let cur = secs[0];
  secs.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.35) cur = s; });
  links.forEach(a => a.classList.toggle('active', $(a.getAttribute('href')) === cur));
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
toTop.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

// ---------- Menu mobile ----------
$('#burger').onclick = () => $('#nav').classList.toggle('open');
$$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

// ---------- Hero: texto entra em sequência ----------
setTimeout(() => $('.hero-text').classList.add('enter'), 250);

// ---------- Revelar ao rolar (fade/slide/zoom com atraso em sequência) ----------
const reveals = [
  ['#galeria .kicker', 'up'], ['#galeria h2', 'up'], ['#galeria .sub', 'up'], ['.gal-title', 'up'], ['.gal', 'up'],
  ['.about .title-left', 'up'], ['.about-grid > div:first-child', 'left'], ['.about-grid > div:last-child', 'right'],
  ['.services .kicker', 'up'], ['.services h2', 'up'], ['.card', 'up', 3, .15], ['.rating', 'up'],
  ['.stats h2', 'left'], ['.stats-text', 'right'], ['.tile', 'zoom', 4, .08], ['.foot-note', 'up'],
  ['.steps-top > *', 'up', 2, .15], ['.step', 'up', 4, .12], ['.cta-blue .wrap', 'up'],
  ['#depoimentos .kicker', 'up'], ['#depoimentos h2', 'up'], ['#depoimentos .sub', 'up'], ['.carousel', 'up'],
  ['.form', 'left'], ['.appoint-text', 'right'], ['.infobar .ib', 'up', 3, .12], ['.foot-grid > div', 'up', 4, .12],
];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; io.unobserve(el); el.classList.add('in');
  const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
  setTimeout(() => el.classList.remove('rv', 'in', 'up', 'left', 'right', 'zoom'), (d + 1.2) * 1000); // libera os efeitos de hover
}), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
reveals.forEach(([sel, type, mod = 1, step = 0]) => $$(sel).forEach((el, i) => {
  el.classList.add('rv', type); el.style.setProperty('--d', ((i % mod) * step).toFixed(2) + 's'); io.observe(el);
}));

// ---------- Carrossel genérico (depoimentos e galeria) ----------
function makeCarousel(root, dotsBox, perView, autoMs = 0, onChange = null) {
  const track = $('.car-track', root);
  let idx = 0, vis = perView(), timer = null, paused = false;
  const items = () => $$('.car-item', track);
  function render() {
    vis = perView(); const max = Math.max(0, items().length - vis);
    idx = Math.min(Math.max(idx, 0), max);
    items().forEach(el => el.style.flexBasis = (100 / vis) + '%');
    track.style.transform = `translateX(${-idx * 100 / vis}%)`;
    root.classList.toggle('no-nav', max === 0);
    if (dotsBox) {
      dotsBox.innerHTML = (max > 0 && max <= 11) ? Array.from({ length: max + 1 }, (_, i) => `<button class="${i === idx ? 'on' : ''}" aria-label="Ir para ${i + 1}"></button>`).join('') : '';
      $$('button', dotsBox).forEach((d, i) => d.onclick = () => { idx = i; render(); restart(); });
    }
    if (onChange) onChange(idx, vis);
  }
  function move(dir) { const max = Math.max(0, items().length - vis); idx = dir > 0 ? (idx >= max ? 0 : idx + 1) : (idx <= 0 ? max : idx - 1); render(); }
  function restart() { clearInterval(timer); if (autoMs) timer = setInterval(() => { if (!paused) move(1); }, autoMs); }
  $('.car-btn.prev', root).onclick = () => { move(-1); restart(); };
  $('.car-btn.next', root).onclick = () => { move(1); restart(); };
  root.addEventListener('mouseenter', () => paused = true);
  root.addEventListener('mouseleave', () => paused = false);
  let sx = null;
  root.addEventListener('touchstart', e => { sx = e.touches[0].clientX; paused = true; }, { passive: true });
  root.addEventListener('touchend', e => { if (sx !== null) { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); sx = null; } paused = false; restart(); });
  addEventListener('resize', render);
  render(); restart();
  return { render, goTo: i => { idx = i; render(); restart(); } };
}

// ---------- Depoimentos (9 imagens, 3 por vez) ----------
// Cada cartão mostra apenas a imagem. Troque os arquivos na pasta IMG.
const DEPOIMENTOS = [
  'IMG/depoimento-1.jpg',
  'IMG/depoimento-2.jpg',
  'IMG/depoimento-3.jpg',
  'IMG/depoimento-4.jpg',
  'IMG/depoimento-5.jpg',
  'IMG/depoimento-6.jpg',
  'IMG/depoimento-7.jpg',
  'IMG/depoimento-8.jpg',
  'IMG/depoimento-9.jpg'
];
$('#carousel .car-track').innerHTML = DEPOIMENTOS.map((src, i) => `<article class="car-item"><div class="dep-card"><img src="${src}" alt="Depoimento ${i + 1}" loading="lazy"></div></article>`).join('');
makeCarousel($('#carousel'), $('#carDots'), () => innerWidth > 1000 ? 3 : innerWidth > 640 ? 2 : 1, 5500);

// ---------- Galeria: fotos (IMG/galeria1.jpg, galeria2.jpg...) e vídeos (VID/video1.mp4...) ----------
// Detecção automática: basta colocar os arquivos com a numeração em sequência (sem pular número).
const GAL_MAX = 80;                                   // limite de arquivos procurados
const galPer = () => innerWidth > 1000 ? 5 : innerWidth > 640 ? 3 : 2;   // VÍDEOS: 5 por vez no computador
const imgPer = () => innerWidth > 1000 ? 3 : innerWidth > 640 ? 2 : 1;   // FOTOS: 3 por vez no computador (maiores)
const probe = (url, kind) => new Promise(res => {
  if (kind === 'img') { const im = new Image(); im.onload = () => res(true); im.onerror = () => res(false); im.src = url; }
  else { const v = document.createElement('video'); v.preload = 'metadata'; v.onloadedmetadata = () => res(true); v.onerror = () => res(false); v.src = url; }
});
async function discover(make, kind) {
  const found = [];
  for (let s = 1; s <= GAL_MAX; s += 10) {
    const urls = Array.from({ length: 10 }, (_, k) => make(s + k));
    const ok = await Promise.all(urls.map(u => probe(u, kind)));
    const miss = ok.indexOf(false);
    urls.slice(0, miss === -1 ? 10 : miss).forEach(u => found.push(u));
    if (miss !== -1) break;
  }
  return found;
}
const slots = (n, nome, cls) => Array.from({ length: n }, (_, i) => `<article class="car-item"><div class="gal-slot ${cls}">Adicione<br><b>${nome(i + 1)}</b></div></article>`).join('');

// Lightbox (ampliar fotos)
const lb = document.createElement('div'); lb.className = 'lb';
lb.innerHTML = '<button class="lb-x" aria-label="Fechar">×</button><button class="lb-p" aria-label="Anterior">‹</button><img alt=""><button class="lb-n" aria-label="Próxima">›</button>';
document.body.appendChild(lb);
let lbList = [], lbI = 0;
const lbShow = i => { lbI = (i + lbList.length) % lbList.length; $('img', lb).src = lbList[lbI]; };
const lbClose = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
$('.lb-x', lb).onclick = lbClose;
$('.lb-p', lb).onclick = e => { e.stopPropagation(); lbShow(lbI - 1); };
$('.lb-n', lb).onclick = e => { e.stopPropagation(); lbShow(lbI + 1); };
lb.onclick = e => { if (e.target === lb) lbClose(); };
addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbShow(lbI - 1); if (e.key === 'ArrowRight') lbShow(lbI + 1); });

(async () => {
  // Fotos
  const gi = $('#galImgs'), imgs = await discover(i => `IMG/galeria${i}.jpg`, 'img');
  $('.car-track', gi).innerHTML = imgs.length
    ? imgs.map((src, i) => `<article class="car-item"><div class="gal-card" data-i="${i}"><img src="${src}" alt="Foto ${i + 1} da galeria" loading="lazy"></div></article>`).join('')
    : slots(5, n => `IMG/galeria${n}.jpg`, '');
  $('.car-track', gi).addEventListener('click', e => { const c = e.target.closest('.gal-card[data-i]'); if (c) { lbList = imgs; lb.classList.add('open'); document.body.style.overflow = 'hidden'; lbShow(+c.dataset.i); } });
  // Mini galeria (miniaturas): clique para ir direto à foto
  const th = $('#galImgsThumbs');
  th.innerHTML = imgs.map((src, i) => `<button type="button" aria-label="Ver foto ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('');
  const tb = $$('button', th);
  const carImgs = makeCarousel(gi, null, imgPer, 4500, (idx, vis) => {
    th.classList.toggle('hide', tb.length <= vis);
    tb.forEach((b, i) => b.classList.toggle('on', i >= idx && i < idx + vis));
    const t = tb[Math.min(idx + Math.floor(vis / 2), tb.length - 1)];
    if (t) th.scrollTo({ left: t.offsetLeft - th.clientWidth / 2 + t.offsetWidth / 2, behavior: 'smooth' });
  });
  tb.forEach((b, i) => b.onclick = () => carImgs.goTo(Math.max(0, i - Math.floor(imgPer() / 2))));
  // Vídeos
  const gv = $('#galVids'), vids = await discover(i => `VID/video${i}.mp4`, 'video');
  $('.car-track', gv).innerHTML = vids.length
    ? vids.map((src, i) => `<article class="car-item"><div class="gal-card vid"><video src="${src}#t=0.1" controls playsinline preload="metadata" aria-label="Vídeo ${i + 1}"></video></div></article>`).join('')
    : slots(5, n => `VID/video${n}.mp4`, 'vidslot');
  $$('video', gv).forEach(v => v.addEventListener('play', () => $$('video', gv).forEach(o => o !== v && o.pause())));
  makeCarousel(gv, $('#galVidsDots'), galPer, 0);
})();

// ---------- Formulário -> WhatsApp ----------
$('#form').onsubmit = e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const txt = `Olá! Meu nome é ${v('f-nome')}.\nTenho interesse em: ${v('f-trat')}.` +
    (v('f-data') ? `\nData desejada: ${v('f-data')}.` : '') +
    (v('f-tel') ? `\nTelefone: ${v('f-tel')}.` : '') +
    (v('f-msg') ? `\n${v('f-msg')}` : '');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`, '_blank');
};

// ---------- Street View / Mapa (alternar) ----------
// Para trocar o ângulo do Street View: no Google Maps abra o Street View > Compartilhar > Incorporar um mapa,
// copie o endereço que aparece em src="..." e cole no atributo data-sv do iframe (index.html).
(() => {
  const frame = $('#mapFrame'), tabs = $$('.map-tabs button');
  tabs.forEach(b => b.onclick = () => {
    tabs.forEach(x => x.classList.toggle('on', x === b));
    const sv = b.dataset.view === 'sv';
    frame.title = sv ? 'Street View - Clínica De Paula' : 'Mapa - Clínica De Paula';
    frame.src = sv ? frame.dataset.sv : frame.dataset.map;
  });
})();
