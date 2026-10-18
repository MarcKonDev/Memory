import './styles/style.scss';
import { createBoard } from './card';
import { createCardsHTML } from './card_template';
import { GameState } from './game_state';
import { showScreen } from './screens';
import { setupSettings, resetSettings, Settings } from './settings';
import { setupExitPopup } from './exit-popup';

const gameState: GameState = {
    pointsPlayer1: 0,
    pointsPlayer2: 0,
    activePlayer: 1,
    openCards: [],
    gameField: createBoard(18)
}

const fieldRef = document.querySelector('#field');
const playerOnePoints = document.querySelectorAll('.scoreboard__points--player1');
const playerTwoPoints = document.querySelectorAll('.scoreboard__points--player2');
const GAME_OVER_DELAY_MS = 2400;
const resetButtons = document.querySelectorAll('.button--secondary');
const playButton = document.querySelector('.button--yellow');

init();

function init() {
    renderBoard();
    setupClickHandler();
    setFieldSize();
    renderScores();
    renderActivePlayer();
    showScreen("home");
    setupResetButtons();
    setupPlayButton();
    setupSettings(startGame);
    setupExitPopup(() => showScreen("settings"));
}

function setupPlayButton():void {
    playButton?.addEventListener('click', () => showScreen('settings'));
}

function renderBoard() {
    if (fieldRef) {
        fieldRef.innerHTML = createCardsHTML(gameState.gameField);
    }
}

function setupClickHandler() {
    if (fieldRef) {
        fieldRef.addEventListener("click", e => {
            const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement;
            if (card) {
                const cardIndex = Number(card.dataset.index);
                const findCard = gameState.gameField[cardIndex];
                if (gameState.openCards.length === 2 || findCard.found || !findCard.hidden) {
                    return
                }
                findCard.hidden = false;
                gameState.openCards.push(findCard);
                checkOpenCards()
                card.classList.add("is-flipped");
            }
        });
    }
}

function checkOpenCards() {
    if (gameState.openCards.length === 2) {
        if (gameState.openCards[0].image === gameState.openCards[1].image) {
            gameState.openCards[0].found = true;
            gameState.openCards[1].found = true;
            setPoints();
            renderScores();
            if (isGameOver()) {
                showEndScreen();
            }
            gameState.openCards = [];
        } else {
            setTimeout(() => {
                cleanOpenCards();
                gameState.activePlayer = gameState.activePlayer === 1 ? 2 : 1;
                renderActivePlayer();
            }, 1000);
        }
    }
}

function setPoints() {
    if (gameState.activePlayer === 1) {
        gameState.pointsPlayer1 += 1;
    } else {
        gameState.pointsPlayer2 += 1;
    }
}

function showEndScreen(): void {
    showScreen("game-over");
    setTimeout(showResultScreen, GAME_OVER_DELAY_MS);
}

function showResultScreen(): void {
    if (gameState.pointsPlayer1 === gameState.pointsPlayer2) {
        showScreen("draw");
    } else {
        if (gameState.pointsPlayer1 > gameState.pointsPlayer2) {
            renderWinner(1)
        } else {
            renderWinner(2)
        }
        showScreen("winner");
    }
}

function renderWinner(winner: 1 | 2): void {
    const title = document.querySelector('.winner__title');
    const icon = document.querySelector('.winner__icon') as HTMLImageElement;
    const isPlayerOne = winner === 1;
    if (title) {
        title.classList.toggle('winner__title--player1', winner === 1)
        title.classList.toggle('winner__title--player2', winner === 2);
        title.textContent = isPlayerOne ? 'Blue Player' : 'Orange Player';
    }
    if (icon) {
        icon.src = isPlayerOne ? "./src/assets/images/winner-p1.svg" : "./src/assets/images/winner-p2.svg";
    }
}


function cleanOpenCards() {
    gameState.openCards[0].hidden = true;
    gameState.openCards[1].hidden = true;
    const positionOne = gameState.gameField.indexOf(gameState.openCards[0]);
    const positionTwo = gameState.gameField.indexOf(gameState.openCards[1]);
    const elementOne = document.querySelector(`[data-index="${positionOne}"]`);
    const elementTwo = document.querySelector(`[data-index="${positionTwo}"]`);
    if (elementOne) {
        elementOne.classList.remove("is-flipped");
    }
    if (elementTwo) {
        elementTwo.classList.remove("is-flipped");
    }
    gameState.openCards = [];
}

function isGameOver(): boolean {
    for (let index = 0; index < gameState.gameField.length; index++) {
        const element = gameState.gameField[index];
        if (element.found === false) {
            return false;
        }
    }
    return true;
}

function setFieldSize() {
    const cardCount = gameState.gameField.length;
    fieldRef?.classList.remove('field--16', 'field--24', 'field--36');
    fieldRef?.classList.add(`field--${cardCount}`);
}


function renderScores() {
    for (const playerOnePoint of playerOnePoints) {
        const pointsP1 = gameState.pointsPlayer1
        playerOnePoint.textContent = `${pointsP1}`
    }

    for (const playerTwoPoint of playerTwoPoints) {
        const pointsP2 = gameState.pointsPlayer2
        playerTwoPoint.textContent = `${pointsP2}`
    }
}

function renderActivePlayer() {
    const activePlayer = gameState.activePlayer;
    const markerarea = document.querySelector('.header__marker');
    markerarea?.classList.toggle("header__marker--player1", activePlayer === 1);
    markerarea?.classList.toggle("header__marker--player2", activePlayer === 2);
}


function setupResetButtons(): void {
    for (const button of resetButtons) {
        button.addEventListener('click', resetGame);
    }
}

/** Startet ein neues Spiel mit den gewählten Settings. */
function startGame(settings: Settings): void {
    gameState.pointsPlayer1 = 0;
    gameState.pointsPlayer2 = 0;
    gameState.activePlayer = settings.player;
    gameState.openCards = [];
    gameState.gameField = createBoard(settings.pairs);
    setFieldSize();
    renderBoard();
    renderScores();
    renderActivePlayer();
    showScreen("game");
}

function resetGame(): void {
    gameState.pointsPlayer1 = 0;
    gameState.pointsPlayer2 = 0;
    gameState.activePlayer = 1;
    gameState.openCards = [];
    gameState.gameField = createBoard(18);
    renderBoard();
    renderScores();
    renderActivePlayer();
    resetSettings();
    showScreen("home");
}

