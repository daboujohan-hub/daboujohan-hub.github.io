#!/bin/bash
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
