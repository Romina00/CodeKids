'use client';

import {
  Check,
  Footprints,
  Icon,
  LockKeyhole,
  Map as MapIcon,
  Play,
  Rocket,
  Trophy,
} from '@repo/ui/icon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadGameLevels } from '../../lib/game-progress';
import styles from './learning-path.module.css';
import { HappyStickman } from '../../components/games/game-guide';

type LevelStatus = 'available' | 'completed' | 'current' | 'locked';

type LearningLevel = {
  number: number;
  title: string;
  topic: string;
  completed: boolean;
  unlocked: boolean;
};

const LEVEL_DETAILS = [
  { number: 1, title: 'Tom & Jerry', topic: 'Sequences' },
  { number: 2, title: 'Pizza order', topic: 'Sequences' },
  { number: 3, title: 'Treasure loop', topic: 'Loops' },
  { number: 4, title: 'True or false', topic: 'Conditions' },
  { number: 5, title: 'If adventure', topic: 'Conditions' },
  { number: 6, title: 'Secret gates', topic: 'Logic' },
  { number: 7, title: 'Coin count', topic: 'Counting' },
  { number: 8, title: 'Data types', topic: 'Data' },
  { number: 9, title: 'Robot Cleaner', topic: 'Functions' },
  { number: 10, title: 'Garden Builder', topic: 'Patterns' },
  { number: 11, title: 'Connect the Path', topic: 'Problem solving' },
  { number: 12, title: 'Mission Planner', topic: 'Planning' },
  { number: 13, title: 'Build a Castle', topic: 'Structures' },
  { number: 14, title: 'Wizard Spells', topic: 'Functions' },
  { number: 15, title: 'Build Your Own Mini Game', topic: 'Create' },
];

const initialLevels: LearningLevel[] = LEVEL_DETAILS.map((level) => ({
  ...level,
  completed: false,
  unlocked: false,
}));

function getLevelStatus(
  level: LearningLevel,
  currentLevelNumber: number | undefined,
): LevelStatus {
  if (level.completed) return 'completed';
  if (level.number === currentLevelNumber) return 'current';
  return level.unlocked ? 'available' : 'locked';
}

function getStatusLabel(status: LevelStatus) {
  if (status === 'completed') return 'Completed';
  if (status === 'current') return 'Play next';
  if (status === 'available') return 'Open';
  return 'Locked';
}

function getStatusClass(status: LevelStatus) {
  const statusClasses = {
    available: styles.levelAvailable,
    completed: styles.levelCompleted,
    current: styles.levelCurrent,
    locked: styles.levelLocked,
  };
  return statusClasses[status];
}

function StatusIcon({ status }: { status: LevelStatus }) {
  if (status === 'completed') return <Icon icon={Check} size="sm" />;
  if (status === 'locked') return <Icon icon={LockKeyhole} size="sm" />;
  return <Icon icon={Play} size="sm" />;
}

export function LearningPath() {
  const [levels, setLevels] = useState(initialLevels);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadGameLevels()
      .then((progressLevels) => {
        if (cancelled) return;
        const progressByPosition = new Map(
          progressLevels.map((level) => [level.position, level]),
        );
        setLevels((currentLevels) =>
          currentLevels.map((level) => {
            const progress = progressByPosition.get(level.number);
            return progress
              ? { ...level, ...progress }
              : { ...level, unlocked: false };
          }),
        );
      })
      .catch(() => {
        if (!cancelled)
          setError('Could not load your progress. Please reload to try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const completedCount = levels.filter((level) => level.completed).length;
  const currentLevelNumber = levels.find(
    (level) => level.unlocked && !level.completed,
  )?.number;

  if (loading || error)
    return <p role="status">{error || 'Loading your progress...'}</p>;

  return (
    <section
      className={styles.learningPath}
      aria-labelledby="learning-path-title"
    >
      <header className={styles.heading}>
        <span className={styles.eyebrow}>
          <Icon icon={MapIcon} size="sm" /> Your journey
        </span>
        <h1 id="learning-path-title">Follow the path to become a coder</h1>
        <p>One small challenge at a time. You&apos;ve got this!</p>
      </header>

      <aside
        className="flex flex-col items-center justify-center gap-5 rounded-3xl bg-blue-50 p-5 sm:flex-row sm:gap-8 dark:bg-slate-900"
        aria-label="A message from Milo"
      >
        <div className="order-2 grid shrink-0 justify-items-center text-blue-600 sm:order-1 dark:text-blue-400">
          <HappyStickman isCelebrating={false} />
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold dark:bg-slate-800">
            Milo
          </span>
        </div>
        <div className="relative order-1 max-w-sm rounded-2xl border-2 border-blue-200 bg-white p-5 text-slate-900 after:absolute after:-bottom-2 after:left-1/2 after:size-3 after:-translate-x-1/2 after:rotate-45 after:border-b-2 after:border-r-2 after:border-blue-200 after:bg-white sm:order-2 sm:after:bottom-auto sm:after:-left-2 sm:after:top-1/2 sm:after:translate-x-0 sm:after:rotate-[135deg] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:after:border-slate-600 dark:after:bg-slate-800">
          <p className="text-2xl font-extrabold leading-snug">
            15 levels. One coding adventure. Let&apos;s go!
          </p>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Try, learn, and build something awesome. I&apos;m here to help!
          </p>
        </div>
      </aside>

      <section className={styles.progressCard} aria-label="Level progress">
        <div className={styles.progressIcon} aria-hidden="true">
          <Icon icon={Rocket} size="lg" />
        </div>
        <div>
          <strong>{completedCount} levels completed</strong>
          <span>{15 - completedCount} adventures are waiting for you</span>
        </div>
        <Icon icon={Trophy} size="lg" aria-hidden="true" />
      </section>

      <ol className={styles.levels} aria-label="Learning levels">
        {levels.map((level, index) => {
          const status = getLevelStatus(level, currentLevelNumber);
          const isOpen = status !== 'locked';
          const cardContent = (
            <>
              <span className={styles.levelNumber}>{level.number}</span>
              <span className={styles.levelCopy}>
                <strong>{level.title}</strong>
                <small>{level.topic}</small>
              </span>
              <span className={styles.status}>
                <StatusIcon status={status} />
                {getStatusLabel(status)}
              </span>
            </>
          );

          return (
            <li
              className={`${styles.level} ${getStatusClass(status)}`}
              key={level.number}
            >
              <span className={styles.pathMarker} aria-hidden="true">
                {index === levels.length - 1 ? (
                  <Icon icon={Trophy} size="sm" />
                ) : (
                  <Icon
                    className={styles.footprints}
                    icon={Footprints}
                    size="sm"
                  />
                )}
              </span>
              {isOpen ? (
                <Link
                  className={styles.levelCard}
                  href={`/kid/levels/${level.number}`}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  className={styles.levelCard}
                  aria-label={`Level ${level.number}: locked`}
                >
                  {cardContent}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
