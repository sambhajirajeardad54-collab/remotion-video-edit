import type { Localized } from '../types';

/**
 * Official branding: लक्ष्य Academy (Lakshya Academy).
 * Both apps read the name and tagline from here.
 */
export const brand = {
  /** Wordmark: the official mixed-script form in Marathi, romanised in English. */
  name: { en: 'Lakshya Academy', mr: 'लक्ष्य Academy' } satisfies Localized,
  shortName: { en: 'Lakshya', mr: 'लक्ष्य' } satisfies Localized,
  /** Official tagline (Marathi) with an English rendering for the English UI. */
  tagline: { en: 'Your goal, our guidance!', mr: 'ध्येय तुमचे, मार्गदर्शन आमचे!' } satisfies Localized,
  city: { en: 'Pune, Maharashtra', mr: 'पुणे, महाराष्ट्र' } satisfies Localized,
};

/** Android launcher name (fixed, not translated). */
export const APP_DISPLAY_NAME = 'Lakshya Academy';
