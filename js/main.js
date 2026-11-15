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

// ---------- Depoimentos: carrossel (9 cartões, 3 por vez) ----------
// Cada cartão mostra apenas a imagem (print da avaliação ou foto). Troque os arquivos na pasta IMG.
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
const track = $('#carTrack'), dotsBox = $('#carDots');
track.innerHTML = DEPOIMENTOS.map((src, i) => `<article class="car-item"><div class="dep-card"><img src="${src}" alt="Depoimento ${i + 1}" loading="lazy"></div></article>`).join('');
let idx = 0, vis = 3, auto;
const perView = () => innerWidth > 1000 ? 3 : innerWidth > 640 ? 2 : 1;
function render() {
  vis = perView(); const max = DEPOIMENTOS.length - vis;
  idx = Math.min(Math.max(idx, 0), max);
  $$('.car-item', track).forEach(el => el.style.flexBasis = (100 / vis) + '%');
  track.style.transform = `translateX(${-idx * 100 / vis}%)`;
  dotsBox.innerHTML = Array.from({ length: max + 1 }, (_, i) => `<button class="${i === idx ? 'on' : ''}" aria-label="Ir para ${i + 1}"></button>`).join('');
  $$('button', dotsBox).forEach((d, i) => d.onclick = () => { idx = i; render(); restart(); });
}
function move(dir) { const max = DEPOIMENTOS.length - vis; idx = dir > 0 ? (idx >= max ? 0 : idx + 1) : (idx <= 0 ? max : idx - 1); render(); }
function restart() { clearInterval(auto); auto = setInterval(() => move(1), 5500); }
$('.car-btn.prev').onclick = () => { move(-1); restart(); };
$('.car-btn.next').onclick = () => { move(1); restart(); };
const car = $('#carousel');
car.addEventListener('mouseenter', () => clearInterval(auto)); car.addEventListener('mouseleave', restart);
let sx = null;
car.addEventListener('touchstart', e => { sx = e.touches[0].clientX; clearInterval(auto); }, { passive: true });
car.addEventListener('touchend', e => { if (sx !== null) { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); sx = null; restart(); } });
addEventListener('resize', render);
render(); restart();

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
