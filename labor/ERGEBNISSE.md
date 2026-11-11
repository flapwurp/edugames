# Labor – Ergebnisse

Was die Tests auf dem Schul-iPad ergeben haben, damit größere Spiele darauf aufbauen können.

## Testgerät (Schritt 1, Gerätecheck, 11.11.2026)

- iPad 10,2 Zoll, 2160 × 1620 Pixel (Pixeldichte 2×), Safari 26.6, 60 Hz
- Sichtbare Fläche quer in Safari: 1080 × 678 Punkte
- WebGL 2, größte Textur 16.384 px, Web Audio, WebSocket, WebRTC, Wake Lock, Vollbild vorhanden
- Canvas-Test: 8.000 bewegte Figuren bei 60 fps (16.000 → 42 fps)
- Download im Schul-WLAN (ein Gerät): rund 116 Mbit/s
- Ton startet erst nach einer Berührung (Web Audio beginnt im Zustand „suspended“)

## Engine-Test (Schritt 2, Phaser 4)

| Fassung | fps beim Rudern |
|---|---|
| erste Version (Hintergrund aus Formen, Minikarte als zweite Kamera, 580 Tweens) | 17–24 |
| überarbeitet (Hintergrund als Bild, Minikarte als Standbild, Wiegen ohne Tweens) | 40–50 |
| Qualität „mittel“ (1,5-fache Auflösung) | knapp 60 |
| Qualität „niedrig“ (1-fache Auflösung) | knapp 60 |

- Grenze ist die Pixelmenge, nicht die Zahl der Objekte.
- „mittel“ ist noch scharf genug, „niedrig“ nicht (Robs Urteil). Empfehlung für große Spiele: Standard „mittel“.
- Regeln daraus: Hintergründe einmal malen und als Bild verwenden; keine zweite Kamera, die die ganze Welt zeichnet; viele gleichartige Bewegungen in einer Schleife berechnen statt als einzelne Tweens.
- Ladezeit unter 1 Sekunde; Touch-Steuerung, Ton, Vollbild funktionieren.

## Bilder im Spiel (Schritt 3)

- Karte, Zoomen mit zwei Fingern, Infotafeln: flüssig und zuverlässig.
- Nilkarte wird beim Hineinzoomen pixelig, weil das NASA-Bild nur 400 px breit ist (liegt am Bild).
- Tiefenwirkung Gizeh: als Machbarkeitsnachweis gelungen, braucht Feinschliff (siehe unten).
- Phaser-Treffererkennung für Objekte versagt bei gezoomter Kamera; eigene Berechnung über `cam.getWorldPoint()` funktioniert.

## Offene Punkte

- Gizeh: Pyramidenfüße liegen teils in der Bodenebene, der Rest in der Pyramidenebene; beim Wischen entsteht ein Versatz. Bodenebene unter den Pyramiden aussparen bzw. Horizontlinie unter die Pyramidenfüße legen. Parallaxe-Faktoren feinjustieren.
