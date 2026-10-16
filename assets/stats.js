const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDwl1cddrgtf81JDMxyMDRwwZTUHGQO7tM",
  authDomain: "planning-with-ai-eef66.firebaseapp.com",
  projectId: "planning-with-ai-eef66",
  appId: "1:709302101514:web:e0c6e30ebc8c5c2870e1f3"
};

(function () {
  if (!window.firebase) return;
  firebase.initializeApp(FIREBASE_CONFIG);
  const db = firebase.firestore();
  const inc = firebase.firestore.FieldValue.increment;
  const jour = d => d.toISOString().slice(0, 10);
  const ref = j => db.collection('stats').doc(j);
  const today = jour(new Date());

  let vu = null;
  try { vu = localStorage.getItem('daj-vu'); } catch (_) {}
  if (vu !== today) {
    ref(today).set({ visiteurs: inc(1), secondes: inc(0) }, { merge: true })
      .then(() => { try { localStorage.setItem('daj-vu', today); } catch (_) {} })
      .catch(() => {});
  }

  let debut = Date.now();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const s = Math.min(Math.round((Date.now() - debut) / 1000), 3600);
      if (s > 0) ref(jour(new Date())).set({ visiteurs: inc(0), secondes: inc(s) }, { merge: true }).catch(() => {});
    } else {
      debut = Date.now();
    }
  });

  const jours = [];
  for (let i = 0; i < 7; i++) jours.push(jour(new Date(Date.now() - i * 86400000)));
  Promise.all(jours.map(j => ref(j).get())).then(docs => {
    let v = 0, sec = 0;
    docs.forEach(d => { if (d.exists) { v += d.data().visiteurs || 0; sec += d.data().secondes || 0; } });
    document.getElementById('statVisiteurs').textContent = v;
    document.getElementById('statMinutes').textContent = Math.round(sec / 60);
    document.getElementById('statMoy').textContent = v ? (sec / 60 / v).toFixed(1) : '0';
    if (v >= 20) document.getElementById('statsBox').classList.add('show');
  }).catch(() => {});
})();
