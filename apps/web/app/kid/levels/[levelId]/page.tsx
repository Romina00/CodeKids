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

export default async function LevelPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const Game = games[Number(levelId) as keyof typeof games];

  if (!Game) {
    return <p>Level not found</p>;
  }

  const currentLevel = Number(levelId);

  return (
    <div className={styles.levelPage}>
      <header className={styles.levelHeader}>
        <span>Challenge {levelId} of 15</span>
        <h1>Level {levelId}</h1>
      </header>
      <div className={styles.gameFrame}>
        <Game />
      </div>
      <LevelNavigation levelId={currentLevel} totalLevels={15} />
    </div>
  );
}
