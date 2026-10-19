import {Card} from './card';

export interface GameState{
    pointsPlayer1: number,
    pointsPlayer2: number, 
    activePlayer: 1 | 2,
    openCards: Card[], 
    gameField: Card[]
}