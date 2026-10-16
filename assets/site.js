function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

fetch('assets/actus.json').then(r => r.json()).then(list => {
  const box = document.getElementById('actusList');
  box.textContent = '';
  list.forEach(a => {
    const d = el('div', 'actu');
    d.append(el('time', '', a.date), el('b', '', a.titre), el('p', '', a.texte));
    box.append(d);
  });
}).catch(() => {
  document.getElementById('actusList').textContent = 'Actualités bientôt disponibles.';
});

fetch('assets/projets.json').then(r => r.json()).then(list => {
  const car = document.getElementById('carousel');
  car.textContent = '';
  list.forEach(p => {
    const c = el('article', 'project');
    const cls = p.statut === 'Disponible' ? 'dispo' : p.statut === 'Bientôt' ? 'bientot' : 'dev';
    c.append(el('span', 'badge ' + cls, p.statut), el('div', 'project-icon', p.icone), el('h3', '', p.nom), el('p', '', p.texte));
    if (p.lien) {
      const a = el('a', 'text-link', 'Voir la démo ▶');
      a.href = p.lien; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const w = el('div', 'project-links');
      w.append(a);
      c.append(w);
    }
    car.append(c);
  });
});
