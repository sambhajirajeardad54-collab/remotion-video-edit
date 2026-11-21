import { courseProgress, formatIndianNumber, formatInr, getCourse, lessonCount, nextLesson } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, radii, spacing } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Badge, Button, Card, HeroPanel, ProgressRing, Row, Screen, T, Ticks } from '@/ui';

const kindIcon = { video: 'play-circle-outline', notes: 'document-text-outline', quiz: 'help-circle-outline' } as const;

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch, m, L, f } = useStudent();
  const course = getCourse(String(id));
  if (!course) {
    return (
      <Screen>
        <T>{m.courses.notFound}</T>
      </Screen>
    );
  }
  const enrolled = state.enrolledCourseIds.includes(course.id);
  const done = state.completedLessons[course.id] ?? [];
  const progress = courseProgress(course, done);
  const next = nextLesson(course, done);

  return (
    <Screen>
      <Stack.Screen options={{ title: L(course.title) }} />
      <HeroPanel>
        <Row wrap gap={6}>
          <Badge tone="accent" label={m.courses.level[course.level]} />
          <Badge label={m.courses.teaching[course.teachingLanguage]} />
        </Row>
        <T variant="title" style={{ color: '#fff' }}>
          {L(course.title)}
        </T>
        <T style={{ color: 'rgba(255,255,255,0.85)' }}>{L(course.description)}</T>
        <T variant="small" style={{ color: 'rgba(255,255,255,0.75)' }}>
          ★ {course.rating} · {f(m.common.learners, { n: formatIndianNumber(course.learners) })} · {f(m.common.weeks, { n: course.durationWeeks })} · {f(m.common.lessons, { n: lessonCount(course) })}
        </T>
        <Row gap={spacing.md} style={{ marginTop: spacing.sm }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="person" size={20} color={colors.accentStrong} />
          </View>
          <View style={{ flex: 1 }}>
            <T variant="eyebrow" style={{ color: '#FFD29E' }}>
              {m.courses.instructor}
            </T>
            <T style={{ color: '#fff', fontWeight: '700' }}>{L(course.instructor.name)}</T>
            <T variant="small" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {L(course.instructor.credential)}
            </T>
          </View>
        </Row>
      </HeroPanel>

      <Card style={{ alignItems: 'center', gap: spacing.md }}>
        {enrolled ? (
          <>
            <ProgressRing value={progress} size={110} stroke={10} />
            {next ? (
              <View style={{ alignItems: 'center' }}>
                <T variant="eyebrow">{m.dashboard.upNext}</T>
                <T style={{ fontWeight: '700', textAlign: 'center' }}>{L(next.lesson.title)}</T>
              </View>
            ) : (
              <Badge tone="success" label={m.dashboard.allDone} />
            )}
          </>
        ) : (
          <>
            <T variant="eyebrow">{m.courses.fee}</T>
            <T variant="display">{formatInr(course.feeInr)}</T>
            <Button label={m.courses.enrolCta} disabled style={{ alignSelf: 'stretch' }} />
            <T variant="small" style={{ textAlign: 'center' }}>
              {m.courses.enrolNote}
            </T>
          </>
        )}
      </Card>

      <View style={{ gap: spacing.md }}>
        <T variant="heading">{m.courses.whatYouGet}</T>
        <Ticks items={course.highlights.map(L)} />
      </View>

      <View style={{ gap: spacing.md }}>
        <T variant="heading">{m.courses.syllabus}</T>
        {course.modules.map((mod, mi) => (
          <Card key={mod.id} style={{ gap: 0 }}>
            <Row gap={spacing.md} style={{ paddingBottom: spacing.sm }}>
              <View style={{ width: 28, height: 28, borderRadius: radii.sm, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <T style={{ fontWeight: '700', color: colors.primary }}>{mi + 1}</T>
              </View>
              <T style={{ flex: 1, fontWeight: '700' }}>{L(mod.title)}</T>
              {enrolled ? (
                <T variant="small">
                  {mod.lessons.filter((l) => done.includes(l.id)).length}/{mod.lessons.length}
                </T>
              ) : null}
            </Row>
            {mod.lessons.map((lesson) => {
              const isDone = done.includes(lesson.id);
              return (
                <Pressable
                  key={lesson.id}
                  testID={`lesson-toggle-${lesson.id}`}
                  disabled={!enrolled}
                  accessibilityRole={enrolled ? 'checkbox' : undefined}
                  aria-checked={isDone}
                  onPress={() => dispatch({ type: 'toggleLesson', courseId: course.id, lessonId: lesson.id })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}
                >
                  <Ionicons
                    name={enrolled ? (isDone ? 'checkmark-circle' : 'ellipse-outline') : kindIcon[lesson.kind]}
                    size={22}
                    color={isDone ? colors.success : colors.textMuted}
                  />
                  <View style={{ flex: 1 }}>
                    <T style={isDone ? { color: colors.textMuted } : undefined}>{L(lesson.title)}</T>
                    <T variant="caption">
                      {m.courses.lessonKind[lesson.kind]} · {lesson.durationMin} {m.common.min}
                    </T>
                  </View>
                  {enrolled ? (
                    <T variant="caption" style={{ color: isDone ? colors.success : colors.primary, fontWeight: '700' }}>
                      {isDone ? m.courses.markedDone : m.courses.markDone}
                    </T>
                  ) : null}
                </Pressable>
              );
            })}
          </Card>
        ))}
      </View>
    </Screen>
  );
}
