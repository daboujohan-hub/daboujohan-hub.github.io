const $ = s => document.querySelector(s);
const phone = $('#phone'), finger = $('#finger'), cap = document.querySelector('.caption');
const synth = window.speechSynthesis || null;
const DELIV = 1000;
let price = 8500, i = 0, playing = false, done = false, timers = [];
let voiceOn = true, frVoice = null, speakToken = 0, animDone = false, voiceDone = true;

const V = () => voiceOn && !!synth;
const fmt = n => n.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ') + ' FCFA';
const render = () => {
  document.querySelectorAll('[data-price]').forEach(e => e.textContent = fmt(price));
  document.querySelectorAll('[data-total]').forEach(e => e.textContent = fmt(price + DELIV));
};
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const stop = () => { timers.forEach(clearTimeout); timers = []; };

function pickVoice() {
  if (!synth) return;
  const f = x => (x.lang || '').replace('_', '-').toLowerCase();
  const list = synth.getVoices();
  frVoice = list.find(x => f(x) === 'fr-fr') || list.find(x => f(x).startsWith('fr')) || null;
}
if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

function stopSpeech() {
  speakToken++;
  cap.classList.remove('talking');
  if (synth) synth.cancel();
}

function speak(text, onEnd) {
  const token = ++speakToken;
  if (!synth || !voiceOn || !text) { if (onEnd) onEnd(); return; }
  synth.cancel();
  cap.classList.add('talking');
  const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
  let k = 0, ended = false, guard = null;
  const fin = () => {
    if (ended || token !== speakToken) return;
    ended = true;
    clearTimeout(guard);
    cap.classList.remove('talking');
    if (onEnd) onEnd();
  };
  guard = setTimeout(fin, text.length * 95 + 3000);
  const one = () => {
    if (token !== speakToken) return;
    if (k >= parts.length) { fin(); return; }
    const u = new SpeechSynthesisUtterance(parts[k++].trim());
    u.lang = 'fr-FR';
    if (frVoice) u.voice = frVoice;
    u.rate = 0.9;
    u.onend = one;
    u.onerror = one;
    synth.speak(u);
  };
  one();
}

function checkVoice() {
  const e = $('#err');
  if (!synth) {
    e.hidden = false;
    e.textContent = 'Ce navigateur ne sait pas parler. Ouvre la page avec Chrome.';
    return;
  }
  pickVoice();
  if (!frVoice && synth.getVoices().length) {
    e.hidden = false;
    e.textContent = "Ton téléphone n'a pas de voix française. Dans Réglages > Synthèse vocale, installe le français.";
  }
}

function bubble(text, who) {
  const d = document.createElement('div');
  d.className = 'b ' + who;
  d.textContent = text;
  $('#chat').append(d);
}

