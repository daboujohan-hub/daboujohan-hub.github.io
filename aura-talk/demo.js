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
    const g = setTimeout(() => fin(), text.length * 100 + 3000);
    const fin = () => { if (over || t !== token) return; over = true; clearTimeout(g); if (end) end(); };
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
    { id: 'a1', cap: "Tu touches l'icône AURA",
      voix: "Bonjour ! Voici ton téléphone. Pour demander de l'aide, tu touches l'icône Aura.",
      tap: '#tIcon', at: 2600 },
    { id: 'a2', cap: "AURA te dit bonjour et t'écoute",
      voix: "Aura s'ouvre et te dit bonjour. Elle t'écoute. Tu n'as pas besoin de lire : tu parles, et elle te répond.",
      wait: 5000 },
    { id: 'a3', cap: "Un message arrive… AURA le lit à voix haute",
      voix: "Un message arrive sur Ouatsapp. Il dit : clique ici pour gagner un cadeau. Aura le lit à voix haute pour toi.",
      wait: 5800 },
    { id: 'a4', cap: "AURA te prévient : danger",
      voix: "Attention ! Aura te prévient : ce lien peut être dangereux. Ne clique pas dessus.",
      wait: 5200 },
    { id: 'a5', cap: "Tu poses ta question avec ta voix",
      voix: "Tu appuies sur le micro et tu demandes : dois-je cliquer ?",
      voix2: "Aura répond : non. Ne clique pas. Supprime ce message.",
      tap: '#tMic', at: 1800, hold: 5200,
      enter() { $('#a5').classList.remove('s1', 's2', 's3'); },
      after() {
        const a = $('#a5');
        a.classList.add('s1');
        later(() => a.classList.add('s2'), 1000);
        later(() => a.classList.add('s3'), 2400);
      } },
    { id: 'a6', cap: "Ta voix. Ton guide. Ta sécurité.",
      voix: "Voilà ! Avec Aura, tu avances en confiance, même sans savoir lire. Ta voix. Ton guide. Ta sécurité. Pour être prévenu quand elle sera prête, écris à Dév D A J sur Ouatsapp. Merci !",
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
        if (s.tap) {
          doTap(1400, () => {
            if (s.voix2) speak(s.voix2, () => advance(900));
            else advance(1200);
          });
        } else advance(900);
      });
    } else if (s.tap) {
      doTap(s.at, () => advance(s.hold || 1000));
    } else {
      advance(s.wait);
    }
  }

  function setBtn() {
    btn.classList.remove('talking');
    btn.textContent = voiceOn ? '⏹ Couper la voix' : '🔊 Écouter la démo parlée';
  }

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
