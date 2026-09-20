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
    <div className="min-h-svh bg-[#deefff]">
      <header className="flex items-center justify-between pt-[0.8rem] pr-[max(1rem,_calc((100%_-_70rem)_/_2))] pb-[0.8rem] pl-[max(1rem,_calc((100%_-_70rem)_/_2))] bg-[#fff] border-b-[length:1px] border-solid border-b-[color:#ccdae8] [&_.logoMark]:w-[2rem] [&_.logoWordmark]:text-[length:1.25rem] [&_.logoLockup]:gap-[0.6rem] [&_nav]:flex [&_nav]:items-center [&_nav]:gap-[1rem] [&_nav_a]:flex [&_nav_a]:items-center [&_nav_a]:gap-[0.4rem] [&_nav_a]:pt-[0.6rem] [&_nav_a]:pr-[1rem] [&_nav_a]:pb-[0.6rem] [&_nav_a]:pl-[1rem] max-[800px]:[&_.logoCopy]:hidden">
        <Logo showTagline={false} />
        <nav>
          <Link href="/kid">
            <Icon icon={BookOpen} size="sm" /> Learn
          </Link>
          <Link
            className="text-[color:#fff] bg-[#5890eb] rounded-[1rem]"
            href="/profile"
          >
            Profile
          </Link>
        </nav>
      </header>
      <main className="w-[min(100%_-_2rem,_70rem)] mt-[0] mr-[auto] mb-[0] ml-[auto] pt-[2rem] pr-[0] pb-[4rem] pl-[0] [&_>_h1]:mb-[1.5rem]">
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
            <div className="grid grid-cols-[22rem_1fr] gap-[1.5rem] max-[800px]:grid-cols-[1fr]">
              <aside className="bg-[#fff] border-[length:1px] border-solid border-[color:#ccdbe9] rounded-[1.1rem] shadow-[0_2px_4px_rgb(30_60_90_/_8%)] grid [align-content:start] [justify-items:center] gap-[0.8rem] pt-[2.5rem] pr-[1.5rem] pb-[2.5rem] pl-[1.5rem] text-center [&_p]:text-[color:#667085] [&_small]:text-[color:#667085]">
                <div className="grid w-[7rem] h-[7rem] place-items-center text-[color:var(--color-on-primary)] bg-[var(--color-primary)] rounded-[var(--radius-xl)]">
                  <ChildAvatar avatar={user?.avatar ?? null} name={name} />
                </div>
                <h2>{name}</h2>
                {user?.birthYear != null && <p>Born in {user.birthYear}</p>}
                <p>Welcome back, keep on learning!</p>
                <span className="flex items-center gap-[0.4rem] pt-[0.45rem] pr-[0.8rem] pb-[0.45rem] pl-[0.8rem] text-[color:#4f8ff2] bg-[#f0f5ff] rounded-[999px]">
                  <Icon icon={Award} size="sm" />{' '}
                  {allComplete
                    ? 'All levels completed!'
                    : `Level ${currentLevel?.position ?? 1}`}
                </span>
                <div
                  className="w-full h-[0.65rem] mt-[0.7rem] [overflow-x:hidden] [overflow-y:hidden] bg-[#e4edfa] rounded-[999px] [&_span]:block [&_span]:h-full [&_span]:bg-[#5890eb]"
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
              <section className="grid gap-[1.25rem]">
                <div className="[&_article]:bg-[#fff] [&_article]:border-[length:1px] [&_article]:border-solid [&_article]:border-[color:#ccdbe9] [&_article]:rounded-[1.1rem] [&_article]:shadow-[0_2px_4px_rgb(30_60_90_/_8%)] [&_article]:grid [&_article]:[justify-items:center] [&_article]:gap-[0.35rem] [&_article]:pt-[2rem] [&_article]:pr-[1rem] [&_article]:pb-[2rem] [&_article]:pl-[1rem] grid grid-cols-[repeat(3,_1fr)] gap-[1rem] max-[800px]:grid-cols-[1fr] [&_svg]:text-[color:#5890eb] [&_strong]:text-[length:1.45rem] [&_span]:text-[color:#667085]">
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
                <article className="bg-[#fff] border-[length:1px] border-solid border-[color:#ccdbe9] rounded-[1.1rem] shadow-[0_2px_4px_rgb(30_60_90_/_8%)] p-[1.5rem] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[0.5rem] [&_h2]:mb-[1.2rem] [&_h2]:text-[length:1rem]">
                  <h2>
                    <Icon icon={Award} size="sm" /> Achievements
                  </h2>
                  {rewards.rewards.length ? (
                    <div className="grid grid-cols-[repeat(2,_1fr)] gap-[0.8rem] max-[800px]:grid-cols-[1fr] [&_>_div]:flex [&_>_div]:gap-[0.8rem] [&_>_div]:pt-[1rem] [&_>_div]:pr-[1rem] [&_>_div]:pb-[1rem] [&_>_div]:pl-[1rem] [&_>_div]:border-[length:1px] [&_>_div]:border-solid [&_>_div]:border-[color:#dce6f1] [&_>_div]:rounded-[0.9rem] [&_svg]:text-[color:#5890eb] [&_span]:grid [&_small]:text-[color:#667085]">
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
                    <p className="text-[color:#667085]">
                      Your earned achievements will appear here.
                    </p>
                  )}
                </article>
                <article className="bg-[#fff] border-[length:1px] border-solid border-[color:#ccdbe9] rounded-[1.1rem] shadow-[0_2px_4px_rgb(30_60_90_/_8%)] p-[1.5rem] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-[0.5rem] [&_h2]:mb-[1.2rem] [&_h2]:text-[length:1rem]">
                  <h2>
                    <Icon icon={BookOpen} size="sm" /> Learning summary
                  </h2>
                  <p className="text-[color:#667085]">
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
                    className="inline-block mt-[1rem] pt-[0.65rem] pr-[1rem] pb-[0.65rem] pl-[1rem] text-[color:#fff] bg-[#5890eb] rounded-[0.7rem]"
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
