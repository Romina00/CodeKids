'use client';

import { Icon, Award, BookOpen, ShieldCheck } from '@repo/ui/icon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '../../components/logo';
import { ChildAvatar } from '../../components/child-avatar';
import {
  authorizedFetch,
  getAccessToken,
  getSessionUser,
} from '../../lib/auth-session';
import styles from './profile.module.css';
import { loadGameLevels, type GameLevel } from '../../lib/game-progress';
import { HappyStickman } from '../../components/games/game-guide';

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
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<GameLevel[]>([]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token || getSessionUser()?.role !== 'kid')
      return window.location.assign('/login');
    async function read<T>(path: string): Promise<T> {
      const response = await authorizedFetch(path, {
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
      loadGameLevels(),
      read<Progress>('/learning/progress/summary'),
      read<Rewards>('/learning/rewards/summary'),
      read<{
        nickname: string | null;
        avatar: string | null;
        birthYear: number | null;
      }>('/auth/me'),
    ])
      .then(([nextLevels, nextProgress, nextRewards, profile]) => {
        if (cancelled) return;
        setLevels(nextLevels);
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
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const name = user?.nickname || 'Young coder';
  const completedLevels = levels.filter((level) => level.completed);
  const allComplete =
    levels.length > 0 && completedLevels.length === levels.length;
  const currentLevel = levels.find(
    (level) => level.unlocked && !level.completed,
  );
  const percentage = levels.length
    ? Math.round((completedLevels.length / levels.length) * 100)
    : 0;
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
        {loading && <p role="status">Loading your profile...</p>}
        {!loading && !error && (
          <>
            <aside
              className="mb-6 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-5 sm:flex-row"
              aria-label="A message from Milo"
            >
              <div className="grid justify-items-center text-blue-600">
                <HappyStickman isCelebrating={allComplete} />
                <span className="text-sm font-bold">Milo</span>
              </div>
              <div className="relative max-w-md rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 text-slate-900 before:absolute before:-top-2 before:left-1/2 before:size-3 before:rotate-45 before:border-l-2 before:border-t-2 before:border-blue-200 before:bg-blue-50 sm:before:top-1/2 sm:before:-left-2 sm:before:-rotate-45">
                <p className="text-2xl font-extrabold">
                  {allComplete
                    ? '15 levels — look what you built!'
                    : 'Every little step makes you a stronger coder!'}
                </p>
                <p className="mt-2">
                  Keep exploring, keep trying, and be proud of how far
                  you&apos;ve come. I&apos;m cheering you on!
                </p>
              </div>
            </aside>
            <div className={styles.grid}>
              <aside className={styles.identity}>
                <div className={styles.bigAvatar}>
                  <ChildAvatar avatar={user?.avatar ?? null} name={name} />
                </div>
                <h2>{name}</h2>
                {user?.birthYear != null && <p>Born in {user.birthYear}</p>}
                <p>Welcome back, keep on learning!</p>
                <span className={styles.level}>
                  <Icon icon={Award} size="sm" />{' '}
                  {allComplete
                    ? 'All levels completed!'
                    : `Level ${currentLevel?.position ?? 1}`}
                </span>
                <div
                  className={styles.progress}
                  role="progressbar"
                  aria-label="Levels completed"
                  aria-valuemin={0}
                  aria-valuemax={levels.length}
                  aria-valuenow={completedLevels.length}
                >
                  <span style={{ width: `${percentage}%` }} />
                </div>
                <small>
                  {completedLevels.length} of {levels.length} levels completed ·{' '}
                  {percentage}%
                </small>
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
                    <span>Activities completed</span>
                  </article>
                  <article>
                    <Icon icon={BookOpen} />
                    <strong>
                      {completedLevels.length}/{levels.length}
                    </strong>
                    <span>Levels completed</span>
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
                  {completedLevels.length > 0 && (
                    <ul className="mt-4 grid gap-2">
                      {completedLevels.map((level) => (
                        <li key={level.id}>
                          <Link
                            className="flex items-center gap-2 text-blue-700 underline"
                            href={`/kid/levels/${level.position}`}
                          >
                            <Icon icon={ShieldCheck} size="sm" />
                            Level {level.position}: {level.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    className={styles.learnButton}
                    href={
                      allComplete
                        ? '/kid/levels'
                        : currentLevel
                          ? `/kid/levels/${currentLevel.position}`
                          : '/kid/levels'
                    }
                  >
                    {allComplete
                      ? 'Play your favourites again'
                      : 'Continue learning'}
                  </Link>
                </article>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
