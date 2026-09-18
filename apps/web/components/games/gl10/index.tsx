'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  Check,
  Icon,
  Play,
  RotateCcw,
  Sparkles,
  Undo2,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

const targetRows = 3;
const targetColumns = 4;
const emptyGarden = Array.from({ length: targetRows }, () =>
  Array(targetColumns).fill(false),
);

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL10({ onComplete }: { onComplete?: () => void }) {
  const [rows, setRows] = useState<number | null>(null);
  const [columns, setColumns] = useState<number | null>(null);
  const [garden, setGarden] = useState<boolean[][]>(emptyGarden);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);
  const [message, setMessage] = useState(
    'Build one repeat loop inside another repeat loop.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function undoChoice() {
    if (columns !== null) {
      setColumns(null);
    } else {
      setRows(null);
    }
    setMissionPassed(false);
    setMessage('Choose the row and tile numbers for your loops.');
    setGuideMood('idle');
  }

  async function runProgram() {
    if (!rows || !columns) {
      setMessage('Choose a number for both repeat loops first.');
      setGuideMood('thinking');
      return;
    }

    setIsRunning(true);
    setMissionPassed(false);
    setGarden(
      Array.from({ length: targetRows }, () =>
        Array(targetColumns).fill(false),
      ),
    );
    setActiveCell(null);
    setGuideMood('idle');
    setMessage(
      'The outer loop is making rows; the inner loop is planting tiles...',
    );

    const planted = Array.from({ length: targetRows }, () =>
      Array(targetColumns).fill(false),
    );

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        setActiveCell([row, column]);
        await wait(350);
        if (row < targetRows && column < targetColumns) {
          const gardenRow = planted[row];
          if (!gardenRow) continue;
          gardenRow[column] = true;
          setGarden(planted.map((gardenRow) => [...gardenRow]));
        }
      }
    }

    setActiveCell(null);
    setIsRunning(false);

    if (rows !== targetRows || columns !== targetColumns) {
      setMessage(
        'The garden shape is not right. Try 3 rows and 4 tiles per row.',
      );
      setGuideMood('thinking');
      return;
    }

    setMissionPassed(true);
    setMessage('Garden complete! Your nested loops created the pattern.');
    setGuideMood('happy');
    onComplete?.();
  }

  function resetGame() {
    setRows(null);
    setColumns(null);
    setGarden(
      Array.from({ length: targetRows }, () =>
        Array(targetColumns).fill(false),
      ),
    );
    setActiveCell(null);
    setIsRunning(false);
    setMissionPassed(false);
    setMessage('Build one repeat loop inside another repeat loop.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Use REPEAT 3 for the rows and put REPEAT 4 inside it for the tiles."
        tutorial={[
          'Goal: build a whole garden using two repeat loops.',
          'A loop inside another loop is called a nested loop. One loop makes rows; the inner loop fills each row.',
          'Choose the number of rows first, then the tiles in each row. You can do this!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-lime-200 border-l-4 border-l-lime-600 bg-lime-50 p-5 dark:border-lime-800 dark:bg-lime-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-lime-700 dark:text-lime-300">
            <Icon icon={Sparkles} size="sm" /> Nested loops
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Garden Builder
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            The outside loop repeats rows. The inside loop repeats tiles in each
            row.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.9fr)_minmax(20rem,1fr)]">
          <div className="grid content-start gap-4 rounded-2xl border border-lime-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Target garden</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-bold">
                {garden.flat().filter(Boolean).length}/
                {targetRows * targetColumns}
              </span>
            </div>
            <div className="grid gap-2 rounded-xl bg-slate-900 p-4">
              {garden.map((row, rowIndex) => (
                <div className="grid grid-cols-4 gap-2" key={rowIndex}>
                  {row.map((planted, columnIndex) => {
                    const isActive =
                      activeCell?.[0] === rowIndex &&
                      activeCell?.[1] === columnIndex;
                    return (
                      <div
                        className={`grid aspect-square place-items-center rounded-lg border text-xs font-bold transition ${
                          isActive
                            ? 'border-amber-300 bg-amber-300/30 text-amber-100'
                            : planted
                              ? 'border-lime-400 bg-lime-400/30 text-lime-100'
                              : 'border-slate-700 bg-slate-800 text-slate-500'
                        }`}
                        key={columnIndex}
                      >
                        {planted ? <Icon icon={Check} size="sm" /> : 'empty'}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              REPEAT rows {`{ REPEAT tiles { PLANT } }`}
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Fill the outer loop
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {[2, 3, 4].map((number) => (
                  <Button
                    key={number}
                    variant={rows === number ? 'secondary' : 'outline'}
                    disabled={isRunning}
                    onClick={() => setRows(number)}
                  >
                    Rows: {number}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                2. Fill the inner loop
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {[3, 4, 5].map((number) => (
                  <Button
                    key={number}
                    variant={columns === number ? 'secondary' : 'outline'}
                    disabled={isRunning}
                    onClick={() => setColumns(number)}
                  >
                    Tiles: {number}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-2 border-dashed border-lime-300 bg-white p-3 font-mono dark:border-lime-700 dark:bg-slate-900">
              <p className="font-bold text-lime-700 dark:text-lime-300">
                REPEAT {rows ?? '_'} ROWS {'{'}
              </p>
              <p className="mt-2 rounded bg-lime-50 px-3 py-2 pl-6 font-bold text-lime-950 dark:bg-lime-950/50 dark:text-lime-100">
                REPEAT {columns ?? '_'} TILES {'{ PLANT }'}
              </p>
              <p className="font-bold text-lime-700 dark:text-lime-300">
                {'}'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runProgram}
                disabled={isRunning}
                className="min-w-32 flex-1"
              >
                <Icon icon={Play} size="sm" />{' '}
                {isRunning ? 'Running...' : 'Run program'}
              </Button>
              <Button
                onClick={undoChoice}
                disabled={isRunning || (!rows && !columns)}
                variant="secondary"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {missionPassed && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-lime-100 p-3 text-center font-extrabold text-lime-800 dark:bg-lime-950 dark:text-lime-200">
                <Icon icon={ArrowRight} size="sm" /> Level complete!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
