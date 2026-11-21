import { getExam, type ExamId } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, examColors, radii, shadows, spacing, typography } from '@edu/design';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'small' | 'caption' | 'eyebrow';

const variantStyles = StyleSheet.create({
  display: { fontSize: typography.size.xxl, lineHeight: typography.lineHeight.xxl, fontWeight: '700', color: colors.primaryStrong },
  title: { fontSize: typography.size.xl, lineHeight: typography.lineHeight.xl, fontWeight: '700', color: colors.primaryStrong },
  heading: { fontSize: typography.size.lg, lineHeight: typography.lineHeight.lg, fontWeight: '700', color: colors.primaryStrong },
  body: { fontSize: typography.size.md, lineHeight: typography.lineHeight.md, color: colors.text },
  small: { fontSize: typography.size.sm, lineHeight: typography.lineHeight.sm, color: colors.textMuted },
  caption: { fontSize: typography.size.xs, lineHeight: typography.lineHeight.xs, color: colors.textMuted },
  eyebrow: { fontSize: typography.size.xs, lineHeight: typography.lineHeight.xs, fontWeight: '700', color: colors.accentStrong, letterSpacing: 0.6, textTransform: 'uppercase' },
});

export function T({ variant = 'body', style, ...rest }: TextProps & { variant?: Variant }) {
  return <Text {...rest} style={[variantStyles[variant], style]} />;
}

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const { ready } = useStudent();
  const body = !ready ? (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.primary} />
    </View>
  ) : scroll ? (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scroll, { flex: 1 }]}>{children}</View>
  );
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.screen}>
      {body}
    </SafeAreaView>
  );
}

export function Card({ children, style, onPress, testID }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; testID?: string }) {
  if (onPress) {
    return (
      <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]} accessibilityRole="button">
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <T variant="heading">{title}</T>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <T variant="small" style={{ color: colors.primary, fontWeight: '700' }}>
            {action} →
          </T>
        </Pressable>
      ) : null}
    </View>
  );
}

type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'danger';
const toneColors: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceMuted, fg: colors.text },
  primary: { bg: colors.primarySoft, fg: colors.primary },
  accent: { bg: colors.accentSoft, fg: colors.accentStrong },
  success: { bg: colors.successSoft, fg: colors.success },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const c = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

export function ExamBadge({ examId }: { examId: ExamId }) {
  const { L } = useStudent();
  return (
    <View style={[styles.badge, { borderWidth: 1, borderColor: examColors[examId], backgroundColor: colors.surface }]}>
      <Text style={[styles.badgeText, { color: examColors[examId] }]}>{L(getExam(examId).shortName)}</Text>
    </View>
  );
}

export function Row({ children, style, gap = spacing.sm, wrap }: { children: ReactNode; style?: StyleProp<ViewStyle>; gap?: number; wrap?: boolean }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: wrap ? 'wrap' : 'nowrap' }, style]}>{children}</View>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progress}>
      <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%` }]} />
    </View>
  );
}

export function ProgressRing({ value, size = 64, stroke = 7, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.min(100, Math.max(0, value));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.primarySoft} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - v / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={{ fontWeight: '700', color: colors.primaryStrong, fontSize: size > 90 ? 22 : 14 }}>{v}%</Text>
      {label ? <T variant="caption">{label}</T> : null}
    </View>
  );
}

export function Chips<V extends string>({ options, value, onChange, dark }: { options: { value: V; label: string }[]; value: V; onChange: (v: V) => void; dark?: boolean }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            aria-checked={active}
            style={[styles.chip, dark && styles.chipDark, active && (dark ? styles.chipDarkActive : styles.chipActive)]}
          >
            <Text style={[styles.chipText, dark && { color: '#fff' }, active && { color: dark ? colors.primaryStrong : '#fff' }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  testID,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'accent' | 'outline';
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = variant === 'primary' ? colors.primary : variant === 'accent' ? colors.accent : colors.surface;
  const fg = variant === 'primary' ? '#fff' : variant === 'accent' ? colors.primaryStrong : colors.primary;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderColor: variant === 'outline' ? colors.border : bg },
        disabled && { opacity: 0.5 },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={{ color: fg, fontWeight: '700', fontSize: typography.size.md }}>{label}</Text>
    </Pressable>
  );
}

export function Ticks({ items }: { items: string[] }) {
  return (
    <View style={{ gap: spacing.sm }}>
      {items.map((item) => (
        <Row key={item} style={{ alignItems: 'flex-start' }}>
          <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 16, lineHeight: 24 }}>✓</Text>
          <T style={{ flex: 1 }}>{item}</T>
        </Row>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.huge, gap: spacing.xxl },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card.native,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.md },
  badge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: radii.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: typography.size.xs, fontWeight: '700', lineHeight: 20 },
  progress: { height: 8, borderRadius: radii.pill, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radii.pill, backgroundColor: colors.accent },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipDark: { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.25)' },
  chipDarkActive: { backgroundColor: '#fff', borderColor: '#fff' },
  chipText: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text },
  button: { minHeight: 48, paddingHorizontal: spacing.xl, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});

/** Navy hero block with a subtle saffron glow, shared by dashboard and course screens. */
export function HeroPanel({ children }: { children: ReactNode }) {
  return (
    <View style={heroStyles.hero}>
      <View style={heroStyles.glow} />
      <View style={heroStyles.ring} />
      <View style={{ gap: spacing.sm }}>{children}</View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  hero: { backgroundColor: colors.primary, borderRadius: radii.xl, padding: spacing.xl, overflow: 'hidden' },
  glow: { position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(242,140,27,0.16)' },
  ring: { position: 'absolute', bottom: -70, left: -50, width: 180, height: 180, borderRadius: 90, borderWidth: 24, borderColor: 'rgba(255,255,255,0.04)' },
});
