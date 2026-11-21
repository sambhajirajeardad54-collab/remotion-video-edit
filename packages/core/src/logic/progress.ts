import type { Course, CourseModule, Lesson, StudentState } from '../types';
import { addDays, toDayKey } from './format';

export const allLessons = (course: Course): Lesson[] => course.modules.flatMap((m) => m.lessons);

export const lessonCount = (course: Course): number => allLessons(course).length;

export const totalMinutes = (course: Course): number =>
  allLessons(course).reduce((sum, l) => sum + l.durationMin, 0);

export function courseProgress(course: Course, completed: readonly string[] = []): number {
  const lessons = allLessons(course);
  if (lessons.length === 0) return 0;
  const done = lessons.filter((l) => completed.includes(l.id)).length;
  return Math.round((done / lessons.length) * 100);
}

export interface NextLesson {
  module: CourseModule;
  lesson: Lesson;
  index: number;
}

/** First lesson (in syllabus order) that is not yet completed. */
export function nextLesson(course: Course, completed: readonly string[] = []): NextLesson | null {
  let index = 0;
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      index += 1;
      if (!completed.includes(lesson.id)) return { module, lesson, index };
    }
  }
  return null;
}

/** Consecutive days of activity ending today (or yesterday, so a streak isn't lost before you study today). */
export function studyStreak(activeDays: readonly string[], today: Date = new Date()): number {
  const set = new Set(activeDays);
  let cursor = set.has(toDayKey(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (set.has(toDayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function completedLessonTotal(state: StudentState): number {
  return Object.values(state.completedLessons).reduce((sum, ids) => sum + ids.length, 0);
}
