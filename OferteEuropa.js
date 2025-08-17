const btn = document.querySelector('.rv-burger');
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
  if (!menu.contains(e.target) && !btn.contains(e.target))
    closeMenu();
});

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape')
    closeMenu();
});

// === Breadcrumb dinamic + mini router pe hash ===
// etichete drăguțe pentru rute
// etichete drăguțe pentru rute + țintă pentru scroll
const ROUTES = {
  acasa: {
    label: "Acasă",
    path: ["Acasă"],
    redirect: "index.html"
  },
  oferte: {
    label: "Oferte",
    path: ["Acasă", "Oferte"],
    // trimite înapoi în index, la caruselul Toate ofertele
    redirect: "index.html#toate-ofertele"
  },
  europa: {
    label: "Europa",
    path: ["Acasă", "Europa"],
    // dacă vrei să facă și scroll în pagină
    target: "#null"   // (secțiunea cu cardurile Europa)
  },
  rezervari: {
    label: "Rezervări",
    path: ["Acasă", "Rezervări"],
    target: "#eu-booking"
  },
  termeni: {
    label: "Termeni și condiții",
    path: ["Acasă", "Termeni și condiții"],
    target: "#termeni"         // dacă ai secțiune; altfel lasă null
  }
};
// refs
const bcEl = document.getElementById("rv-bc");
const menuLinks = document.querySelectorAll('[data-route]');

function go(route) {
  const key = ROUTES[route] ? route : "europa";  // <- fallback pe europa
  const trail = ROUTES[key].path;
  bcEl.innerHTML = trail
    .map((seg, i) => {
      const isLast = i === trail.length - 1;
      if (isLast) return `<span aria-current="page">${seg}</span>`;
      const href = i === 0 ? "#acasa" : "#";
      return `<a href="${href}" data-route="${i===0 ? 'acasa' : ''}">${seg}</a><span class="rv-breadcrumbs__sep">/</span>`;
    })
    .join("");

  const targetSel = ROUTES[key].target;
  if (targetSel) {
    document.querySelector(targetSel)?.scrollIntoView({ behavior: "smooth" });
  }
}
}

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
    const cfg = ROUTES[route];

    // dacă ruta are redirect -> mergem înapoi în index.html
    if (cfg && cfg.redirect) {
      window.location.href = cfg.redirect;
      return; // ieșim, nu mai facem nimic pe pagina curentă
    }

    // altfel: rulăm routing local (breadcrumb + scroll) și închidem meniul
    go(route);
    closeMenu();
  });
});
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
(function(){
  const form   = document.getElementById('eu-booking');
  if(!form) return;

  const status = document.getElementById('bk-status');
  const req = sel => form.querySelector(sel);

  function setErr(el, msg){
    const box = el.closest('.field')?.querySelector('.err');
    if(box){ box.textContent = msg || ''; }
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate(){
    let ok = true;
    ['#bk-name','#bk-email','#bk-phone','#bk-destination','#bk-start','#bk-nights','#bk-guests']
      .forEach(sel=>{
        const el = req(sel);
        if(!el) return;
        let msg = '';
        if(!el.value.trim()) msg = 'Câmp obligatoriu';
        if(el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = 'Email invalid';
        setErr(el, msg);
        if(msg) ok = false;
      });

    const terms = document.getElementById('bk-terms');
    if(terms && !terms.checked){ ok = false; status.textContent = 'Bifează Termenii și condițiile.'; }
    else if(ok){ status.textContent = ''; }
    return ok;
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!validate()) return;

    // Variante:
    // 1) Doar mesaj de confirmare
    status.textContent = 'Mulțumim! Cererea ta a fost trimisă. Revenim foarte curând.';

    // 2) SAU mailto (decomentează ca să trimită prin clientul de email al utilizatorului)
    /*
    const data = new FormData(form);
    const subject = encodeURIComponent(`Rezervare ${data.get('destination') || 'Europa'}`);
    const body = encodeURIComponent(
      `Nume: ${data.get('name')}\nEmail: ${data.get('email')}\nTelefon: ${data.get('phone')}\n` +
      `Destinație: ${data.get('destination')}\nPlecare: ${data.get('start')}\n` +
      `Nopți: ${data.get('nights')}\nPersoane: ${data.get('guests')}\n` +
      `Observații: ${data.get('notes')||''}`
    );
    window.location.href = `mailto:rezervari@rvtours.ro?subject=${subject}&body=${body}`;
    */
    form.reset();
    document.getElementById('bk-destination').value = 'Portugalia';
  });
})();
// apelăm funcția go() pe baza hash-ului din URL sau default "europa"
document.addEventListener("DOMContentLoaded", () => {
  const initialRoute = (location.hash || "#europa").substring(1);
  go(initialRoute);
});
