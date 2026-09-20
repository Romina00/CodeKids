'use client';

import { Badge } from '@repo/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import { useEffect, useState } from 'react';
import { ChildAvatar } from '../../components/child-avatar';
import {
  authorizedFetch,
  getAccessToken,
  readApiError,
} from '../../lib/auth-session';
import { EnterKidsMode } from './profile-actions';

type ChildSummary = {
  id: number;
  nickname: string | null;
  avatar: string | null;
  birthYear: number | null;
  learningLevel: string | null;
  learningStatistics: { averageScore: number };
};

type Dashboard = { children: ChildSummary[] };

export function ChildProfiles() {
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [status, setStatus] = useState('Loading profiles…');

  useEffect(() => {
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
        <span className="text-[var(--color-text-muted)]">
          {children.length} profiles
        </span>
      </div>
      {status ? <p role="status">{status}</p> : null}
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
                {index === 0 ? <Badge variant="success">Viewing</Badge> : null}
              </CardHeader>
              <CardContent>
                {child.birthYear !== null && <p>Born in {child.birthYear}</p>}
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
                <EnterKidsMode childId={child.id} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
