'use client';

import type { Locale } from '@edu/core';
import { StudentProvider } from '@edu/core/react';
import type { ReactNode } from 'react';
import { browserStorage, LOCALE_COOKIE } from '@/lib/storage';

const persistLocale = (locale: Locale) => {
  document.documentElement.lang = locale;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
};

export function Providers({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  return (
    <StudentProvider storage={browserStorage} initialLocale={initialLocale} onLocaleChange={persistLocale}>
      {children}
    </StudentProvider>
  );
}
