const btn  = document.querySelector('.rv-burger');
const menu = document.getElementById('rv-menu');

function closeMenu(){
  menu.classList.remove('is-open');
  btn.setAttribute('aria-expanded','false');
}

btn.addEventListener('click', (e)=>{
  e.stopPropagation();
  const open = menu.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.addEventListener('click', (e)=>{
  if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
});

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeMenu();
});
// === Breadcrumb dinamic + mini router pe hash ===

// etichete drăguțe pentru rute
// etichete drăguțe pentru rute + ținta pentru scroll
const ROUTES = {
  acasa:       { label: "Acasă",       path: ["Acasă"],                     target: null },
  "despre-noi":{ label: "Despre noi",  path: ["Acasă", "Despre noi"],       target: "#despre-noi" },
  oferte:      { label: "Oferte",      path: ["Acasă", "Oferte"],           target: "#toate-ofertele" },
  rezervari: { label: "Rezervări",
             path: ["Acasă", "Rezervări"],
             target: "#rezervari-europa" },
  termeni:     { label: "Termeni și condiții", path: ["Acasă", "Termeni și condiții"], target: null },
};

// refs
const bcEl = document.getElementById("rv-bc");
const menuLinks = document.querySelectorAll('[data-route]');

// schimbare rută + randare breadcrumb
function go(route) {
  const key = ROUTES[route] ? route : "acasa";
  const trail = ROUTES[key].path;

  // construim breadcrumb-ul
  bcEl.innerHTML = trail
    .map((seg, i) => {
      const isLast = i === trail.length - 1;
      if (isLast) {
        return `<span aria-current="page">${seg}</span>`;
      }
      const href = i === 0 ? "#acasa" : "#";
      return `<a href="${href}" data-route="${i===0 ? 'acasa' : ''}">${seg}</a><span class="rv-breadcrumbs__sep">/</span>`;
    })
    .join("");

  // scroll la target dacă există
  const targetSel = ROUTES[key].target;
  if (targetSel) {
    const targetEl = document.querySelector(targetSel);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// click pe linkurile din meniu
menuLinks.forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const route = a.dataset.route || "acasa";
    if (location.hash !== `#${route}`) history.pushState(null, "", `#${route}`);
    go(route);
  });
});

// navigare din butoanele back/forward
window.addEventListener("popstate", () => {
  go((location.hash || "#acasa").substring(1));
});

// init pe load
go((location.hash || "#acasa").substring(1));
menuLinks.forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const route = a.dataset.route || "acasa";
    if (location.hash !== `#${route}`) history.pushState(null, "", `#${route}`);
    go(route);
    closeMenu();
  });
});
// Mini-control pentru carusele: butoane prev/next
function hookCarouselButtons() {
  document.querySelectorAll('.carousel-btn').forEach(btn => {
    const targetSel = btn.getAttribute('data-target');
    const scroller = document.querySelector(targetSel);
    if (!scroller) return;
    const step = () => Math.max(280, scroller.clientWidth * 0.85);
    btn.addEventListener('click', () => {
      const dir = btn.classList.contains('prev') ? -1 : 1;
      scroller.scrollBy({ left: dir * step(), behavior: 'smooth' });
    });
  });
}
hookCarouselButtons();
// Mini-control pentru carusel: butoane prev/next
function hookCarouselButtons(){
  document.querySelectorAll('.carousel-btn').forEach(btn => {
    const targetSel = btn.getAttribute('data-target');
    const scroller  = document.querySelector(targetSel);
    if (!scroller) return;

    const step = () => Math.max(280, scroller.clientWidth * 0.85);
    btn.addEventListener('click', () => {
      const dir = btn.classList.contains('prev') ? -1 : 1;
      scroller.scrollBy({ left: dir * step(), behavior: 'smooth' });
    });
  });
}
hookCarouselButtons();
