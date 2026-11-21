import { formatClock, getMockTest, type MockTest } from '@edu/core';
import { useStudent, useTestSession } from '@edu/core/react';
import { colors, radii, spacing } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Badge, Button, Card, ProgressRing, Row, Screen, T, Ticks } from '@/ui';

export default function TestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { m } = useStudent();
  const test = getMockTest(String(id));
  if (!test || test.status !== 'available') {
    return (
      <Screen>
        <T>{test ? m.tests.locked : m.tests.notFound}</T>
      </Screen>
    );
  }
  return <Runner key={test.id} test={test} />;
}

function Runner({ test }: { test: MockTest }) {
  const { dispatch, m, L, f } = useStudent();
  const session = useTestSession(test, (attempt) => dispatch({ type: 'recordAttempt', attempt }));
  const [confirming, setConfirming] = useState(false);
  const total = test.questions.length;

  if (session.phase === 'intro') {
    return (
      <Screen>
        <Stack.Screen options={{ title: m.nav.tests }} />
        <Card style={{ gap: spacing.md }}>
          <T variant="title">{L(test.title)}</T>
          <T variant="small">{L(test.description)}</T>
          <Row gap={spacing.sm}>
            {[
              [String(total), f(m.common.questions, { n: '' }).trim()],
              [String(test.durationMin), m.common.min],
              [String(total * test.marksPerQuestion), f(m.common.marks, { n: '' }).trim()],
            ].map(([v, l]) => (
              <View key={l} style={s.fact}>
                <T variant="display">{v}</T>
                <T variant="small">{l}</T>
              </View>
            ))}
          </Row>
          <T variant="heading">{m.tests.instructionsTitle}</T>
          <Ticks items={[...m.tests.instructions, test.negativeMarks > 0 ? f(m.tests.negative, { n: test.negativeMarks }) : m.tests.noNegative]} />
          <Button testID="start-test" label={m.tests.start} onPress={session.start} />
        </Card>
      </Screen>
    );
  }

  if (session.phase === 'finished' && session.result) {
    const r = session.result;
    return (
      <Screen>
        <Stack.Screen options={{ title: m.tests.resultTitle }} />
        {session.timedOut ? (
          <View style={s.banner}>
            <T style={{ color: colors.accentStrong, fontWeight: '700' }}>{m.tests.timeUp}</T>
          </View>
        ) : null}
        <Card style={{ alignItems: 'center', gap: spacing.md }}>
          <ProgressRing value={r.percentage} size={130} stroke={11} />
          <T variant="eyebrow">{m.tests.resultTitle}</T>
          <T variant="heading" style={{ textAlign: 'center' }}>
            {L(test.title)}
          </T>
          <T variant="display" testID="result-score">
            {r.score} / {r.maxScore}
          </T>
          <Row wrap gap={6} style={{ justifyContent: 'center' }}>
            <Badge tone="success" label={`${m.tests.correct}: ${r.correct}`} />
            <Badge tone="danger" label={`${m.tests.wrong}: ${r.wrong}`} />
            <Badge label={`${m.tests.skipped}: ${r.skipped}`} />
            <Badge tone="primary" label={`${m.tests.accuracy}: ${r.accuracy}%`} />
          </Row>
        </Card>
        <Row gap={spacing.md}>
          <Button label={m.tests.retake} onPress={session.restart} style={{ flex: 1 }} />
          <Button label={m.tests.backToTests} variant="outline" onPress={() => router.back()} style={{ flex: 1 }} />
        </Row>
        <View style={{ gap: spacing.md }}>
          <T variant="heading">{m.tests.review}</T>
          {test.questions.map((q, i) => {
            const chosen = session.answers[i] ?? null;
            const correct = chosen === q.answerIndex;
            return (
              <Card key={q.id}>
                <Row style={{ alignItems: 'flex-start' }}>
                  <Ionicons
                    name={chosen === null ? 'remove-circle-outline' : correct ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={chosen === null ? colors.textMuted : correct ? colors.success : colors.danger}
                  />
                  <T style={{ flex: 1, fontWeight: '700' }}>
                    {i + 1}. {L(q.prompt)}
                  </T>
                </Row>
                <T variant="small">
                  {m.tests.yourAnswer}: {chosen === null ? m.tests.notAnswered : L(q.options[chosen]!)}
                </T>
                {!correct ? (
                  <T variant="small" style={{ color: colors.success, fontWeight: '700' }}>
                    {m.tests.correctAnswer}: {L(q.options[q.answerIndex]!)}
                  </T>
                ) : null}
                <View style={s.explanation}>
                  <T variant="small" style={{ color: colors.text }}>
                    <T variant="small" style={{ fontWeight: '700', color: colors.text }}>
                      {m.tests.explanation}:{' '}
                    </T>
                    {L(q.explanation)}
                  </T>
                </View>
              </Card>
            );
          })}
        </View>
      </Screen>
    );
  }

  const q = test.questions[session.index]!;
  const chosen = session.answers[session.index] ?? null;
  const isLast = session.index === total - 1;
  const requestSubmit = () => (session.unansweredCount > 0 ? setConfirming(true) : session.submit());

  return (
    <Screen>
      <Stack.Screen options={{ title: L(test.title) }} />
      <Row style={{ justifyContent: 'space-between' }}>
        <T variant="small">{f(m.tests.questionOf, { n: session.index + 1, total })}</T>
        <View style={[s.timer, session.secondsLeft <= 60 && { backgroundColor: colors.danger }]} accessibilityLabel={m.tests.timeLeft}>
          <Ionicons name="time-outline" size={16} color="#fff" />
          <T style={{ color: '#fff', fontWeight: '700', fontVariant: ['tabular-nums'] }}>{formatClock(session.secondsLeft)}</T>
        </View>
      </Row>
      <Row wrap gap={6}>
        {test.questions.map((qq, i) => {
          const answered = session.answers[i] !== null;
          const current = i === session.index;
          return (
            <Pressable
              key={qq.id}
              onPress={() => session.goTo(i)}
              style={[s.dot, answered && s.dotAnswered, current && s.dotCurrent]}
              accessibilityLabel={f(m.tests.questionOf, { n: i + 1, total })}
            >
              <T variant="small" style={{ fontWeight: '700', color: answered || current ? colors.primary : colors.textMuted }}>
                {i + 1}
              </T>
            </Pressable>
          );
        })}
      </Row>
      <Card style={{ gap: spacing.lg }}>
        <T variant="heading" style={{ fontWeight: '600' }}>
          {L(q.prompt)}
        </T>
        <View style={{ gap: spacing.sm }}>
          {q.options.map((opt, oi) => {
            const selected = chosen === oi;
            return (
              <Pressable
                key={oi}
                testID={`option-${oi}`}
                onPress={() => session.choose(oi)}
                accessibilityRole="radio"
                aria-checked={selected}
                style={[s.option, selected && s.optionSelected]}
              >
                <View style={[s.letter, selected && { backgroundColor: colors.primary }]}>
                  <T variant="small" style={{ fontWeight: '700', color: selected ? '#fff' : colors.text }}>
                    {String.fromCharCode(65 + oi)}
                  </T>
                </View>
                <T style={{ flex: 1 }}>{L(opt)}</T>
              </Pressable>
            );
          })}
        </View>
        {chosen !== null ? (
          <Pressable onPress={session.clear}>
            <T variant="small" style={{ color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' }}>
              {m.tests.clear}
            </T>
          </Pressable>
        ) : null}
      </Card>
      <Row gap={spacing.md}>
        <Button label={`‹ ${m.tests.previous}`} variant="outline" onPress={session.previous} disabled={session.index === 0} style={{ flex: 1 }} />
        {isLast ? (
          <Button key="submit" testID="submit-test" label={m.tests.submit} variant="accent" onPress={requestSubmit} style={{ flex: 1 }} />
        ) : (
          <Button key="next" testID="next-question" label={`${m.tests.next} ›`} onPress={session.next} style={{ flex: 1 }} />
        )}
      </Row>
      {!isLast ? (
        <Pressable onPress={requestSubmit} style={{ alignSelf: 'center' }}>
          <T variant="small" style={{ color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' }}>
            {m.tests.submit}
          </T>
        </Pressable>
      ) : null}

      <Modal visible={confirming} transparent animationType="fade" onRequestClose={() => setConfirming(false)}>
        <View style={s.backdrop}>
          <Card style={{ width: '100%', maxWidth: 420, gap: spacing.lg }}>
            <T>{f(m.tests.confirmSubmit, { n: session.unansweredCount })}</T>
            <Row gap={spacing.md}>
              <Button label={m.tests.submitNo} variant="outline" onPress={() => setConfirming(false)} style={{ flex: 1 }} />
              <Button
                testID="confirm-submit"
                label={m.tests.submitYes}
                variant="accent"
                onPress={() => {
                  setConfirming(false);
                  session.submit();
                }}
                style={{ flex: 1 }}
              />
            </Row>
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  fact: { flex: 1, alignItems: 'center', padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.primarySoft },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.primary },
  dot: { width: 36, height: 36, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dotAnswered: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  dotCurrent: { borderWidth: 2, borderColor: colors.accent },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 52, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  letter: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  explanation: { padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.accentSoft, borderLeftWidth: 3, borderLeftColor: colors.accent },
  banner: { padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent },
  backdrop: { flex: 1, backgroundColor: 'rgba(5,13,36,0.55)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
});
