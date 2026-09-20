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
    available:
      '[&_.ck-learning-path-status]:text-[color:var(--color-primary)] [&_.ck-learning-path-pathMarker]:bg-[var(--color-primary)] [&_.ck-learning-path-levelCard]:border-[color:color-mix(_in_srgb,_var(--color-primary)_45%,_var(--color-border)_)]',
    completed:
      '[&_.ck-learning-path-pathMarker]:text-[color:var(--color-on-primary)] [&_.ck-learning-path-pathMarker]:bg-[var(--color-success)] [&_.ck-learning-path-levelNumber]:text-[color:var(--color-on-primary)] [&_.ck-learning-path-levelNumber]:bg-[var(--color-success)] [&_.ck-learning-path-levelCard]:border-[color:color-mix(_in_srgb,_var(--color-success)_55%,_var(--color-border)_)] [&_.ck-learning-path-status]:text-[color:var(--color-success)]',
    current:
      '[&_.ck-learning-path-pathMarker]:text-[color:var(--color-on-primary)] [&_.ck-learning-path-pathMarker]:bg-[var(--color-primary)] [&_.ck-learning-path-pathMarker]:shadow-[0_0_0_var(--space-2)_color-mix(in_srgb,_var(--color-primary)_18%,_transparent)] [&_.ck-learning-path-levelNumber]:text-[color:var(--color-on-primary)] [&_.ck-learning-path-levelNumber]:bg-[var(--color-primary)] [&_.ck-learning-path-levelCard]:bg-[color-mix(in_srgb,_var(--color-primary)_8%,_var(--color-surface))] [&_.ck-learning-path-levelCard]:border-[length:2px] [&_.ck-learning-path-levelCard]:border-solid [&_.ck-learning-path-levelCard]:border-[color:var(--color-primary)] [&_.ck-learning-path-levelCard]:shadow-[var(--shadow-sm)] [&_.ck-learning-path-status]:text-[color:var(--color-primary)]',
    locked:
      '[&_.ck-learning-path-levelCard]:text-[color:var(--color-text-muted)] [&_.ck-learning-path-levelCard]:bg-[var(--color-surface-subtle)] [&_.ck-learning-path-status]:text-[color:var(--color-text-muted)]',
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
      className="grid w-[min(100%,_52rem)] gap-8 pb-10 mt-[0] mr-[auto] mb-[0] ml-[auto] max-[640px]:gap-6"
      aria-labelledby="learning-path-title"
    >
      <header className="grid [justify-items:center] gap-2 text-center [&_h1]:max-w-[17ch] [&_h1]:text-[length:clamp(var(--font-size-2xl),_5vw,_3rem)] [&_h1]:leading-[var(--text-heading-line-height)] [&_h1]:tracking-[-0.04em] [&_p]:text-[color:var(--color-text-muted)]">
        <span className="inline-flex items-center gap-2 text-[color:var(--color-primary)] text-[length:var(--font-size-sm)] font-bold tracking-[0.04em] uppercase">
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

      <section
        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 pt-4 pr-5 pb-4 pl-5 text-[color:var(--color-text)] bg-[color-mix(_in_srgb,_var(--color-warning)_14%,_var(--color-surface)_)] border-[length:1px] border-solid border-[color:color-mix(in_srgb,_var(--color-warning)_40%,_var(--color-border))] rounded-[var(--radius-xl)] max-[640px]:grid-cols-[auto_1fr] [&_div:nth-child(2)]:grid [&_div:nth-child(2)]:gap-1 [&_span]:text-[color:var(--color-text-muted)] [&_span]:text-[length:var(--font-size-sm)] [&_>_svg]:text-[color:var(--color-warning)] max-[640px]:[&_>_svg]:hidden"
        aria-label="Level progress"
      >
        <div
          className="grid w-[3rem] h-[3rem] text-[color:var(--color-on-primary)] bg-[var(--color-primary)] rounded-[var(--radius-full)] place-items-center"
          aria-hidden="true"
        >
          <Icon icon={Rocket} size="lg" />
        </div>
        <div>
          <strong>{completedCount} levels completed</strong>
          <span>{15 - completedCount} adventures are waiting for you</span>
        </div>
        <Icon icon={Trophy} size="lg" aria-hidden="true" />
      </section>

      <ol
        className="grid gap-4 p-[0] mt-[0] mr-[0] mb-[0] ml-[0] list-none"
        aria-label="Learning levels"
      >
        {levels.map((level, index) => {
          const status = getLevelStatus(level, currentLevelNumber);
          const isOpen = status !== 'locked';
          const cardContent = (
            <>
              <span className="ck-learning-path-levelNumber grid w-[2rem] h-[2rem] text-[color:var(--color-text-muted)] bg-[var(--color-surface-subtle)] rounded-[var(--radius-full)] text-[length:var(--font-size-sm)] font-bold place-items-center">
                {level.number}
              </span>
              <span className="grid min-w-0 gap-1 [&_strong]:[overflow-x:hidden] [&_strong]:[overflow-y:hidden] [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_small]:[overflow-x:hidden] [&_small]:[overflow-y:hidden] [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&_small]:text-[color:var(--color-text-muted)] [&_small]:text-[length:var(--font-size-xs)]">
                <strong>{level.title}</strong>
                <small>{level.topic}</small>
              </span>
              <span className="ck-learning-path-status inline-flex items-center gap-1 text-[length:var(--font-size-xs)] font-bold whitespace-nowrap max-[640px]:col-[2]">
                <StatusIcon status={status} />
                {getStatusLabel(status)}
              </span>
            </>
          );

          return (
            <li
              className={`relative grid grid-cols-[3rem_minmax(0,_1fr)] gap-4 max-[640px]:grid-cols-[2.5rem_minmax(0,_1fr)] max-[640px]:gap-3 [&:not(:last-child)::after]:absolute [&:not(:last-child)::after]:top-[3rem] [&:not(:last-child)::after]:bottom-[calc(var(--space-4)_*_-1)] [&:not(:last-child)::after]:left-[calc(1.5rem_-_1px)] [&:not(:last-child)::after]:border-l-[length:2px] [&:not(:last-child)::after]:border-dashed [&:not(:last-child)::after]:border-l-[color:var(--color-border)] [&:not(:last-child)::after]:[content:''] max-[640px]:[&:not(:last-child)::after]:top-[2.5rem] max-[640px]:[&:not(:last-child)::after]:left-[calc(1.25rem_-_1px)] ${getStatusClass(status)}`}
              key={level.number}
            >
              <span
                className="ck-learning-path-pathMarker z-[1] grid w-[3rem] h-[3rem] text-[color:var(--color-on-primary)] bg-[var(--color-text-muted)] border-[length:4px] border-solid border-[color:var(--color-surface-subtle)] rounded-[var(--radius-full)] place-items-center max-[640px]:w-[2.5rem] max-[640px]:h-[2.5rem]"
                aria-hidden="true"
              >
                {index === levels.length - 1 ? (
                  <Icon icon={Trophy} size="sm" />
                ) : (
                  <Icon
                    className="[transform:rotate(180deg)]"
                    icon={Footprints}
                    size="sm"
                  />
                )}
              </span>
              {isOpen ? (
                <Link
                  className="ck-learning-path-levelCard grid grid-cols-[auto_minmax(0,_1fr)_auto] items-center gap-3 min-h-[4.5rem] pt-3 pr-4 pb-3 pl-4 text-[color:var(--color-text)] bg-[var(--color-surface)] border-[length:1px] border-solid border-[color:var(--color-border)] rounded-[var(--radius-lg)] max-[640px]:grid-cols-[auto_minmax(0,_1fr)] [a&:hover]:shadow-[var(--shadow-md)] [a&:hover]:[transform:translateY(-2px)] [a&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [a&:focus-visible]:outline-offset-[3px]"
                  href={`/kid/levels/${level.number}`}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  className="ck-learning-path-levelCard grid grid-cols-[auto_minmax(0,_1fr)_auto] items-center gap-3 min-h-[4.5rem] pt-3 pr-4 pb-3 pl-4 text-[color:var(--color-text)] bg-[var(--color-surface)] border-[length:1px] border-solid border-[color:var(--color-border)] rounded-[var(--radius-lg)] max-[640px]:grid-cols-[auto_minmax(0,_1fr)] [a&:hover]:shadow-[var(--shadow-md)] [a&:hover]:[transform:translateY(-2px)] [a&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [a&:focus-visible]:outline-offset-[3px]"
                  aria-label={`Level ${level.number}: locked`}
                >
                  {cardContent}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="grid [justify-items:center] gap-2 text-center [&_h1]:max-w-[17ch] [&_h1]:text-[length:clamp(var(--font-size-2xl),_5vw,_3rem)] [&_h1]:leading-[var(--text-heading-line-height)] [&_h1]:tracking-[-0.04em] [&_p]:text-[color:var(--color-text-muted)]">
        More levels coming soon. Your coding adventure continues!
      </p>
    </section>
  );
}
