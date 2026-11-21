'use client';

import { getExam, getStudyMaterial, getSubject } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge, Card, EmptyState, ExamBadge, WhenReady } from '@/components/ui';

export default function MaterialDetailPage() {
  return (
    <WhenReady>
      <MaterialDetail />
    </WhenReady>
  );
}

function MaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const { m, L, f } = useStudent();
  const item = getStudyMaterial(id);
  if (!item) return <EmptyState>{m.material.notFound}</EmptyState>;

  return (
    <div className="stack-lg narrow">
      <Link href="/material" className="back-link">
        <ArrowLeft size={16} aria-hidden /> {m.nav.material}
      </Link>
      <Card className="stack">
        <div className="row-badges">
          <Badge tone="primary">{m.material.kind[item.kind]}</Badge>
          <Badge>{L(getSubject(item.subjectId).name)}</Badge>
          {item.examIds.map((e) => (
            <ExamBadge key={getExam(e).id} examId={e} />
          ))}
        </div>
        <h1>{L(item.title)}</h1>
        <p className="muted">{L(item.description)}</p>
        <p className="small muted">
          {f(m.common.pages, { n: item.pages })} · {f(m.material.updated, { when: f(m.common.daysAgo, { n: item.updatedDaysAgo }) })}
        </p>
        <h2 className="h3">{m.material.keyPoints}</h2>
        <ul className="ticks">
          {item.highlights.map((h) => (
            <li key={h.en}>{L(h)}</li>
          ))}
        </ul>
        <button type="button" className="btn btn-outline" disabled>
          <Download size={16} aria-hidden /> {m.material.download}
        </button>
      </Card>
    </div>
  );
}
