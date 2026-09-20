'use client';

import { Button } from '@repo/ui/button';
import { ArrowLeft, ArrowRight, Icon, Rocket } from '@repo/ui/icon';
import { useRouter } from 'next/navigation';

type LevelNavigationProps = {
  levelId: number;
  totalLevels: number;
  nextUnlocked: boolean;
};

export function LevelNavigation({
  levelId,
  totalLevels,
  nextUnlocked,
}: LevelNavigationProps) {
  const router = useRouter();

  return (
    <nav
      aria-label="Level navigation"
      className="flex w-full min-w-0 justify-between gap-3"
    >
      <Button
        className="max-w-[48%] gap-2"
        disabled={levelId === 1}
        variant="outline"
        onClick={() => router.push(`/kid/levels/${levelId - 1}`)}
      >
        <Icon icon={ArrowLeft} size="sm" />
        <span>Previous game</span>
      </Button>

      {levelId === totalLevels ? (
        <p className="flex items-center gap-3 rounded-[var(--radius-xl)] border-2 border-[var(--color-primary)] bg-[var(--color-surface-subtle)] px-5 py-3 text-[length:var(--font-size-lg)] font-bold text-[var(--color-text)] shadow-[var(--shadow-md)]">
          <Icon
            icon={Rocket}
            size="lg"
            className="shrink-0 text-[var(--color-primary)]"
          />
          More levels coming soon!
        </p>
      ) : (
        <Button
          className="max-w-[48%] gap-2"
          disabled={levelId === totalLevels || !nextUnlocked}
          variant="primary"
          onClick={() => router.push(`/kid/levels/${levelId + 1}`)}
        >
          <span>Next game</span>
          <Icon icon={ArrowRight} size="sm" />
        </Button>
      )}
    </nav>
  );
}
