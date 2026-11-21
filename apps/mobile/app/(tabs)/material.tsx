import { exams, getSubject, studyMaterials, type ExamId, type MaterialKind } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, radii, spacing } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { View } from 'react-native';
import { Badge, Card, Chips, Row, Screen, T } from '@/ui';

type Filter = ExamId | 'all';
const materialIcons: Record<MaterialKind, ComponentProps<typeof Ionicons>['name']> = {
  notes: 'document-text-outline',
  pyq: 'library-outline',
  'current-affairs': 'newspaper-outline',
  'formula-sheet': 'calculator-outline',
};

export default function MaterialScreen() {
  const { state, m, L, f } = useStudent();
  const [filter, setFilter] = useState<Filter>(state.targetExam);
  const [kind, setKind] = useState<MaterialKind | 'all'>('all');
  const kinds = Object.keys(m.material.kind) as MaterialKind[];
  const items = studyMaterials.filter((s) => (filter === 'all' || s.examIds.includes(filter)) && (kind === 'all' || s.kind === kind));

  return (
    <Screen>
      <View style={{ gap: spacing.xs }}>
        <T variant="display">{m.material.title}</T>
        <T variant="small">{m.material.subtitle}</T>
      </View>
      <View style={{ gap: spacing.sm }}>
        <Chips<Filter> value={filter} onChange={setFilter} options={[{ value: 'all', label: m.common.all }, ...exams.map((e) => ({ value: e.id, label: L(e.shortName) }))]} />
        <Chips<MaterialKind | 'all'> value={kind} onChange={setKind} options={[{ value: 'all', label: m.common.all }, ...kinds.map((k) => ({ value: k, label: m.material.kind[k] }))]} />
      </View>
      <View style={{ gap: spacing.md }}>
        {items.map((s) => (
          <Card key={s.id} onPress={() => router.push(`/material/${s.id}`)} style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={materialIcons[s.kind]} size={22} color={colors.accentStrong} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Row wrap gap={6}>
                <Badge tone="primary" label={m.material.kind[s.kind]} />
                <Badge label={L(getSubject(s.subjectId).name)} />
              </Row>
              <T style={{ fontWeight: '700', color: colors.primaryStrong }}>{L(s.title)}</T>
              <T variant="small">{L(s.description)}</T>
              <T variant="caption">
                {f(m.common.pages, { n: s.pages })} · {f(m.material.updated, { when: f(m.common.daysAgo, { n: s.updatedDaysAgo }) })}
              </T>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
