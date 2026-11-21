import { courseProgress, courses, exams, formatIndianNumber, formatInr, lessonCount, type Course, type ExamId } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, examColors, spacing } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Badge, Card, Chips, ExamBadge, ProgressBar, Row, Screen, SectionHeader, T } from '@/ui';

type Filter = ExamId | 'all';

export default function CoursesScreen() {
  const { state, m, L } = useStudent();
  const [filter, setFilter] = useState<Filter>(state.targetExam);
  const visible = courses.filter((c) => filter === 'all' || c.examIds.includes(filter));
  const mine = visible.filter((c) => state.enrolledCourseIds.includes(c.id));
  const others = visible.filter((c) => !state.enrolledCourseIds.includes(c.id));

  return (
    <Screen>
      <View style={{ gap: spacing.xs }}>
        <T variant="display">{m.courses.title}</T>
        <T variant="small">{m.courses.subtitle}</T>
      </View>
      <Chips<Filter> value={filter} onChange={setFilter} options={[{ value: 'all', label: m.common.all }, ...exams.map((e) => ({ value: e.id, label: L(e.shortName) }))]} />
      {mine.length > 0 ? (
        <View>
          <SectionHeader title={m.courses.myCourses} />
          <View style={{ gap: spacing.md }}>
            {mine.map((c) => (
              <CourseCard key={c.id} course={c} progress={courseProgress(c, state.completedLessons[c.id])} />
            ))}
          </View>
        </View>
      ) : null}
      {others.length > 0 ? (
        <View>
          <SectionHeader title={m.courses.explore} />
          <View style={{ gap: spacing.md }}>
            {others.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

function CourseCard({ course, progress }: { course: Course; progress?: number }) {
  const { m, L, f } = useStudent();
  return (
    <Card onPress={() => router.push(`/course/${course.id}`)} style={{ borderTopWidth: 4, borderTopColor: examColors[course.examIds[0] ?? 'mpsc-group-c'] }}>
      <Row wrap gap={6}>
        {course.examIds.map((id) => (
          <ExamBadge key={id} examId={id} />
        ))}
        <Badge label={m.courses.level[course.level]} tone="primary" />
      </Row>
      <T style={{ fontWeight: '700', color: colors.primaryStrong }}>{L(course.title)}</T>
      <T variant="small">{L(course.subtitle)}</T>
      <Row gap={spacing.md} wrap>
        <Row gap={4}>
          <Ionicons name="star" size={13} color={colors.accent} />
          <T variant="small">{course.rating}</T>
        </Row>
        <Row gap={4}>
          <Ionicons name="people-outline" size={13} color={colors.textMuted} />
          <T variant="small">{formatIndianNumber(course.learners)}</T>
        </Row>
        <T variant="small">{f(m.common.weeks, { n: course.durationWeeks })}</T>
      </Row>
      {progress !== undefined ? (
        <View style={{ gap: 4 }}>
          <ProgressBar value={progress} />
          <T variant="caption">
            {f(m.courses.progress, { n: progress })} · {f(m.common.lessons, { n: lessonCount(course) })}
          </T>
        </View>
      ) : (
        <Row style={{ justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm }}>
          <T variant="heading">{formatInr(course.feeInr)}</T>
          <T variant="small">{f(m.common.lessons, { n: lessonCount(course) })}</T>
        </Row>
      )}
    </Card>
  );
}
