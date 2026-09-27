'use client';

import { Badge } from '@repo/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import { ArrowRight, Icon } from '@repo/ui/icon';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ChildAvatar } from '../../components/child-avatar';
import {
  authorizedFetch,
  getAccessToken,
  readApiError,
} from '../../lib/auth-session';
import {
  AddChildProfile,
  EditChildProfile,
  EnterKidsMode,
} from './profile-actions';

type ChildSummary = {
  id: number;
  nickname: string | null;
  avatar: string | null;
  birthYear: number | null;
  learningLevel: string | null;
  lastKidsModeAt: string | null;
  completedLevels: number;
  earnedRewards: number;
  timeSpentMinutes: number;
  learningStatistics: { averageScore: number };
};

type Dashboard = {
  children: ChildSummary[];
  totals: {
    children: number;
    completedLevels: number;
    rewards: number;
    timeSpentMinutes: number;
  };
};

export function ChildProfiles() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [totals, setTotals] = useState<Dashboard['totals'] | null>(null);
  const [status, setStatus] = useState('Loading profiles…');

  const loadDashboard = useCallback(() => {
    const token = getAccessToken();
    if (!token) {
      setStatus('Please sign in to view child profiles.');
      return;
    }

    authorizedFetch('/parents/dashboard')
      .then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response));
        return response.json() as Promise<Dashboard>;
      })
      .then((dashboard) => {
        setChildren(dashboard.children);
        setTotals(dashboard.totals);
        setStatus(
          dashboard.children.length
            ? ''
            : 'No child profiles yet. Add one to get started.',
        );
      })
      .catch((error: unknown) => {
        setStatus(
          error instanceof Error
            ? error.message
            : 'Profiles could not be loaded.',
        );
      });
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const lastViewedChildId = children
    .filter((child) => child.lastKidsModeAt)
    .sort((left, right) =>
      String(right.lastKidsModeAt).localeCompare(String(left.lastKidsModeAt)),
    )[0]?.id;

  return (
    <>
      <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
        <div className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">
            Family profiles
          </span>
          <h2
            id="children-title"
            className="text-[length:var(--font-size-2xl)] leading-[var(--text-heading-line-height)]"
          >
            Children
          </h2>
        </div>
        <AddChildProfile label="Add profile" onCreated={loadDashboard} />
      </div>
      {status ? <p role="status">{status}</p> : null}
      {totals ? (
        <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <strong>{totals.children}</strong>
            <p className="text-sm text-[var(--color-text-muted)]">Children</p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <strong>{totals.completedLevels}</strong>
            <p className="text-sm text-[var(--color-text-muted)]">
              Levels done
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <strong>{totals.rewards}</strong>
            <p className="text-sm text-[var(--color-text-muted)]">Rewards</p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <strong>{totals.timeSpentMinutes}</strong>
            <p className="text-sm text-[var(--color-text-muted)]">Minutes</p>
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {children.map((child, index) => {
          const name = child.nickname || 'Young coder';
          const progress = child.learningStatistics?.averageScore ?? 0;
          return (
            <Card
              className={
                index === 0
                  ? 'shadow-none! border-[var(--color-primary)]!'
                  : 'shadow-none!'
              }
              key={child.id}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="grid size-13 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-lg font-bold text-[var(--color-on-primary)]">
                    <ChildAvatar avatar={child.avatar} name={name} />
                  </span>
                  <span className="grid gap-1">
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>
                      {child.learningLevel || 'Beginner'}
                    </CardDescription>
                  </span>
                </div>
                {child.id === lastViewedChildId ? (
                  <Badge variant="success">Last opened</Badge>
                ) : null}
              </CardHeader>
              <CardContent>
                {child.birthYear !== null && <p>Born in {child.birthYear}</p>}
                <div className="mb-4 mt-2 grid grid-cols-3 gap-2 text-sm">
                  <span>
                    <strong>{child.completedLevels}</strong>
                    <small className="block text-[var(--color-text-muted)]">
                      Levels
                    </small>
                  </span>
                  <span>
                    <strong>{child.earnedRewards}</strong>
                    <small className="block text-[var(--color-text-muted)]">
                      Rewards
                    </small>
                  </span>
                  <span>
                    <strong>{child.timeSpentMinutes}</strong>
                    <small className="block text-[var(--color-text-muted)]">
                      Minutes
                    </small>
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Overall progress</span>
                  <strong>{progress}%</strong>
                </div>
                <div
                  aria-label={`${name} overall progress`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={progress}
                  className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-subtle)]"
                  role="progressbar"
                >
                  <span
                    className="block h-full bg-[var(--color-primary)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <Link
                  className="mt-5 flex min-h-11 items-center gap-2 font-semibold text-[var(--color-primary)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus-ring)]"
                  href={`/parent/children/${child.id}`}
                >
                  View learning path <Icon icon={ArrowRight} size="sm" />
                </Link>
                <EnterKidsMode childId={child.id} />
                <EditChildProfile child={child} onSaved={loadDashboard} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
