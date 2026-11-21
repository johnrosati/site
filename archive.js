const el = id => document.getElementById(id);
const menu = el('menu');
const player = el('player');
const video = el('video');
const soundButton = el('reel-sound');
let reelSoundOn = false;
soundButton.onclick = () => {
  const clip = document.querySelector('.selected-page .slide.current video');
  if (!clip) return;
  reelSoundOn = !reelSoundOn;
  clip.muted = !reelSoundOn;
  soundButton.setAttribute('aria-pressed', String(reelSoundOn));
  soundButton.title = reelSoundOn ? 'Turn sound off' : 'Turn sound on';
  if (reelSoundOn && clip.paused) clip.play().catch(() => {});
};
let collection = [];
let openingFilms = [];
let current = 0;
let pausedOpeningClip;

function time(seconds) {
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}
function still(film) {
  const image = new Image();
  image.src = film.frame;
  image.alt = '';
  return image;
}
let returnFocus;
function play(film, opener) {
  returnFocus = opener;
  el('playing').textContent = film.title;
  el('original').href = film.src;
  el('failure').hidden = true;
  video.poster = film.frame;
  video.src = film.playback || film.src;
  const openingClip = document.querySelector('.selected-page .slide.current video');
  if (openingClip && !openingClip.paused) {
    pausedOpeningClip = openingClip;
    openingClip.pause();
  }
  player.showModal();
  video.play().catch(() => {});
}
function previewVideo(film) {
  const clip = document.createElement('video');
  clip.muted = true;
  clip.playsInline = true;
  clip.loop = true;
  clip.autoplay = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  clip.preload = clip.autoplay ? 'auto' : 'none';
  clip.poster = film.frame;
  clip.src = film.excerpt || film.playback || film.src;
  return clip;
}
function reel(index) {
  current = (index + openingFilms.length) % openingFilms.length;
  const continuous = document.body.classList.contains('selected-page');
  const lastClip = el('strip').querySelector('video');
  if (lastClip) lastClip.pause();
  const offsets = continuous || openingFilms.length === 1 ? [0] : [-1, 0, 1];
  el('strip').replaceChildren(...offsets.map(offset => {
    const film = openingFilms[(current + offset + openingFilms.length) % openingFilms.length];
    const slide = document.createElement('button');
    slide.className = 'slide' + (offset ? '' : ' current');
    slide.setAttribute('aria-label', (offset ? 'Select ' : 'Watch ') + film.title);
    const media = offset ? still(film) : previewVideo(film);
    if (continuous) {
      media.muted = !reelSoundOn;
      media.loop = false;
      media.onended = () => {
        if (!slide.isConnected) return;
        const focused = document.activeElement === slide;
        reel(current + 1);
        if (focused) document.querySelector('.slide.current').focus({preventScroll:true});
      };
    }
    slide.append(media);
    if (!offset) {
      const label = document.createElement('span');
      label.textContent = '▶  ' + film.title;
      slide.append(label);
    }
    slide.onclick = () => offset ? reel(current + offset) : play(film, slide);
    return slide;
  }));

}
function grid() {
  const query = el('search').value.toLowerCase().trim();
  const cards = collection.filter(f => f.title.toLowerCase().includes(query)).map(film => {
    const button = document.createElement('button');
    button.className = 'card';
    const image = still(film);
    image.loading = 'lazy';
    const title = document.createElement('strong');
    title.textContent = film.title;
    const detail = document.createElement('small');
    detail.textContent = (film.shelf ? 'Shelf ' + film.shelf + ' · ' : '') + time(film.duration);
    button.append(image, title, detail);
    button.onclick = () => play(film, button);
    return button;
  });
  el('grid').replaceChildren(...(cards.length ? cards : ['No films match this search.']));
}
function closeMenu() {
  menu.hidden = true;
  el('menuBtn').setAttribute('aria-expanded','false');
}
function route() {
  closeMenu();
  const about = location.hash === '#about';
  const river = location.hash === '#river-of-days';
  const earlier = false;
  document.body.classList.toggle('selected-page', !about && !river && !earlier);
  document.body.classList.toggle('light-page', !earlier);
  el('rod').hidden = !river;
  const frame = el('rod').querySelector('iframe');
  if (river && !frame.hasAttribute('src')) frame.src = frame.dataset.page;
  if (!river && frame.hasAttribute('src')) frame.removeAttribute('src');
  el('about').hidden = !about;
  el('archive').hidden = about || river;
  if (about || river) {
    el('strip').querySelector('video')?.pause();
    el('strip').replaceChildren();
  } else {
    collection = window.films.filter(f => Boolean(f.shelf) === earlier);
    openingFilms = collection;
    el('prev').hidden = el('next').hidden = !earlier;
    document.querySelector('.theater').setAttribute('aria-label', earlier ? 'Opening film carousel' : 'Selected works film reel');
    el('heading').textContent = earlier ? 'Earlier films' : 'Selected works';
    el('search').value = '';
    const first = earlier ? 0 : collection.findIndex(film => film.title === 'The Other Seat');
    reel(Math.max(0, first));
    grid();
  }
  window.scrollTo(0,0);
}
el('menuBtn').onclick = () => {
  menu.hidden = !menu.hidden;
  el('menuBtn').setAttribute('aria-expanded', String(!menu.hidden));
};
document.addEventListener('click', e => {
  if (!e.target.closest('header') || e.target.closest('nav a')) closeMenu();
});
el('prev').onclick = () => reel(current - 1);
el('next').onclick = () => reel(current + 1);
el('down').onclick = () => document.querySelector('.index').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
el('search').oninput = grid;
el('close').onclick = () => player.close();
video.onerror = () => { if (player.open) el('failure').hidden = false; };
player.onclose = () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
  if (pausedOpeningClip?.isConnected) pausedOpeningClip.play().catch(() => {});
  pausedOpeningClip = undefined;
  returnFocus?.focus({preventScroll:true});
};
const header = document.querySelector('header');
function positionHeader() {
  header.classList.toggle('compact', window.scrollY > 48);
}
window.addEventListener('scroll', positionHeader, {passive:true});
positionHeader();
document.addEventListener('keydown', event => {
  if (player.open) return;
  if (!menu.hidden) {
    if (event.key === 'Escape') { closeMenu(); el('menuBtn').focus(); }
    return;
  }
  if (el('archive').hidden || event.target.matches('input,textarea') || event.altKey || event.metaKey || event.ctrlKey) return;
  const card = event.target.closest('.card');
  if (card && event.key.startsWith('Arrow')) {
    const cards = [...el('grid').querySelectorAll('.card')];
    const columns = cards.filter(item => item.offsetTop === cards[0].offsetTop).length;
    const step = {ArrowLeft:-1, ArrowRight:1, ArrowUp:-columns, ArrowDown:columns}[event.key];
    if (step === undefined) return;
    event.preventDefault();
    cards[Math.max(0, Math.min(cards.length - 1, cards.indexOf(card) + step))].focus();
    return;
  }
  if (event.target !== document.body && !event.target.closest('.theater')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    if (openingFilms.length < 2) return;
    reel(current + (event.key === 'ArrowLeft' ? -1 : 1));
    document.querySelector('.slide.current').focus({preventScroll:true});
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    el('grid').querySelector('.card')?.focus();
  } else if (event.key === 'Enter' && event.target === document.body) {
    document.querySelector('.slide.current').click();
  }
});
window.addEventListener('hashchange', route);
route();
if (!el('archive').hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const film = openingFilms[current];
  const moving = previewVideo(film);
  el('slit').append(moving);
  el('intro').hidden = false;
  el('intro').addEventListener('animationend', event => {
    if (event.animationName === 'clearLeader') {
      el('intro').hidden = true;
      moving.pause();
      moving.remove();
    }
  });
}

const repostTrigger = el('repost-trigger');
const repostImage = el('repost-image');
function showRepost(show) {
  repostImage.hidden = !show;
  repostTrigger.setAttribute('aria-expanded', String(show));
}
repostTrigger.addEventListener('pointerenter', event => {
  if (event.pointerType === 'mouse') showRepost(true);
});
repostTrigger.addEventListener('pointerleave', () => {
  if (document.activeElement !== repostTrigger) showRepost(false);
});
repostTrigger.addEventListener('focus', () => showRepost(true));
repostTrigger.addEventListener('blur', () => showRepost(false));
repostTrigger.addEventListener('click', () => showRepost(true));
document.addEventListener('pointerdown', event => {
  if (event.target !== repostTrigger && event.target !== repostImage) showRepost(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') showRepost(false);
});
window.addEventListener('hashchange', () => showRepost(false));
