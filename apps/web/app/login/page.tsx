'use client';

import { normalizeIndianMobile } from '@edu/core';
import { useStudent } from '@edu/core/react';
import Link from 'next/link';
import { useState } from 'react';
import { AuthCard, Field } from '@/components/AuthCard';
import { WhenReady } from '@/components/ui';

export default function LoginPage() {
  return (
    <WhenReady>
      <Login />
    </WhenReady>
  );
}

function Login() {
  const { m } = useStudent();
  const [mobile, setMobile] = useState('');
  const invalid = mobile.trim() !== '' && normalizeIndianMobile(mobile) === null;

  return (
    <AuthCard
      title={m.auth.loginTitle}
      subtitle={m.auth.loginSubtitle}
      footer={
        <>
          {m.auth.noAccount}{' '}
          <Link href="/register" className="link">
            {m.auth.createAccount}
          </Link>
        </>
      }
    >
      <Field label={m.auth.mobile} htmlFor="mobile" error={invalid ? m.auth.invalidMobile : null}>
        <div className="input-group">
          <span className="input-prefix">+91</span>
          <input
            id="mobile"
            className="input"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={m.auth.mobilePlaceholder}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            aria-invalid={invalid}
            data-testid="login-mobile"
          />
        </div>
      </Field>
      <button type="submit" className="btn btn-primary btn-large" disabled>
        {m.auth.sendOtp} · {m.common.comingSoon}
      </button>
    </AuthCard>
  );
}
