"""Bündelt eine HTML-Seite mit ihren JS-Modulen zu EINER Datei, die per Doppelklick ohne Webserver läuft.

Hintergrund: Browser laden ES-Module nicht aus lokalen Dateien (file://). Die Seiten im Repo brauchen deshalb
einen Webserver – diese Einzeldateien nicht. Nur für Vorschauen gedacht, nicht für das Spiel selbst.

Aufruf:  python3 scripts/einzeldatei.py planspiel-julikrise/galerie.html ausgabe.html
Grenzen: nur relative Importe der Form  import { a, b } from "./datei.js";  Namen müssen über alle Module eindeutig sein.
"""
import os, re, sys

IMPORT = re.compile(r'^import\s+\{[^}]*\}\s+from\s+"(\.[^"]+)";\s*\n', re.M | re.S)

def module_in_reihenfolge(datei, gesehen, liste):
    pfad = os.path.normpath(datei)
    if pfad in gesehen:
        return
    gesehen.add(pfad)
    text = open(pfad, encoding="utf-8").read()
    for ziel in IMPORT.findall(text):
        module_in_reihenfolge(os.path.join(os.path.dirname(pfad), ziel), gesehen, liste)
    liste.append(pfad)

def buendeln(html_pfad):
    html = open(html_pfad, encoding="utf-8").read()
    kopf, rest = html.split('<script type="module">', 1)
    skript, schluss = rest.split("</script>", 1)
    gesehen, liste = set(), []
    for ziel in IMPORT.findall(skript):
        module_in_reihenfolge(os.path.join(os.path.dirname(html_pfad), ziel), gesehen, liste)
    teile = []
    for pfad in liste:
        t = IMPORT.sub("", open(pfad, encoding="utf-8").read())
        teile.append(f"/* ---- {os.path.basename(pfad)} ---- */\n" + re.sub(r"^export ", "", t, flags=re.M))
    return kopf + '<script type="module">\n' + "\n".join(teile) + "\n/* ---- Seite ---- */\n" + IMPORT.sub("", skript) + "</script>" + schluss

if __name__ == "__main__":
    open(sys.argv[2], "w", encoding="utf-8").write(buendeln(sys.argv[1]))
    print("geschrieben:", sys.argv[2])
