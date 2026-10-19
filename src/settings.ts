import { DEFAULT_THEME, getTheme } from './themes';
import type { PlayerNumber } from './game-state';

/**
 * The three choices from the settings screen.
 */
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

/**
 * Finds the selected radio button of a group.
 *
 * @param name - The `name` attribute of the radio group
 * @returns The checked radio, or `null` if nothing is selected yet
 */
function getCheckedInput(name: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
}

/**
 * Reads the text of an option from its surrounding label, for example "Code vibes theme".
 *
 * @param input - The radio button of the option
 * @returns The label text, or `null` if there is no option
 */
function getLabelText(input: HTMLInputElement | null): string | null {
  return input?.parentElement?.textContent?.trim() ?? null;
}

/**
 * Reads all three choices.
 *
 * @returns The settings, or `null` as long as one choice is missing
 */
function getSettings(): Settings | null {
  const theme = getCheckedInput('theme');
  const player = getCheckedInput('player');
  const size = getCheckedInput('size');
  if (!theme || !player || !size) {
    return null;
  }
  return { theme: theme.value, player: Number(player.value) as PlayerNumber, pairs: Number(size.value) };
}

/**
 * Sets the text of a summary item and animates it if the text has changed.
 *
 * @param item - The summary element
 * @param text - The new text
 */
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

/**
 * Writes the chosen options into the summary bar, or the placeholder if nothing is chosen.
 */
function renderSummary(): void {
  for (const item of summaryItems) {
    const name = item.dataset.summary ?? '';
    updateSummaryItem(item, getLabelText(getCheckedInput(name)) ?? PLACEHOLDERS[name]);
  }
}

/**
 * Shows the preview of the chosen theme, or the default theme while none is chosen.
 */
function renderPreview(): void {
  if (previewRef) {
    previewRef.src = getTheme(getCheckedInput('theme')?.value ?? DEFAULT_THEME).preview;
  }
}

/**
 * Finds the theme radio of the option the mouse is currently over.
 *
 * @param target - The element the mouse is over or leaves to
 * @returns The theme radio, or `null` if the mouse is not over a theme option
 */
function getThemeInput(target: EventTarget | null): HTMLInputElement | null {
  const option = (target as HTMLElement | null)?.closest('.settings__option');
  return option?.querySelector<HTMLInputElement>('input[name="theme"]') ?? null;
}

/**
 * Shows the preview of a theme while the mouse hovers over it.
 *
 * @param event - The `mouseover` event of the form
 */
function showHoveredPreview(event: MouseEvent): void {
  const input = getThemeInput(event.target);
  if (input && previewRef) {
    previewRef.src = getTheme(input.value).preview;
  }
}

/**
 * Shows the preview of the chosen theme again after the mouse has left a theme option.
 *
 * @param event - The `mouseout` event of the form
 */
function restorePreview(event: MouseEvent): void {
  if (!getThemeInput(event.relatedTarget)) {
    renderPreview();
  }
}

/**
 * Enables the start button as soon as all three choices are made.
 */
function updateStartButton(): void {
  if (startButtonRef) {
    startButtonRef.disabled = getSettings() === null;
  }
}

/**
 * Updates the summary bar, the preview and the start button to match the current choices.
 */
function renderSettings(): void {
  renderSummary();
  renderPreview();
  updateStartButton();
}

/**
 * Resets all choices, including the summary bar, the preview and the start button.
 */
export function resetSettings(): void {
  formRef?.reset();
  renderSettings();
}

/**
 * Connects the form and the start button to the game logic.
 *
 * @param onStart - Called with the chosen settings when the start button is clicked
 */
export function setupSettings(onStart: (settings: Settings) => void): void {
  formRef?.addEventListener('change', renderSettings);
  formRef?.addEventListener('mouseover', showHoveredPreview);
  formRef?.addEventListener('mouseout', restorePreview);
  startButtonRef?.addEventListener('click', () => {
    const settings = getSettings();
    if (settings) {
      onStart(settings);
    }
  });
  renderSettings();
}
