const STEPS = [
  {
    "id": "a1",
    "cap": "On entre avec le code familial",
    "voix": "Bonjour ! Voici Diomandé, l'application privée de la famille. Pour entrer, on tape le code familial, et on touche : entrer.",
    "type": [
      "#dCode",
      "••••••"
    ],
    "tap": "#dEnter",
    "at": 3200,
    "hold": 800
  },
  {
    "id": "a2",
    "cap": "Le fil de discussion de la famille",
    "voix": "Voici le fil de la famille. Maman demande à quelle heure on mange. Tu réponds. Puis Aya envoie une vidéo.",
    "gap": 1500,
    "wait": 8000
  },
  {
    "id": "a3",
    "cap": "Une vidéo de 24 heures",
    "voix": "Aya a partagé une vidéo. Elle s'efface toute seule après vingt-quatre heures. Tu touches le cœur pour réagir.",
    "tap": "#dHeart",
    "at": 3600,
    "hold": 2600
  },
  {
    "id": "a4",
    "cap": "Tu partages un moment avec la caméra",
    "voix": "Tu veux partager un moment ? Tu ouvres la caméra, et tu touches le grand bouton. C'est envoyé à toute la famille.",
    "tap": "#dShut",
    "at": 4200,
    "hold": 2600
  },
  {
    "id": "a5",
    "cap": "Les événements de la famille",
    "voix": "Voici les événements à venir : l'anniversaire d'Aya, le déjeuner chez grand-mère, et le match de Karim. Toute la famille voit les dates.",
    "gap": 1500,
    "wait": 8000
  },
  {
    "id": "a6",
    "cap": "Les membres du foyer",
    "voix": "Et voici les membres du foyer. Tu vois qui est en ligne. L'administrateur peut ajouter un nouveau membre.",
    "gap": 1100,
    "wait": 7000
  },
  {
    "id": "a7",
    "cap": "Diomandé · en cours de création",
    "voix": "Voilà Diomandé : le foyer, en version appli. Elle est en cours de création. Pour en parler, écris à Dév D A J sur Ouatsapp. Merci !",
    "wait": 5500
  }
];
(function () {
  const $ = s => document.querySelector(s);
  const ph = $('#ph'), finger = $('#fg'), cap = $('#cap'), btn = $('#btnVoix'), msg = $('#voixMsg');
  if (!ph || !btn) return;
  const synth = window.speechSynthesis || null;
  let i = 0, tm = [], voiceOn = false, token = 0, frVoice = null;
  const later = (f, ms) => tm.push(setTimeout(f, ms));
  const clear = () => { tm.forEach(clearTimeout); tm = []; };

  function pick() {
    if (!synth) return;
    const f = v => (v.lang || '').replace('_', '-').toLowerCase();
    const L = synth.getVoices();
    frVoice = L.find(v => f(v) === 'fr-fr') || L.find(v => f(v).startsWith('fr')) || null;
  }
  if (synth) { pick(); synth.onvoiceschanged = pick; }

  function speak(text, end) {
    const t = ++token;
    if (!synth || !voiceOn) { if (end) end(); return; }
    synth.cancel();
    const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
    let k = 0, over = false;
    const fin = () => { if (over || t !== token) return; over = true; clearTimeout(g); if (end) end(); };
    const g = setTimeout(fin, text.length * 100 + 3000);
    const one = () => {
      if (t !== token) return;
      if (k >= parts.length) { fin(); return; }
      const u = new SpeechSynthesisUtterance(parts[k++].trim());
      u.lang = 'fr-FR';
      if (frVoice) u.voice = frVoice;
      u.rate = 0.92;
      u.onend = one;
      u.onerror = one;
      synth.speak(u);
    };
    one();
  }

  function place(sel) {
    const el = $(sel), p = ph.getBoundingClientRect(), r = el.getBoundingClientRect();
    finger.style.left = (r.left - p.left - ph.clientLeft + r.width / 2 - 12) + 'px';
    finger.style.top = (r.top - p.top - ph.clientTop + r.height / 2 - 4) + 'px';
    finger.classList.add('show');
    el.classList.add('pu');
  }

  function typeIn(sel, text) {
    const e = $(sel);
    if (!e) return;
    let k = 0;
    const t = () => { if (k <= text.length) { e.textContent = text.slice(0, k++); later(t, 120); } };
    t();
  }

  function run(n) {
    clear();
    token++;
    if (synth) synth.cancel();
    i = n;
    const s = STEPS[i], scr = $('#' + s.id);
    document.querySelectorAll('.sc').forEach(e => e.classList.toggle('on', e.id === s.id));
    finger.classList.remove('show', 'tap');
    document.querySelectorAll('.pu').forEach(e => e.classList.remove('pu'));
    document.querySelectorAll('.rv,.rw').forEach(e => e.classList.remove('show'));
    if (s.type) { const t = $(s.type[0]); if (t) t.textContent = ''; }
    cap.textContent = s.cap;

    const items = Array.from(scr.querySelectorAll('.rv'));
    items.forEach((e, k) => later(() => e.classList.add('show'), 500 + k * (s.gap || 800)));
    if (s.type) later(() => typeIn(s.type[0], s.type[1]), 500);

    const advance = ms => later(() => run((i + 1) % STEPS.length), ms);
    const doTap = (delay, then) => {
      later(() => place(s.tap), Math.max(delay - 1200, 50));
      later(() => finger.classList.add('tap'), delay);
      later(() => {
        finger.classList.remove('tap');
        scr.querySelectorAll('.rw').forEach(e => e.classList.add('show'));
        if (then) then();
      }, delay + 300);
    };

    if (voiceOn) {
      speak(s.voix, () => {
        if (s.tap) doTap(1400, () => advance(s.hold || 1200));
        else advance(900);
      });
    } else if (s.tap) {
      doTap(s.at, () => advance(s.hold || 1000));
    } else {
      advance(s.wait);
    }
  }

  function setBtn() { btn.textContent = voiceOn ? '⏹ Couper la voix' : '🔊 Écouter la démo parlée'; }

  btn.onclick = () => {
    if (voiceOn) { voiceOn = false; setBtn(); run(0); return; }
    if (!synth) { msg.hidden = false; msg.textContent = 'Ce navigateur ne sait pas parler. Ouvre la page avec Chrome.'; return; }
    pick();
    if (!frVoice && synth.getVoices().length) {
      msg.hidden = false;
      msg.textContent = "Pas de voix française sur ce téléphone. Réglages > Synthèse vocale > installer le français.";
    }
    voiceOn = true;
    setBtn();
    run(0);
  };

  setBtn();
  run(0);
})();
