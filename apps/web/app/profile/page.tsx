'use client';

import { Icon, Award, BookOpen, Clock, ShieldCheck } from '@repo/ui/icon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '../../components/logo';
import { ChildAvatar } from '../../components/child-avatar';
import {
  apiBaseUrl,
  getAccessToken,
  getSessionUser,
} from '../../lib/auth-session';
import styles from './profile.module.css';

type Progress = {
  completedActivities: number;
  completedLevels: number;
  timeSpentMinutes: number;
};
type Rewards = {
  xp: number;
  rewards: Array<{ id: number; title: string; description?: string }>;
};

export default function ProfilePage() {
  const [progress, setProgress] = useState<Progress>({
    completedActivities: 0,
    completedLevels: 0,
    timeSpentMinutes: 0,
  });
  const [rewards, setRewards] = useState<Rewards>({ xp: 0, rewards: [] });
  const [user, setUser] = useState<{
    nickname: string | null;
    avatar: string | null;
    birthYear: number | null;
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token || getSessionUser()?.role !== 'kid')
      return window.location.assign('/login');
    const headers = { Authorization: `Bearer ${token}` };
    async function read<T>(path: string): Promise<T> {
      const response = await fetch(`${apiBaseUrl}${path}`, {
        headers,
        cache: 'no-store',
      });
      if (!response.ok)
        throw new Error(
          'Could not load your profile. Please reload to try again.',
        );
      return response.json() as Promise<T>;
    }
    let cancelled = false;
    Promise.all([
      read<Progress>('/learning/progress/summary'),
      read<Rewards>('/learning/rewards/summary'),
      read<{
        nickname: string | null;
        avatar: string | null;
        birthYear: number | null;
      }>('/auth/me'),
    ])
      .then(([nextProgress, nextRewards, profile]) => {
        if (cancelled) return;
        setProgress(nextProgress);
        setRewards(nextRewards);
        setUser(profile);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setError(
            error instanceof Error
              ? error.message
              : 'Could not load your profile.',
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const name = user?.nickname || 'Young coder';
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Logo showTagline={false} />
        <nav>
          <Link href="/kid">
            <Icon icon={BookOpen} size="sm" /> Learn
          </Link>
          <Link className={styles.current} href="/profile">
            Profile
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <h1>My Profile</h1>
        {error && <p role="alert">{error}</p>}
        <div className={styles.grid}>
          <aside className={styles.identity}>
            <div className={styles.bigAvatar}>
              <ChildAvatar avatar={user?.avatar ?? null} name={name} />
            </div>
            <h2>{name}</h2>
            {user?.birthYear != null && <p>Born in {user.birthYear}</p>}
            <p>Welcome back, keep on learning!</p>
            <span className={styles.level}>
              <Icon icon={Award} size="sm" /> Level{' '}
              {Math.max(1, progress.completedLevels + 1)}
            </span>
            <div className={styles.progress}>
              <span
                style={{ width: `${Math.min(100, (rewards.xp % 150) / 1.5)}%` }}
              />
            </div>
            <small>{rewards.xp} XP earned</small>
          </aside>
          <section className={styles.details}>
            <div className={styles.metrics}>
              <article>
                <Icon icon={Award} />
                <strong>{rewards.xp}</strong>
                <span>Total XP</span>
              </article>
              <article>
                <Icon icon={ShieldCheck} />
                <strong>{progress.completedActivities}</strong>
                <span>Lessons</span>
              </article>
              <article>
                <Icon icon={Clock} />
                <strong>{progress.timeSpentMinutes}</strong>
                <span>Minutes learned</span>
              </article>
            </div>
            <article className={styles.panel}>
              <h2>
                <Icon icon={Award} size="sm" /> Achievements
              </h2>
              {rewards.rewards.length ? (
                <div className={styles.rewardList}>
                  {rewards.rewards.map((reward) => (
                    <div key={reward.id}>
                      <Icon icon={Award} />
                      <span>
                        <strong>{reward.title}</strong>
                        <small>
                          {reward.description || 'Achievement earned'}
                        </small>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.empty}>
                  Your earned achievements will appear here.
                </p>
              )}
            </article>
            <article className={styles.panel}>
              <h2>
                <Icon icon={BookOpen} size="sm" /> Learning summary
              </h2>
              <p className={styles.empty}>
                {progress.completedActivities
                  ? `${progress.completedActivities} activities completed.`
                  : 'Complete your first activity to start your learning history.'}
              </p>
              <Link className={styles.learnButton} href="/kid">
                Continue learning
              </Link>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
