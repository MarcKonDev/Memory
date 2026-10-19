import './styles/style.scss';
import { createBoard } from './card';
import type { Card } from './card';
import { createCardsHTML } from './card-template';
import type { GameState, PlayerNumber } from './game-state';
import { showScreen } from './screens';
import { setupSettings, resetSettings } from './settings';
import type { Settings } from './settings';
import { setupExitPopup } from './exit-popup';
import { DEFAULT_THEME, getTheme } from './themes';

const DEFAULT_PAIRS = 18;
const MAX_OPEN_CARDS = 2;
const MISMATCH_DELAY_MS = 1000;
const GAME_OVER_DELAY_MS = 2400;
const FIELD_SIZE_CLASSES: string[] = ['field--16', 'field--24', 'field--36'];
const WINNER_TEXTS: Record<PlayerNumber, string> = { 1: 'Blue Player', 2: 'Orange Player' };
const WINNER_ICONS: Record<PlayerNumber, string> = {
  1: new URL('./assets/images/winner-p1.svg', import.meta.url).href,
  2: new URL('./assets/images/winner-p2.svg', import.meta.url).href
};

const fieldRef: Element | null = document.querySelector('#field');
const playerOnePoints: NodeListOf<Element> = document.querySelectorAll('.scoreboard__points--player1');
const playerTwoPoints: NodeListOf<Element> = document.querySelectorAll('.scoreboard__points--player2');
const resetButtons: NodeListOf<Element> = document.querySelectorAll('.button--secondary');
const playButton: Element | null = document.querySelector('.button--yellow');
const backButton: Element | null = document.querySelector('[data-popup="back"]');
const drawIcon: HTMLImageElement | null = document.querySelector<HTMLImageElement>('.draw__icon');
const winnerTitle: Element | null = document.querySelector('.winner__title');
const winnerIcon: HTMLImageElement | null = document.querySelector<HTMLImageElement>('.winner__icon');
const markerRef: Element | null = document.querySelector('.header__marker');

const gameState: GameState = {
  pointsPlayer1: 0,
  pointsPlayer2: 0,
  activePlayer: 1,
  openCards: [],
  gameField: createBoard(DEFAULT_PAIRS, getTheme(DEFAULT_THEME).cards)
};

init();

/** Baut das Spiel auf und verbindet alle Buttons und Screens. */
function init(): void {
  renderGame();
  setupClickHandler();
  showScreen('home');
  setupResetButtons();
  setupPlayButton();
  setupSettings(startGame);
  setupExitPopup(exitGame);
}

/** Der Play-Button auf dem Startscreen führt zu den Settings. */
function setupPlayButton(): void {
  playButton?.addEventListener('click', () => showScreen('settings'));
}

/** Die "Back to start"-Buttons setzen das Spiel zurück und zeigen den Startscreen. */
function setupResetButtons(): void {
  for (const button of resetButtons) {
    button.addEventListener('click', resetGame);
  }
}

/** Zeichnet Spielfeld, Feldgröße, Punkte und aktiven Spieler neu. */
function renderGame(): void {
  setFieldSize();
  renderBoard();
  renderScores();
  renderActivePlayer();
}

/** Schreibt alle Karten als HTML ins Spielfeld. */
function renderBoard(): void {
  if (fieldRef) {
    fieldRef.innerHTML = createCardsHTML(gameState.gameField);
  }
}

/** Setzt die CSS-Klasse des Spielfelds passend zur Kartenanzahl (field--16/24/36). */
function setFieldSize(): void {
  fieldRef?.classList.remove(...FIELD_SIZE_CLASSES);
  fieldRef?.classList.add(`field--${gameState.gameField.length}`);
}

/** Schreibt die Punkte eines Spielers in alle Anzeigen (Spielfeld-Header und Game over). */
function renderPoints(elements: NodeListOf<Element>, points: number): void {
  for (const element of elements) {
    element.textContent = String(points);
  }
}

/** Zeigt die aktuellen Punkte beider Spieler. */
function renderScores(): void {
  renderPoints(playerOnePoints, gameState.pointsPlayer1);
  renderPoints(playerTwoPoints, gameState.pointsPlayer2);
}

/** Färbt den Marker im Header passend zum aktiven Spieler. */
function renderActivePlayer(): void {
  markerRef?.classList.toggle('header__marker--player1', gameState.activePlayer === 1);
  markerRef?.classList.toggle('header__marker--player2', gameState.activePlayer === 2);
}

/** Reagiert auf Klicks im Spielfeld (Event Delegation auf die Karten). */
function setupClickHandler(): void {
  fieldRef?.addEventListener('click', handleFieldClick);
}

/** Darf diese Karte gerade umgedreht werden? */
function canFlip(card: Card): boolean {
  const tooManyOpen = gameState.openCards.length === MAX_OPEN_CARDS;
  return !tooManyOpen && !card.found && card.hidden;
}

