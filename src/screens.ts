export type ScreenName = "game" | "game-over" | "winner" | "draw";

const screens = document.querySelectorAll('.screen');

export function showScreen(screenName:ScreenName):void{
    for (const screen of screens){
        screen.classList.toggle('is-hidden', !screen.classList.contains(screenName))
    }
}