import {shuffle} from './shuffle'

export interface Card {
    image: string,
    hidden: boolean,
    found: boolean
}

export function createBoard(amount: number, images: string[]):Card[] {
    const boardCards: Card[] = [];
    for (let i = 0; i < amount; i++) {
        boardCards.push({
            image: images[i],
            hidden: true,
            found: false
        }, {
            image: images[i],
            hidden: true,
            found: false
        });
    }
    return shuffle(boardCards); 
}
