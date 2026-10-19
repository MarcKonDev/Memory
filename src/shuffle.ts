import type { Card } from './card';

/**
 * Shuffles the cards randomly (Fisher-Yates) and returns the same list.
 *
 * @param cards - The cards to shuffle, the list is changed in place
 * @returns The shuffled list
 */
export function shuffle(cards: Card[]): Card[] {
  for (let index = cards.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }
  return cards;
}
