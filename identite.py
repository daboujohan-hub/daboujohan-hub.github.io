import os, subprocess

MOI = os.path.abspath(__file__)
os.chdir(os.path.dirname(MOI))
URL = "https://daboujohan-hub.github.io/assets/identite.png"

def lire(f):
    with open(f, encoding="utf-8") as fh:
        return fh.read()

def ecrire(f, t):
    with open(f, "w", encoding="utf-8") as fh:
        fh.write(t)

# 1. Cacher les stats sous 20 visiteurs
js = lire("assets/stats.js")
ligne = "document.getElementById('statMoy').textContent = v ? (sec / 60 / v).toFixed(1) : '0';"
if "classList.add('show')" in js:
    print("stats : déjà fait")
elif ligne in js:
    ecrire("assets/stats.js", js.replace(ligne, ligne + "\n    if (v >= 20) document.getElementById('statsBox').classList.add('show');"))
    print("stats : cachées sous 20 visiteurs")
else:
    print("stats : ligne introuvable, non modifié")

# 2. Photos
h = lire("index.html")
moi = os.path.exists("assets/moi.jpg")
ident = os.path.exists("assets/identite.png")
print("photo moi.jpg :", "trouvée" if moi else "ABSENTE")
print("image identite.png :", "trouvée" if ident else "ABSENTE")

if moi and 'class="moi"' not in h:
    a = "<h3>👋 Mon parcours</h3>"
    if a in h:
        h = h.replace(a, '<img class="moi" src="assets/moi.jpg" alt="Diomandé Abou Johan, DEV.D.A.J" width="120" height="120">' + a, 1)
if ident and 'id="identite"' not in h:
    b = '<section id="competences">'
    sec = ('<section id="identite"><div class="container"><img class="banniere" src="assets/identite.png" '
           'alt="DEV.D.A.J — AbouDev Labs" loading="lazy"></div></section>\n\n    ')
    if b in h:
        h = h.replace(b, sec + b, 1)
    og = '<meta property="og:image" content="%s">\n  <meta name="twitter:image" content="%s">\n  ' % (URL, URL)
    if "og:image" not in h:
        h = h.replace("<title>", og + "<title>", 1)
ecrire("index.html", h)

# 3. Style
css = lire("assets/site.css")
if "#statsBox" not in css:
    ecrire("assets/site.css", css + """
#statsBox{display:none}
#statsBox.show{display:grid}
.moi{display:block;width:120px;height:120px;border-radius:50%;object-fit:cover;object-position:center 20%;border:3px solid var(--green);margin:0 0 14px}
.banniere{display:block;width:100%;height:auto;border-radius:22px;border:1px solid var(--line);box-shadow:var(--shadow)}
#identite{padding:10px 0 20px}
""")
    print("style ajouté")

if moi and ident:
    os.remove(MOI)
subprocess.run("git add . && git commit -m 'identité: photos, stats cachées sous 20' && git push", shell=True)
print("Terminé. Attends une minute puis ouvre ton site." if moi and ident else "Copie les photos manquantes puis relance : python3 identite.py")