/** Dreht die angeklickte Karte um und prüft danach, ob zwei Karten offen sind. */
function handleFieldClick(event: Event): void {
  const cardElement = (event.target as HTMLElement).closest<HTMLButtonElement>('.card');
  if (!cardElement) {
    return;
  }
  const clickedCard = gameState.gameField[Number(cardElement.dataset.index)];
  if (!canFlip(clickedCard)) {
    return;
  }
  clickedCard.hidden = false;
  gameState.openCards.push(clickedCard);
  checkOpenCards();
  cardElement.classList.add('is-flipped');
}

/** Sind zwei Karten offen, wird entschieden: Paar gefunden oder wieder zudecken. */
function checkOpenCards(): void {
  if (gameState.openCards.length !== MAX_OPEN_CARDS) {
    return;
  }
  if (isMatch()) {
    handleMatch();
  } else {
    setTimeout(handleMismatch, MISMATCH_DELAY_MS);
  }
}

/** Zeigen die beiden offenen Karten dasselbe Motiv? */
function isMatch(): boolean {
  const [firstCard, secondCard] = gameState.openCards;
  return firstCard.image === secondCard.image;
}

/** Markiert das Paar als gefunden, vergibt den Punkt und prüft das Spielende. */
function handleMatch(): void {
  for (const card of gameState.openCards) {
    card.found = true;
  }
  setPoints();
  renderScores();
  if (isGameOver()) {
    showEndScreen();
  }
  gameState.openCards = [];
}

/** Deckt die Karten wieder zu und gibt den Zug an den anderen Spieler. */
function handleMismatch(): void {
  cleanOpenCards();
  switchPlayer();
  renderActivePlayer();
}

/** Gibt dem aktiven Spieler einen Punkt. */
function setPoints(): void {
  if (gameState.activePlayer === 1) {
    gameState.pointsPlayer1 += 1;
  } else {
    gameState.pointsPlayer2 += 1;
  }
}

/** Wechselt den aktiven Spieler. */
function switchPlayer(): void {
  gameState.activePlayer = gameState.activePlayer === 1 ? 2 : 1;
}

/** Deckt die offenen Karten im Daten-Zustand und im DOM wieder zu. */
function cleanOpenCards(): void {
  for (const card of gameState.openCards) {
    card.hidden = true;
    const position = gameState.gameField.indexOf(card);
    document.querySelector(`[data-index="${position}"]`)?.classList.remove('is-flipped');
  }
  gameState.openCards = [];
}

/** Ist das Spiel vorbei, wenn alle Karten gefunden wurden? */
function isGameOver(): boolean {
  return gameState.gameField.every((card: Card): boolean => card.found);
}

/** Zeigt "Game over" und nach kurzer Zeit das Ergebnis. */
function showEndScreen(): void {
  showScreen('game-over');
  setTimeout(showResultScreen, GAME_OVER_DELAY_MS);
}

/** Zeigt je nach Punktestand den Gewinner oder das Unentschieden. */
function showResultScreen(): void {
  const { pointsPlayer1, pointsPlayer2 } = gameState;
  if (pointsPlayer1 === pointsPlayer2) {
    showScreen('draw');
    return;
  }
  renderWinner(pointsPlayer1 > pointsPlayer2 ? 1 : 2);
  showScreen('winner');
}

/** Trägt Name, Farbe und Icon des Gewinners in den Winner-Screen ein. */
function renderWinner(winner: PlayerNumber): void {
  winnerTitle?.classList.toggle('winner__title--player1', winner === 1);
  winnerTitle?.classList.toggle('winner__title--player2', winner === 2);
  if (winnerTitle) {
    winnerTitle.textContent = WINNER_TEXTS[winner];
  }
  if (winnerIcon) {
    winnerIcon.src = WINNER_ICONS[winner];
  }
}

/** Wendet das Theme an: Farbschema per data-theme, Bilder und Button-Beschriftung per Code. */
function applyTheme(themeName: string): void {
  const theme = getTheme(themeName);
  document.body.dataset.theme = theme.name;
  if (drawIcon) {
    drawIcon.src = theme.drawIcon;
  }
  for (const button of resetButtons) {
    button.textContent = theme.resetLabel;
  }
  if (backButton) {
    backButton.textContent = theme.backLabel;
  }
}

/** Setzt Punkte, Spieler und Karten für eine neue Runde zurück. */
function resetGameState(player: PlayerNumber, pairs: number, themeName: string): void {
  gameState.pointsPlayer1 = 0;
  gameState.pointsPlayer2 = 0;
  gameState.activePlayer = player;
  gameState.openCards = [];
  gameState.gameField = createBoard(pairs, getTheme(themeName).cards);
}

/** Startet ein neues Spiel mit den gewählten Settings. */
function startGame(settings: Settings): void {
  applyTheme(settings.theme);
  resetGameState(settings.player, settings.pairs, settings.theme);
  renderGame();
  showScreen('game');
}

/** Verlässt das Spiel über das Exit-Popup und zeigt wieder die Settings im Standard-Look. */
function exitGame(): void {
  applyTheme(DEFAULT_THEME);
  showScreen('settings');
}

/** Setzt alles zurück und zeigt den Startscreen. */
function resetGame(): void {
  applyTheme(DEFAULT_THEME);
  resetGameState(1, DEFAULT_PAIRS, DEFAULT_THEME);
  renderGame();
  resetSettings();
  showScreen('home');
}
