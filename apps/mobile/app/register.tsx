import { exams, normalizeIndianMobile, type ExamId, type Locale } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors } from '@edu/design';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AuthCard, Field } from '@/auth';
import { Chips, Screen, T } from '@/ui';

export default function RegisterScreen() {
  const { state, m, L } = useStudent();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('');
  const [exam, setExam] = useState<ExamId>(state.targetExam);
  const [language, setLanguage] = useState<Locale>(state.locale);
  const invalid = mobile.trim() !== '' && normalizeIndianMobile(mobile) === null;
  return (
    <Screen>
      <AuthCard
        title={m.auth.registerTitle}
        subtitle={m.auth.registerSubtitle}
        submitLabel={m.auth.register}
        footer={
          <Pressable onPress={() => router.replace('/login')}>
            <T variant="small">
              {m.auth.haveAccount} <T variant="small" style={{ color: colors.primary, fontWeight: '700' }}>{m.auth.login}</T>
            </T>
          </Pressable>
        }
      >
        <Field label={m.auth.fullName} autoComplete="name" placeholder={m.auth.fullNamePlaceholder} value={name} onChangeText={setName} />
        <Field
          label={m.auth.mobile}
          prefix="+91"
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder={m.auth.mobilePlaceholder}
          value={mobile}
          onChangeText={setMobile}
          error={invalid ? m.auth.invalidMobile : null}
          testID="register-mobile"
        />
        <Field label={m.auth.district} placeholder={m.auth.districtPlaceholder} value={district} onChangeText={setDistrict} />
        <View style={{ gap: 6 }}>
          <T variant="small" style={{ fontWeight: '700', color: colors.text }}>
            {m.auth.targetExam}
          </T>
          <Chips<ExamId> value={exam} onChange={setExam} options={exams.map((e) => ({ value: e.id, label: L(e.shortName) }))} />
        </View>
        <View style={{ gap: 6 }}>
          <T variant="small" style={{ fontWeight: '700', color: colors.text }}>
            {m.auth.language}
          </T>
          <Chips<Locale>
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'mr', label: 'मराठी' },
              { value: 'en', label: 'English' },
            ]}
          />
        </View>
      </AuthCard>
    </Screen>
  );
}
