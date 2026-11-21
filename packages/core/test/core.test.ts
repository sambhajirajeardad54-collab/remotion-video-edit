import { describe, expect, it } from 'vitest';
import {
  buildDashboard,
  courseProgress,
  courses,
  createInitialState,
  exams,
  fmt,
  formatClock,
  formatIndianNumber,
  formatTime,
  messages,
  mockTests,
  nextLesson,
  parseStoredState,
  scoreAttempt,
  serializeState,
  studentReducer,
  studyMaterials,
  studyStreak,
  toDayKey,
  addDays,
  type Localized,
} from '../src';

const TODAY = new Date(2026, 10, 21, 9, 30); // 21 Nov 2026, 09:30 local

/** Walk any value and collect every Localized object. */
function collectLocalized(value: unknown, out: Localized[] = []): Localized[] {
  if (Array.isArray(value)) value.forEach((v) => collectLocalized(v, out));
  else if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 2 && keys.includes('en') && keys.includes('mr')) out.push(value as Localized);
    else Object.values(value).forEach((v) => collectLocalized(v, out));
  }
  return out;
}

describe('content integrity', () => {
  it('every bilingual string is filled in both languages', () => {
    const all = collectLocalized([exams, courses, mockTests, studyMaterials]);
    expect(all.length).toBeGreaterThan(300);
    for (const l of all) {
      expect(l.en.trim(), JSON.stringify(l)).not.toBe('');
      expect(l.mr.trim(), JSON.stringify(l)).not.toBe('');
    }
  });

  it('Marathi strings actually contain Devanagari where the English is prose', () => {
    const all = collectLocalized([courses, studyMaterials]);
    const prose = all.filter((l) => /[a-z]{4,}/i.test(l.en) && l.en.split(' ').length > 2);
    for (const l of prose) expect(l.mr, l.en).toMatch(/[ऀ-ॿ]/);
  });

  it('ids are unique', () => {
    const unique = (ids: string[]) => expect(new Set(ids).size).toBe(ids.length);
    unique(courses.map((c) => c.id));
    unique(mockTests.map((t) => t.id));
    unique(studyMaterials.map((m) => m.id));
    unique(courses.flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => l.id))));
    unique(mockTests.flatMap((t) => t.questions.map((q) => q.id)));
  });

  it('every exam has courses, practice tests and material', () => {
    for (const exam of exams) {
      expect(courses.some((c) => c.examIds.includes(exam.id)), exam.id).toBe(true);
      expect(mockTests.some((t) => t.examIds.includes(exam.id) && t.status === 'available'), exam.id).toBe(true);
      expect(studyMaterials.some((m) => m.examIds.includes(exam.id)), exam.id).toBe(true);
    }
  });

  it('questions are well formed', () => {
    for (const test of mockTests) {
      if (test.status === 'available') {
        expect(test.questions.length).toBe(test.totalQuestions);
        expect(test.questions.length).toBeGreaterThan(0);
      } else {
        expect(test.scheduleOffsetDays).toBeGreaterThan(0);
        expect(test.startTime).toMatch(/^\d{2}:\d{2}$/);
      }
      for (const q of test.questions) {
        expect(q.options).toHaveLength(4);
        expect(q.answerIndex).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex).toBeLessThan(q.options.length);
      }
    }
  });

  it('seeded progress references real lessons', () => {
    const state = createInitialState(TODAY);
    for (const [courseId, ids] of Object.entries(state.completedLessons)) {
      const course = courses.find((c) => c.id === courseId)!;
      const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      for (const id of ids) expect(lessonIds).toContain(id);
    }
  });
});

describe('i18n', () => {
  it('Marathi and English dictionaries have identical keys', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
      );
    expect(keys(messages.mr).sort()).toEqual(keys(messages.en).sort());
  });

  it('placeholders match between languages', () => {
    const flat = (o: object): Record<string, string> =>
      Object.fromEntries(
        Object.entries(o).flatMap(([k, v]) =>
          typeof v === 'string' ? [[k, v]] : v && typeof v === 'object' && !Array.isArray(v) ? Object.entries(flat(v)).map(([kk, vv]) => [`${k}.${kk}`, vv]) : [],
        ),
      );
    const en = flat(messages.en);
    const mr = flat(messages.mr);
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(en)) expect(vars(mr[key]!), key).toEqual(vars(en[key]!));
  });

  it('fmt replaces placeholders', () => {
    expect(fmt('Question {n} of {total}', { n: 2, total: 10 })).toBe('Question 2 of 10');
    expect(fmt('{missing}', {})).toBe('{missing}');
  });
});

describe('formatting', () => {
  it('formats numbers the Indian way', () => {
    expect(formatIndianNumber(999)).toBe('999');
    expect(formatIndianNumber(14999)).toBe('14,999');
    expect(formatIndianNumber(214000)).toBe('2,14,000');
    expect(formatIndianNumber(12345678)).toBe('1,23,45,678');
  });
  it('formats clocks and times', () => {
    expect(formatClock(605)).toBe('10:05');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(-3)).toBe('00:00');
    expect(formatTime('10:00', 'en')).toBe('10:00 AM');
    expect(formatTime('18:30', 'mr')).toBe('सायं. 6:30');
  });
});

