'use client';

import { Badge } from '@repo/ui/badge';
import {
  ArrowLeft,
  Award,
  Check,
  Icon,
  LockKeyhole,
  Play,
} from '@repo/ui/icon';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import {
  LearningPathView,
  type LearningPathLevel,
} from '../../../kid/learning-path';
import { ChildAvatar } from '../../../../components/child-avatar';
import { authorizedFetch, readApiError } from '../../../../lib/auth-session';
import type { GameLevel } from '../../../../lib/game-progress';

type ChildSummary = {
  id: number;
  nickname: string | null;
  avatar: string | null;
  birthYear: number | null;
  learningLevel: string | null;
  completedLevels: number;
  earnedRewards: number;
  timeSpentMinutes: number;
  learningStatistics: { averageScore: number };
};

type Dashboard = { children: ChildSummary[] };

type ParentGameLevel = Omit<GameLevel, 'activities'> & {
  activities: {
    id: number;
    title: string;
    completed: boolean;
    estimatedMinutes: number;
    content: { game?: string } | null;
  }[];
};

type RewardSummary = {
  xp: number;
  rewards: {
    id: number;
    title: string;
    description: string | null;
    earnedAt: string;
  }[];
};

const levelTopics = [
  'Sequences',
  'Sequences',
  'Loops',
  'Conditions',
  'Conditions',
  'Logic',
  'Counting',
  'Data',
  'Functions',
  'Patterns',
  'Problem solving',
  'Planning',
  'Structures',
  'Functions',
  'Create',
];

function toPathLevel(level: GameLevel): LearningPathLevel {
  return {
    number: level.position,
    title: level.title,
    topic: levelTopics[level.position - 1] ?? 'Coding',
    completed: level.completed,
    unlocked: level.unlocked,
  };
}

export default function ParentChildPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);
  const id = Number(childId);
  const [child, setChild] = useState<ChildSummary | null>(null);
  const [levels, setLevels] = useState<LearningPathLevel[]>([]);
  const [levelDetails, setLevelDetails] = useState<ParentGameLevel[]>([]);
  const [rewards, setRewards] = useState<RewardSummary | null>(null);
  const [status, setStatus] = useState('Loading child progress...');

  useEffect(() => {
    let active = true;

    Promise.all([
      authorizedFetch('/parents/dashboard').then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response));
        return response.json() as Promise<Dashboard>;
      }),
      authorizedFetch(`/parents/children/${id}/levels`).then(
        async (response) => {
          if (!response.ok) throw new Error(await readApiError(response));
          return response.json() as Promise<ParentGameLevel[]>;
        },
      ),
      authorizedFetch(`/parents/children/${id}/rewards`).then(
        async (response) => {
          if (!response.ok) throw new Error(await readApiError(response));
          return response.json() as Promise<RewardSummary>;
        },
      ),
    ])
      .then(([dashboard, records, rewardSummary]) => {
        if (!active) return;
        const selectedChild =
          dashboard.children.find((item) => item.id === id) ?? null;
        const gameLevels = records.filter(
          (level) => level.slug === `game-gl${level.position}`,
        );
        setChild(selectedChild);
        setLevelDetails(gameLevels);
        setLevels(gameLevels.map(toPathLevel));
        setRewards(rewardSummary);
        setStatus(selectedChild ? '' : 'Child profile was not found.');
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStatus(
          error instanceof Error
            ? error.message
            : 'Child progress could not be loaded.',
        );
      });

    return () => {
      active = false;
    };
  }, [id]);

  const name = child?.nickname || 'Young coder';
  const completedActivities = levelDetails.flatMap((level) =>
    level.activities
      .filter((activity) => activity.completed)
      .map((activity) => ({ ...activity, levelTitle: level.title })),
  );
  const nextLevel = levelDetails.find(
    (level) => level.unlocked && !level.completed,
  );

  return (
    <main
      className="min-h-svh bg-[var(--color-surface-subtle)] px-5 py-8 text-[var(--color-text)]"
      id="main-content"
    >
      <div className="mx-auto grid w-[min(100%,_64rem)] gap-8">
        <Link
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--color-primary)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus-ring)]"
          href="/parent"
        >
          <Icon icon={ArrowLeft} size="sm" /> Parent dashboard
        </Link>

        {status ? <p role="status">{status}</p> : null}

        {child ? (
          <>
            <section className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 max-sm:flex-col max-sm:items-start">
              <span className="grid size-16 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-on-primary)]">
                <ChildAvatar avatar={child.avatar} name={name} />
              </span>
              <div className="grid gap-2">
                <Badge variant="primary">Read-only progress</Badge>
                <h1 className="text-[length:var(--font-size-2xl)] leading-[var(--text-heading-line-height)]">
                  {name}
                </h1>
                <p className="text-[var(--color-text-muted)]">
                  {child.completedLevels} levels completed,{' '}
                  {child.earnedRewards} rewards earned, {child.timeSpentMinutes}{' '}
                  minutes spent.
                </p>
              </div>
            </section>

            <LearningPathView levels={levels} readOnly childName={name} />

            {child.completedLevels === 0 && completedActivities.length === 0 ? (
              <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h2 className="text-[length:var(--font-size-xl)]">
                  No saved progress yet
                </h2>
                <p className="mt-2 text-[var(--color-text-muted)]">
                  Once {name} completes a level, this page will show the latest
                  steps, rewards, and unlocked lessons.
                </p>
              </section>
            ) : null}

            <section className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] gap-5 max-md:grid-cols-1">
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Icon icon={Play} size="sm" />
                  <h2 className="text-[length:var(--font-size-xl)]">
                    Next step
                  </h2>
                </div>
                {nextLevel ? (
                  <p>
                    Level {nextLevel.position}: {nextLevel.title}
                  </p>
                ) : (
                  <p>All available levels are complete.</p>
                )}
              </div>

              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Icon icon={Award} size="sm" />
                  <h2 className="text-[length:var(--font-size-xl)]">Rewards</h2>
                </div>
                <p className="mb-3 text-[var(--color-text-muted)]">
                  {rewards?.xp ?? 0} XP earned
                </p>
                <ul className="grid gap-3 p-0">
                  {rewards?.rewards.slice(0, 5).map((reward) => (
                    <li
                      className="list-none rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] p-3"
                      key={reward.id}
                    >
                      <strong>{reward.title}</strong>
                      {reward.description ? (
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {reward.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {!rewards?.rewards.length ? (
                  <p className="text-[var(--color-text-muted)]">
                    No rewards earned yet.
                  </p>
                ) : null}
              </div>
            </section>

            <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h2 className="mb-4 text-[length:var(--font-size-xl)]">
                Activities
              </h2>
              <div className="grid gap-3">
                {levelDetails.map((level) => (
                  <div
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4"
                    key={level.id}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <strong>
                        Level {level.position}: {level.title}
                      </strong>
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                        <Icon
                          icon={
                            level.completed
                              ? Check
                              : level.unlocked
                                ? Play
                                : LockKeyhole
                          }
                          size="sm"
                        />
                        {level.completed
                          ? 'Complete'
                          : level.unlocked
                            ? 'Unlocked'
                            : 'Locked'}
                      </span>
                    </div>
                    <ul className="grid gap-2 p-0">
                      {level.activities.map((activity) => (
                        <li
                          className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] p-3 text-sm"
                          key={activity.id}
                        >
                          <span>{activity.title}</span>
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Icon
                              icon={activity.completed ? Check : Play}
                              size="sm"
                            />
                            {activity.completed ? 'Done' : 'Not done'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
