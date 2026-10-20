#!/bin/bash
cd "$(dirname "$0")" || exit 1
python3 - "$@" <<'EOF'
import json, sys
a = sys.argv[1:]
f = "produits.json"
d = json.load(open(f, encoding="utf-8"))
if a[:1] == ["liste"]:
    for p in d:
        print(p["id"], "-", p["nom"], "-", p["prix"], "FCFA", "(vendu)" if p.get("vendu") else "")
    sys.exit(3)
elif len(a) >= 3 and a[0] == "ajouter":
    n = max([p["id"] for p in d] or [0]) + 1
    d.append({"id": n, "nom": a[1], "prix": int(a[2]), "etat": a[3] if len(a) > 3 else "Bon état",
              "photo": a[4] if len(a) > 4 else "", "vendu": False})
    print("ajouté : numéro", n)
elif len(a) == 2 and a[0] == "vendu":
    for p in d:
        if p["id"] == int(a[1]):
            p["vendu"] = True
    print("marqué vendu :", a[1])
elif len(a) == 3 and a[0] == "prix":
    for p in d:
        if p["id"] == int(a[1]):
            p["prix"] = int(a[2])
    print("prix changé")
else:
    print('Usage : ./gerer.sh liste | ajouter "nom" prix ["état"] [photo.jpg] | vendu NUMERO | prix NUMERO NOUVEAUPRIX')
    sys.exit(3)
json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
EOF
[ $? -eq 0 ] || exit 0
git add produits.json photos
git commit -m "boutique: mise à jour des articles"
git push
