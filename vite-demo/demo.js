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

  const steps = [
    { id: 'a1', cap: "Tu crées ta clé API",
      voix: "Bonjour ! Voici Vité A P I. Tu ouvres ton espace développeur, et tu touches : créer ma clé.",
      tap: '#tKey', at: 2600, hold: 1800,
      enter() { $('#key').textContent = "Aucune clé pour l'instant"; },
      after() { $('#key').textContent = 'vite_test_8f3a…c91d'; } },
    { id: 'a2', cap: "Tu copies quelques lignes de code",
      voix: "Ensuite, tu copies quelques lignes de code dans ton application. C'est tout. Il n'y a rien de compliqué.",
      tap: '#tCopy', at: 4200, hold: 1500 },
    { id: 'a3', cap: "Ton client choisit son opérateur",
      voix: "Ton client veut payer cinq cents francs. Il choisit son opérateur : Ouéve, Orange Money, Mouve, ou M T N.",
      tap: '#tWave', at: 2800, hold: 1200 },
    { id: 'a4', cap: "Il confirme sur son téléphone",
      voix: "Il reçoit un message sur son téléphone. Il tape son code secret, et il confirme.",
      tap: '#tConfirm', at: 3000, hold: 1200 },
    { id: 'a5', cap: "Paiement effectué",
      voix: "Et voilà ! Le paiement est effectué.",
      wait: 3500 },
    { id: 'a6', cap: "Ton application est prévenue toute seule",
      voix: "Ton application est prévenue tout de suite. La commande est validée toute seule, et le reçu part chez le client.",
      wait: 6000 },
    { id: 'a7', cap: "VITE API · bientôt disponible",
      voix: "Voilà Vité A P I : le paiement mobile, simplifié. Elle n'est pas encore disponible. Pour être prévenu à la sortie, écris à Dév D A J sur Ouatsapp. Merci !",
      wait: 5500 }
  ];

  function run(n) {
    clear();
    token++;
    if (synth) synth.cancel();
    i = n;
    const s = steps[i];
    document.querySelectorAll('.sc').forEach(e => e.classList.toggle('on', e.id === s.id));
    finger.classList.remove('show', 'tap');
    document.querySelectorAll('.pu').forEach(e => e.classList.remove('pu'));
    cap.textContent = s.cap;
    if (s.enter) s.enter();

    const advance = ms => later(() => run((i + 1) % steps.length), ms);
    const doTap = (delay, then) => {
      later(() => place(s.tap), Math.max(delay - 1200, 50));
      later(() => finger.classList.add('tap'), delay);
      later(() => { finger.classList.remove('tap'); if (s.after) s.after(); if (then) then(); }, delay + 300);
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
