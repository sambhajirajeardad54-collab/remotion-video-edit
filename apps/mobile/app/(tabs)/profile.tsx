import { APP_VERSION, brand, buildDashboard, exams, formatDate, parseDayKey, sampleStudent, type ExamId, type Locale } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, radii, spacing } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from 'react';
import { Alert, View } from 'react-native';
import { Button, Card, Chips, Row, Screen, T } from '@/ui';

export default function ProfileScreen() {
  const { state, dispatch, m, L, f, locale } = useStudent();
  const d = useMemo(() => buildDashboard(state), [state]);
  const name = L(sampleStudent.name);

  const confirmReset = () =>
    Alert.alert(m.profile.reset, m.profile.resetConfirm, [
      { text: m.tests.submitNo, style: 'cancel' },
      { text: m.profile.reset, style: 'destructive', onPress: () => dispatch({ type: 'reset' }) },
    ]);

  return (
    <Screen>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <T variant="title" style={{ color: colors.accentStrong }}>
            {name
              .split(' ')
              .map((p) => p[0])
              .join('')}
          </T>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T variant="title">{name}</T>
          <Row gap={4}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <T variant="small">
              {m.profile.district}: {L(sampleStudent.district)}
            </T>
          </Row>
          <T variant="small">
            {m.profile.memberSince}: {formatDate(parseDayKey(sampleStudent.memberSince), locale)}
          </T>
        </View>
      </Card>

      <View style={{ gap: spacing.md }}>
        <T variant="heading">{m.profile.progress}</T>
        <Row gap={spacing.md}>
          {[
            [String(d.streak), m.profile.streakDays],
            [String(d.lessonsDone), m.dashboard.statLessons],
            [String(d.testsTaken), m.dashboard.statTests],
          ].map(([v, label]) => (
            <View key={label} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, alignItems: 'center' }}>
              <T variant="title">{v}</T>
              <T variant="caption" style={{ textAlign: 'center' }}>
                {label}
              </T>
            </View>
          ))}
        </Row>
      </View>

      <Card style={{ gap: spacing.md }}>
        <T variant="heading">{m.profile.targetExam}</T>
        <Chips<ExamId> value={state.targetExam} onChange={(examId) => dispatch({ type: 'setTargetExam', examId })} options={exams.map((e) => ({ value: e.id, label: L(e.shortName) }))} />
        <T variant="heading">{m.profile.language}</T>
        <Chips<Locale>
          value={state.locale}
          onChange={(l) => dispatch({ type: 'setLocale', locale: l })}
          options={[
            { value: 'mr', label: 'मराठी' },
            { value: 'en', label: 'English' },
          ]}
        />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <Row style={{ alignItems: 'flex-start' }}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
          <T variant="small" style={{ flex: 1 }}>
            {m.profile.storageNote}
          </T>
        </Row>
        <Button label={m.profile.reset} variant="outline" onPress={confirmReset} />
      </Card>

      <T variant="caption" style={{ textAlign: 'center' }}>
        {L(brand.name)} · {L(brand.city)} · {f(m.profile.version, { v: APP_VERSION })}
      </T>
    </Screen>
  );
}
