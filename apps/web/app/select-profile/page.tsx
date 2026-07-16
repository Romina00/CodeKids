'use client';

import { Icon, Plus, ShieldCheck, UserRound } from '@repo/ui/icon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogoMark } from '../../components/logo';
import {
  apiBaseUrl,
  getAccessToken,
  readApiError,
} from '../../lib/auth-session';
import { AddChildProfile, EnterKidsMode } from '../parent/profile-actions';
import styles from './select-profile.module.css';

type Child = {
  id: number;
  nickname: string | null;
  learningLevel: string | null;
};
type Dashboard = {
  parent: { displayName: string | null; email: string };
  children: Child[];
};

export default function SelectProfilePage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [status, setStatus] = useState('Loading profiles…');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return window.location.assign('/login');
    fetch(`${apiBaseUrl}/parents/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response));
        return response.json() as Promise<Dashboard>;
      })
      .then((data) => {
        setDashboard(data);
        setStatus('');
      })
      .catch((error: unknown) =>
        setStatus(
          error instanceof Error
            ? error.message
            : 'Profiles could not be loaded.',
        ),
      );
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <LogoMark className={styles.logo} title="" />
        <h1>Who&apos;s learning today?</h1>
        <p className={styles.subtitle}>Pick your profile to continue</p>
        {status ? (
          <p className={styles.status} role="status">
            {status}
          </p>
        ) : null}
        <div className={styles.profiles}>
          {dashboard?.children.map((child) => (
            <div className={styles.profile} key={child.id}>
              <div className={styles.avatar}>
                <Icon icon={UserRound} size="xl" />
              </div>
              <strong>{child.nickname || 'Young coder'}</strong>
              <small>{child.learningLevel || 'Beginner'}</small>
              <EnterKidsMode childId={child.id} />
            </div>
          ))}
          <div className={styles.addProfile}>
            <Icon icon={Plus} size="xl" />
            <AddChildProfile className={styles.addButton} label="Add profile" />
          </div>
        </div>
        {dashboard ? (
          <div className={styles.parentInfo}>
            <span>
              <Icon icon={ShieldCheck} size="sm" /> Signed in as{' '}
              {dashboard.parent.displayName || dashboard.parent.email}
            </span>
            <Link href="/parent">Go to parent dashboard</Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
