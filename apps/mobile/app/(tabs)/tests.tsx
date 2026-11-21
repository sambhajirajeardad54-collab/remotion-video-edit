import { attemptsFor, bestPercentage, exams, formatShortDate, formatTime, mockTests, scheduledTests, type ExamId } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, spacing } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Badge, Button, Card, Chips, ExamBadge, Row, Screen, SectionHeader, T } from '@/ui';

type Filter = ExamId | 'all';

export default function TestsScreen() {
  const { state, m, L, f, locale } = useStudent();
  const [filter, setFilter] = useState<Filter>(state.targetExam);
  const today = useMemo(() => new Date(), []);
  const match = (ids: ExamId[]) => filter === 'all' || ids.includes(filter);
  const practice = mockTests.filter((t) => t.status === 'available' && match(t.examIds));
  const upcoming = scheduledTests(today).filter((s) => match(s.test.examIds));

  return (
    <Screen>
      <View style={{ gap: spacing.xs }}>
        <T variant="display">{m.tests.title}</T>
        <T variant="small">{m.tests.subtitle}</T>
      </View>
      <Chips<Filter> value={filter} onChange={setFilter} options={[{ value: 'all', label: m.common.all }, ...exams.map((e) => ({ value: e.id, label: L(e.shortName) }))]} />
      <View>
        <SectionHeader title={m.tests.available} />
        <View style={{ gap: spacing.md }}>
          {practice.map((t) => {
            const best = bestPercentage(t, state.attempts);
            const count = attemptsFor(t.id, state.attempts).length;
            return (
              <Card key={t.id}>
                <Row wrap gap={6}>
                  {t.examIds.map((id) => (
                    <ExamBadge key={id} examId={id} />
                  ))}
                </Row>
                <T style={{ fontWeight: '700', color: colors.primaryStrong }}>{L(t.title)}</T>
                <T variant="small">{L(t.description)}</T>
                <T variant="small">
                  {f(m.common.questions, { n: t.totalQuestions })} · {t.durationMin} {m.common.min} · {t.negativeMarks > 0 ? f(m.tests.negative, { n: t.negativeMarks }) : m.tests.noNegative}
                </T>
                {best !== null ? <Badge tone="success" label={`${f(m.tests.best, { n: best })} · ${f(m.tests.attempts, { n: count })}`} /> : null}
                <Button label={count > 0 ? m.tests.retake : m.tests.start} onPress={() => router.push(`/test/${t.id}`)} />
              </Card>
            );
          })}
        </View>
      </View>
      <View>
        <SectionHeader title={m.tests.scheduled} />
        <View style={{ gap: spacing.md }}>
          {upcoming.map(({ test, date }) => (
            <Card key={test.id} style={{ backgroundColor: colors.accentSoft }}>
              <Row wrap gap={6}>
                {test.examIds.map((id) => (
                  <ExamBadge key={id} examId={id} />
                ))}
                <Badge tone="accent" label={m.tests.remind} />
              </Row>
              <T style={{ fontWeight: '700', color: colors.primaryStrong }}>{L(test.title)}</T>
              <T variant="small">{L(test.description)}</T>
              <Row gap={6}>
                <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                <T variant="small">{f(m.tests.opensOn, { date: formatShortDate(date, locale), time: formatTime(test.startTime ?? '10:00', locale) })}</T>
              </Row>
              <T variant="small">
                {f(m.common.questions, { n: test.totalQuestions })} · {test.durationMin} {m.common.min}
              </T>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}
