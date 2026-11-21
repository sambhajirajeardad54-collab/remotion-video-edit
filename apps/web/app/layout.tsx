import type { Locale } from '@edu/core';
import { brand } from '@edu/core';
import { toCssVariables } from '@edu/design';
import type { Metadata, Viewport } from 'next';
import { Mukta } from 'next/font/google';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';
import { Providers } from '@/components/Providers';
import { LOCALE_COOKIE } from '@/lib/storage';
import './globals.css';

// Mukta covers both Devanagari and Latin, so Marathi and English share one typeface.
const mukta = Mukta({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: `${brand.name.en} — MPSC Group C, Group D & DMER`, template: `%s · ${brand.name.en}` },
  description: brand.tagline.en,
};

export const viewport: Viewport = {
  themeColor: '#0A1A3F',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale: Locale = cookieLocale === 'en' ? 'en' : 'mr';

  return (
    <html lang={locale} className={mukta.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: toCssVariables() }} />
      </head>
      <body>
        <Providers initialLocale={locale}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
