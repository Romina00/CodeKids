'use client';

import { useEffect, useState } from 'react';
import { loadGameLevels, type GameLevel } from '../../lib/game-progress';
import { Badge } from '@repo/ui/badge';
import { Icon, Play, Rocket, Trophy } from '@repo/ui/icon';
import Link from 'next/link';
import styles from './kid-dashboard.module.css';

export default function KidDashboard() {
  const [levels, setLevels] = useState<GameLevel[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    loadGameLevels()
      .then((records) => {
        if (!cancelled) setLevels(records);
      })
      .catch(() => {
        if (!cancelled)
          setError('Could not load your progress. Please reload to try again.');
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const currentLevel = levels?.find(
    (level) => level.unlocked && !level.completed,
  );
  const completedCount = levels?.filter((level) => level.completed).length ?? 0;
  return (
    <>
      <header className={styles.welcome} id="home">
        <div>
          <Badge variant="primary">Your coding space</Badge>
          <h1>Ready for your next coding adventure?</h1>
          <p>
            Choose a level, solve the challenge, and see your ideas come to
            life.
          </p>
        </div>
        <div className={styles.welcomeIcon} aria-hidden="true">
          <Icon icon={Rocket} size="xl" />
        </div>
      </header>
      <section className={styles.continueCard} aria-labelledby="continue-title">
        <div className={styles.continueCopy}>
          <span className={styles.eyebrow}>Your progress</span>
          {!levels ? (
            <p role="status">{error || 'Loading your progress...'}</p>
          ) : (
            <>
              <h2 id="continue-title">
                {currentLevel
                  ? `Level ${currentLevel.position}: ${currentLevel.title}`
                  : completedCount === 15
                    ? 'All levels completed!'
                    : 'No levels available yet'}
              </h2>
              <p>{completedCount} of 15 levels completed</p>
              {currentLevel && (
                <Link
                  className={styles.primaryAction}
                  href={`/kid/levels/${currentLevel.position}`}
                >
                  <Icon icon={Play} size="sm" />
                  Continue learning
                </Link>
              )}
            </>
          )}
          <Link className={styles.secondaryAction} href="/kid/levels">
            Browse all levels
          </Link>
        </div>
        <div className={styles.challengePreview} aria-hidden="true">
          <Icon icon={Trophy} size="xl" />
          <span>Build. Test. Learn.</span>
        </div>
      </section>
    </>
  );
}
