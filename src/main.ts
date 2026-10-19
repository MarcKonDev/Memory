import './styles/style.scss';
import { createBoard, createCardsHTML } from './card';
import type { Card } from './card';
import type { GameState, PlayerNumber } from './game-state';
import { showScreen, slideInScreen } from './screens';
import { setupSettings, resetSettings } from './settings';
import type { Settings } from './settings';
import { setupExitPopup } from './exit-popup';
import { DEFAULT_THEME, getTheme } from './themes';

const DEFAULT_PAIRS = 18;
const MAX_OPEN_CARDS = 2;
const MISMATCH_DELAY_MS = 1000;
const GAME_OVER_DELAY_MS = 2400;
const FLIP_DURATION_MS = 300;
const LAST_PAIR_VISIBLE_MS = 700;
const END_SCREEN_DELAY_MS = FLIP_DURATION_MS + LAST_PAIR_VISIBLE_MS;
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

document.addEventListener('DOMContentLoaded', init);

/**
 * Builds the game and connects all buttons and screens.
 * Runs as soon as the page has finished loading.
 */
function init(): void {
  renderGame();
  setupClickHandler();
  showScreen('home');
  setupResetButtons();
  setupPlayButton();
  setupSettings(startGame);
  setupExitPopup(exitGame);
}

/**
 * Makes the play button on the start screen open the settings.
 */
function setupPlayButton(): void {
  playButton?.addEventListener('click', () => showScreen('settings'));
}

/**
 * Makes the "Back to start" buttons reset the game and show the start screen.
 */
function setupResetButtons(): void {
  for (const button of resetButtons) {
    button.addEventListener('click', resetGame);
  }
}

/**
 * Redraws the board, the field size, the scores and the active player.
 */
function renderGame(): void {
  setFieldSize();
  renderBoard();
  renderScores();
  renderActivePlayer();
}

/**
 * Writes all cards as HTML into the game field.
 */
function renderBoard(): void {
  if (fieldRef) {
    fieldRef.innerHTML = createCardsHTML(gameState.gameField);
  }
}

/**
 * Sets the CSS class of the game field that matches the number of cards.
 */
function setFieldSize(): void {
  fieldRef?.classList.remove(...FIELD_SIZE_CLASSES);
  fieldRef?.classList.add(`field--${gameState.gameField.length}`);
}

/**
 * Writes the points of one player into all of their score displays.
 *
 * @param elements - The score elements of the player (header and game over screen)
 * @param points - The points to show
 */
function renderPoints(elements: NodeListOf<Element>, points: number): void {
  for (const element of elements) {
    element.textContent = String(points);
  }
}

/**
 * Shows the current points of both players.
 */
function renderScores(): void {
  renderPoints(playerOnePoints, gameState.pointsPlayer1);
  renderPoints(playerTwoPoints, gameState.pointsPlayer2);
}

/**
 * Colors the marker in the header to match the active player.
 */
function renderActivePlayer(): void {
  markerRef?.classList.toggle('header__marker--player1', gameState.activePlayer === 1);
  markerRef?.classList.toggle('header__marker--player2', gameState.activePlayer === 2);
}

/**
 * Listens for clicks on the game field (event delegation on the cards).
 */
function setupClickHandler(): void {
  fieldRef?.addEventListener('click', handleFieldClick);
}

/**
 * Checks whether a card may be flipped right now.
 *
 * @param card - The card that was clicked
 * @returns `true` if the card is hidden, not found yet and fewer than two cards are open
 */
function canFlip(card: Card): boolean {
  const tooManyOpen = gameState.openCards.length === MAX_OPEN_CARDS;
  return !tooManyOpen && !card.found && card.hidden;
}

/**
 * Flips the clicked card and then checks whether two cards are open.
 *
 * @param event - The click event on the game field
 */
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

/**
 * Decides what happens once two cards are open: a pair was found or the cards are hidden again.
 */
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

