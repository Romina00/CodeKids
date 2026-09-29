'use client';

import { useEffect, useState } from 'react';
import { loadGameLevels, type GameLevel } from '../../lib/game-progress';
import { Badge } from '@repo/ui/badge';
import { Icon, Play, Rocket, Trophy } from '@repo/ui/icon';
import Link from 'next/link';

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
      <header
        className="flex items-center justify-between gap-6 max-[720px]:items-start max-[720px]:flex-col [&_>_div:first-child]:grid [&_>_div:first-child]:gap-2 [&_>_div:first-child]:[justify-items:start] [&_h1]:mt-2 [&_h1]:text-[length:clamp(var(--font-size-2xl),_5vw,_3.5rem)] [&_h1]:leading-[var(--text-heading-line-height)] [&_h1]:tracking-[-0.045em] [&_h1]:max-w-[15ch] [&_p]:text-[color:var(--color-text-muted)] [&_p]:leading-[var(--line-height-relaxed)] [&_p]:max-w-[56ch]"
        id="home"
      >
        <div>
          <Badge variant="primary">Your coding space</Badge>
          <h1>Are You Ready for your next coding adventure?</h1>
          <p>
            Choose a level, solve the challenge, and see your ideas come to
            life.
          </p>
        </div>
        <div
          className="grid text-[color:var(--color-primary)] bg-[color-mix(_in_srgb,_var(--color-primary)_10%,_var(--color-surface)_)] rounded-[var(--radius-xl)] place-items-center w-[5rem] h-[5rem] [flex:none] max-[640px]:w-[3.5rem] max-[640px]:h-[3.5rem]"
          aria-hidden="true"
        >
          <Icon icon={Rocket} size="xl" />
        </div>
      </header>
      <section
        className="grid grid-cols-[minmax(0,_1.3fr)_minmax(13rem,_0.7fr)] [overflow-x:hidden] [overflow-y:hidden] bg-[var(--color-surface)] border-[length:1px] border-solid border-[color:var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] max-[720px]:grid-cols-[1fr]"
        aria-labelledby="continue-title"
      >
        <div className="grid gap-4 [justify-items:start] p-[clamp(var(--space-6),_5vw,_var(--space-10))] [&_p]:text-[color:var(--color-text-muted)] [&_p]:leading-[var(--line-height-relaxed)] [&_h2]:text-[length:clamp(var(--font-size-xl),_3vw,_var(--font-size-2xl))] [&_h2]:leading-[var(--text-heading-line-height)]">
          <span className="text-[color:var(--color-primary)] text-[length:var(--font-size-xs)] font-bold tracking-[0.08em] uppercase">
            Your progress
          </span>
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
                  className="flex items-center min-h-[3rem] gap-2 px-5 text-[color:var(--color-on-primary)] bg-[var(--color-primary)] rounded-[var(--radius-control)] font-bold [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
                  href={`/kid/levels/${currentLevel.position}`}
                >
                  <Icon icon={Play} size="sm" />
                  Continue learning
                </Link>
              )}
            </>
          )}
          <Link
            className="text-[color:var(--color-primary)] font-semibold [text-decoration:underline] [text-underline-offset:var(--space-1)] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
            href="/kid/levels"
          >
            Browse all levels
          </Link>
        </div>
        <div
          className="grid text-[color:var(--color-primary)] bg-[color-mix(_in_srgb,_var(--color-primary)_10%,_var(--color-surface)_)] rounded-[var(--radius-xl)] place-items-center [align-content:center] gap-3 min-h-[14rem] p-6 font-bold text-center max-[640px]:min-h-[9rem] [&_svg]:w-[4.5rem] [&_svg]:h-[4.5rem]"
          aria-hidden="true"
        >
          <Icon icon={Trophy} size="xl" />
          <span>Build. Test. Learn.</span>
        </div>
      </section>
    </>
  );
}
