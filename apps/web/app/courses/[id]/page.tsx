'use client';

import { courseProgress, formatIndianNumber, formatInr, getCourse, lessonCount, nextLesson, totalMinutes } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { ArrowLeft, Check, CheckCircle2, Circle, FileText, HelpCircle, Info, PlayCircle, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BrandMark } from '@/components/Logo';
import { Badge, Card, EmptyState, ExamBadge, ProgressRing, WhenReady } from '@/components/ui';

const kindIcon = { video: PlayCircle, notes: FileText, quiz: HelpCircle } as const;

export default function CourseDetailPage() {
  return (
    <WhenReady>
      <CourseDetail />
    </WhenReady>
  );
}

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, m, L, f } = useStudent();
  const course = getCourse(id);
  if (!course) return <EmptyState>{m.courses.notFound}</EmptyState>;

  const enrolled = state.enrolledCourseIds.includes(course.id);
  const done = state.completedLessons[course.id] ?? [];
  const progress = courseProgress(course, done);
  const next = nextLesson(course, done);
  const hours = Math.round(totalMinutes(course) / 60);

  return (
    <div className="stack-lg">
      <Link href="/courses" className="back-link">
        <ArrowLeft size={16} aria-hidden /> {m.nav.courses}
      </Link>

      <section className="course-hero">
        <div className="hero-watermark" aria-hidden>
          <BrandMark size={220} tile={false} />
        </div>
        <div className="stack">
          <div className="row-badges">
            {course.examIds.map((eid) => (
              <ExamBadge key={eid} examId={eid} />
            ))}
            <Badge tone="accent">{m.courses.level[course.level]}</Badge>
            <Badge>{m.courses.teaching[course.teachingLanguage]}</Badge>
          </div>
          <h1>{L(course.title)}</h1>
          <p className="lead">{L(course.description)}</p>
          <div className="meta-row on-dark">
            <span>
              <Star size={14} aria-hidden /> {f(m.courses.rating, { n: course.rating })}
            </span>
            <span>
              <Users size={14} aria-hidden /> {f(m.common.learners, { n: formatIndianNumber(course.learners) })}
            </span>
            <span>{f(m.common.weeks, { n: course.durationWeeks })}</span>
            <span>
              {f(m.common.lessons, { n: lessonCount(course) })} · {hours}h
            </span>
          </div>
          <div className="instructor">
            <span className="avatar avatar-lg">{L(course.instructor.name).split(' ').slice(-1)[0]?.slice(0, 1)}</span>
            <div>
              <span className="eyebrow">{m.courses.instructor}</span>
              <strong>{L(course.instructor.name)}</strong>
              <span className="small">{L(course.instructor.credential)}</span>
            </div>
          </div>
        </div>
        <Card className="course-side">
          {enrolled ? (
            <>
              <ProgressRing value={progress} size={120} label={m.dashboard.statProgress} />
              {next ? (
                <div className="stack-xs center">
                  <span className="eyebrow">{m.dashboard.upNext}</span>
                  <strong>{L(next.lesson.title)}</strong>
                </div>
              ) : (
                <Badge tone="success">{m.dashboard.allDone}</Badge>
              )}
            </>
          ) : (
            <>
              <span className="eyebrow">{m.courses.fee}</span>
              <strong className="price">{formatInr(course.feeInr)}</strong>
              <button type="button" className="btn btn-primary" disabled aria-describedby="enrol-note">
                {m.courses.enrolCta}
              </button>
              <p id="enrol-note" className="note">
                <Info size={14} aria-hidden /> {m.courses.enrolNote}
              </p>
            </>
          )}
        </Card>
      </section>

      <section>
        <h2 className="h2">{m.courses.whatYouGet}</h2>
        <ul className="ticks grid-2">
          {course.highlights.map((h) => (
            <li key={h.en}>{L(h)}</li>
          ))}
        </ul>
      </section>

      <section className="stack">
        <h2 className="h2">{m.courses.syllabus}</h2>
        {course.modules.map((mod, mi) => {
          const doneCount = mod.lessons.filter((l) => done.includes(l.id)).length;
          return (
            <Card key={mod.id} className="module">
              <div className="module-head">
                <span className="module-index">{mi + 1}</span>
                <strong>{L(mod.title)}</strong>
                {enrolled ? (
                  <span className="muted small">
                    {doneCount}/{mod.lessons.length}
                  </span>
                ) : null}
              </div>
              <ul className="lessons">
                {mod.lessons.map((lesson) => {
                  const isDone = done.includes(lesson.id);
                  const KindIcon = kindIcon[lesson.kind];
                  return (
                    <li key={lesson.id} className={`lesson ${isDone ? 'lesson-done' : ''}`}>
                      {enrolled ? isDone ? <CheckCircle2 size={20} className="ok" aria-hidden /> : <Circle size={20} className="muted" aria-hidden /> : <KindIcon size={20} className="muted" aria-hidden />}
                      <div className="lesson-body">
                        <span>{L(lesson.title)}</span>
                        <span className="muted small">
                          {m.courses.lessonKind[lesson.kind]} · {lesson.durationMin} {m.common.min}
                        </span>
                      </div>
                      {enrolled ? (
                        <button
                          type="button"
                          className={`btn btn-small ${isDone ? 'btn-ghost' : 'btn-outline'}`}
                          aria-pressed={isDone}
                          onClick={() => dispatch({ type: 'toggleLesson', courseId: course.id, lessonId: lesson.id })}
                          data-testid={`lesson-toggle-${lesson.id}`}
                        >
                          {isDone ? (
                            <>
                              <Check size={14} aria-hidden /> {m.courses.markedDone}
                            </>
                          ) : (
                            m.courses.markDone
                          )}
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
