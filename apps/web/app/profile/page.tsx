'use client';

import { APP_VERSION, brand, buildDashboard, exams, formatDate, parseDayKey, sampleStudent, type ExamId, type Locale } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { useMemo } from 'react';
import Link from 'next/link';
import { Badge, Card, Chips, PageHeader, StatTile, WhenReady } from '@/components/ui';
import { BookOpenCheck, Flame, MapPin, ShieldCheck, Target, Trophy } from 'lucide-react';

export default function ProfilePage() {
  return (
    <WhenReady>
      <Profile />
    </WhenReady>
  );
}

function Profile() {
  const { state, dispatch, m, L, f, locale } = useStudent();
  const d = useMemo(() => buildDashboard(state), [state]);
  const name = L(sampleStudent.name);

  return (
    <div className="stack-lg narrow">
      <PageHeader title={m.profile.title} />
      <Card className="profile-card">
        <span className="avatar avatar-xl">
          {name
            .split(' ')
            .map((p) => p[0])
            .join('')}
        </span>
        <div className="stack-xs">
          <h2 className="h2">{name}</h2>
          <span className="muted small">
            <MapPin size={14} aria-hidden /> {m.profile.district}: {L(sampleStudent.district)}
          </span>
          <span className="muted small">
            {m.profile.memberSince}: {formatDate(parseDayKey(sampleStudent.memberSince), locale)}
          </span>
        </div>
      </Card>

      <section className="stack">
        <h2 className="h3">{m.profile.progress}</h2>
        <div className="stats">
          <StatTile icon={<Flame size={20} />} label={m.profile.streakDays} value={String(d.streak)} />
          <StatTile icon={<BookOpenCheck size={20} />} label={m.dashboard.statLessons} value={String(d.lessonsDone)} />
          <StatTile icon={<Trophy size={20} />} label={m.dashboard.statTests} value={String(d.testsTaken)} />
          <StatTile icon={<Target size={20} />} label={m.dashboard.statAccuracy} value={d.averageAccuracy === null ? '—' : `${d.averageAccuracy}%`} />
        </div>
      </section>

      <Card className="stack">
        <h2 className="h3">{m.profile.targetExam}</h2>
        <Chips<ExamId>
          label={m.profile.targetExam}
          value={state.targetExam}
          onChange={(examId) => dispatch({ type: 'setTargetExam', examId })}
          options={exams.map((e) => ({ value: e.id, label: L(e.name) }))}
        />
        <h2 className="h3">{m.profile.language}</h2>
        <Chips<Locale>
          label={m.profile.language}
          value={state.locale}
          onChange={(l) => dispatch({ type: 'setLocale', locale: l })}
          options={[
            { value: 'mr', label: 'मराठी' },
            { value: 'en', label: 'English' },
          ]}
        />
      </Card>

      <Card className="stack" data-testid="account-card">
        <div className="row gap">
          <h2 className="h3">{m.auth.account}</h2>
          <Badge tone="accent">{m.auth.preview}</Badge>
        </div>
        <p className="small muted">{m.auth.accountNote}</p>
        <div className="row gap">
          <Link href="/login" className="btn btn-primary">
            {m.auth.login}
          </Link>
          <Link href="/register" className="btn btn-outline">
            {m.auth.createAccount}
          </Link>
        </div>
      </Card>

      <Card className="stack">
        <p className="note">
          <ShieldCheck size={16} aria-hidden /> {m.profile.storageNote}
        </p>
        <button
          type="button"
          className="btn btn-outline btn-danger"
          onClick={() => {
            if (window.confirm(m.profile.resetConfirm)) dispatch({ type: 'reset' });
          }}
        >
          {m.profile.reset}
        </button>
      </Card>

      <p className="small muted center">
        {L(brand.name)} · {L(brand.city)} · {f(m.profile.version, { v: APP_VERSION })}
      </p>
    </div>
  );
}
