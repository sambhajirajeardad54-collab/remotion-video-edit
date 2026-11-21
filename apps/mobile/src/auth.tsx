import { brand } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors, radii, spacing, typography } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Badge, BrandMark, Button, Card, Row, T } from '@/ui';

/** Branded shell for the sign-in / registration previews. Nothing inside is saved or sent. */
export function AuthCard({ title, subtitle, children, submitLabel, footer }: { title: string; subtitle: string; children: ReactNode; submitLabel: string; footer: ReactNode }) {
  const { m, L } = useStudent();
  return (
    <Card style={{ padding: 0, overflow: 'hidden', gap: 0 }}>
      <View style={s.brand}>
        <BrandMark size={64} />
        <Text style={s.name}>{L(brand.name)}</Text>
        <Text style={s.tagline}>{L(brand.tagline)}</Text>
      </View>
      <View style={s.body}>
        <Row wrap>
          <T variant="title">{title}</T>
          <Badge tone="accent" label={m.auth.preview} />
        </Row>
        <T variant="small">{subtitle}</T>
        {children}
        <Button label={`${submitLabel} · ${m.common.comingSoon}`} disabled />
        <Row style={s.note}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <T variant="small" style={{ flex: 1 }} testID="auth-preview-note">
            {m.auth.previewNote}
          </T>
        </Row>
        <View style={{ alignItems: 'center' }}>{footer}</View>
      </View>
    </Card>
  );
}

export function Field({ label, error, prefix, ...input }: TextInputProps & { label: string; error?: string | null; prefix?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <T variant="small" style={{ fontWeight: '700', color: colors.text }}>
        {label}
      </T>
      <View style={[s.inputWrap, error ? { borderColor: colors.danger } : null]}>
        {prefix ? <Text style={s.prefix}>{prefix}</Text> : null}
        <TextInput placeholderTextColor={colors.textMuted} style={s.input} aria-invalid={!!error} {...input} />
      </View>
      {error ? (
        <T variant="caption" style={{ color: colors.danger }}>
          {error}
        </T>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  brand: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg, backgroundColor: colors.primaryStrong, borderBottomWidth: 3, borderBottomColor: colors.accent },
  name: { color: '#fff', fontSize: typography.size.xl, fontWeight: '700' },
  tagline: { color: colors.accentOnDark, fontWeight: '600', textAlign: 'center' },
  body: { padding: spacing.xl, gap: spacing.md },
  note: { alignItems: 'flex-start', backgroundColor: colors.surfaceMuted, padding: spacing.md, borderRadius: radii.md },
  inputWrap: { flexDirection: 'row', alignItems: 'center', minHeight: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surface, overflow: 'hidden' },
  prefix: { paddingHorizontal: spacing.md, alignSelf: 'stretch', textAlignVertical: 'center', lineHeight: 46, backgroundColor: colors.surfaceMuted, color: colors.textMuted, fontWeight: '700' },
  input: { flex: 1, paddingHorizontal: spacing.md, fontSize: typography.size.md, color: colors.text, minHeight: 46 },
});
