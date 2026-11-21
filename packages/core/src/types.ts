export type Locale = 'en' | 'mr';
export const LOCALES: readonly Locale[] = ['mr', 'en'] as const;

/** Content that must exist in every supported language. */
export type Localized = Record<Locale, string>;

export type ExamId = 'mpsc-group-c' | 'mpsc-group-d' | 'dmer';

export interface Exam {
  id: ExamId;
  name: Localized;
  shortName: Localized;
  conductingBody: Localized;
  description: Localized;
  pattern: Localized[];
  samplePosts: Localized[];
}

export type SubjectId =
  | 'history'
  | 'geography'
  | 'polity'
  | 'economy'
  | 'science'
  | 'marathi'
  | 'english'
  | 'reasoning'
  | 'current-affairs'
  | 'general-knowledge'
  | 'nursing';

export interface Subject {
  id: SubjectId;
  name: Localized;
}

export type LessonKind = 'video' | 'notes' | 'quiz';

export interface Lesson {
  id: string;
  title: Localized;
  durationMin: number;
  kind: LessonKind;
}

export interface CourseModule {
  id: string;
  title: Localized;
  lessons: Lesson[];
}

export type CourseLevel = 'foundation' | 'advanced' | 'crash';
export type TeachingLanguage = 'mr' | 'en' | 'bilingual';

export interface Instructor {
  name: Localized;
  credential: Localized;
}

export interface Course {
  id: string;
  examIds: ExamId[];
  title: Localized;
  subtitle: Localized;
  description: Localized;
  level: CourseLevel;
  teachingLanguage: TeachingLanguage;
  instructor: Instructor;
  durationWeeks: number;
  /** Display-only. No payments are processed in this milestone. */
  feeInr: number;
  rating: number;
  learners: number;
  highlights: Localized[];
  modules: CourseModule[];
}

export interface Question {
  id: string;
  prompt: Localized;
  options: Localized[];
  answerIndex: number;
  explanation: Localized;
}

export type TestStatus = 'available' | 'scheduled';

export interface MockTest {
  id: string;
  examIds: ExamId[];
  subjectId: SubjectId;
  title: Localized;
  description: Localized;
  status: TestStatus;
  durationMin: number;
  marksPerQuestion: number;
  /** Marks deducted per wrong answer (MPSC uses ¼ of a mark). */
  negativeMarks: number;
  /** For scheduled tests: days from today the test goes live. */
  scheduleOffsetDays?: number;
  /** For scheduled tests: 24h clock start time, e.g. "10:00". */
  startTime?: string;
  totalQuestions: number;
  questions: Question[];
}

export type MaterialKind = 'notes' | 'pyq' | 'current-affairs' | 'formula-sheet';

export interface StudyMaterial {
  id: string;
  examIds: ExamId[];
  subjectId: SubjectId;
  kind: MaterialKind;
  title: Localized;
  description: Localized;
  pages: number;
  /** Days ago the material was updated. */
  updatedDaysAgo: number;
  highlights: Localized[];
}

export interface Announcement {
  id: string;
  title: Localized;
  body: Localized;
  /** Days from today; negative = in the past. */
  offsetDays: number;
  tone: 'info' | 'accent';
}

export interface StudentProfile {
  id: string;
  name: Localized;
  district: Localized;
  memberSince: string;
}

/** A single answered/submitted test. `answers[i]` is the chosen option index or null if skipped. */
export interface TestAttempt {
  testId: string;
  answers: (number | null)[];
  startedAt: string;
  submittedAt: string;
}

/** Everything the student changes on-device. Persisted locally until the backend exists. */
export interface StudentState {
  version: 1;
  locale: Locale;
  targetExam: ExamId;
  enrolledCourseIds: string[];
  /** courseId -> completed lesson ids */
  completedLessons: Record<string, string[]>;
  attempts: TestAttempt[];
  /** ISO dates (YYYY-MM-DD) on which the student studied; drives the streak. */
  activeDays: string[];
}
