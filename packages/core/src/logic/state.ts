import { initialStudentState } from '../data/community';
import { courses } from '../data/courses';
import { exams } from '../data/exams';
import type { ExamId, Locale, StudentState, TestAttempt } from '../types';
import { addDays, toDayKey } from './format';

export const STORAGE_KEY = 'edu.student-state.v1';

export type StudentAction =
  | { type: 'setLocale'; locale: Locale }
  | { type: 'setTargetExam'; examId: ExamId }
  | { type: 'toggleLesson'; courseId: string; lessonId: string; today?: Date }
  | { type: 'recordAttempt'; attempt: TestAttempt; today?: Date }
  | { type: 'reset'; today?: Date }
  | { type: 'hydrate'; state: StudentState };

/** Fresh state for a new device, seeded with a short streak so the dashboard looks lived-in. */
export function createInitialState(today: Date = new Date()): StudentState {
  return {
    ...initialStudentState,
    completedLessons: { ...initialStudentState.completedLessons },
    activeDays: [4, 3, 2, 1].map((n) => toDayKey(addDays(today, -n))),
  };
}

const markActive = (days: string[], today: Date): string[] => {
  const key = toDayKey(today);
  return days.includes(key) ? days : [...days, key].slice(-120);
};

export function studentReducer(state: StudentState, action: StudentAction): StudentState {
  switch (action.type) {
    case 'setLocale':
      return { ...state, locale: action.locale };
    case 'setTargetExam':
      return { ...state, targetExam: action.examId };
    case 'toggleLesson': {
      const current = state.completedLessons[action.courseId] ?? [];
      const done = current.includes(action.lessonId);
      const next = done ? current.filter((id) => id !== action.lessonId) : [...current, action.lessonId];
      return {
        ...state,
        completedLessons: { ...state.completedLessons, [action.courseId]: next },
        activeDays: done ? state.activeDays : markActive(state.activeDays, action.today ?? new Date()),
      };
    }
    case 'recordAttempt':
      return {
        ...state,
        attempts: [...state.attempts, action.attempt].slice(-200),
        activeDays: markActive(state.activeDays, action.today ?? new Date()),
      };
    case 'reset':
      return { ...createInitialState(action.today), locale: state.locale, targetExam: state.targetExam };
    case 'hydrate':
      return action.state;
    default:
      return state;
  }
}

const isLocale = (v: unknown): v is Locale => v === 'en' || v === 'mr';
const isExamId = (v: unknown): v is ExamId => exams.some((e) => e.id === v);

/**
 * Parse persisted JSON defensively. Anything malformed falls back to defaults,
 * so a corrupt or old payload can never crash the app.
 */
export function parseStoredState(raw: string | null | undefined, today: Date = new Date()): StudentState {
  const fallback = createInitialState(today);
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw) as Partial<StudentState>;
    if (!data || data.version !== 1) return fallback;
    const knownCourses = new Set(courses.map((c) => c.id));
    const completedLessons: Record<string, string[]> = {};
    for (const [courseId, ids] of Object.entries(data.completedLessons ?? {})) {
      if (knownCourses.has(courseId) && Array.isArray(ids)) {
        completedLessons[courseId] = ids.filter((id): id is string => typeof id === 'string');
      }
    }
    const attempts = Array.isArray(data.attempts)
      ? data.attempts.filter(
          (a): a is TestAttempt =>
            !!a && typeof a.testId === 'string' && Array.isArray(a.answers) && typeof a.submittedAt === 'string',
        )
      : [];
    return {
      version: 1,
      locale: isLocale(data.locale) ? data.locale : fallback.locale,
      targetExam: isExamId(data.targetExam) ? data.targetExam : fallback.targetExam,
      enrolledCourseIds: Array.isArray(data.enrolledCourseIds)
        ? data.enrolledCourseIds.filter((id) => knownCourses.has(id))
        : fallback.enrolledCourseIds,
      completedLessons,
      attempts,
      activeDays: Array.isArray(data.activeDays)
        ? data.activeDays.filter((d): d is string => typeof d === 'string')
        : fallback.activeDays,
    };
  } catch {
    return fallback;
  }
}

export const serializeState = (state: StudentState): string => JSON.stringify(state);
