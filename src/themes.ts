import { svgLogos } from './assets/svgs';
import { foodLogos } from './assets/foods';

export type ThemeName = 'code-vibes' | 'foods';

export interface Theme {
    name: ThemeName;
    cards: string[];
    preview: string;
    drawIcon: string;
    resetLabel: string;
}

export const DEFAULT_THEME: ThemeName = 'code-vibes';

const THEMES: Record<ThemeName, Theme> = {
    'code-vibes': {
        name: 'code-vibes',
        cards: svgLogos,
        preview: new URL('./assets/images/preview.svg', import.meta.url).href,
        drawIcon: new URL('./assets/images/draw.svg', import.meta.url).href,
        resetLabel: 'Back to start'
    },
    foods: {
        name: 'foods',
        cards: foodLogos,
        preview: new URL('./assets/images/food/preview.png', import.meta.url).href,
        drawIcon: new URL('./assets/images/food/draw.svg', import.meta.url).href,
        resetLabel: 'Home'
    }
};

/** Liefert das Theme zum Namen aus den Settings, bei unbekanntem Namen das Standard-Theme. */
export function getTheme(name: string): Theme {
    return name in THEMES ? THEMES[name as ThemeName] : THEMES[DEFAULT_THEME];
}
