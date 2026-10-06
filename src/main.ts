import './styles/style.scss';
import { createBoard } from './card';
import { createCardsHTML } from './card_template';
import { GameState } from './game_state'

const gameState: GameState = {
    pointsPlayer1: 0,
    pointsPlayer2: 0,
    activePlayer: 1,
    openCards: [],
    gameField: createBoard(8)
}

const fieldRef = document.querySelector('#field');

init();

function init() {
    renderBoard();
    setupClickHandler();
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
            if (isGameOver()) {
                showEndScreen();
            }
            gameState.openCards = [];
        } else {
            setTimeout(() => {
                cleanOpenCards();
                gameState.activePlayer = gameState.activePlayer === 1 ? 2 : 1;
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

function showEndScreen() {
    if (gameState.pointsPlayer1 > gameState.pointsPlayer2) {
        console.log("Spieler 1 hat gewonnen");
    } else if (gameState.pointsPlayer2 > gameState.pointsPlayer1) {
        console.log("Spieler 2 hat gewonnen");
    } else {
        console.log("Unentschieden")
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