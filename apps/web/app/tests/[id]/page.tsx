'use client';

import { formatClock, getMockTest, type MockTest } from '@edu/core';
import { useStudent, useTestSession } from '@edu/core/react';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Badge, Card, EmptyState, ProgressRing, WhenReady } from '@/components/ui';

export default function TestPage() {
  return (
    <WhenReady>
      <TestLoader />
    </WhenReady>
  );
}

function TestLoader() {
  const { id } = useParams<{ id: string }>();
  const { m } = useStudent();
  const test = getMockTest(id);
  if (!test) return <EmptyState>{m.tests.notFound}</EmptyState>;
  if (test.status !== 'available') return <EmptyState>{m.tests.locked}</EmptyState>;
  return <TestRunner test={test} />;
}

function TestRunner({ test }: { test: MockTest }) {
  const { dispatch, m, L, f } = useStudent();
  const session = useTestSession(test, (attempt) => dispatch({ type: 'recordAttempt', attempt }));
  const [confirming, setConfirming] = useState(false);

  if (session.phase === 'intro') {
    return (
      <div className="stack-lg narrow">
        <Link href="/tests" className="back-link">
          <ArrowLeft size={16} aria-hidden /> {m.nav.tests}
        </Link>
        <Card className="stack">
          <h1>{L(test.title)}</h1>
          <p className="muted">{L(test.description)}</p>
          <div className="intro-facts">
            <div>
              <strong>{test.questions.length}</strong>
              <span>{f(m.common.questions, { n: '' }).trim()}</span>
            </div>
            <div>
              <strong>{test.durationMin}</strong>
              <span>{m.common.min}</span>
            </div>
            <div>
              <strong>{test.questions.length * test.marksPerQuestion}</strong>
              <span>{f(m.common.marks, { n: '' }).trim()}</span>
            </div>
          </div>
          <h2 className="h3">{m.tests.instructionsTitle}</h2>
          <ul className="ticks">
            {m.tests.instructions.map((line) => (
              <li key={line}>{line}</li>
            ))}
            <li>{test.negativeMarks > 0 ? f(m.tests.negative, { n: test.negativeMarks }) : m.tests.noNegative}</li>
          </ul>
          <button type="button" className="btn btn-primary btn-large" onClick={session.start} data-testid="start-test">
            {m.tests.start}
          </button>
        </Card>
      </div>
    );
  }

  if (session.phase === 'finished' && session.result) {
    const r = session.result;
    return (
      <div className="stack-lg narrow" data-testid="test-result">
        {session.timedOut ? <div className="banner">{m.tests.timeUp}</div> : null}
        <Card className="result-hero">
          <ProgressRing value={r.percentage} size={132} stroke={11} label={m.tests.score} />
          <div className="stack-xs">
            <span className="eyebrow">{m.tests.resultTitle}</span>
            <h1>{L(test.title)}</h1>
            <p className="result-big">
              {r.score} / {r.maxScore}
            </p>
            <div className="row-badges">
              <Badge tone="success">
                {m.tests.correct}: {r.correct}
              </Badge>
              <Badge tone="danger">
                {m.tests.wrong}: {r.wrong}
              </Badge>
              <Badge>
                {m.tests.skipped}: {r.skipped}
              </Badge>
              <Badge tone="primary">
                {m.tests.accuracy}: {r.accuracy}%
              </Badge>
            </div>
          </div>
        </Card>
        <div className="row gap">
          <button type="button" className="btn btn-primary" onClick={session.restart}>
            {m.tests.retake}
          </button>
          <Link href="/tests" className="btn btn-outline">
            {m.tests.backToTests}
          </Link>
        </div>
        <h2 className="h2">{m.tests.review}</h2>
        <div className="stack">
          {test.questions.map((q, i) => {
            const chosen = session.answers[i] ?? null;
            const correct = chosen === q.answerIndex;
            return (
              <Card key={q.id} className="review">
                <div className="review-head">
                  {chosen === null ? <Badge>{m.tests.skipped}</Badge> : correct ? <CheckCircle2 className="ok" size={20} aria-label={m.tests.correct} /> : <XCircle className="bad" size={20} aria-label={m.tests.wrong} />}
                  <strong>
                    {i + 1}. {L(q.prompt)}
                  </strong>
                </div>
                <p className="small">
                  <span className="muted">{m.tests.yourAnswer}: </span>
                  {chosen === null ? m.tests.notAnswered : L(q.options[chosen]!)}
                </p>
                {!correct ? (
                  <p className="small">
                    <span className="muted">{m.tests.correctAnswer}: </span>
                    <strong className="ok">{L(q.options[q.answerIndex]!)}</strong>
                  </p>
                ) : null}
                <p className="explanation">
                  <strong>{m.tests.explanation}: </strong>
                  {L(q.explanation)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const q = test.questions[session.index]!;
  const chosen = session.answers[session.index] ?? null;
  const isLast = session.index === test.questions.length - 1;
  const lowTime = session.secondsLeft <= 60;

  const requestSubmit = () => (session.unansweredCount > 0 ? setConfirming(true) : session.submit());

  return (
    <div className="runner narrow" data-testid="test-runner">
      <div className="runner-bar">
        <span className="small muted">{L(test.title)}</span>
        <span className={`timer ${lowTime ? 'timer-low' : ''}`} aria-live="polite" aria-label={m.tests.timeLeft}>
          <Clock size={16} aria-hidden /> {formatClock(session.secondsLeft)}
        </span>
      </div>
      <div className="palette" aria-label="Questions">
        {test.questions.map((qq, i) => (
          <button
            key={qq.id}
            type="button"
            className={`palette-dot ${i === session.index ? 'current' : ''} ${session.answers[i] !== null ? 'answered' : ''}`}
            onClick={() => session.goTo(i)}
            aria-label={f(m.tests.questionOf, { n: i + 1, total: test.questions.length })}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <Card className="question">
        <span className="eyebrow">{f(m.tests.questionOf, { n: session.index + 1, total: test.questions.length })}</span>
        <h2 className="question-text">{L(q.prompt)}</h2>
        <div className="options" role="radiogroup">
          {q.options.map((opt, oi) => (
            <button
              key={oi}
              type="button"
              role="radio"
              aria-checked={chosen === oi}
              className={`option ${chosen === oi ? 'option-chosen' : ''}`}
              onClick={() => session.choose(oi)}
              data-testid={`option-${oi}`}
            >
              <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
              <span>{L(opt)}</span>
            </button>
          ))}
        </div>
        {chosen !== null ? (
          <button type="button" className="link-button small" onClick={session.clear}>
            {m.tests.clear}
          </button>
        ) : null}
      </Card>
      <div className="runner-nav">
        <button type="button" className="btn btn-outline" onClick={session.previous} disabled={session.index === 0}>
          <ChevronLeft size={16} aria-hidden /> {m.tests.previous}
        </button>
        {isLast ? (
          <button key="submit" type="button" className="btn btn-accent" onClick={requestSubmit} data-testid="submit-test">
            {m.tests.submit}
          </button>
        ) : (
          <button key="next" type="button" className="btn btn-primary" onClick={session.next} data-testid="next-question">
            {m.tests.next} <ChevronRight size={16} aria-hidden />
          </button>
        )}
      </div>
      {!isLast ? (
        <button type="button" className="link-button submit-early" onClick={requestSubmit}>
          {m.tests.submit}
        </button>
      ) : null}

      {confirming ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <Card className="modal">
            <p id="confirm-title">{f(m.tests.confirmSubmit, { n: session.unansweredCount })}</p>
            <div className="row gap">
              <button type="button" className="btn btn-outline" onClick={() => setConfirming(false)}>
                {m.tests.submitNo}
              </button>
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {
                  setConfirming(false);
                  session.submit();
                }}
                data-testid="confirm-submit"
              >
                {m.tests.submitYes}
              </button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
