# Memory

🇬🇧 English | [🇩🇪 Deutsch](README.de.md)

A two-player memory game, created as a project for the Developer Akademie.
Built with TypeScript, SCSS and Vite, without a framework.

**Live version:** https://marc-konopka.developerakademie.net/Memory/index.html

## How to play

1. On the start screen, click **Play** to open the settings.
2. In the settings, choose three things: the **theme**, the **starting player** (Blue or Orange) and the **board size**.
   The **Start** button is enabled as soon as all three choices are made.
3. The players take turns flipping two cards. If the cards match, the active player gets a point and plays again. If they do not match, the cards are turned back and the other player is next.
4. When all pairs are found, a **Game over** screen shows the final score. After that, the winner or a draw is shown, and one click leads back to the start.
5. With **Exit Game**, a running game can be left after a confirmation.

## Features

- Start screen with an animated controller icon on the play button
- Settings to choose the theme, the starting player and the board size (16, 24 or 36 cards)
- Two themes that change the color scheme, fonts and motifs:
  - **Code vibes** with web development logos
  - **Foods** with food motifs
- Game field with the score of both players, an indicator for the current player and a smooth card flip animation
- Game over screen with the final score, a winner screen and a draw screen

## Extras

- Exit popup with a confirmation (`<dialog>`) and its own entrance animation for each theme
- Summary bar in the settings that shows the chosen options and animates when they change
- Preview image in the settings that matches the theme (also while hovering over an option)
- Hover effects in the settings: an option becomes bold and gets the line, the start button grows and its icon rotates (only when it is enabled)
- Hover effects on the buttons
- Automatic transition from "Game over" to the result; the winner or draw screen slides in from the top over the previous screen
- The end of the game waits until the last card has been flipped completely

The **Gaming** and **DA Projects** themes from the design are not implemented (they are optional) and are not part of the settings.

## Getting started

Requirement: [Node.js](https://nodejs.org) is installed.

```bash
npm install
npm run dev
```

Then open the shown address (usually `http://localhost:5173`) in the browser.

### Build for a server

```bash
npm run build -- --base=./
```

This creates the `dist` folder. Upload its **contents** (`index.html`, `favicon.svg`, `assets/`) to the server.
The `--base=./` makes all files load with relative paths, so the page also works in a subfolder.

## Project structure

```
index.html            all screens as <section> (home, settings, game, game over, winner, draw)
public/               favicon
src/
  main.ts             game logic and wiring of all parts
  card.ts             create cards, the board and the card HTML
  card-template.ts    HTML template of a single card
  game-state.ts       types for the game state
  screens.ts          show, hide and slide in screens
  settings.ts         settings, summary bar and start button
  exit-popup.ts       exit popup
  themes.ts           theme data (motifs, preview, labels)
  shuffle.ts          shuffle the cards
  assets/             images, fonts and motifs
  styles/             SCSS (abstracts, base, themes)
```

## Implementation

- All screens live on one page and are shown and hidden with the class `is-hidden`.
- The theme is set with the attribute `data-theme` on the `body`. The theme styles are located in `src/styles/themes/`.
- The card motifs are inline SVGs.
- The code follows the coding conventions of the Developer Akademie (kebab-case file names, explicit types, TSDoc, named constants, short functions).
- The design is provided by the Developer Akademie (Figma).
