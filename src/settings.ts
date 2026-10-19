import { DEFAULT_THEME, getTheme } from './themes';
import type { PlayerNumber } from './game-state';

/** Die drei Auswahlen aus den Settings. */
export interface Settings {
  theme: string;
  player: PlayerNumber;
  pairs: number;
}

const SUMMARY_ANIMATION_MS = 200;
const formRef: HTMLFormElement | null = document.querySelector<HTMLFormElement>('.settings__form');
const startButtonRef: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('.settings__start');
const summaryItems: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('[data-summary]');
const previewRef: HTMLImageElement | null = document.querySelector<HTMLImageElement>('.settings__preview');
const PLACEHOLDERS: Record<string, string> = {
  theme: 'Game theme',
  player: 'Player',
  size: 'Board size'
};

/** Liefert das gewählte Radio einer Gruppe oder null, wenn noch nichts gewählt ist. */
function getCheckedInput(name: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
}

/** Liest den Text einer Option aus dem umschließenden Label (z.B. "Code vibes theme"). */
function getLabelText(input: HTMLInputElement | null): string | null {
  return input?.parentElement?.textContent?.trim() ?? null;
}

/** Liest alle drei Auswahlen. Gibt null zurück, solange eine fehlt. */
function getSettings(): Settings | null {
  const theme = getCheckedInput('theme');
  const player = getCheckedInput('player');
  const size = getCheckedInput('size');
  if (!theme || !player || !size) {
    return null;
  }
  return { theme: theme.value, player: Number(player.value) as PlayerNumber, pairs: Number(size.value) };
}

/** Setzt den Text eines Leisten-Eintrags und animiert ihn, wenn er sich geändert hat. */
function updateSummaryItem(item: HTMLElement, text: string): void {
  if (item.textContent === text) {
    return;
  }
  item.textContent = text;
  item.animate(
    [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: SUMMARY_ANIMATION_MS, easing: 'ease-out' }
  );
}

/** Schreibt die gewählten Optionen in die Leiste, sonst den Platzhalter. */
function renderSummary(): void {
  for (const item of summaryItems) {
    const name = item.dataset.summary ?? '';
    updateSummaryItem(item, getLabelText(getCheckedInput(name)) ?? PLACEHOLDERS[name]);
  }
}

/** Zeigt die Vorschau des gewählten Themes, solange keins gewählt ist die des Standard-Themes. */
function renderPreview(): void {
  if (previewRef) {
    previewRef.src = getTheme(getCheckedInput('theme')?.value ?? DEFAULT_THEME).preview;
  }
}

/** Gibt den Start-Button frei, sobald alle drei Auswahlen getroffen sind. */
function updateStartButton(): void {
  if (startButtonRef) {
    startButtonRef.disabled = getSettings() === null;
  }
}

/** Aktualisiert Leiste, Vorschau und Start-Button passend zur aktuellen Auswahl. */
function renderSettings(): void {
  renderSummary();
  renderPreview();
  updateStartButton();
}

/** Setzt alle Auswahlen zurück (Radios, Leiste, Vorschau und Start-Button). */
export function resetSettings(): void {
  formRef?.reset();
  renderSettings();
}

/** Verbindet das Formular und den Start-Button mit der Spiellogik. */
export function setupSettings(onStart: (settings: Settings) => void): void {
  formRef?.addEventListener('change', renderSettings);
  startButtonRef?.addEventListener('click', () => {
    const settings = getSettings();
    if (settings) {
      onStart(settings);
    }
  });
  renderSettings();
}
