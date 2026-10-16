import {shuffle} from './shuffle'
import {svgLogos} from './assets/svgs';


export interface Card {
    image: string,
    hidden: boolean,
    found: boolean
}

export function createBoard(amount: number):Card[] {
    const boardCards: Card[] = [];
    for (let i = 0; i < amount; i++) {
        boardCards.push({
            image: svgLogos[i],
            hidden: true,
            found: false
        }, {
            image: svgLogos[i],
            hidden: true,
            found: false
        });
    }
    return shuffle(boardCards); 
}
