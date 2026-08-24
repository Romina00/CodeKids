'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { DirectionalCat } from './directional-cat';
import { GameGuide, type GuideMood } from '../game-guide';
import styles from './game.module.css';

const numberOfRows = 5;
const numberOfColumns = 4;

type Direction = 'up' | 'right' | 'down' | 'left';
type Command = 'forward' | 'left' | 'right';

type Position = {
  row: number;
  col: number;
};

type Robot = Position & {
  direction: Direction;
};

const startPosition: Robot = {
  row: 4,
  col: 0,
  direction: 'right',
};

const goal: Position = { row: 0, col: 3 };

const walls = [
  { row: 3, col: 0 },
  { row: 2, col: 2 },
  { row: 1, col: 2 },
];

function cellHasWall(row: number, col: number) {
  return walls.some((wall) => wall.row === row && wall.col === col);
}

function getCommandIcon(command: Command) {
  if (command === 'forward') {
    return '⬆';
  }

  if (command === 'left') {
    return '⟲';
  }

  return '⟳';
}

export default function GameGL1() {
  const [robot, setRobot] = useState<Robot>(startPosition);
  const [commands, setCommands] = useState<Command[]>([]);
  const [message, setMessage] = useState('Find the path.');
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function addCommand(command: Command) {
    setCommands([...commands, command]);
  }

  async function runCommands() {
    const currentRobot = { ...startPosition };
    setRobot(currentRobot);

    for (const command of commands) {
      if (command === 'left') {
        if (currentRobot.direction === 'up') {
          currentRobot.direction = 'left';
        } else if (currentRobot.direction === 'left') {
          currentRobot.direction = 'down';
        } else if (currentRobot.direction === 'down') {
          currentRobot.direction = 'right';
        } else {
          currentRobot.direction = 'up';
        }
      }

      if (command === 'right') {
        if (currentRobot.direction === 'up') {
          currentRobot.direction = 'right';
        } else if (currentRobot.direction === 'right') {
          currentRobot.direction = 'down';
        } else if (currentRobot.direction === 'down') {
          currentRobot.direction = 'left';
        } else {
          currentRobot.direction = 'up';
        }
      }

      if (command === 'forward') {
        let newRow = currentRobot.row;
        let newCol = currentRobot.col;

        if (currentRobot.direction === 'up') {
          newRow = newRow - 1;
        } else if (currentRobot.direction === 'right') {
          newCol = newCol + 1;
        } else if (currentRobot.direction === 'down') {
          newRow = newRow + 1;
        } else {
          newCol = newCol - 1;
        }

        const hitWall = cellHasWall(newRow, newCol);
        const outside =
          newRow < 0 ||
          newRow >= numberOfRows ||
          newCol < 0 ||
          newCol >= numberOfColumns;

        if (outside || hitWall) {
          setMessage('You cannot move there!');
          setGuideMood('sad');
          return;
        }

        currentRobot.row = newRow;
        currentRobot.col = newCol;
      }

      setRobot({ ...currentRobot });
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    const reachedGoal =
      currentRobot.row === goal.row && currentRobot.col === goal.col;

    if (reachedGoal) {
      setMessage('You won!');
      setGuideMood('happy');
    } else {
      setMessage('Try again and find Jerry.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setRobot(startPosition);
    setCommands([]);
    setMessage('Find the best path');
    setGuideMood('idle');
  }

  return (
    <main className={styles.game}>
      <GameGuide mood={guideMood} message={message} />
      <div className={styles.missionPanel}>
        <span className={styles.levelLabel}>Algorithms</span>
        <h2>Tom &amp; Jerry</h2>
        <p>Tom wants to catch Jerry. Help him!</p>
      </div>

      <div aria-live="polite">
        <p className={styles.statusMessage}>{message}</p>
      </div>

      <div
        dir="ltr"
        className="grid w-full grid-cols-4 gap-2 rounded-2xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/40"
      >
        {Array.from({ length: numberOfRows }).map((_, row) =>
          Array.from({ length: numberOfColumns }).map((_, col) => {
            const isRobotHere = robot.row === row && robot.col === col;
            const isGoalHere = goal.row === row && goal.col === col;
            const isWallHere = cellHasWall(row, col);

            return (
              <div
                key={`${row}-${col}`}
                className={`grid aspect-square min-w-0 place-items-center overflow-hidden rounded-xl border shadow-sm ${
                  isWallHere ? 'bg-slate-500' : 'bg-slate-50'
                }`}
              >
                {isRobotHere && (
                  <DirectionalCat
                    direction={robot.direction}
                    className="h-14 w-14 overflow-visible transition-transform duration-300 sm:h-16 sm:w-16"
                  />
                )}

                {!isRobotHere && isGoalHere && (
                  <span className="text-xs font-bold sm:text-sm">
                    {' '}
                    {/* Jerry SVG source: https://icons8.com/icon/ZWwA8bv48g5i/jerry */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="100"
                      height="100"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#f57c00"
                        d="M34,8c-4-4-8,10-8,10l11,2C37,20,38.5,12.5,34,8z"
                      ></path>
                      <path
                        fill="#fb8c00"
                        d="M24,15c3-2,11-3,11-3s-8.539,0.269-10,1c0,0,2-2,2-4c0,0-3,5-8,5c0,0-7.5-8.5-13-3 c-3.5,3.5-2,21,11.703,24.44c1.161,0.292,3.166,4.222,8.443,5.277c3.98,0.796,23.132-2.911,14.968-9.866 c-0.626-0.534-0.852-1.409-0.597-2.192c0.5-1.536,1.271-3.953,0.483-6.659c-0.593-2.037-1-4-6-6C32.205,14.882,24,15,24,15z"
                      ></path>
                      <path
                        fill="#ffcdd2"
                        d="M12,23c0,0,3,4,5,0c2.542-5.083-6.778-14.166-11-11S4,33,17.703,35.44c0,0-3.87-6.274-0.703-9.44 C17,26,14.111,28.277,12,23z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M29.313,31.219c0,0-7.095-11.529-1.774-11.011c1.149,0.112,2.162,0.803,2.783,1.776 c1.095,1.717,2.512,5.005,1.101,9.236H29.313z"
                      ></path>
                      <path
                        fill="#fff"
                        d="M36.7,31.219c0,0-3.045-11.837,1.055-9.499C40,23,38.811,31.219,38.811,31.219H36.7z"
                      ></path>
                      <path
                        fill="#212121"
                        d="M31.922,29.262c0-1.801-0.584-3.262-1.305-3.262c-0.72,0-1.305,1.46-1.305,3.262 c0,0.738,0.102,1.411,0.267,1.957h2.076C31.82,30.672,31.922,29.999,31.922,29.262z"
                      ></path>
                      <path
                        fill="#212121"
                        d="M37.742,28.483c0-1.457-0.473-2.638-1.055-2.638c-0.346,0-0.644,0.436-0.835,1.082 c0.321,2.194,0.835,4.195,0.835,4.195C37.27,31.122,37.742,29.94,37.742,28.483z"
                      ></path>
                      <path
                        fill="#ffe082"
                        d="M28.257,31.219c0,0,3.166-1.055,6.332,1.055c0,0,3.166-3.166,5.277,0c0,0,1.055,2.111-2.111,3.166 c0,0,0.521,3.449-4.756,5.56c0,0-1.5,5.5-7,0c0,0-2-2-3.02-6.615C22.98,34.385,31.423,36.496,28.257,31.219z"
                      ></path>
                      <path
                        fill="#212121"
                        d="M36,36c-0.825,0.3-1.41-0.56-1.41-0.56c-4.118,2.059-6.222-0.895-6.323-1.042 C27.973,34.568,26.404,33.94,26,34c0,0,0.75,2.25,1,3c2,6,4.423,3.717,4.423,3.717C33.598,37.818,34,37,36,36z"
                      ></path>
                      <path
                        fill="#ff5252"
                        d="M28.579,37.442C27.818,36.503,27,37,27,37c2,8,5,3,5,3C31.197,37.591,29.209,37.288,28.579,37.442z"
                      ></path>
                      <path
                        fill="#212121"
                        d="M33.534,32.274L35.06,33.8c0.349,0.349,0.902,0.396,1.297,0.101 c1.187-0.887,3.001-2.682-1.767-2.682C32.479,31.219,33.534,32.274,33.534,32.274z"
                      ></path>
                      <path
                        fill="#fb8c00"
                        d="M28,29c0,0,6,8-4,6l-5-1L28,29z"
                      ></path>
                      <ellipse
                        cx="35.117"
                        cy="31.855"
                        fill="#fff"
                        rx="1"
                        ry=".334"
                      ></ellipse>
                      <path d="M36,19c0.518-0.332,1.118-0.461,1.699-0.509c0.55-0.041,1.097,0.018,1.63,0.126c-0.262-0.276-0.578-0.551-0.949-0.826 c-0.267,0.056-0.532,0.119-0.787,0.212C36.992,18.224,36.412,18.536,36,19z"></path>
                      <path d="M23.5,21.5c-0.055-0.83,0.121-1.672,0.505-2.45c0.377-0.764,1.091-1.511,2.048-1.706c0.951-0.2,1.838,0.125,2.583,0.516 c0.349,0.239,0.701,0.472,1.012,0.744c0.297,0.292,0.587,0.584,0.852,0.896c-0.38-0.173-0.734-0.364-1.082-0.557 c-0.354-0.181-0.726-0.311-1.069-0.485c-0.725-0.229-1.448-0.42-2.102-0.261c-0.646,0.15-1.19,0.619-1.625,1.226 C24.186,20.033,23.83,20.743,23.5,21.5z"></path>
                    </svg>
                  </span>
                )}
              </div>
            );
          }),
        )}
      </div>

      <div className={styles.commandPanel} aria-label="Movement commands">
        <h3>Plan Tom&apos;s moves</h3>
        <div className={styles.commandButtons}>
          <Button
            onClick={() => addCommand('forward')}
            variant="outline"
            className={styles.commandButton}
          >
            <span aria-hidden="true">⬆</span> Forward
          </Button>

          <Button
            onClick={() => addCommand('left')}
            variant="outline"
            className={styles.commandButton}
          >
            <span aria-hidden="true">↶</span> Turn left
          </Button>

          <Button
            onClick={() => addCommand('right')}
            variant="outline"
            className={styles.commandButton}
          >
            <span aria-hidden="true">↷</span> Turn right
          </Button>
        </div>
      </div>

      <div className={styles.commandPlan} aria-live="polite">
        {commands.length === 0
          ? 'Your plan goes here.'
          : commands.map(getCommandIcon).join('  ')}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={runCommands} className="min-w-28">
          GO
        </Button>

        <Button onClick={resetGame} variant="secondary">
          Reset
        </Button>
      </div>
    </main>
  );
}
