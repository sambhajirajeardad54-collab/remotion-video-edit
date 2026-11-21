'use client';

import { attemptsFor, bestPercentage, exams, formatShortDate, formatTime, mockTests, scheduledTests, type ExamId } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { CalendarClock, Lock, Timer } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge, Card, Chips, ExamBadge, PageHeader, SectionHeader, WhenReady } from '@/components/ui';

type Filter = ExamId | 'all';

export default function TestsPage() {
  return (
    <WhenReady>
      <Tests />
    </WhenReady>
  );
}

function Tests() {
  const { state, m, L, f, locale } = useStudent();
  const [filter, setFilter] = useState<Filter>(state.targetExam);
  const today = useMemo(() => new Date(), []);
  const match = (ids: ExamId[]) => filter === 'all' || ids.includes(filter);
  const practice = mockTests.filter((t) => t.status === 'available' && match(t.examIds));
  const upcoming = scheduledTests(today).filter((s) => match(s.test.examIds));

  return (
    <div className="stack-lg">
      <PageHeader title={m.tests.title} subtitle={m.tests.subtitle} />
      <Chips<Filter>
        label={m.tests.title}
        value={filter}
        onChange={setFilter}
        options={[{ value: 'all', label: m.common.all }, ...exams.map((e) => ({ value: e.id, label: L(e.shortName) }))]}
      />

      <section>
        <SectionHeader title={m.tests.available} />
        <div className="grid-2">
          {practice.map((t) => {
            const best = bestPercentage(t, state.attempts);
            const count = attemptsFor(t.id, state.attempts).length;
            return (
              <Card key={t.id} className="test-card" data-testid="test-card">
                <div className="row-badges">
                  {t.examIds.map((id) => (
                    <ExamBadge key={id} examId={id} />
                  ))}
                </div>
                <strong className="course-title">{L(t.title)}</strong>
                <span className="muted small">{L(t.description)}</span>
                <div className="meta-row">
                  <span>{f(m.common.questions, { n: t.totalQuestions })}</span>
                  <span>
                    <Timer size={14} aria-hidden /> {t.durationMin} {m.common.min}
                  </span>
                  <span>{f(m.common.marks, { n: t.totalQuestions * t.marksPerQuestion })}</span>
                </div>
                <div className="test-card-foot">
                  <span className="small muted">{t.negativeMarks > 0 ? f(m.tests.negative, { n: t.negativeMarks }) : m.tests.noNegative}</span>
                  {best !== null ? (
                    <Badge tone="success">
                      {f(m.tests.best, { n: best })} · {f(m.tests.attempts, { n: count })}
                    </Badge>
                  ) : null}
                </div>
                <Link href={`/tests/${t.id}`} className="btn btn-primary">
                  {count > 0 ? m.tests.retake : m.tests.start}
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title={m.tests.scheduled} />
        <div className="grid-2">
          {upcoming.map(({ test, date }) => (
            <Card key={test.id} className="test-card test-card-locked">
              <div className="row-badges">
                {test.examIds.map((id) => (
                  <ExamBadge key={id} examId={id} />
                ))}
                <Badge tone="accent">
                  <Lock size={12} aria-hidden /> {m.tests.remind}
                </Badge>
              </div>
              <strong className="course-title">{L(test.title)}</strong>
              <span className="muted small">{L(test.description)}</span>
              <div className="meta-row">
                <span>
                  <CalendarClock size={14} aria-hidden />{' '}
                  {f(m.tests.opensOn, { date: formatShortDate(date, locale), time: formatTime(test.startTime ?? '10:00', locale) })}
                </span>
              </div>
              <div className="meta-row">
                <span>{f(m.common.questions, { n: test.totalQuestions })}</span>
                <span>
                  {test.durationMin} {m.common.min}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
