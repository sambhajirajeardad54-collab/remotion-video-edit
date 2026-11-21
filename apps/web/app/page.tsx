'use client';

import {
  buildDashboard,
  dayPart,
  exams,
  formatDate,
  formatShortDate,
  formatTime,
  lessonCount,
  sampleStudent,
  type ExamId,
} from '@edu/core';
import { useStudent } from '@edu/core/react';
import { ArrowRight, BookOpenCheck, CalendarClock, Flame, Megaphone, PlayCircle, Target, Timer, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Badge, Card, Chips, ExamBadge, ProgressBar, ProgressRing, SectionHeader, StatTile, WhenReady } from '@/components/ui';

export default function DashboardPage() {
  return (
    <WhenReady>
      <Dashboard />
    </WhenReady>
  );
}

function Dashboard() {
  const { state, dispatch, m, L, f, locale } = useStudent();
  const today = useMemo(() => new Date(), []);
  const d = useMemo(() => buildDashboard(state, today), [state, today]);

  const when = (days: number) => (days === 0 ? m.common.today : days === 1 ? m.common.tomorrow : f(m.common.inDays, { n: days }));
  const firstName = L(sampleStudent.name).split(' ')[0];

  return (
    <div className="stack-lg" data-testid="dashboard">
      <section className="hero">
        <div className="hero-main">
          <p className="hero-date">{formatDate(today, locale, true)}</p>
          <h1>
            {m.greeting[dayPart(today)]}, {firstName}
          </h1>
          <p className="hero-sub">
            <Target size={16} aria-hidden /> {f(m.dashboard.target, { exam: L(d.exam.name) })}
          </p>
          <Chips<ExamId>
            label={m.profile.targetExam}
            value={state.targetExam}
            onChange={(examId) => dispatch({ type: 'setTargetExam', examId })}
            options={exams.map((e) => ({ value: e.id, label: L(e.shortName) }))}
          />
          <div className="hero-streak">
            <Flame size={18} aria-hidden />
            {d.streak > 0 ? f(m.dashboard.streak, { n: d.streak }) : m.dashboard.streakNone}
          </div>
        </div>
        {d.continueWith?.next ? (
          <Link href={`/courses/${d.continueWith.course.id}`} className="hero-card" data-testid="continue-card">
            <span className="eyebrow">{m.dashboard.upNext}</span>
            <strong className="hero-card-title">{L(d.continueWith.next.lesson.title)}</strong>
            <span className="hero-card-meta">
              {L(d.continueWith.course.title)} · {d.continueWith.next.lesson.durationMin} {m.common.min}
            </span>
            <ProgressBar value={d.continueWith.progress} label={L(d.continueWith.course.title)} />
            <span className="hero-card-cta">
              <PlayCircle size={18} aria-hidden /> {m.common.continue}
            </span>
          </Link>
        ) : null}
      </section>

      <section className="stats">
        <StatTile icon={<BookOpenCheck size={20} />} label={m.dashboard.statProgress} value={`${d.overallProgress}%`} />
        <StatTile icon={<PlayCircle size={20} />} label={m.dashboard.statLessons} value={String(d.lessonsDone)} />
        <StatTile icon={<Trophy size={20} />} label={m.dashboard.statTests} value={String(d.testsTaken)} />
        <StatTile icon={<Target size={20} />} label={m.dashboard.statAccuracy} value={d.averageAccuracy === null ? '—' : `${d.averageAccuracy}%`} />
      </section>

      <div className="grid-dashboard">
        <div className="stack-lg">
          <section>
            <SectionHeader title={m.dashboard.continueLearning} href="/courses" action={m.common.viewAll} />
            <div className="stack">
              {d.enrolled.map(({ course, progress, next }) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="card course-row">
                  <ProgressRing value={progress} size={64} stroke={7} />
                  <div className="course-row-body">
                    <div className="row-badges">
                      {course.examIds.map((id) => (
                        <ExamBadge key={id} examId={id} />
                      ))}
                    </div>
                    <strong>{L(course.title)}</strong>
                    <span className="muted small">
                      {next ? `${m.dashboard.upNext}: ${L(next.lesson.title)}` : m.dashboard.allDone} · {f(m.common.lessons, { n: lessonCount(course) })}
                    </span>
                  </div>
                  <ArrowRight className="row-arrow" size={18} aria-hidden />
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title={m.dashboard.practiceNow} href="/tests" action={m.common.viewAll} />
            <div className="grid-2">
              {d.practice.slice(0, 4).map((t) => (
                <Link key={t.id} href={`/tests/${t.id}`} className="card practice-card">
                  <Timer size={20} className="accent-icon" aria-hidden />
                  <strong>{L(t.title)}</strong>
                  <span className="muted small">
                    {f(m.common.questions, { n: t.totalQuestions })} · {t.durationMin} {m.common.min}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title={m.dashboard.recentResults} />
            {d.recent.length === 0 ? (
              <Card className="empty-card">{m.dashboard.noResults}</Card>
            ) : (
              <div className="stack">
                {d.recent.map(({ test, attempt, result }) => (
                  <Card key={attempt.submittedAt} className="result-row">
                    <div>
                      <strong>{L(test.title)}</strong>
                      <span className="muted small">{formatDate(new Date(attempt.submittedAt), locale)}</span>
                    </div>
                    <div className="result-score">
                      <strong>
                        {result.score}/{result.maxScore}
                      </strong>
                      <Badge tone={result.percentage >= 60 ? 'success' : result.percentage >= 40 ? 'accent' : 'danger'}>{result.percentage}%</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="stack-lg">
          <section>
            <SectionHeader title={m.dashboard.upcomingTests} href="/tests" action={m.common.viewAll} />
            <Card className="list-card">
              {d.upcoming.map(({ test, date, daysAway }) => (
                <div key={test.id} className="list-item">
                  <div className="date-tile">
                    <strong>{date.getDate()}</strong>
                    <span>{formatShortDate(date, locale).split(',')[0]}</span>
                  </div>
                  <div className="list-item-body">
                    <strong>{L(test.title)}</strong>
                    <span className="muted small">
                      <CalendarClock size={14} aria-hidden /> {when(daysAway)}, {formatTime(test.startTime ?? '10:00', locale)} · {f(m.common.questions, { n: test.totalQuestions })}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </section>

          <section>
            <SectionHeader title={m.dashboard.announcements} />
            <div className="stack">
              {d.announcements.map((a) => (
                <Card key={a.id} className={`announcement ${a.tone === 'accent' ? 'announcement-accent' : ''}`}>
                  <Megaphone size={18} aria-hidden className="accent-icon" />
                  <div>
                    <strong>{L(a.title)}</strong>
                    <p className="muted small">{L(a.body)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title={m.dashboard.examFocus} />
            <Card className="exam-focus">
              <ExamBadge examId={d.exam.id} />
              <strong>{L(d.exam.name)}</strong>
              <span className="muted small">{L(d.exam.conductingBody)}</span>
              <ul className="ticks">
                {d.exam.pattern.map((p) => (
                  <li key={p.en}>{L(p)}</li>
                ))}
              </ul>
              <div className="row-badges">
                {d.exam.samplePosts.map((p) => (
                  <Badge key={p.en}>{L(p)}</Badge>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>

      {d.recommended.length > 0 ? (
        <section>
          <SectionHeader title={m.dashboard.recommended} href="/courses" action={m.common.viewAll} />
          <div className="grid-3">
            {d.recommended.slice(0, 3).map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="card rec-card">
                <Badge tone="primary">{m.courses.level[c.level]}</Badge>
                <strong>{L(c.title)}</strong>
                <span className="muted small">{L(c.subtitle)}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
