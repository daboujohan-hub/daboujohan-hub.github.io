const STEPS = [
  {
    "id": "a1",
    "cap": "Tu poses ta question à LIRA",
    "voix": "Bonjour ! Voici Lira, une intelligence artificielle. Tu écris ta question, et tu touches : envoyer.",
    "type": [
      "#lType",
      "C'est quoi une API ?"
    ],
    "tap": "#lSend",
    "at": 3200,
    "hold": 800
  },
  {
    "id": "a2",
    "cap": "LIRA te répond simplement",
    "voix": "Lira réfléchit, puis elle répond avec une image simple : une A P I, c'est comme un serveur dans un restaurant. Il prend ta demande, la porte à la cuisine, et te rapporte la réponse.",
    "gap": 1500,
    "wait": 8500
  },
  {
    "id": "a3",
    "cap": "LIRA t'aide à écrire",
    "voix": "Tu peux aussi lui demander de t'aider à écrire. Par exemple, un message pour ton client. Lira écrit le message pour toi.",
    "type": [
      "#lType2",
      "Écris un message pour mon client"
    ],
    "tap": "#lSend2",
    "at": 3800,
    "hold": 5500
  },
  {
    "id": "a4",
    "cap": "LIRA · bientôt disponible",
    "voix": "Voilà Lira. Elle n'est pas encore disponible. Pour être prévenu à la sortie, écris à Dév D A J sur Ouatsapp. Merci !",
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
    const t = () => { if (k <= text.length) { e.textContent = text.slice(0, k++); later(t, 55); } };
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
    if (!s.tap) scr.querySelectorAll('.rw').forEach(e => items.push(e));
    items.forEach((e, k) => later(() => e.classList.add('show'), 500 + k * (s.gap || 800)));
    if (s.type) later(() => typeIn(s.type[0], s.type[1]), 500);

    const advance = ms => later(() => run((i + 1) % STEPS.length), ms);
    const doTap = (delay, then) => {
      later(() => place(s.tap), Math.max(delay - 1200, 50));
      later(() => finger.classList.add('tap'), delay);
      later(() => {
        finger.classList.remove('tap');
        scr.querySelectorAll('.rw').forEach((e, k) => later(() => e.classList.add('show'), k * 900));
        if (s.type) { const t = $(s.type[0]); if (t) t.textContent = ''; }
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
