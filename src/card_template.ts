import {Card} from './card';


export function createCardsHTML(boardCards:Card[]):string{
    let renderedCards = "";
    for (let index = 0; index < boardCards.length; index++) {
        const card = boardCards[index];
        let buildCard = cardTemplate(card, index);
        renderedCards += buildCard;
    }
    return renderedCards;
}

function cardTemplate(card:Card, index:number):string {
    return `
        <button class="card ${card.hidden ? "" : "is-flipped"}" type="button" data-index ="${index}">
            <div class="card__inner">
                <div class="card__face"></div>
                <div class="card__face card__face--back">
                    ${card.image}
                </div>
            </div>
        </button>`
}