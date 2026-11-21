'use client';

import { examColors } from '@edu/design';
import type { ExamId } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { getExam } from '@edu/core';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

export function Card({ children, className = '', ...rest }: ComponentProps<'div'>) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, href, action }: { title: string; href?: string; action?: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {href && action ? (
        <Link href={href} className="link">
          {action} →
        </Link>
      ) : null}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'primary' | 'success' | 'danger' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function ExamBadge({ examId }: { examId: ExamId }) {
  const { L } = useStudent();
  return (
    <span className="badge exam-badge" style={{ color: examColors[examId], borderColor: examColors[examId] }}>
      {L(getExam(examId).shortName)}
    </span>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 96, stroke = 9, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-primary-soft)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-label">
        <strong>{v}%</strong>
        {label ? <span>{label}</span> : null}
      </div>
    </div>
  );
}

export function StatTile({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
      </div>
      {children}
    </header>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`chip ${value === o.value ? 'chip-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Renders a skeleton until persisted student state is loaded (avoids hydration flicker). */
export function WhenReady({ children }: { children: ReactNode }) {
  const { ready } = useStudent();
  if (!ready) {
    return (
      <div className="skeleton-stack" aria-busy="true">
        <div className="skeleton" style={{ height: 160 }} />
        <div className="skeleton" style={{ height: 88 }} />
        <div className="skeleton" style={{ height: 220 }} />
      </div>
    );
  }
  return <>{children}</>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
