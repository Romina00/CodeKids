'use client';

import { Button } from '@repo/ui/button';
import { ArrowLeft, ArrowRight, Icon } from '@repo/ui/icon';
import { useRouter } from 'next/navigation';

type LevelNavigationProps = {
  levelId: number;
  totalLevels: number;
};

export function LevelNavigation({
  levelId,
  totalLevels,
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
        <span className="truncate">Previous game</span>
      </Button>

      <Button
        className="max-w-[48%] gap-2"
        disabled={levelId === totalLevels}
        variant="primary"
        onClick={() => router.push(`/kid/levels/${levelId + 1}`)}
      >
        <span className="truncate">Next game</span>
        <Icon icon={ArrowRight} size="sm" />
      </Button>
    </nav>
  );
}
