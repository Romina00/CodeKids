'use client';

import { Button } from '@repo/ui/button';
import { ArrowLeft, ArrowRight, Icon } from '@repo/ui/icon';
import { useRouter } from 'next/navigation';
import styles from './level-page.module.css';

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
    <nav aria-label="Level navigation" className={styles.levelNavigation}>
      <Button
        className={styles.levelNavigationButton}
        disabled={levelId === 1}
        variant="outline"
        onClick={() => router.push(`/kid/levels/${levelId - 1}`)}
      >
        <Icon icon={ArrowLeft} size="sm" />
        <span>Previous game</span>
      </Button>

      <Button
        className={styles.levelNavigationButton}
        disabled={levelId === totalLevels || !nextUnlocked}
        variant="primary"
        onClick={() => router.push(`/kid/levels/${levelId + 1}`)}
      >
        <span>Next game</span>
        <Icon icon={ArrowRight} size="sm" />
      </Button>
    </nav>
  );
}
