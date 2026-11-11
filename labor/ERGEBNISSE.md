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

- Behoben: Pyramiden enden jetzt an ihrer Fußlinie, der Boden beginnt dort (kein Bruch mehr beim Wischen). Die kleine Nebenpyramide gehört zum Boden.

## Effekte und Ton (Schritt 5)

- Eigener WebGL-Shader statt Phaser: alle Ebenen in einem Durchgang, Licht pro Bildpunkt berechnet. Phaser 4 hätte dafür ein neues Filter- und Shader-System, das sich zum Testen weniger eignet.
- Ton komplett aus Web Audio berechnet (Wind, Vögel, Grillen), ohne Tondateien; Start erst nach Tippen.
- iPad, Qualität „mittel“: 60 fps, auch mit Hitzeflimmern. Ein Shader, der jeden Bildpunkt einzeln berechnet, ist also kein Problem.
- Nacht war zu dunkel; aufgehellt (Mondlicht als bläuliches Umgebungslicht).

## Multiplayer (Schritt 6)

- Supabase Realtime (Projekt „labor“, Frankfurt), nur Broadcast und Presence, keine Tabellen. Ohne Bibliothek: Das Phoenix-Protokoll ist so schlicht, dass `verbindung.js` mit gut 150 Zeilen auskommt.
- Gratis-Kontingent als harte Grenze fürs Spieldesign: 100 Nachrichten/s fürs ganze Projekt, Senden und jedes Empfangen zählen einzeln (1 Nachricht an 29 Mitspieler = 30). Eine ganze Klasse darf also keine Dauerströme senden, sondern nur Ereignisse (Zug, Antwort, Ergebnis). Fingerbewegungen werden deshalb auf 10/s gedrosselt und beim Empfänger weich nachgezogen.
- Lokal gegen nachgebauten Server getestet (Neuverbinden nach Abbruch, Anwesenheit, getrennte Räume). Messung auf den iPads: steht aus.

## Offene Punkte

- Gizeh: Parallaxe-Faktoren feinjustieren.
