'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { authorizedFetch } from '../../../../lib/auth-session';
import { type GameLevel, loadGameLevels } from '../../../../lib/game-progress';
import GameGL1 from '../../../../components/games/gl1';
import GameGL2 from '../../../../components/games/gl2';
import GameGL3 from '../../../../components/games/gl3';
import GameGL4 from '../../../../components/games/gl4';
import GameGL5 from '../../../../components/games/gl5';
import GameGL6 from '../../../../components/games/gl6';
import GameGL7 from '../../../../components/games/gl7';
import GameGL8 from '../../../../components/games/gl8';
import GameGL9 from '../../../../components/games/gl9';
import GameGL10 from '../../../../components/games/gl10';
import GameGL11 from '../../../../components/games/gl11';
import GameGL12 from '../../../../components/games/gl12';
import GameGL13 from '../../../../components/games/gl13';
import GameGL14 from '../../../../components/games/gl14';
import GameGL15 from '../../../../components/games/gl15';
import { LevelNavigation } from './level-navigation';
import styles from './level-page.module.css';

const games = {
  1: GameGL1,
  2: GameGL2,
  3: GameGL3,
  4: GameGL4,
  5: GameGL5,
  6: GameGL6,
  7: GameGL7,
  8: GameGL8,
  9: GameGL9,
  10: GameGL10,
  11: GameGL11,
  12: GameGL12,
  13: GameGL13,
  14: GameGL14,
  15: GameGL15,
};

const levelDetails = {
  1: { title: 'Tom & Jerry', objective: 'Guide Tom to Jerry with commands.' },
  2: {
    title: 'Pizza order',
    objective: 'Build a pizza recipe in the right order.',
  },
  3: {
    title: 'Treasure loop',
    objective: 'Choose the Boolean value that solves the mission.',
  },
  4: {
    title: 'True or false',
    objective: 'Pick the conditions needed to open the gate.',
  },
  5: {
    title: 'If adventure',
    objective: 'Find one correct way to open the gate.',
  },
  6: {
    title: 'Secret gates',
    objective: 'Change the coins variable to reach the target.',
  },
  7: {
    title: 'Coin count',
    objective: 'Match each variable with the right value type.',
  },
  8: { title: 'Data types', objective: 'Build an if statement for the robot.' },
  9: { title: 'Robot Cleaner', objective: 'Use a loop to clean every tile.' },
  10: {
    title: 'Garden Builder',
    objective: 'Create a garden with nested loops.',
  },
  11: {
    title: 'Connect the Path',
    objective: 'Plan the drone route with a flowchart.',
  },
  12: {
    title: 'Mission Planner',
    objective: 'Put the robot plan in a useful order.',
  },
  13: {
    title: 'Build a Castle',
    objective: 'Solve the castle one small part at a time.',
  },
  14: {
    title: 'Wizard Spells',
    objective: 'Use one function to light both torches.',
  },
  15: { title: 'Mini Game', objective: 'Create and test your own mini game.' },
};

export function LevelGame({ levelId }: { levelId: number }) {
  const [levels, setLevels] = useState<GameLevel[] | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const completed = useRef(false);
  const [needsSave, setNeedsSave] = useState(false);
  const levelRecord = levels?.find((level) => level.position === levelId);
  const activity = levelRecord?.activities.find(
    (item) => item.content?.game === `gl${levelId}`,
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const records = await loadGameLevels();
        if (cancelled) return;
        const level = records.find((item) => item.position === levelId);
        const game = level?.activities.find(
          (item) => item.content?.game === `gl${levelId}`,
        );
        if (!level || !game) throw new Error('This game is not available yet.');
        if (level.unlocked && !game.completed) {
          await saveProgress(level.id, game.id, 'IN_PROGRESS');
        }
        if (!cancelled) {
          completed.current = game.completed;
          setLevels(records);
        }
      } catch {
        if (!cancelled)
          setError('Could not load your progress. Please reload to try again.');
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [levelId]);

  async function completeGame() {
    if (!levelRecord || !activity || pending.current || completed.current)
      return;
    pending.current = true;
    setSaving(true);
    setNeedsSave(true);
    setError('');
    try {
      await saveProgress(levelRecord.id, activity.id, 'COMPLETED');
      const records = await loadGameLevels();
      setLevels(records);
      completed.current = true;
      setNeedsSave(false);
    } catch {
      setError(
        'Your progress could not be saved. Please try again before leaving.',
      );
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  const Game = games[Number(levelId) as keyof typeof games];

  if (!Game) {
    return <p>Level not found</p>;
  }

  if (!levels)
    return <p role="status">{error || 'Loading your progress...'}</p>;
  if (!levelRecord?.unlocked)
    return (
      <p>
        Complete the previous level first.{' '}
        <Link href="/kid">Back to your journey</Link>
      </p>
    );

  const completedCount = levels.filter((item) => item.completed).length;
  const currentLevel = Number(levelId);
  const level = levelDetails[currentLevel as keyof typeof levelDetails];

  return (
    <div className={styles.levelPage}>
      <header className={styles.levelHeader}>
        <div>
          <span>Level {levelId} of 15</span>
          <h1>{level.title}</h1>
          <p>{level.objective}</p>
        </div>
        <div className={styles.levelProgress}>
          <span>Journey progress</span>
          <progress max={15} value={completedCount}>
            {completedCount} of 15
          </progress>
        </div>
      </header>
      <div className={styles.gameFrame}>
        <Game
          onComplete={() => {
            void completeGame();
          }}
        />
      </div>
      <p role="status">
        {saving
          ? 'Saving progress...'
          : error ||
            (activity?.completed
              ? 'Completed — progress saved.'
              : 'In progress')}
      </p>
      {needsSave && !saving && (
        <button
          type="button"
          onClick={() => {
            void completeGame();
          }}
        >
          Retry saving
        </button>
      )}
      <LevelNavigation
        levelId={currentLevel}
        totalLevels={15}
        nextUnlocked={
          !needsSave &&
          !!levels.find((item) => item.position === currentLevel + 1)?.unlocked
        }
      />
    </div>
  );
}

async function saveProgress(
  levelId: number,
  activityId: number,
  status: 'IN_PROGRESS' | 'COMPLETED',
) {
  const response = await authorizedFetch('/learning/progress', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ levelId, activityId, status }),
  });
  if (!response.ok) throw new Error('Could not save progress.');
}
