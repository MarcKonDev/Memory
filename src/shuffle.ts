import type { Card } from './card';

/** Mischt die Karten zufällig (Fisher-Yates) und gibt dieselbe Liste zurück. */
export function shuffle(cards: Card[]): Card[] {
  for (let index = cards.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }
  return cards;
}
