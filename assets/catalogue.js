(function () {
  const NUM = '2250565961287';
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const wa = msg => 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(msg);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; };
  const lien = (txt, url) => { const a = el('a', 'btn primary', txt); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };

  fetch('assets/catalogue.json').then(r => r.json()).then(list => {
    grid.textContent = '';
    list.forEach(p => {
      const c = el('article', 'cat-card');
      c.append(el('div', 'project-icon', p.icone), el('h3', '', p.nom), el('p', '', p.texte), el('div', 'meta', '⏱ ' + (p.delai || 'Sur devis')));
      c.append(lien('Commander ce projet ↗', wa('Bonjour DEV.D.A.J, je suis intéressé(e) par : ' + p.nom + '. Pouvez-vous me donner plus de détails ?')));
      grid.append(c);
    });
    const o = el('article', 'cat-card cat-other');
    const ta = el('textarea'); ta.placeholder = 'Décris ton idée en quelques mots…'; ta.setAttribute('aria-label', 'Ton idée');
    const b = el('button', 'btn primary', 'Envoyer mon idée ↗'); b.type = 'button';
    b.onclick = () => window.open(wa('Bonjour DEV.D.A.J, j\'ai un projet : ' + (ta.value.trim() || '(je vous explique sur WhatsApp)')), '_blank', 'noopener');
    o.append(el('div', 'project-icon', '💡'), el('h3', '', 'Mon idée n\'est pas dans la liste'), el('p', '', 'Explique ce que tu veux, je te réponds avec une proposition.'), ta, b);
    grid.append(o);
  }).catch(() => { grid.textContent = 'Catalogue bientôt disponible.'; });
})();
