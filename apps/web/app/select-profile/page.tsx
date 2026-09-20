'use client';

import { ArrowRight, Icon, Plus, ShieldCheck, UsersRound } from '@repo/ui/icon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChildAvatar } from '../../components/child-avatar';
import { LogoMark } from '../../components/logo';
import {
  authorizedFetch,
  getAccessToken,
  readApiError,
} from '../../lib/auth-session';
import { AddChildProfile, EnterKidsMode } from '../parent/profile-actions';
import styles from './select-profile.module.css';

type Child = {
  id: number;
  nickname: string | null;
  avatar: string | null;
  birthYear: number | null;
  learningLevel: string | null;
};
type Dashboard = {
  parent: { displayName: string | null; email: string };
  children: Child[];
};

export default function SelectProfilePage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [status, setStatus] = useState('Loading profiles…');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return window.location.assign('/login');
    authorizedFetch('/parents/dashboard')
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
    <main className={styles.page} id="main-content">
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <LogoMark className={styles.logo} title="" /> CodeKids
          </div>
          <span className={styles.account}>
            <Icon icon={ShieldCheck} size="sm" /> Parent area
          </span>
        </header>
        <div className={styles.intro}>
          <h1>Your family’s learning space</h1>
          <p>
            Choose a child’s profile to open Kids Mode, or manage learning in
            your parent dashboard.
          </p>
          {dashboard && (
            <small>
              Signed in as{' '}
              {dashboard.parent.displayName || dashboard.parent.email}
            </small>
          )}
        </div>
        <section aria-labelledby="profiles-title">
          <div className={styles.sectionHeader}>
            <h2 id="profiles-title">Child profiles</h2>
          </div>
          {status && (
            <p className={styles.status} role="status">
              {status}
            </p>
          )}
          {dashboard?.children.length === 0 && (
            <p className={styles.status}>
              Add your first child profile to start the coding adventure.
            </p>
          )}
          <div className={styles.profiles}>
            {dashboard?.children.map((child) => (
              <EnterKidsMode
                key={child.id}
                childId={child.id}
                className={styles.profile}
                disabled={isOpening}
                onPendingChange={setIsOpening}
              >
                <span className={styles.avatar}>
                  <ChildAvatar
                    avatar={child.avatar}
                    name={child.nickname || 'Young coder'}
                  />
                </span>
                <strong>{child.nickname || 'Young coder'}</strong>
                {child.birthYear !== null && (
                  <small>Born in {child.birthYear}</small>
                )}
              </EnterKidsMode>
            ))}
            {dashboard && (
              <AddChildProfile className={styles.addProfile}>
                <span className={styles.addAvatar}>
                  <Icon icon={Plus} size="xl" />
                </span>
                <span>Add profile</span>
              </AddChildProfile>
            )}
          </div>
          {dashboard && dashboard.children.length > 0 && (
            <p className={styles.note}>
              Selecting a profile switches to your child’s session. Sign in
              again to return to the parent area.
            </p>
          )}
        </section>
        <Link href="/parent" className={styles.parentCard}>
          <Icon icon={UsersRound} size="lg" />
          <span>
            <strong>Parent dashboard</strong>
            <small>
              View each child’s progress and manage your family’s profiles.
            </small>
          </span>
          <Icon icon={ArrowRight} size="md" />
        </Link>
      </div>
    </main>
  );
}
