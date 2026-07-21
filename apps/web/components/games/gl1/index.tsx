'use client';

import { Button } from '@repo/ui/button';
import { Cat, Icon } from '@repo/ui/icon';
import { useState } from 'react';

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
  direction: 'up',
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
    } else {
      setMessage('Try again and find Jerry.');
    }
  }

  function resetGame() {
    setRobot(startPosition);
    setCommands([]);
    setMessage('Find the best path');
  }

  return (
    <main className="grid w-full max-w-lg gap-5 rounded-3xl border  p-4  shadow-lg sm:p-6">
      <div className="grid gap-1 text-center">
        <span className="text-xs font-bold ">Coding challenge</span>
        <h2 className="text-2xl leading-tight font-bold">Tom &amp; Jerry</h2>
        <p>{message}</p>
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
                  <Icon
                    icon={Cat}
                    label="Tom"
                    size="xl"
                    className="text-orange-500 drop-shadow-sm"
                  />
                )}

                {!isRobotHere && isGoalHere && (
                  <span className="text-xs font-bold sm:text-sm">Jerry</span>
                )}
              </div>
            );
          }),
        )}
      </div>

      <div
        className="flex flex-wrap justify-center gap-2"
        aria-label="Movement commands"
      >
        <Button
          onClick={() => addCommand('forward')}
          variant="outline"
          className="flex-1 gap-2 sm:flex-none"
        >
          <span aria-hidden="true">⬆</span> Forward
        </Button>

        <Button
          onClick={() => addCommand('left')}
          variant="outline"
          className="flex-1 gap-2 sm:flex-none"
        >
          <span aria-hidden="true">↶</span> Left
        </Button>

        <Button
          onClick={() => addCommand('right')}
          variant="outline"
          className="flex-1 gap-2 sm:flex-none"
        >
          <span aria-hidden="true">↷</span> Right
        </Button>
      </div>

      <div
        className="min-h-12 rounded-xl border border-dashed   p-3 text-center font-semibold "
        aria-live="polite"
      >
        {commands.length === 0
          ? 'Command Not Found!'
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
