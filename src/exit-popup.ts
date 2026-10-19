const popupRef: HTMLDialogElement | null = document.querySelector<HTMLDialogElement>('.exit-popup');
const exitButtonRef: HTMLElement | null = document.querySelector<HTMLElement>('.header__exit .button');

/** Reagiert auf einen Klick im Popup: zurück ins Spiel oder das Spiel verlassen. */
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

/** Öffnet das Popup beim Klick auf "Exit game" und verbindet seine zwei Buttons. */
export function setupExitPopup(onExit: () => void): void {
  exitButtonRef?.addEventListener('click', () => popupRef?.showModal());
  popupRef?.addEventListener('click', (event: Event) => handlePopupClick(event, onExit));
}
