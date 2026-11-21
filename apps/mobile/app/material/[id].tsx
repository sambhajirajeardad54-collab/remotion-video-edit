import { getStudyMaterial, getSubject } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { spacing } from '@edu/design';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Badge, Button, Card, ExamBadge, Row, Screen, T, Ticks } from '@/ui';

export default function MaterialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { m, L, f } = useStudent();
  const item = getStudyMaterial(String(id));
  if (!item) {
    return (
      <Screen>
        <T>{m.material.notFound}</T>
      </Screen>
    );
  }
  return (
    <Screen>
      <Stack.Screen options={{ title: m.material.kind[item.kind] }} />
      <Card style={{ gap: spacing.md }}>
        <Row wrap gap={6}>
          <Badge tone="primary" label={m.material.kind[item.kind]} />
          <Badge label={L(getSubject(item.subjectId).name)} />
          {item.examIds.map((e) => (
            <ExamBadge key={e} examId={e} />
          ))}
        </Row>
        <T variant="title">{L(item.title)}</T>
        <T variant="small">{L(item.description)}</T>
        <T variant="caption">
          {f(m.common.pages, { n: item.pages })} · {f(m.material.updated, { when: f(m.common.daysAgo, { n: item.updatedDaysAgo }) })}
        </T>
        <T variant="heading">{m.material.keyPoints}</T>
        <Ticks items={item.highlights.map(L)} />
        <Button label={m.material.download} variant="outline" disabled />
      </Card>
    </Screen>
  );
}
