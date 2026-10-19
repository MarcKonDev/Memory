import type { Card } from './card';

/** Baut das HTML einer einzelnen Karte (umgedreht, wenn sie nicht mehr verdeckt ist). */
function cardTemplate(card: Card, index: number): string {
  return `
    <button class="card ${card.hidden ? '' : 'is-flipped'}" type="button" data-index="${index}">
      <div class="card__inner">
        <div class="card__face"></div>
        <div class="card__face card__face--back">
          ${card.image}
        </div>
      </div>
    </button>`;
}

/** Baut das HTML für alle Karten des Spielfelds. */
export function createCardsHTML(boardCards: Card[]): string {
  let renderedCards = '';
  for (let index = 0; index < boardCards.length; index++) {
    renderedCards += cardTemplate(boardCards[index], index);
  }
  return renderedCards;
}
