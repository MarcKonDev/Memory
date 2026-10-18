const POPUP = document.querySelector<HTMLDialogElement>('.exit-popup');
const EXIT_BUTTON = document.querySelector('.header__exit .button');

/** Reagiert auf einen Klick im Popup: zurück ins Spiel oder das Spiel verlassen. */
function handlePopupClick(event: Event, onExit: () => void): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-popup]');
    if (!button) {
        return;
    }
    POPUP?.close();
    if (button.dataset.popup === 'exit') {
        onExit();
    }
}

/** Öffnet das Popup beim Klick auf "Exit game" und verbindet seine zwei Buttons. */
export function setupExitPopup(onExit: () => void): void {
    EXIT_BUTTON?.addEventListener('click', () => POPUP?.showModal());
    POPUP?.addEventListener('click', event => handlePopupClick(event, onExit));
}