describe('scoring', () => {
  const test = mockTests.find((t) => t.id === 'gs-practice-1')!;

  it('scores all-correct as 100%', () => {
    const r = scoreAttempt(test, test.questions.map((q) => q.answerIndex));
    expect(r).toMatchObject({ correct: 10, wrong: 0, skipped: 0, score: 20, maxScore: 20, accuracy: 100, percentage: 100 });
  });

  it('applies negative marking and counts skips', () => {
    const answers = test.questions.map((q, i) => (i < 6 ? q.answerIndex : i < 8 ? (q.answerIndex + 1) % 4 : null));
    const r = scoreAttempt(test, answers);
    expect(r).toMatchObject({ correct: 6, wrong: 2, skipped: 2, score: 11, accuracy: 75, percentage: 55 });
  });

  it('never reports a negative percentage', () => {
    const r = scoreAttempt(test, test.questions.map((q) => (q.answerIndex + 1) % 4));
    expect(r.score).toBe(-5);
    expect(r.percentage).toBe(0);
  });
});

describe('progress', () => {
  const course = courses.find((c) => c.id === 'group-c-prelims-2027')!;
  it('computes progress and next lesson', () => {
    expect(courseProgress(course, [])).toBe(0);
    expect(nextLesson(course, [])?.lesson.id).toBe('gcp-h1');
    expect(nextLesson(course, ['gcp-h1'])?.lesson.id).toBe('gcp-h2');
    const all = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    expect(courseProgress(course, all)).toBe(100);
    expect(nextLesson(course, all)).toBeNull();
  });

  it('counts streaks, tolerating "not yet studied today"', () => {
    const days = [1, 2, 3].map((n) => toDayKey(addDays(TODAY, -n)));
    expect(studyStreak(days, TODAY)).toBe(3);
    expect(studyStreak([...days, toDayKey(TODAY)], TODAY)).toBe(4);
    expect(studyStreak([toDayKey(addDays(TODAY, -3))], TODAY)).toBe(0);
  });
});

describe('state', () => {
  it('round-trips through storage', () => {
    const s = studentReducer(createInitialState(TODAY), { type: 'setLocale', locale: 'en' });
    expect(parseStoredState(serializeState(s), TODAY)).toEqual(s);
  });

  it('falls back safely on corrupt or foreign data', () => {
    expect(parseStoredState('not json', TODAY)).toEqual(createInitialState(TODAY));
    expect(parseStoredState('{"version":99}', TODAY)).toEqual(createInitialState(TODAY));
    const bad = parseStoredState(JSON.stringify({ version: 1, locale: 'fr', targetExam: 'upsc', completedLessons: { nope: ['x'] } }), TODAY);
    expect(bad.locale).toBe('mr');
    expect(bad.targetExam).toBe('mpsc-group-c');
    expect(bad.completedLessons).toEqual({});
  });

  it('toggles lessons and records attempts, extending the streak', () => {
    let s = createInitialState(TODAY);
    s = studentReducer(s, { type: 'toggleLesson', courseId: 'reasoning-arithmetic', lessonId: 'ra-2', today: TODAY });
    expect(s.completedLessons['reasoning-arithmetic']).toContain('ra-2');
    expect(s.activeDays).toContain(toDayKey(TODAY));
    s = studentReducer(s, { type: 'toggleLesson', courseId: 'reasoning-arithmetic', lessonId: 'ra-2', today: TODAY });
    expect(s.completedLessons['reasoning-arithmetic']).not.toContain('ra-2');

    s = studentReducer(s, {
      type: 'recordAttempt',
      today: TODAY,
      attempt: { testId: 'dmer-practice-1', answers: [1, 2, 1, 3, 1, 2], startedAt: TODAY.toISOString(), submittedAt: TODAY.toISOString() },
    });
    expect(s.attempts).toHaveLength(1);
  });
});

describe('dashboard', () => {
  it('builds a dashboard for each target exam', () => {
    for (const exam of exams) {
      const state = studentReducer(createInitialState(TODAY), { type: 'setTargetExam', examId: exam.id });
      const d = buildDashboard(state, TODAY);
      expect(d.exam.id).toBe(exam.id);
      expect(d.streak).toBe(4);
      expect(d.practice.length).toBeGreaterThan(0);
      expect(d.upcoming.every((u) => u.test.examIds.includes(exam.id))).toBe(true);
      expect(d.continueWith).not.toBeNull();
    }
  });

  it('continues the target-exam course first and reflects results', () => {
    let state = createInitialState(TODAY);
    const d0 = buildDashboard(state, TODAY);
    expect(d0.continueWith?.course.id).toBe('group-c-prelims-2027');
    expect(d0.continueWith?.next?.lesson.id).toBe('gcp-g3');
    expect(d0.averageAccuracy).toBeNull();

    const test = mockTests.find((t) => t.id === 'gs-practice-1')!;
    state = studentReducer(state, {
      type: 'recordAttempt',
      today: TODAY,
      attempt: { testId: test.id, answers: test.questions.map((q) => q.answerIndex), startedAt: 'a', submittedAt: '2026-11-21T10:00:00Z' },
    });
    const d1 = buildDashboard(state, TODAY);
    expect(d1.testsTaken).toBe(1);
    expect(d1.averageAccuracy).toBe(100);
    expect(d1.recent[0]?.result.percentage).toBe(100);
  });
});
