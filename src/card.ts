import {shuffle} from './shuffle'
import {svgLogos} from './assets/svgs';

export interface Card {
    image: string,
    hidden: boolean,
    found: boolean
}

// const cardImages: string[] = [
//     "img1",
//     "img2",
//     "img3",
//     "img4",
//     "img5",
//     "img6",
//     "img7",
//     "img8",
//     "img9",
//     "img10",
//     "img11",
//     "img12",
//     "img13",
//     "img14",
//     "img15",
//     "img16",
//     "img17",
//     "img18"
// ];

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
