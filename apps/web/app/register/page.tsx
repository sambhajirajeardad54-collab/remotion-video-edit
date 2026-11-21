'use client';

import { exams, normalizeIndianMobile, type ExamId, type Locale } from '@edu/core';
import { useStudent } from '@edu/core/react';
import Link from 'next/link';
import { useState } from 'react';
import { AuthCard, Field } from '@/components/AuthCard';
import { Chips, WhenReady } from '@/components/ui';

export default function RegisterPage() {
  return (
    <WhenReady>
      <Register />
    </WhenReady>
  );
}

function Register() {
  const { state, m, L } = useStudent();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('');
  const [exam, setExam] = useState<ExamId>(state.targetExam);
  const [language, setLanguage] = useState<Locale>(state.locale);
  const invalidMobile = mobile.trim() !== '' && normalizeIndianMobile(mobile) === null;

  return (
    <AuthCard
      title={m.auth.registerTitle}
      subtitle={m.auth.registerSubtitle}
      footer={
        <>
          {m.auth.haveAccount}{' '}
          <Link href="/login" className="link">
            {m.auth.login}
          </Link>
        </>
      }
    >
      <Field label={m.auth.fullName} htmlFor="name">
        <input id="name" className="input" autoComplete="name" placeholder={m.auth.fullNamePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label={m.auth.mobile} htmlFor="reg-mobile" error={invalidMobile ? m.auth.invalidMobile : null}>
        <div className="input-group">
          <span className="input-prefix">+91</span>
          <input
            id="reg-mobile"
            className="input"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={m.auth.mobilePlaceholder}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            aria-invalid={invalidMobile}
            data-testid="register-mobile"
          />
        </div>
      </Field>
      <Field label={m.auth.district} htmlFor="district">
        <input id="district" className="input" autoComplete="address-level2" placeholder={m.auth.districtPlaceholder} value={district} onChange={(e) => setDistrict(e.target.value)} />
      </Field>
      <div className="field">
        <span className="field-label">{m.auth.targetExam}</span>
        <Chips<ExamId> label={m.auth.targetExam} value={exam} onChange={setExam} options={exams.map((e) => ({ value: e.id, label: L(e.shortName) }))} />
      </div>
      <div className="field">
        <span className="field-label">{m.auth.language}</span>
        <Chips<Locale>
          label={m.auth.language}
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'mr', label: 'मराठी' },
            { value: 'en', label: 'English' },
          ]}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-large" disabled>
        {m.auth.register} · {m.common.comingSoon}
      </button>
    </AuthCard>
  );
}
