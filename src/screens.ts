/** Namen aller Screens, entsprechen der zweiten CSS-Klasse der Sections. */
export type ScreenName = 'game' | 'game-over' | 'winner' | 'draw' | 'home' | 'settings';

const screens: NodeListOf<HTMLElement> = document.querySelectorAll('.screen');

/** Zeigt genau einen Screen und blendet alle anderen aus. */
export function showScreen(screenName: ScreenName): void {
  for (const screen of screens) {
    screen.classList.toggle('is-hidden', !screen.classList.contains(screenName));
  }
}
