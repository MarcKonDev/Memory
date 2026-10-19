import { shuffle } from './shuffle';
import { cardTemplate } from './card-template';

/**
 * A single card on the game field.
 */
export interface Card {
  image: string;
  hidden: boolean;
  found: boolean;
}

/**
 * Creates a hidden card with the given image.
 *
 * @param image - The SVG of the card motif
 * @returns A new card that is hidden and not found yet
 */
function createCard(image: string): Card {
  return { image, hidden: true, found: false };
}

/**
 * Creates a shuffled board with two cards for every motif.
 *
 * @param pairs - The number of pairs on the board
 * @param images - The motifs to choose from, the first `pairs` entries are used
 * @returns The shuffled list of cards
 */
export function createBoard(pairs: number, images: string[]): Card[] {
  const boardCards: Card[] = [];
  for (let index = 0; index < pairs; index++) {
    boardCards.push(createCard(images[index]), createCard(images[index]));
  }
  return shuffle(boardCards);
}

/**
 * Builds the HTML for all cards of the game field.
 *
 * @param boardCards - The cards of the board in their current order
 * @returns The HTML string with one button per card
 */
export function createCardsHTML(boardCards: Card[]): string {
  let renderedCards = '';
  for (let index = 0; index < boardCards.length; index++) {
    renderedCards += cardTemplate(boardCards[index], index);
  }
  return renderedCards;
}
