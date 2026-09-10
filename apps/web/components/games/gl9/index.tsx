'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  BatteryCharging,
  Bot,
  Check,
  Footprints,
  Icon,
  Play,
  RotateCcw,
  Undo2,
  Zap,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Step = 'move' | 'clean';

const stepDetails: Record<Step, { label: string; icon: typeof Footprints }> = {
  move: { label: 'Move forward', icon: Footprints },
  clean: { label: 'Clean tile', icon: Zap },
};

const emptyTiles = [false, false, false, false, false];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL9() {
  const [repeatCount, setRepeatCount] = useState<number | null>(null);
  const [loopSteps, setLoopSteps] = useState<Step[]>([]);
  const [cleanedTiles, setCleanedTiles] = useState(emptyTiles);
  const [robotPosition, setRobotPosition] = useState(0);
  const [activeStep, setActiveStep] = useState<Step | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);
  const [message, setMessage] = useState(
    'Build a repeat block that cleans all five tiles.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function addStep(step: Step) {
    if (loopSteps.length === 2) return;

    setLoopSteps([...loopSteps, step]);
    setMissionPassed(false);
    setMessage('Your loop is growing. Put Clean before Move.');
    setGuideMood('idle');
  }

  function undoStep() {
    setLoopSteps(loopSteps.slice(0, -1));
    setMissionPassed(false);
    setMessage('Choose the next step inside the loop.');
    setGuideMood('idle');
  }

  async function runProgram() {
    if (!repeatCount || loopSteps.length === 0) {
      setMessage('Choose a repeat number and add steps inside the loop.');
      setGuideMood('sad');
      return;
    }

    setIsRunning(true);
    setMissionPassed(false);
    setCleanedTiles([...emptyTiles]);
    setRobotPosition(0);
    setGuideMood('idle');
    setMessage('The robot is running your loop...');

    const tiles = [...emptyTiles];
    let position = 0;

    for (let round = 0; round < repeatCount; round += 1) {
      for (const step of loopSteps) {
        setActiveStep(step);
        await wait(450);

        if (step === 'move') {
          position = Math.min(position + 1, tiles.length - 1);
          setRobotPosition(position);
        } else {
          tiles[position] = true;
          setCleanedTiles([...tiles]);
        }
      }
    }

    setActiveStep(null);
    setIsRunning(false);

    const correctLoop =
      repeatCount === 5 && loopSteps[0] === 'clean' && loopSteps[1] === 'move';

    if (!correctLoop) {
      setMessage(
        'The robot ran the loop, but not all tiles were cleaned. Check the number and order.',
      );
      setGuideMood('sad');
      return;
    }

    setMissionPassed(true);
    setMessage('Efficient cleaning! One loop cleaned every tile.');
    setGuideMood('happy');
  }

  function resetGame() {
    setRepeatCount(null);
    setLoopSteps([]);
    setCleanedTiles([...emptyTiles]);
    setRobotPosition(0);
    setActiveStep(null);
    setIsRunning(false);
    setMissionPassed(false);
    setMessage('Build a repeat block that cleans all five tiles.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[18rem_1fr] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Use REPEAT 5 TIMES with Clean tile, then Move forward inside it."
      />

      <section className="grid min-w-0 content-start gap-5">
        <header className="rounded-2xl border border-emerald-200 border-l-4 border-l-emerald-600 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <Icon icon={Zap} size="sm" /> Loops
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Robot Cleaner
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Put the repeated actions in a loop so the robot can clean the whole
            corridor.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.9fr)_minmax(20rem,1fr)]">
          <div className="grid content-start gap-4 rounded-2xl border border-emerald-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Cleaning corridor</h3>
              <span className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-sm font-bold">
                <Icon icon={BatteryCharging} size="sm" />{' '}
                {cleanedTiles.filter(Boolean).length}/5
              </span>
            </div>

            <div className="grid gap-2 rounded-xl bg-slate-900 p-4">
              {cleanedTiles.map((cleaned, index) => (
                <div
                  className={`flex items-center gap-2 rounded-lg border p-2 transition ${
                    robotPosition === index
                      ? 'border-amber-300 bg-amber-300/20'
                      : cleaned
                        ? 'border-emerald-400 bg-emerald-400/20'
                        : 'border-slate-700 bg-slate-800'
                  }`}
                  key={index}
                >
                  <Icon
                    icon={robotPosition === index ? Bot : Check}
                    size="sm"
                  />
                  <span className="text-sm font-bold">
                    Tile {index + 1} {cleaned ? 'clean' : 'dirty'}
                  </span>
                </div>
              ))}
            </div>

            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              A loop repeats its inside steps.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose the loop number
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {[3, 4, 5, 6].map((number) => (
                  <Button
                    key={number}
                    variant={repeatCount === number ? 'secondary' : 'outline'}
                    disabled={isRunning}
                    onClick={() => setRepeatCount(number)}
                  >
                    Repeat {number}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                2. Add steps inside the loop
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(stepDetails) as Step[]).map((step) => (
                  <Button
                    key={step}
                    variant="outline"
                    disabled={isRunning || loopSteps.length === 2}
                    onClick={() => addStep(step)}
                  >
                    <Icon icon={stepDetails[step].icon} size="sm" />
                    {stepDetails[step].label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-2 border-dashed border-emerald-300 bg-white p-3 font-mono dark:border-emerald-700 dark:bg-slate-900">
              <p className="font-bold text-emerald-700 dark:text-emerald-300">
                REPEAT {repeatCount ?? '_'} TIMES
              </p>
              {loopSteps.length === 0 ? (
                <p className="mt-2 pl-5 text-sm text-slate-500">
                  Choose steps...
                </p>
              ) : (
                loopSteps.map((step, index) => (
                  <p
                    className={`mt-2 rounded px-3 py-2 pl-5 text-sm font-bold ${
                      activeStep === step
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100'
                    }`}
                    key={`${step}-${index}`}
                  >
                    {index + 1}. {stepDetails[step].label}
                  </p>
                ))
              )}
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
                onClick={undoStep}
                disabled={isRunning || loopSteps.length === 0}
                variant="secondary"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {missionPassed && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-emerald-100 p-3 text-center font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                <Icon icon={ArrowRight} size="sm" /> Level complete!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
