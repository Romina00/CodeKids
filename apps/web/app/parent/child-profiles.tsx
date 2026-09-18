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
  apiBaseUrl,
  getAccessToken,
  readApiError,
} from '../../lib/auth-session';
import styles from './parent-dashboard.module.css';
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

    fetch(`${apiBaseUrl}/parents/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.eyebrow}>Family profiles</span>
          <h2 id="children-title">Children</h2>
        </div>
        <span>{children.length} profiles</span>
      </div>
      {status ? <p role="status">{status}</p> : null}
      <div className={styles.childGrid}>
        {children.map((child, index) => {
          const name = child.nickname || 'Young coder';
          const progress = child.learningStatistics?.averageScore ?? 0;
          return (
            <Card
              className={index === 0 ? styles.activeChild : undefined}
              key={child.id}
            >
              <CardHeader>
                <div className={styles.childIdentity}>
                  <span className={styles.avatar}>
                    <ChildAvatar avatar={child.avatar} name={name} />
                  </span>
                  <span>
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
                <div className={styles.progressLabel}>
                  <span>Overall progress</span>
                  <strong>{progress}%</strong>
                </div>
                <div
                  aria-label={`${name} overall progress`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={progress}
                  className={styles.progressTrack}
                  role="progressbar"
                >
                  <span style={{ width: `${progress}%` }} />
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
