const popupRef: HTMLDialogElement | null = document.querySelector<HTMLDialogElement>('.exit-popup');
const exitButtonRef: HTMLElement | null = document.querySelector<HTMLElement>('.header__exit .button');

/**
 * Reacts to a click inside the popup: back to the game or leave the game.
 *
 * @param event - The click event on the popup
 * @param onExit - Called when the player confirms to leave the game
 */
function handlePopupClick(event: Event, onExit: () => void): void {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-popup]');
  if (!button) {
    return;
  }
  popupRef?.close();
  if (button.dataset.popup === 'exit') {
    onExit();
  }
}

/**
 * Opens the popup when "Exit game" is clicked and connects its two buttons.
 *
 * @param onExit - Called when the player confirms to leave the game
 */
export function setupExitPopup(onExit: () => void): void {
  exitButtonRef?.addEventListener('click', () => popupRef?.showModal());
  popupRef?.addEventListener('click', (event: Event) => handlePopupClick(event, onExit));
}
