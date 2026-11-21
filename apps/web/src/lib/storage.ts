import type { KeyValueStorage } from '@edu/core/react';

/** localStorage wrapped in the async interface shared with the mobile app. */
export const browserStorage: KeyValueStorage = {
  async getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Private mode or quota exceeded: progress simply isn't persisted.
    }
  },
};

export const LOCALE_COOKIE = 'edu-locale';
