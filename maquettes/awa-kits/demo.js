const $ = s => document.querySelector(s);
const phone = $('#phone'), finger = $('#finger');
const DELIV = 1000;
let price = 8500, i = 0, playing = false, done = false, timers = [];

const fmt = n => n.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ') + ' FCFA';
const render = () => {
  document.querySelectorAll('[data-price]').forEach(e => e.textContent = fmt(price));
  document.querySelectorAll('[data-total]').forEach(e => e.textContent = fmt(price + DELIV));
};
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const stop = () => { timers.forEach(clearTimeout); timers = []; };

function bubble(text, who) {
  const d = document.createElement('div');
  d.className = 'b ' + who;
  d.textContent = text;
  $('#chat').append(d);
}

const steps = [
  { screen: 's-live', title: '1. La cliente voit ton LIVE TikTok',
    text: "Pendant ton live, elle te voit présenter tes kits. Elle touche ton lien pour aller sur ton site.",
    tap: '#tapSite', at: 2200 },
  { screen: 's-home', title: '2. Elle arrive sur ta boutique',
    text: "Elle voit tous tes produits avec les photos et les prix. Elle touche celui qui lui plaît.",
    tap: '#tapSerum', at: 2200 },
  { screen: 's-prod', title: '3. Elle regarde la photo et la vidéo',
    text: "Elle voit le produit, la vidéo et le prix. Elle touche « Ajouter au panier ».",
    tap: '#tapCart', at: 2600 },
  { screen: 's-cart', title: '4. Elle vérifie son panier',
    text: "Le total avec la livraison est calculé tout seul. Elle touche « Commander sur WhatsApp ».",
    tap: '#tapWa', at: 2800 },
  { screen: 's-wa', title: '5. La commande arrive sur ton WhatsApp',
    text: "Le message est déjà écrit avec le produit, le prix et le total. Toi, tu réponds simplement et tu livres.",
    wait: 7200,
    enter() {
      $('#chat').textContent = '';
      later(() => bubble('Bonjour Awa, je commande : 1 × Sérum Éclat Teint Métisse — ' + fmt(price) + ' + livraison ' + fmt(DELIV) + ' = ' + fmt(price + DELIV), 'me'), 700);
      later(() => bubble('Ok ma chérie 🥰 livraison demain 🚚', 'her'), 3400);
      later(() => bubble('Merci Awa ! 🙏', 'me'), 5400);
    } },
  { screen: 's-dash', title: '6. Ton tableau de bord',
    text: "Tu vois ton chiffre du jour, tes commandes et ton stock. Tu touches « Commandes ».",
    tap: '#tapOrders', at: 3000 },
  { screen: 's-orders', title: '7. Tu suis tes commandes',
    text: "Quand tu as livré, tu touches « Marquer comme livrée » et le statut change.",
    tap: '#tapDeliver', at: 3000, hold: 2200,
    enter() {
      const b = $('#status');
      b.textContent = '🟡 En attente';
      b.className = 'badge wait';
      $('#tapDeliver').style.display = '';
    },
    after() {
      const b = $('#status');
      b.textContent = '🟢 Livrée';
      b.className = 'badge ok';
      $('#tapDeliver').style.display = 'none';
      $('#toastOrders').classList.add('on');
    } },
  { screen: 's-admin', title: '8. Tu changes le prix sur ton téléphone',
    text: "Tu changes la photo, la vidéo, le prix ou le stock en 30 secondes. Puis tu touches « Enregistrer ».",
    tap: '#tapSave', at: 3900, hold: 2200,
    enter() {
      const el = $('#adminPrice');
      el.textContent = '8500';
      el.classList.add('cursor');
      ['850', '85', '8', '1', '10', '100', '1000', '10000'].forEach((t, k) => later(() => el.textContent = t, 800 + k * 280));
    },
    after() { price = 10000; render(); $('#toastAdmin').classList.add('on'); } },
  { screen: 's-home', title: '9. Le site change tout seul',
    text: "Le nouveau prix s'affiche tout de suite chez toutes tes clientes. Tu n'as pas besoin d'appeler le développeur.",
    wait: 4500,
    enter() { later(() => $('#toastHome').classList.add('on'), 600); } },
  { screen: 's-contact', title: '10. Elle peut aussi te contacter',
    text: "La page Contact donne ton WhatsApp, ton TikTok et ta zone de livraison. Tu les changes dans Paramètres.",
    wait: 5000 }
];

function setBtn() {
  $('#btnPlay').textContent = playing ? '⏸ Pause' : done ? '↻ Revoir la démo' : '▶ Lancer la démo';
}

function next() {
  if (i < steps.length - 1) show(i + 1);
  else { playing = false; done = true; setBtn(); }
}

function show(n) {
  stop();
  i = n;
  price = i >= 8 ? 10000 : 8500;
  const s = steps[i];
  document.querySelectorAll('.screen').forEach(e => e.classList.toggle('on', e.id === s.screen));
  document.querySelectorAll('.toast').forEach(e => e.classList.remove('on'));
  document.querySelectorAll('.pulse').forEach(e => e.classList.remove('pulse'));
  document.querySelectorAll('.dots button').forEach((b, k) => b.classList.toggle('on', k === i));
  finger.classList.remove('show', 'tap');
  $('#capTitle').textContent = s.title;
  $('#capText').textContent = s.text;
  render();
  if (s.enter) s.enter();

  if (s.tap) {
    later(() => {
      const el = $(s.tap), p = phone.getBoundingClientRect(), r = el.getBoundingClientRect();
      finger.style.left = (r.left - p.left - phone.clientLeft + r.width / 2 - 12) + 'px';
      finger.style.top = (r.top - p.top - phone.clientTop + r.height / 2 - 4) + 'px';
      finger.classList.add('show');
      el.classList.add('pulse');
    }, Math.max(s.at - 1300, 100));
    later(() => finger.classList.add('tap'), s.at);
    later(() => { finger.classList.remove('tap'); if (s.after) s.after(); }, s.at + 350);
    if (playing) later(next, s.at + (s.hold || 1100));
  } else if (playing) {
    later(next, s.wait);
  }
}

$('#btnPlay').onclick = () => {
  if (playing) { playing = false; stop(); setBtn(); return; }
  playing = true;
  if (done) { done = false; show(0); } else show(i);
  setBtn();
};
const go = n => { playing = false; done = false; setBtn(); show(Math.max(0, Math.min(steps.length - 1, n))); };
$('#btnPrev').onclick = () => go(i - 1);
$('#btnNext').onclick = () => go(i + 1);

steps.forEach((s, k) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Étape ' + (k + 1));
  b.onclick = () => go(k);
  $('#dots').append(b);
});

show(0);
setBtn();
