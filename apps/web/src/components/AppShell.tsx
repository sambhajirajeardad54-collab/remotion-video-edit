'use client';

import { brand, sampleStudent } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { BookOpen, ClipboardCheck, FileText, House, Languages, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Wordmark } from './Logo';

const NAV = [
  { href: '/', key: 'home', Icon: House },
  { href: '/courses', key: 'courses', Icon: BookOpen },
  { href: '/tests', key: 'tests', Icon: ClipboardCheck },
  { href: '/material', key: 'material', Icon: FileText },
  { href: '/profile', key: 'profile', Icon: UserRound },
] as const;

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const { m, L, locale, dispatch } = useStudent();
  const toggleLocale = () => dispatch({ type: 'setLocale', locale: locale === 'mr' ? 'en' : 'mr' });
  const initials = L(sampleStudent.name)
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Main">
        <Link href="/" className="brand-link" aria-label={L(brand.name)}>
          <Wordmark size={40} subtitle="MPSC · DMER" />
        </Link>
        <nav className="side-nav">
          {NAV.map(({ href, key, Icon }) => (
            <Link key={href} href={href} className={`side-link ${isActive(pathname, href) ? 'active' : ''}`} aria-current={isActive(pathname, href) ? 'page' : undefined}>
              <Icon size={20} strokeWidth={2} aria-hidden />
              <span>{m.nav[key]}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="tagline">{L(brand.tagline)}</span>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <Link href="/" className="brand-link brand-compact" aria-label={L(brand.name)}>
            <Wordmark size={34} />
          </Link>
          <div className="topbar-actions">
            <button type="button" className="lang-toggle" onClick={toggleLocale} aria-label={`Switch language to ${m.common.switchLanguage}`} data-testid="lang-toggle">
              <Languages size={18} aria-hidden />
              <span>{m.common.switchLanguage}</span>
            </button>
            <Link href="/profile" className="avatar" aria-label={m.nav.profile}>
              {initials}
            </Link>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>

      <nav className="bottom-nav" aria-label="Main">
        {NAV.map(({ href, key, Icon }) => (
          <Link key={href} href={href} className={`bottom-link ${isActive(pathname, href) ? 'active' : ''}`} aria-current={isActive(pathname, href) ? 'page' : undefined}>
            <Icon size={22} strokeWidth={2} aria-hidden />
            <span>{key === 'material' ? m.nav.materialShort : m.nav[key]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
