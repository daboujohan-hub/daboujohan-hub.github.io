import os, stat

def ecrire(chemin, contenu, ecraser=True):
    if not ecraser and os.path.exists(chemin):
        print("déjà présent :", chemin)
        return
    os.makedirs(os.path.dirname(chemin) or ".", exist_ok=True)
    with open(chemin, "w", encoding="utf-8") as f:
        f.write(contenu)
    print("écrit :", chemin)

ACTUS = """[
  { "date": "2026-10-16", "titre": "Nouvelle version de VITE API", "texte": "La v3.0 arrive avec 20 fonctionnalités." },
  { "date": "2026-10-10", "titre": "TermChat évolue", "texte": "Nouvelles fonctions en préparation." }
]
"""

PROJETS = """[
  { "nom": "TermChat", "icone": "💬", "statut": "Disponible", "texte": "Messagerie mondiale pour développeurs.", "lien": "https://github.com/daboujohan-hub/termchat" },
  { "nom": "VITE API", "icone": "💳", "statut": "En développement", "texte": "API de paiement mobile (Wave, Orange Money, Moov, MTN).", "lien": "" },
  { "nom": "LIRA", "icone": "🤖", "statut": "Bientôt", "texte": "Mon projet d'intelligence artificielle.", "lien": "" }
]
"""

CSS = """.brand{white-space:nowrap}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
.actus-list{display:grid;gap:12px;margin-top:14px}
.actu{border:1px solid var(--line);border-radius:14px;padding:13px;background:var(--surface-2)}
.actu time{font-size:.76rem;color:var(--green);font-weight:700}
.actu b{display:block;margin-top:2px}
.actu p{margin:4px 0 0;color:var(--muted);font-size:.9rem}
.carousel{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 16px;-webkit-overflow-scrolling:touch}
.carousel .project{flex:0 0 min(82%,340px);scroll-snap-align:start}
.badge{align-self:flex-start;font-size:.74rem;font-weight:800;padding:4px 10px;border-radius:999px;margin-bottom:12px;border:1px solid var(--line)}
.badge.dispo{color:var(--green);border-color:var(--green)}
.badge.dev{color:var(--orange);border-color:var(--orange)}
.badge.bientot{color:var(--muted)}
"""

JS = """function el(tag, cls, text) {
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
      const a = el('a', 'text-link', 'Découvrir ↗');
      a.href = p.lien; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const w = el('div', 'project-links');
      w.append(a);
      c.append(w);
    }
    car.append(c);
  });
});
"""

ACTU_SH = """#!/bin/bash
cd "$(dirname "$0")" || exit 1
if [ -z "$1" ] || [ -z "$2" ]; then
  echo 'Usage : ./actu.sh "titre" "texte"'
  exit 1
fi
python3 - "$1" "$2" <<'EOF'
import json, sys, datetime
f = "assets/actus.json"
try:
    data = json.load(open(f, encoding="utf-8"))
except Exception:
    data = []
data.insert(0, {"date": datetime.date.today().isoformat(), "titre": sys.argv[1], "texte": sys.argv[2]})
data = data[:10]
json.dump(data, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
EOF
git add assets/actus.json
git commit -m "actu: $1"
git push
"""

ASIDE = """<aside class="hero-panel" aria-label="Actualités">
          <div class="kicker">📰 Actualités</div>
          <div id="actusList" class="actus-list"><p class="muted">Chargement…</p></div>
        </aside>"""

CAROUSEL = '<div class="carousel" id="carousel"></div>'

# --- 1. fichiers de contenu et d'assets ---
ecrire("assets/actus.json", ACTUS, ecraser=False)
ecrire("assets/projets.json", PROJETS, ecraser=False)
ecrire("assets/site.css", CSS)
ecrire("assets/site.js", JS)
ecrire("actu.sh", ACTU_SH)
os.chmod("actu.sh", os.stat("actu.sh").st_mode | stat.S_IEXEC)

# --- 2. modification de index.html ---
with open("index.html", encoding="utf-8") as f:
    html = f.read()

if "assets/site.css" in html:
    print("index.html déjà modifié, rien à faire.")
else:
    with open("index.html.bak", "w", encoding="utf-8") as f:
        f.write(html)
    print("sauvegarde : index.html.bak")

    # partie 1 : le panneau du haut
    a = html.find('<aside class="hero-panel"')
    b = html.find("</aside>", a)
    if a == -1 or b == -1:
        raise SystemExit("Bloc <aside> introuvable, index.html non modifié.")
    html = html[:a] + ASIDE + html[b + len("</aside>"):]

    # partie 2 : la grille des projets
    s = html.find('<div class="project-grid">')
    fin_section = html.find("</section>", s)
    if s == -1 or fin_section == -1:
        raise SystemExit("Bloc project-grid introuvable, index.html non modifié.")
    seg = html[s:fin_section]
    dernier = seg.rfind("</article>")
    fermeture = seg.find("</div>", dernier) + len("</div>")
    html = html[:s] + CAROUSEL + html[s + fermeture:]

    # liens vers les nouveaux fichiers
    html = html.replace("</head>", '  <link rel="stylesheet" href="assets/site.css">\n</head>', 1)
    html = html.replace("</body>", '  <script src="assets/site.js"></script>\n</body>', 1)

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("index.html modifié.")

print("\nTerminé. Publie avec : git add . && git commit -m 'actus + défilé projets' && git push")
