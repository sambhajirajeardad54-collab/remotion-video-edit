'use client';

import { brand } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { BrandMark } from './Logo';
import { Badge } from './ui';

/** Branded shell for the sign-in / registration previews. Nothing inside is submitted. */
export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  const { m, L } = useStudent();
  return (
    <div className="auth narrow">
      <div className="auth-card card">
        <div className="auth-brand">
          <BrandMark size={64} />
          <strong className="auth-name">{L(brand.name)}</strong>
          <span className="tagline">{L(brand.tagline)}</span>
        </div>
        <div className="auth-body">
          <div className="row gap">
            <h1 className="h2">{title}</h1>
            <Badge tone="accent">{m.auth.preview}</Badge>
          </div>
          <p className="muted">{subtitle}</p>
          {/* noValidate + preventDefault: preview only, the form never submits anywhere. */}
          <form className="stack" noValidate onSubmit={(e) => e.preventDefault()}>
            {children}
          </form>
          <p className="note" data-testid="auth-preview-note">
            <Info size={16} aria-hidden /> {m.auth.previewNote}
          </p>
          <div className="auth-footer small">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, error, children, htmlFor }: { label: string; error?: string | null; children: ReactNode; htmlFor: string }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <span className="field-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
