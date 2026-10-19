import type { Card } from './card';

/** Nummer eines Spielers: 1 = Blue, 2 = Orange. */
export type PlayerNumber = 1 | 2;

/** Alle Daten, die sich während einer Runde ändern. */
export interface GameState {
  pointsPlayer1: number;
  pointsPlayer2: number;
  activePlayer: PlayerNumber;
  openCards: Card[];
  gameField: Card[];
}