const steps = [
  { screen: 's-live', title: '1. La cliente voit ton LIVE TikTok',
    text: "Pendant ton live, elle te voit présenter tes kits. Elle touche ton lien pour aller sur ton site.",
    voix: "Bonjour Tantie Awa ! Je vais te montrer comment ta boutique va marcher. Pendant que tu fais ton laïve sur Tik Tok, la cliente te regarde. Elle touche ton lien pour aller sur ton site.",
    tap: '#tapSite', at: 2200 },
  { screen: 's-home', title: '2. Elle arrive sur ta boutique',
    text: "Elle voit tous tes produits avec les photos et les prix. Elle touche celui qui lui plaît.",
    voix: "Elle arrive sur ta boutique. Elle voit tous tes produits, avec les photos et les prix. Elle touche le produit qui lui plaît.",
    tap: '#tapSerum', at: 2200 },
  { screen: 's-prod', title: '3. Elle regarde la photo et la vidéo',
    text: "Elle voit le produit, la vidéo et le prix. Elle touche « Ajouter au panier ».",
    voix: "Elle regarde la photo et la vidéo du produit. Elle voit le prix : huit mille cinq cents francs. Elle touche : ajouter au panier.",
    tap: '#tapCart', at: 2600 },
  { screen: 's-cart', title: '4. Elle vérifie son panier',
    text: "Le total avec la livraison est calculé tout seul. Elle touche « Commander sur WhatsApp ».",
    voix: "Voici son panier. Le total est calculé tout seul, avec la livraison. Neuf mille cinq cents francs. Elle touche : commander sur Ouatsapp.",
    tap: '#tapWa', at: 2800 },
  { screen: 's-wa', title: '5. La commande arrive sur ton WhatsApp',
    text: "Le message est déjà écrit avec le produit, le prix et le total. Toi, tu réponds simplement et tu livres.",
    voix: "La commande arrive directement sur ton Ouatsapp. Le message est déjà écrit, avec le produit et le prix. Toi, tu réponds juste : d'accord ma chérie, livraison demain.",
    wait: 7200,
    enter() {
      $('#chat').textContent = '';
      const o = V() ? 5000 : 0;
      later(() => bubble('Bonjour Awa, je commande : 1 × Sérum Éclat Teint Métisse — ' + fmt(price) + ' + livraison ' + fmt(DELIV) + ' = ' + fmt(price + DELIV), 'me'), o + 700);
      later(() => bubble('Ok ma chérie 🥰 livraison demain 🚚', 'her'), o + 3400);
      later(() => bubble('Merci Awa ! 🙏', 'me'), o + 5400);
    } },
  { screen: 's-dash', title: '6. Ton tableau de bord',
    text: "Tu vois ton chiffre du jour, tes commandes et ton stock. Tu touches « Commandes ».",
    voix: "Ça, c'est ton tableau de bord. Tu vois combien tu as gagné aujourd'hui, tes commandes, et ce qui reste en stock. Tu touches : commandes.",
    tap: '#tapOrders', at: 3000 },
  { screen: 's-orders', title: '7. Tu suis tes commandes',
    text: "Quand tu as livré, tu touches « Marquer comme livrée » et le statut change.",
    voix: "Ici, tu suis toutes tes commandes. Quand tu as livré la cliente, tu touches : marquer comme livrée. Et le statut devient vert.",
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
    voix: "Maintenant, tu veux changer le prix. Tu ouvres ton espace sur ton téléphone. Tu écris le nouveau prix : dix mille francs. Tu touches : enregistrer. C'est fait, en trente secondes.",
    tap: '#tapSave', at: 3900, hold: 2200,
    enter() {
      const el = $('#adminPrice');
      el.textContent = '8500';
      el.classList.add('cursor');
      const o = V() ? 6000 : 800;
      ['850', '85', '8', '1', '10', '100', '1000', '10000'].forEach((t, k) => later(() => el.textContent = t, o + k * 280));
    },
    after() { price = 10000; render(); $('#toastAdmin').classList.add('on'); } },
  { screen: 's-home', title: '9. Le site change tout seul',
    text: "Le nouveau prix s'affiche tout de suite chez toutes tes clientes. Tu n'as pas besoin d'appeler le développeur.",
    voix: "Et voilà ! Le site a changé tout seul. Toutes tes clientes voient le nouveau prix : dix mille francs. Tu n'as pas besoin d'appeler le développeur.",
    wait: 4500,
    enter() { later(() => $('#toastHome').classList.add('on'), 600); } },
  { screen: 's-contact', title: '10. Elle peut aussi te contacter',
    text: "La page Contact donne ton WhatsApp, ton TikTok et ta zone de livraison. Tu les changes dans Paramètres.",
    voix: "Enfin, la page contact. Tes clientes y trouvent ton Ouatsapp, ton Tik Tok, et les villes où tu livres. Voilà, Tantie Awa : ta boutique travaille pour toi, même quand tu dors. Je suis Dév D A J, de Abou Dév Labs. Merci !",
    wait: 5000 }
];

function setBtn() {
  $('#btnPlay').textContent = playing ? '⏸ Pause' : done ? '↻ Réécouter la démo' : '▶ Lancer la démo parlée';
}
function setVoiceBtn() { $('#btnVoice').textContent = voiceOn ? '🔊' : '🔇'; }

function tryNext() { if (playing && animDone && voiceDone) next(); }

function next() {
  if (i < steps.length - 1) show(i + 1);
  else { playing = false; done = true; setBtn(); }
}

function show(n, quiet) {
  stop();
  stopSpeech();
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

  animDone = false;
  voiceDone = true;
  const talk = !quiet && V();

  const runTap = at => {
    later(() => {
      const el = $(s.tap), p = phone.getBoundingClientRect(), r = el.getBoundingClientRect();
      finger.style.left = (r.left - p.left - phone.clientLeft + r.width / 2 - 12) + 'px';
      finger.style.top = (r.top - p.top - phone.clientTop + r.height / 2 - 4) + 'px';
      finger.classList.add('show');
      el.classList.add('pulse');
    }, Math.max(at - 1300, 100));
    later(() => finger.classList.add('tap'), at);
    later(() => { finger.classList.remove('tap'); if (s.after) s.after(); }, at + 350);
    later(() => { animDone = true; tryNext(); }, at + (s.hold || 1100));
  };

  if (s.tap) {
    if (talk) speak(s.voix, () => runTap(1500));
    else runTap(s.at);
  } else {
    if (talk) { voiceDone = false; speak(s.voix, () => { voiceDone = true; tryNext(); }); }
    later(() => { animDone = true; tryNext(); }, s.wait);
  }
}

$('#btnPlay').onclick = () => {
  if (playing) { playing = false; stop(); stopSpeech(); setBtn(); return; }
  checkVoice();
  playing = true;
  if (done) { done = false; show(0); } else show(i);
  setBtn();
};
const go = n => { playing = false; done = false; setBtn(); show(Math.max(0, Math.min(steps.length - 1, n))); };
$('#btnPrev').onclick = () => go(i - 1);
$('#btnNext').onclick = () => go(i + 1);
$('#btnVoice').onclick = () => {
  voiceOn = !voiceOn;
  setVoiceBtn();
  if (voiceOn) checkVoice();
  show(i);
};

steps.forEach((s, k) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Étape ' + (k + 1));
  b.onclick = () => go(k);
  $('#dots').append(b);
});

setVoiceBtn();
show(0, true);
setBtn();
