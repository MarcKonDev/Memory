# Memory

[🇬🇧 English](README.md) | 🇩🇪 Deutsch

Ein Memory-Spiel für zwei Spieler, entstanden als Projekt der Developer Akademie.
Gebaut mit TypeScript, SCSS und Vite, ohne Framework.

**Live-Version:** https://marc-konopka.developerakademie.net/Memory/index.html

## Spielablauf

1. Auf dem Startscreen mit **Play** zu den Settings wechseln.
2. In den Settings drei Dinge wählen: **Theme**, **Startspieler** (Blue oder Orange) und **Spielfeldgröße**.
   Der **Start**-Button wird erst frei, wenn alle drei Auswahlen getroffen sind.
3. Die Spieler decken abwechselnd zwei Karten auf. Passen sie zusammen, bekommt der aktive Spieler einen Punkt und darf weiterspielen. Passen sie nicht, werden sie wieder zugedeckt und der andere Spieler ist dran.
4. Sind alle Paare gefunden, erscheint **Game over** mit dem Endstand. Danach folgt der Gewinner oder ein Unentschieden und mit einem Klick geht es zurück zum Start.
5. Über **Exit Game** kann ein laufendes Spiel nach einer Sicherheitsabfrage verlassen werden.

## Funktionen

- Startseite mit animiertem Controller-Icon auf dem Play-Button
- Settings mit Auswahl von Theme, Startspieler und Spielfeldgröße (16, 24 oder 36 Karten)
- Zwei Themes, die Farbschema, Schriften und Motive ändern:
  - **Code vibes** mit Logos aus der Webentwicklung
  - **Foods** mit Speisen-Motiven
- Spielfeld mit Punktestand beider Spieler, Anzeige des aktuellen Spielers und flüssiger Flip-Animation der Karten
- Game-over-Screen mit Endstand, Gewinner-Anzeige und Unentschieden-Screen

## Extras

- Exit-Popup mit Sicherheitsabfrage (`<dialog>`) und eigener Einblend-Animation je Theme
- Auswahl-Leiste in den Settings, die die gewählten Optionen anzeigt und bei Änderungen animiert
- Vorschau-Bild in den Settings, das zum Theme passt (auch schon beim Hovern über eine Option)
- Hover-Effekt in den Settings: Option wird fett und bekommt die Linie, der Start-Button vergrößert sich und das Icon dreht sich (nur wenn er freigegeben ist)
- Hover-Effekte auf den Buttons
- Automatischer Übergang von "Game over" zum Ergebnis; der Winner- bzw. Draw-Screen fliegt dabei von oben über den vorherigen Screen
- Das Spielende wartet, bis die letzte Karte vollständig umgedreht ist

Die Themes **Gaming** und **DA Projects** aus dem Design sind nicht umgesetzt (laut Aufgabe optional) und in den Settings nicht enthalten.

## Projekt starten

Voraussetzung: [Node.js](https://nodejs.org) ist installiert.

```bash
npm install
npm run dev
```

Danach die angezeigte Adresse (meist `http://localhost:5173`) im Browser öffnen.

### Für einen Server bauen

```bash
npm run build -- --base=./
```

Das erzeugt den Ordner `dist`. Dessen **Inhalt** (`index.html`, `favicon.svg`, `assets/`) wird auf den Server hochgeladen.
Das `--base=./` sorgt dafür, dass alle Dateien relativ geladen werden und die Seite auch in einem Unterordner funktioniert.

## Projektstruktur

```
index.html            alle Screens als <section> (Home, Settings, Spielfeld, Game over, Winner, Draw)
public/               Favicon
src/
  main.ts             Spiellogik und Verknüpfung aller Teile
  card.ts             Karten, Spielfeld und Karten-HTML erzeugen
  card-template.ts    HTML-Vorlage einer einzelnen Karte
  game-state.ts       Typen für den Spielstand
  screens.ts          Screens ein-, ausblenden und einfliegen lassen
  settings.ts         Settings, Auswahl-Leiste und Start-Button
  exit-popup.ts       Exit-Popup
  themes.ts           Daten der Themes (Motive, Vorschau, Beschriftungen)
  shuffle.ts          Karten mischen
  assets/             Bilder, Schriften und Motive
  styles/             SCSS (abstracts, base, themes)
```

## Umsetzung

- Alle Screens liegen in einer Seite und werden über die Klasse `is-hidden` ein- und ausgeblendet.
- Das Theme wird über das Attribut `data-theme` am `body` gesetzt. Die Theme-Styles stehen in `src/styles/themes/`.
- Die Karten-Motive sind inline eingebundene SVGs.
- Der Code folgt den Coding-Konventionen der Developer Akademie (kebab-case-Dateinamen, explizite Typen, TSDoc, benannte Konstanten, kurze Funktionen).
- Das Design stammt von der Developer Akademie (Figma).
