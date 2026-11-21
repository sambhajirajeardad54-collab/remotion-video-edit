import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { scoreAttempt, type TestResult } from '../logic/scoring';
import type { MockTest, TestAttempt } from '../types';

export type TestPhase = 'intro' | 'running' | 'finished';

export interface TestSession {
  phase: TestPhase;
  index: number;
  answers: (number | null)[];
  secondsLeft: number;
  answeredCount: number;
  unansweredCount: number;
  result: TestResult | null;
  /** True if the timer, not the student, ended the test. */
  timedOut: boolean;
  start: () => void;
  choose: (option: number) => void;
  clear: () => void;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  submit: () => void;
  restart: () => void;
}

/**
 * Platform-independent test engine: timer, navigation, answers, auto-submit, scoring.
 * The UI layer (web or native) only renders it.
 */
export function useTestSession(test: MockTest | undefined, onSubmit: (attempt: TestAttempt) => void): TestSession {
  const total = test?.questions.length ?? 0;
  const durationSec = (test?.durationMin ?? 0) * 60;

  const [phase, setPhase] = useState<TestPhase>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [timedOut, setTimedOut] = useState(false);

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  /** Guards against recording one attempt twice (e.g. tap on Submit as the timer hits zero). */
  const submittedRef = useRef(false);

  const secondsLeft =
    phase === 'running' && startedAt !== null ? Math.max(0, Math.ceil(durationSec - (now - startedAt) / 1000)) : durationSec;

  const finish = useCallback(
    (byTimer: boolean) => {
      if (!test || startedAt === null || submittedRef.current) return;
      submittedRef.current = true;
      setPhase('finished');
      setTimedOut(byTimer);
      onSubmitRef.current({
        testId: test.id,
        answers: answersRef.current,
        startedAt: new Date(startedAt).toISOString(),
        submittedAt: new Date().toISOString(),
      });
    },
    [test, startedAt],
  );

  useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && secondsLeft <= 0) finish(true);
  }, [phase, secondsLeft, finish]);

  const result = useMemo(() => (phase === 'finished' && test ? scoreAttempt(test, answers) : null), [phase, test, answers]);
  const answeredCount = answers.filter((a) => a !== null).length;

  return {
    phase,
    index,
    answers,
    secondsLeft,
    answeredCount,
    unansweredCount: total - answeredCount,
    result,
    timedOut,
    start: () => {
      const t = Date.now();
      setAnswers(Array(total).fill(null));
      setIndex(0);
      setStartedAt(t);
      setNow(t);
      setTimedOut(false);
      submittedRef.current = false;
      setPhase('running');
    },
    choose: (option) =>
      setAnswers((prev) => prev.map((a, i) => (i === index ? option : a))),
    clear: () => setAnswers((prev) => prev.map((a, i) => (i === index ? null : a))),
    goTo: (i) => setIndex(Math.min(Math.max(0, i), Math.max(0, total - 1))),
    next: () => setIndex((i) => Math.min(i + 1, total - 1)),
    previous: () => setIndex((i) => Math.max(i - 1, 0)),
    submit: () => finish(false),
    restart: () => {
      setPhase('intro');
      setIndex(0);
      setAnswers(Array(total).fill(null));
      setStartedAt(null);
    },
  };
}
