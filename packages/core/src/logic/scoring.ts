import type { MockTest, TestAttempt } from '../types';

export interface TestResult {
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  /** correct / attempted, 0–100 */
  accuracy: number;
  /** score / maxScore, 0–100 (never negative) */
  percentage: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function scoreAttempt(test: MockTest, answers: readonly (number | null)[]): TestResult {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  test.questions.forEach((question, i) => {
    const answer = answers[i];
    if (answer === null || answer === undefined) skipped += 1;
    else if (answer === question.answerIndex) correct += 1;
    else wrong += 1;
  });
  const maxScore = test.questions.length * test.marksPerQuestion;
  const score = round2(correct * test.marksPerQuestion - wrong * test.negativeMarks);
  const attempted = correct + wrong;
  return {
    correct,
    wrong,
    skipped,
    score,
    maxScore,
    accuracy: attempted === 0 ? 0 : Math.round((correct / attempted) * 100),
    percentage: maxScore === 0 ? 0 : Math.max(0, Math.round((score / maxScore) * 100)),
  };
}

export function attemptsFor(testId: string, attempts: readonly TestAttempt[]): TestAttempt[] {
  return attempts.filter((a) => a.testId === testId);
}

export function bestPercentage(test: MockTest, attempts: readonly TestAttempt[]): number | null {
  const mine = attemptsFor(test.id, attempts);
  if (mine.length === 0) return null;
  return Math.max(...mine.map((a) => scoreAttempt(test, a.answers).percentage));
}