/**
 * Checks whether the two open cards show the same image.
 *
 * @returns `true` if both open cards match
 */
function isMatch(): boolean {
  const [firstCard, secondCard] = gameState.openCards;
  return firstCard.image === secondCard.image;
}

/**
 * Marks the pair as found, awards the point and ends the game after the last pair.
 * The end screen waits until the last card has been flipped over completely.
 */
function handleMatch(): void {
  for (const card of gameState.openCards) {
    card.found = true;
  }
  setPoints();
  renderScores();
  if (isGameOver()) {
    setTimeout(showEndScreen, END_SCREEN_DELAY_MS);
  }
  gameState.openCards = [];
}

/**
 * Hides the cards again and passes the turn to the other player.
 */
function handleMismatch(): void {
  cleanOpenCards();
  switchPlayer();
  renderActivePlayer();
}

/**
 * Gives the active player one point.
 */
function setPoints(): void {
  if (gameState.activePlayer === 1) {
    gameState.pointsPlayer1 += 1;
  } else {
    gameState.pointsPlayer2 += 1;
  }
}

/**
 * Switches the active player.
 */
function switchPlayer(): void {
  gameState.activePlayer = gameState.activePlayer === 1 ? 2 : 1;
}

/**
 * Hides the open cards again, both in the game state and in the DOM.
 */
function cleanOpenCards(): void {
  for (const card of gameState.openCards) {
    card.hidden = true;
    const position = gameState.gameField.indexOf(card);
    document.querySelector(`[data-index="${position}"]`)?.classList.remove('is-flipped');
  }
  gameState.openCards = [];
}

/**
 * Checks whether all cards have been found.
 *
 * @returns `true` if the game is over
 */
function isGameOver(): boolean {
  return gameState.gameField.every((card: Card): boolean => card.found);
}

/**
 * Shows the "Game over" screen and, after a short time, the result.
 */
function showEndScreen(): void {
  showScreen('game-over');
  setTimeout(showResultScreen, GAME_OVER_DELAY_MS);
}

/**
 * Slides in the winner or the draw screen, depending on the final score.
 */
function showResultScreen(): void {
  const { pointsPlayer1, pointsPlayer2 } = gameState;
  if (pointsPlayer1 === pointsPlayer2) {
    slideInScreen('draw');
    return;
  }
  renderWinner(pointsPlayer1 > pointsPlayer2 ? 1 : 2);
  slideInScreen('winner');
}

/**
 * Fills the winner screen with the name, color and icon of the winner.
 *
 * @param winner - The player who won
 */
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

/**
 * Applies a theme: the color scheme via `data-theme`, images and button labels via code.
 *
 * @param themeName - The name of the theme, for example `foods`
 */
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

/**
 * Resets points, player and cards for a new round.
 *
 * @param player - The player who starts
 * @param pairs - The number of pairs on the board
 * @param themeName - The theme whose images are used for the cards
 */
function resetGameState(player: PlayerNumber, pairs: number, themeName: string): void {
  gameState.pointsPlayer1 = 0;
  gameState.pointsPlayer2 = 0;
  gameState.activePlayer = player;
  gameState.openCards = [];
  gameState.gameField = createBoard(pairs, getTheme(themeName).cards);
}

/**
 * Starts a new game with the chosen settings.
 *
 * @param settings - The theme, starting player and board size from the settings
 */
function startGame(settings: Settings): void {
  applyTheme(settings.theme);
  resetGameState(settings.player, settings.pairs, settings.theme);
  renderGame();
  showScreen('game');
}

/**
 * Leaves the game via the exit popup and shows the settings in the default look again.
 */
function exitGame(): void {
  applyTheme(DEFAULT_THEME);
  showScreen('settings');
}

/**
 * Resets everything and shows the start screen.
 */
function resetGame(): void {
  applyTheme(DEFAULT_THEME);
  resetGameState(1, DEFAULT_PAIRS, DEFAULT_THEME);
  renderGame();
  resetSettings();
  showScreen('home');
}
