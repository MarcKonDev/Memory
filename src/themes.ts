import { svgLogos } from './assets/svgs';
import { foodLogos } from './assets/foods';

/**
 * Names of the finished themes (values of the theme radios in the settings).
 */
export type ThemeName = 'code-vibes' | 'foods';

/**
 * Everything that differs between the themes and cannot be solved with CSS alone.
 */
export interface Theme {
  name: ThemeName;
  cards: string[];
  preview: string;
  drawIcon: string;
  resetLabel: string;
  backLabel: string;
}

/**
 * The theme that is used when no other theme is chosen.
 */
export const DEFAULT_THEME: ThemeName = 'code-vibes';

const THEMES: Record<ThemeName, Theme> = {
  'code-vibes': {
    name: 'code-vibes',
    cards: svgLogos,
    preview: new URL('./assets/images/preview.svg', import.meta.url).href,
    drawIcon: new URL('./assets/images/draw.svg', import.meta.url).href,
    resetLabel: 'Back to start',
    backLabel: 'Back to game'
  },
  foods: {
    name: 'foods',
    cards: foodLogos,
    preview: new URL('./assets/images/food/preview.png', import.meta.url).href,
    drawIcon: new URL('./assets/images/food/draw.svg', import.meta.url).href,
    resetLabel: 'Home',
    backLabel: 'No, back to game'
  }
};

/**
 * Finds the theme for a name from the settings.
 *
 * @param name - The name of the theme, for example `foods`
 * @returns The matching theme, or the default theme if the name is unknown
 */
export function getTheme(name: string): Theme {
  return name in THEMES ? THEMES[name as ThemeName] : THEMES[DEFAULT_THEME];
}
