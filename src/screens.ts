const SLIDE_IN_MS = 500;
const SCREENS: NodeListOf<HTMLElement> = document.querySelectorAll('.screen');

/**
 * Names of all screens, equal to the second CSS class of each section.
 */
export type ScreenName = 'game' | 'game-over' | 'winner' | 'draw' | 'home' | 'settings';

/**
 * Shows exactly one screen and hides all others.
 *
 * @param screenName - The screen to show
 */
export function showScreen(screenName: ScreenName): void {
  for (const screen of SCREENS) {
    screen.classList.toggle('is-hidden', !screen.classList.contains(screenName));
  }
}

/**
 * Slides a screen in from the top, like a card pushed over the previous screen.
 * The previous screen stays visible until the animation has finished.
 *
 * @param screenName - The screen that slides in
 */
export function slideInScreen(screenName: ScreenName): void {
  const screen = document.querySelector<HTMLElement>(`.screen.${screenName}`);
  if (!screen) {
    return;
  }
  screen.classList.remove('is-hidden');
  screen.classList.add('is-sliding-in');
  const animation = screen.animate(
    [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }],
    { duration: SLIDE_IN_MS, easing: 'ease-out' }
  );
  animation.finished.then(() => finishSlideIn(screen, screenName));
}

/**
 * Ends the slide-in: the screen becomes a normal screen and all others are hidden.
 *
 * @param screen - The screen element that has slid in
 * @param screenName - The name of that screen
 */
function finishSlideIn(screen: HTMLElement, screenName: ScreenName): void {
  screen.classList.remove('is-sliding-in');
  showScreen(screenName);
}
