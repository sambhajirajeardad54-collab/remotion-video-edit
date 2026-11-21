'use client';

import { exams, getSubject, studyMaterials, type ExamId, type MaterialKind } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { BookMarked, FileText, Newspaper, Sigma } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge, Chips, PageHeader, WhenReady } from '@/components/ui';

type Filter = ExamId | 'all';
const kindIcons: Record<MaterialKind, typeof FileText> = {
  notes: FileText,
  pyq: BookMarked,
  'current-affairs': Newspaper,
  'formula-sheet': Sigma,
};

export default function MaterialPage() {
  return (
    <WhenReady>
      <Material />
    </WhenReady>
  );
}

function Material() {
  const { state, m, L, f } = useStudent();
  const [filter, setFilter] = useState<Filter>(state.targetExam);
  const [kind, setKind] = useState<MaterialKind | 'all'>('all');
  const items = studyMaterials.filter((s) => (filter === 'all' || s.examIds.includes(filter)) && (kind === 'all' || s.kind === kind));
  const kinds = Object.keys(m.material.kind) as MaterialKind[];

  return (
    <div className="stack-lg">
      <PageHeader title={m.material.title} subtitle={m.material.subtitle} />
      <Chips<Filter>
        label={m.material.title}
        value={filter}
        onChange={setFilter}
        options={[{ value: 'all', label: m.common.all }, ...exams.map((e) => ({ value: e.id, label: L(e.shortName) }))]}
      />
      <Chips<MaterialKind | 'all'>
        label={m.material.title}
        value={kind}
        onChange={setKind}
        options={[{ value: 'all', label: m.common.all }, ...kinds.map((k) => ({ value: k, label: m.material.kind[k] }))]}
      />
      <div className="grid-2">
        {items.map((s) => {
          const Icon = kindIcons[s.kind];
          return (
            <Link key={s.id} href={`/material/${s.id}`} className="card material-card" data-testid="material-card">
              <div className="material-icon">
                <Icon size={22} aria-hidden />
              </div>
              <div className="stack-xs">
                <div className="row-badges">
                  <Badge tone="primary">{m.material.kind[s.kind]}</Badge>
                  <Badge>{L(getSubject(s.subjectId).name)}</Badge>
                </div>
                <strong>{L(s.title)}</strong>
                <span className="muted small">{L(s.description)}</span>
                <span className="small muted">
                  {f(m.common.pages, { n: s.pages })} · {f(m.material.updated, { when: f(m.common.daysAgo, { n: s.updatedDaysAgo }) })}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
