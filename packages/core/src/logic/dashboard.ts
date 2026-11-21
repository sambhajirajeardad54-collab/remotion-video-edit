import { announcements } from '../data/community';
import { courses } from '../data/courses';
import { getExam } from '../data/exams';
import { mockTests } from '../data/tests';
import type { Announcement, Course, Exam, MockTest, StudentState, TestAttempt } from '../types';
import { addDays } from './format';
import { completedLessonTotal, courseProgress, nextLesson, studyStreak, type NextLesson } from './progress';
import { scoreAttempt, type TestResult } from './scoring';

export interface ScheduledTest {
  test: MockTest;
  date: Date;
  daysAway: number;
}

export interface RecentResult {
  test: MockTest;
  attempt: TestAttempt;
  result: TestResult;
}

export interface EnrolledCourse {
  course: Course;
  progress: number;
  next: NextLesson | null;
}

export interface Dashboard {
  exam: Exam;
  streak: number;
  enrolled: EnrolledCourse[];
  continueWith: EnrolledCourse | null;
  overallProgress: number;
  lessonsDone: number;
  testsTaken: number;
  averageAccuracy: number | null;
  upcoming: ScheduledTest[];
  practice: MockTest[];
  recent: RecentResult[];
  recommended: Course[];
  announcements: (Announcement & { date: Date })[];
}

export const coursesForExam = (examId: Exam['id']): Course[] => courses.filter((c) => c.examIds.includes(examId));

export const testsForExam = (examId: Exam['id']): MockTest[] => mockTests.filter((t) => t.examIds.includes(examId));

export function scheduledTests(today: Date, examId?: Exam['id']): ScheduledTest[] {
  return mockTests
    .filter((t) => t.status === 'scheduled' && (!examId || t.examIds.includes(examId)))
    .map((test) => {
      const daysAway = test.scheduleOffsetDays ?? 0;
      return { test, daysAway, date: addDays(today, daysAway) };
    })
    .sort((a, b) => a.daysAway - b.daysAway);
}

export function buildDashboard(state: StudentState, today: Date = new Date()): Dashboard {
  const exam = getExam(state.targetExam);

  const enrolled: EnrolledCourse[] = state.enrolledCourseIds
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is Course => !!c)
    .map((course) => {
      const done = state.completedLessons[course.id] ?? [];
      return { course, progress: courseProgress(course, done), next: nextLesson(course, done) };
    });

  // Prefer an unfinished course for the target exam, then any unfinished course.
  const unfinished = enrolled.filter((e) => e.next);
  const continueWith =
    unfinished.find((e) => e.course.examIds.includes(exam.id) && e.course.examIds.length === 1) ??
    unfinished.find((e) => e.course.examIds.includes(exam.id)) ??
    unfinished[0] ??
    null;

  const overallProgress =
    enrolled.length === 0 ? 0 : Math.round(enrolled.reduce((s, e) => s + e.progress, 0) / enrolled.length);

  const recent: RecentResult[] = [...state.attempts]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .map((attempt) => {
      const test = mockTests.find((t) => t.id === attempt.testId);
      return test ? { test, attempt, result: scoreAttempt(test, attempt.answers) } : null;
    })
    .filter((r): r is RecentResult => !!r);

  const averageAccuracy =
    recent.length === 0 ? null : Math.round(recent.reduce((s, r) => s + r.result.accuracy, 0) / recent.length);

  const enrolledIds = new Set(state.enrolledCourseIds);

  return {
    exam,
    streak: studyStreak(state.activeDays, today),
    enrolled,
    continueWith,
    overallProgress,
    lessonsDone: completedLessonTotal(state),
    testsTaken: recent.length,
    averageAccuracy,
    upcoming: scheduledTests(today, exam.id),
    practice: testsForExam(exam.id).filter((t) => t.status === 'available'),
    recent: recent.slice(0, 3),
    recommended: coursesForExam(exam.id).filter((c) => !enrolledIds.has(c.id)),
    announcements: announcements
      .map((a) => ({ ...a, date: addDays(today, a.offsetDays) }))
      .sort((a, b) => a.offsetDays - b.offsetDays),
  };
}
