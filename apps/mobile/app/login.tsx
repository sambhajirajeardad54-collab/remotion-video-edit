import { normalizeIndianMobile } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors } from '@edu/design';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { AuthCard, Field } from '@/auth';
import { Screen, T } from '@/ui';

export default function LoginScreen() {
  const { m } = useStudent();
  const [mobile, setMobile] = useState('');
  const invalid = mobile.trim() !== '' && normalizeIndianMobile(mobile) === null;
  return (
    <Screen>
      <AuthCard
        title={m.auth.loginTitle}
        subtitle={m.auth.loginSubtitle}
        submitLabel={m.auth.sendOtp}
        footer={
          <Pressable onPress={() => router.replace('/register')}>
            <T variant="small">
              {m.auth.noAccount} <T variant="small" style={{ color: colors.primary, fontWeight: '700' }}>{m.auth.createAccount}</T>
            </T>
          </Pressable>
        }
      >
        <Field
          label={m.auth.mobile}
          prefix="+91"
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder={m.auth.mobilePlaceholder}
          value={mobile}
          onChangeText={setMobile}
          error={invalid ? m.auth.invalidMobile : null}
          testID="login-mobile"
        />
      </AuthCard>
    </Screen>
  );
}
