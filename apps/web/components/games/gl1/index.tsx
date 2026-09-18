'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';
import { DirectionalCat } from './directional-cat';
import { Jerry } from './jerry';

const rows = 5;
const columns = 4;

type Direction = 'up' | 'right' | 'down' | 'left';
type Command = 'forward' | 'left' | 'right';

type Robot = {
  row: number;
  column: number;
  direction: Direction;
};

const startPosition: Robot = { row: 4, column: 0, direction: 'right' };
const goal = { row: 0, column: 3 };
const walls = [
  { row: 3, column: 0 },
  { row: 2, column: 2 },
  { row: 1, column: 2 },
];

const commandDetails = {
  forward: { icon: '↑', label: 'Move forward' },
  left: { icon: '↶', label: 'Turn left' },
  right: { icon: '↷', label: 'Turn right' },
};

const directionAfterLeftTurn: Record<Direction, Direction> = {
  up: 'left',
  left: 'down',
  down: 'right',
  right: 'up',
};

const directionAfterRightTurn: Record<Direction, Direction> = {
  up: 'right',
  right: 'down',
  down: 'left',
  left: 'up',
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function hasWall(row: number, column: number) {
  return walls.some((wall) => wall.row === row && wall.column === column);
}

function isOutsideBoard(row: number, column: number) {
  return row < 0 || row >= rows || column < 0 || column >= columns;
}

function getNextPosition(robot: Robot) {
  const nextPosition = { row: robot.row, column: robot.column };

  if (robot.direction === 'up') nextPosition.row -= 1;
  if (robot.direction === 'right') nextPosition.column += 1;
  if (robot.direction === 'down') nextPosition.row += 1;
  if (robot.direction === 'left') nextPosition.column -= 1;

  return nextPosition;
}

export default function GameGL1({ onComplete }: { onComplete?: () => void }) {
  const [robot, setRobot] = useState<Robot>(startPosition);
  const [commands, setCommands] = useState<Command[]>([]);
  const [activeCommand, setActiveCommand] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Build a program that helps Tom reach Jerry.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function addCommand(command: Command) {
    setCommands([...commands, command]);
    setMessage('Great! Add more commands or run your program.');
    setGuideMood('idle');
  }

  function undoLastCommand() {
    setCommands(commands.slice(0, -1));
  }

  function resetGame() {
    setRobot({ ...startPosition });
    setCommands([]);
    setActiveCommand(null);
    setMessage('Build a program that helps Tom reach Jerry.');
    setGuideMood('idle');
  }

  async function runProgram() {
    if (commands.length === 0) {
      setMessage('Add at least one command before you press Run.');
      setGuideMood('sad');
      return;
    }

    setIsRunning(true);
    setGuideMood('idle');
    setMessage('Tom is running your program...');

    const currentRobot = { ...startPosition };
    setRobot({ ...currentRobot });
    await wait(300);

    for (let index = 0; index < commands.length; index += 1) {
      const command = commands[index];
      setActiveCommand(index);

      if (command === 'left') {
        currentRobot.direction = directionAfterLeftTurn[currentRobot.direction];
      }

      if (command === 'right') {
        currentRobot.direction =
          directionAfterRightTurn[currentRobot.direction];
      }

      if (command === 'forward') {
        const nextPosition = getNextPosition(currentRobot);
        const moveIsBlocked =
          isOutsideBoard(nextPosition.row, nextPosition.column) ||
          hasWall(nextPosition.row, nextPosition.column);

        if (moveIsBlocked) {
          setMessage(`Command ${index + 1} moves Tom into a wall.`);
          setGuideMood('sad');
          setIsRunning(false);
          return;
        }

        currentRobot.row = nextPosition.row;
        currentRobot.column = nextPosition.column;
      }

      setRobot({ ...currentRobot });
      await wait(500);
    }

    setActiveCommand(null);
    setIsRunning(false);

    const reachedJerry =
      currentRobot.row === goal.row && currentRobot.column === goal.column;

    if (reachedJerry) {
      setMessage('You did it! Your program helped Tom reach Jerry.');
      setGuideMood('happy');
      onComplete?.();
    } else {
      setMessage('The program finished, but Tom did not reach Jerry yet.');
      setGuideMood('sad');
    }
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Move forward, turn left, move forward 4 times, turn right, then move forward 2 times."
        tutorial={[
          'Goal: help Tom reach Jerry by placing commands in the right order.',
          'Move forward takes Tom one square ahead. Turn left and turn right only change where he faces.',
          'Build your steps from top to bottom, then press Run. You can try again as often as you like!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-blue-200 border-l-4 border-l-blue-600 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/40">
          <p className="text-sm font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            Algorithm · Sequence
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            Tom &amp; Jerry
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Put the commands in the correct order, then run your program.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(20rem,1fr)_minmax(18rem,0.8fr)]">
          <div
            dir="ltr"
            aria-label="Tom and Jerry game board"
            className="grid grid-cols-4 gap-2 rounded-2xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/40"
          >
            {Array.from({ length: rows }).map((_, row) =>
              Array.from({ length: columns }).map((_, column) => {
                const tomIsHere = robot.row === row && robot.column === column;
                const jerryIsHere = goal.row === row && goal.column === column;
                const wallIsHere = hasWall(row, column);

                return (
                  <div
                    key={`${row}-${column}`}
                    className={`grid aspect-square place-items-center rounded-xl border shadow-sm ${
                      wallIsHere
                        ? 'border-slate-500 bg-slate-500'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                    }`}
                  >
                    {wallIsHere && (
                      <span aria-label="Wall" className="text-2xl">
                        🧱
                      </span>
                    )}
                    {tomIsHere && (
                      <DirectionalCat
                        direction={robot.direction}
                        className="h-14 w-14 transition-transform duration-300 sm:h-16 sm:w-16"
                      />
                    )}
                    {!tomIsHere && jerryIsHere && (
                      <Jerry className="h-14 w-14 sm:h-16 sm:w-16" />
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose commands
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                {(Object.keys(commandDetails) as Command[]).map((command) => (
                  <Button
                    key={command}
                    variant="outline"
                    disabled={isRunning}
                    onClick={() => addCommand(command)}
                    className="justify-start gap-2"
                  >
                    <span aria-hidden="true" className="text-xl">
                      {commandDetails[command].icon}
                    </span>
                    {commandDetails[command].label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  2. Your program
                </h3>
                <span className="text-sm font-bold text-slate-500">
                  {commands.length} commands
                </span>
              </div>

              <ol
                aria-live="polite"
                className="mt-3 grid min-h-24 content-start gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900"
              >
                {commands.length === 0 && (
                  <li className="m-auto text-center text-sm font-semibold text-slate-500">
                    Your command blocks will appear here.
                  </li>
                )}

                {commands.map((command, index) => (
                  <li
                    key={`${command}-${index}`}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 font-bold transition ${
                      activeCommand === index
                        ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                        : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-100'
                    }`}
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-blue-600 text-xs text-white">
                      {index + 1}
                    </span>
                    <span aria-hidden="true" className="text-xl">
                      {commandDetails[command].icon}
                    </span>
                    {commandDetails[command].label}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runProgram}
                disabled={isRunning}
                className="min-w-28 flex-1"
              >
                {isRunning ? 'Running...' : '▶ Run program'}
              </Button>
              <Button
                onClick={undoLastCommand}
                disabled={isRunning || commands.length === 0}
                variant="secondary"
              >
                Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
