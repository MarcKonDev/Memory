import { shuffle } from './shuffle';

/** Eine Karte auf dem Spielfeld. */
export interface Card {
  image: string;
  hidden: boolean;
  found: boolean;
}

/** Erstellt eine verdeckte Karte mit dem gegebenen Motiv. */
function createCard(image: string): Card {
  return { image, hidden: true, found: false };
}

/** Erstellt ein gemischtes Spielfeld mit je zwei Karten pro Motiv. */
export function createBoard(pairs: number, images: string[]): Card[] {
  const boardCards: Card[] = [];
  for (let index = 0; index < pairs; index++) {
    boardCards.push(createCard(images[index]), createCard(images[index]));
  }
  return shuffle(boardCards);
}
