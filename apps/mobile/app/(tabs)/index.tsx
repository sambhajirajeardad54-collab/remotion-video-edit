import { buildDashboard, dayPart, exams, formatDate, formatShortDate, formatTime, lessonCount, sampleStudent, type ExamId } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, radii, spacing } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Badge, Card, Chips, ExamBadge, HeroPanel, ProgressBar, ProgressRing, Row, Screen, SectionHeader, T } from '@/ui';

export default function Dashboard() {
  const { state, dispatch, m, L, f, locale } = useStudent();
  const today = useMemo(() => new Date(), []);
  const d = useMemo(() => buildDashboard(state, today), [state, today]);
  const when = (days: number) => (days === 0 ? m.common.today : days === 1 ? m.common.tomorrow : f(m.common.inDays, { n: days }));
  const firstName = L(sampleStudent.name).split(' ')[0];
  const next = d.continueWith?.next;

  return (
    <Screen>
      <HeroPanel>
        <T variant="small" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {formatDate(today, locale, true)}
        </T>
        <T variant="display" style={{ color: '#fff' }}>
          {m.greeting[dayPart(today)]}, {firstName}
        </T>
        <Row>
          <Ionicons name="locate-outline" size={16} color="rgba(255,255,255,0.85)" />
          <T style={{ color: 'rgba(255,255,255,0.85)' }}>{f(m.dashboard.target, { exam: L(d.exam.name) })}</T>
        </Row>
        <Chips<ExamId> dark value={state.targetExam} onChange={(examId) => dispatch({ type: 'setTargetExam', examId })} options={exams.map((e) => ({ value: e.id, label: L(e.shortName) }))} />
        <View style={s.streak}>
          <Ionicons name="flame" size={16} color="#FFD29E" />
          <T variant="small" style={{ color: '#FFD29E', fontWeight: '700' }}>
            {d.streak > 0 ? f(m.dashboard.streak, { n: d.streak }) : m.dashboard.streakNone}
          </T>
        </View>
        {next && d.continueWith ? (
          <Pressable testID="continue-card" style={s.heroCard} onPress={() => router.push(`/course/${d.continueWith!.course.id}`)}>
            <T variant="eyebrow">{m.dashboard.upNext}</T>
            <T variant="heading">{L(next.lesson.title)}</T>
            <T variant="small">
              {L(d.continueWith.course.title)} · {next.lesson.durationMin} {m.common.min}
            </T>
            <ProgressBar value={d.continueWith.progress} />
            <Row>
              <Ionicons name="play-circle-outline" size={18} color={colors.accentStrong} />
              <T style={{ color: colors.accentStrong, fontWeight: '700' }}>{m.common.continue}</T>
            </Row>
          </Pressable>
        ) : null}
      </HeroPanel>

      <View style={s.stats}>
        <Stat icon="book-outline" value={`${d.overallProgress}%`} label={m.dashboard.statProgress} />
        <Stat icon="checkmark-done-outline" value={String(d.lessonsDone)} label={m.dashboard.statLessons} />
        <Stat icon="trophy-outline" value={String(d.testsTaken)} label={m.dashboard.statTests} />
        <Stat icon="analytics-outline" value={d.averageAccuracy === null ? '—' : `${d.averageAccuracy}%`} label={m.dashboard.statAccuracy} />
      </View>

      <View>
        <SectionHeader title={m.dashboard.continueLearning} action={m.common.viewAll} onAction={() => router.navigate('/courses')} />
        <View style={{ gap: spacing.md }}>
          {d.enrolled.map(({ course, progress, next: n }) => (
            <Card key={course.id} onPress={() => router.push(`/course/${course.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
              <ProgressRing value={progress} />
              <View style={{ flex: 1, gap: 4 }}>
                <Row wrap gap={6}>
                  {course.examIds.map((id) => (
                    <ExamBadge key={id} examId={id} />
                  ))}
                </Row>
                <T style={{ fontWeight: '700', color: colors.primaryStrong }}>{L(course.title)}</T>
                <T variant="small">
                  {n ? `${m.dashboard.upNext}: ${L(n.lesson.title)}` : m.dashboard.allDone} · {f(m.common.lessons, { n: lessonCount(course) })}
                </T>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View>
        <SectionHeader title={m.dashboard.practiceNow} action={m.common.viewAll} onAction={() => router.navigate('/tests')} />
        <View style={{ gap: spacing.md }}>
          {d.practice.map((t) => (
            <Card key={t.id} onPress={() => router.push(`/test/${t.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={s.iconTile}>
                <Ionicons name="timer-outline" size={20} color={colors.accentStrong} />
              </View>
              <View style={{ flex: 1 }}>
                <T style={{ fontWeight: '700', color: colors.primaryStrong }}>{L(t.title)}</T>
                <T variant="small">
                  {f(m.common.questions, { n: t.totalQuestions })} · {t.durationMin} {m.common.min}
                </T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Card>
          ))}
        </View>
      </View>

      <View>
        <SectionHeader title={m.dashboard.recentResults} />
        {d.recent.length === 0 ? (
          <Card>
            <T variant="small" style={{ textAlign: 'center' }}>
              {m.dashboard.noResults}
            </T>
          </Card>
        ) : (
          <View style={{ gap: spacing.md }}>
            {d.recent.map(({ test, attempt, result }) => (
              <Card key={attempt.submittedAt} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <T style={{ fontWeight: '700' }}>{L(test.title)}</T>
                  <T variant="small">{formatDate(new Date(attempt.submittedAt), locale)}</T>
                </View>
                <Badge label={`${result.score}/${result.maxScore} · ${result.percentage}%`} tone={result.percentage >= 60 ? 'success' : result.percentage >= 40 ? 'accent' : 'danger'} />
              </Card>
            ))}
          </View>
        )}
      </View>

      <View>
        <SectionHeader title={m.dashboard.upcomingTests} action={m.common.viewAll} onAction={() => router.navigate('/tests')} />
        <Card style={{ paddingVertical: spacing.xs }}>
          {d.upcoming.map(({ test, date, daysAway }, i) => (
            <Row key={test.id} gap={spacing.md} style={[{ paddingVertical: spacing.md }, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={s.dateTile}>
                <T style={{ fontWeight: '700', color: colors.accentStrong, lineHeight: 22 }}>{date.getDate()}</T>
                <T variant="caption" style={{ color: colors.accentStrong }}>
                  {formatShortDate(date, locale).split(',')[0]}
                </T>
              </View>
              <View style={{ flex: 1 }}>
                <T style={{ fontWeight: '700' }}>{L(test.title)}</T>
                <T variant="small">
                  {when(daysAway)}, {formatTime(test.startTime ?? '10:00', locale)} · {f(m.common.questions, { n: test.totalQuestions })}
                </T>
              </View>
            </Row>
          ))}
        </Card>
      </View>

      <View>
        <SectionHeader title={m.dashboard.announcements} />
        <View style={{ gap: spacing.md }}>
          {d.announcements.map((a) => (
            <Card key={a.id} style={[{ flexDirection: 'row', gap: spacing.md }, a.tone === 'accent' && { borderLeftWidth: 4, borderLeftColor: colors.accent }]}>
              <Ionicons name="megaphone-outline" size={18} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <T style={{ fontWeight: '700' }}>{L(a.title)}</T>
                <T variant="small">{L(a.body)}</T>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {d.recommended.length > 0 ? (
        <View>
          <SectionHeader title={m.dashboard.recommended} action={m.common.viewAll} onAction={() => router.navigate('/courses')} />
          <View style={{ gap: spacing.md }}>
            {d.recommended.slice(0, 3).map((c) => (
              <Card key={c.id} onPress={() => router.push(`/course/${c.id}`)}>
                <Badge label={m.courses.level[c.level]} tone="primary" />
                <T style={{ fontWeight: '700', color: colors.primaryStrong }}>{L(c.title)}</T>
                <T variant="small">{L(c.subtitle)}</T>
              </Card>
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

function Stat({ icon, value, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; value: string; label: string }) {
  return (
    <View style={s.stat}>
      <View style={s.statIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <T variant="title">{value}</T>
        <T variant="caption">{label}</T>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  streak: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: radii.pill, backgroundColor: 'rgba(242,140,27,0.18)' },
  heroCard: { backgroundColor: '#fff', borderRadius: radii.lg, padding: spacing.lg, gap: spacing.sm, marginTop: spacing.sm },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  stat: { flexBasis: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  statIcon: { width: 36, height: 36, borderRadius: radii.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  iconTile: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  dateTile: { width: 50, height: 50, borderRadius: radii.md, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
});
