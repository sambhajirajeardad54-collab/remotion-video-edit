'use client';

import { courseProgress, courses, exams, formatIndianNumber, formatInr, lessonCount, type Course, type ExamId } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { examColors } from '@edu/design';
import { Clock, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge, Chips, ExamBadge, PageHeader, ProgressBar, SectionHeader, WhenReady } from '@/components/ui';

type Filter = ExamId | 'all';

export default function CoursesPage() {
  return (
    <WhenReady>
      <Courses />
    </WhenReady>
  );
}

function Courses() {
  const { state, m, L } = useStudent();
  const [filter, setFilter] = useState<Filter>(state.targetExam);
  const visible = courses.filter((c) => filter === 'all' || c.examIds.includes(filter));
  const mine = visible.filter((c) => state.enrolledCourseIds.includes(c.id));
  const others = visible.filter((c) => !state.enrolledCourseIds.includes(c.id));

  return (
    <div className="stack-lg">
      <PageHeader title={m.courses.title} subtitle={m.courses.subtitle} />
      <Chips<Filter>
        label={m.courses.title}
        value={filter}
        onChange={setFilter}
        options={[{ value: 'all', label: m.common.all }, ...exams.map((e) => ({ value: e.id, label: L(e.shortName) }))]}
      />
      {mine.length > 0 ? (
        <section>
          <SectionHeader title={m.courses.myCourses} />
          <div className="grid-3">
            {mine.map((c) => (
              <CourseCard key={c.id} course={c} progress={courseProgress(c, state.completedLessons[c.id])} />
            ))}
          </div>
        </section>
      ) : null}
      {others.length > 0 ? (
        <section>
          <SectionHeader title={m.courses.explore} />
          <div className="grid-3">
            {others.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function CourseCard({ course, progress }: { course: Course; progress?: number }) {
  const { m, L, f } = useStudent();
  const stripe = examColors[course.examIds[0] ?? 'mpsc-group-c'];
  return (
    <Link href={`/courses/${course.id}`} className="card course-card" data-testid="course-card">
      <div className="course-stripe" style={{ background: stripe }} />
      <div className="row-badges">
        {course.examIds.map((id) => (
          <ExamBadge key={id} examId={id} />
        ))}
        <Badge tone="primary">{m.courses.level[course.level]}</Badge>
      </div>
      <strong className="course-title">{L(course.title)}</strong>
      <span className="muted small">{L(course.subtitle)}</span>
      <div className="meta-row">
        <span>
          <Star size={14} aria-hidden /> {course.rating}
        </span>
        <span>
          <Users size={14} aria-hidden /> {formatIndianNumber(course.learners)}
        </span>
        <span>
          <Clock size={14} aria-hidden /> {f(m.common.weeks, { n: course.durationWeeks })}
        </span>
      </div>
      {progress !== undefined ? (
        <div className="stack-xs">
          <ProgressBar value={progress} />
          <span className="small muted">
            {f(m.courses.progress, { n: progress })} · {f(m.common.lessons, { n: lessonCount(course) })}
          </span>
        </div>
      ) : (
        <div className="price-row">
          <strong>{formatInr(course.feeInr)}</strong>
          <span className="muted small">{f(m.common.lessons, { n: lessonCount(course) })}</span>
        </div>
      )}
    </Link>
  );
}
