import type { Card } from './card';

/**
 * Number of a player: 1 = Blue, 2 = Orange.
 */
export type PlayerNumber = 1 | 2;

/**
 * All data that changes during a round.
 */
export interface GameState {
  pointsPlayer1: number;
  pointsPlayer2: number;
  activePlayer: PlayerNumber;
  openCards: Card[];
  gameField: Card[];
}
