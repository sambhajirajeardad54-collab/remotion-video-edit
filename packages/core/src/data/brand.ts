import type { Localized } from '../types';

/**
 * Institute branding. "Pragati Academy" is a placeholder —
 * change it here and both apps pick it up.
 */
export const brand = {
  name: { en: 'Pragati Academy', mr: 'प्रगती अकॅडमी' } satisfies Localized,
  shortName: { en: 'Pragati', mr: 'प्रगती' } satisfies Localized,
  tagline: {
    en: 'Focused preparation for Maharashtra government recruitment',
    mr: 'महाराष्ट्र शासकीय भरतीसाठी नेमकी तयारी',
  } satisfies Localized,
  city: { en: 'Pune, Maharashtra', mr: 'पुणे, महाराष्ट्र' } satisfies Localized,
};
