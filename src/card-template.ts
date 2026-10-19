import type { Card } from './card';

/**
 * Builds the HTML of a single card, flipped if it is not hidden anymore.
 *
 * @param card - The card to render
 * @param index - The position of the card on the board (stored in `data-index`)
 * @returns The HTML string of the card button
 */
export function cardTemplate(card: Card, index: number): string {
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