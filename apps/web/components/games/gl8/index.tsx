'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  BatteryCharging,
  Bot,
  Check,
  CornerUpLeft,
  Footprints,
  GitBranch,
  Icon,
  Octagon,
  Play,
  RotateCcw,
  Undo2,
  Zap,
  type LucideIcon,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Condition = 'enoughEnergy' | 'noEnergy' | 'hasKey';
type Action = 'jump' | 'stop' | 'turnAround';

type Test = {
  energy: number;
  hasKey: boolean;
};

const tests: [Test, Test, Test] = [
  { energy: 5, hasKey: false },
  { energy: 2, hasKey: true },
  { energy: 3, hasKey: false },
];

const conditionDetails: Record<Condition, { label: string; icon: LucideIcon }> =
  {
    enoughEnergy: { label: 'energy >= 3', icon: BatteryCharging },
    noEnergy: { label: 'energy == 0', icon: Zap },
    hasKey: { label: 'hasKey == true', icon: Check },
  };

const actionDetails: Record<Action, { label: string; icon: LucideIcon }> = {
  jump: { label: 'JUMP', icon: Footprints },
  stop: { label: 'STOP', icon: Octagon },
  turnAround: { label: 'TURN AROUND', icon: CornerUpLeft },
};

const availableConditions = Object.keys(conditionDetails) as Condition[];
const availableActions = Object.keys(actionDetails) as Action[];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function checkCondition(condition: Condition, test: Test) {
  if (condition === 'enoughEnergy') return test.energy >= 3;
  if (condition === 'noEnergy') return test.energy === 0;
  return test.hasKey;
}

export default function GameGL8({ onComplete }: { onComplete?: () => void }) {
  const [testNumber, setTestNumber] = useState<0 | 1 | 2>(0);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(
    null,
  );
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [actionRan, setActionRan] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Choose a condition and an action to build an if statement.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const currentTest = tests[testNumber];

  function chooseCondition(condition: Condition) {
    setSelectedCondition(condition);
    clearResult();
  }

  function chooseAction(action: Action) {
    setSelectedAction(action);
    clearResult();
  }

  function clearResult() {
    setActionRan(false);
    setTestPassed(false);
    setMessage('Program updated. Now run it.');
    setGuideMood('idle');
  }

  function undoSelection() {
    if (selectedAction) {
      setSelectedAction(null);
    } else {
      setSelectedCondition(null);
    }

    clearResult();
  }

  async function runProgram() {
    if (!selectedCondition || !selectedAction) {
      setMessage('Complete both empty parts of the if statement.');
      setGuideMood('thinking');
      return;
    }

    setIsRunning(true);
    setActionRan(false);
    setTestPassed(false);
    setGuideMood('idle');
    setMessage('The program is checking the condition...');

    setActiveLine(1);
    await wait(800);

    const conditionIsTrue = checkCondition(selectedCondition, currentTest);

    if (conditionIsTrue) {
      setActiveLine(2);
      setActionRan(true);
      await wait(800);
    }

    setActiveLine(null);
    setIsRunning(false);

    const programIsCorrect =
      selectedCondition === 'enoughEnergy' && selectedAction === 'jump';

    if (!programIsCorrect) {
      setMessage('The robot must check its energy and jump over the obstacle.');
      setGuideMood('thinking');
      return;
    }

    setTestPassed(true);
    setGuideMood('happy');
    if (testNumber === 2) onComplete?.();
    setMessage(
      conditionIsTrue
        ? 'The condition is true, so the JUMP action runs.'
        : 'The condition is false, so the JUMP action is skipped.',
    );
  }

  function goToNextTest() {
    if (testNumber === 0) setTestNumber(1);
    if (testNumber === 1) setTestNumber(2);

    setActionRan(false);
    setTestPassed(false);
    setMessage('Run the same if statement with the new energy value.');
    setGuideMood('idle');
  }

  function resetGame() {
    setTestNumber(0);
    setSelectedCondition(null);
    setSelectedAction(null);
    setActiveLine(null);
    setActionRan(false);
    setTestPassed(false);
    setMessage('Choose a condition and an action to build an if statement.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="If energy is at least 3, the robot should jump."
        tutorial={[
          'Goal: tell the robot what to do when a condition is true.',
          'An if statement means: if this is true, then do this action.',
          'Pick the correct condition and the action that belongs after it. Then test your rule!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-indigo-200 border-l-4 border-l-indigo-600 bg-indigo-50 p-5 dark:border-indigo-800 dark:bg-indigo-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              <Icon icon={GitBranch} size="sm" /> If statements
            </p>
            <p className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
              Test {testNumber + 1} of {tests.length}
            </p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Robot Jump
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Make the robot jump when it has at least 3 energy points.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid min-h-80 content-between overflow-hidden rounded-2xl border border-indigo-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-extrabold">Test world</h3>
              <span className="flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-sm font-extrabold text-yellow-950">
                <Icon icon={Zap} size="sm" /> energy = {currentTest.energy}
              </span>
            </div>

            <div className="relative my-8 h-40 border-b-4 border-slate-600">
              <div
                className={`absolute bottom-2 left-8 grid size-20 place-items-center rounded-2xl border-2 border-indigo-400 bg-indigo-400/20 text-indigo-200 transition-transform duration-500 ${
                  actionRan && selectedAction === 'jump'
                    ? 'translate-x-28 -translate-y-20'
                    : ''
                }`}
              >
                <Icon icon={Bot} size="xl" className="size-14" />
              </div>
              <div
                className="absolute bottom-0 left-40 h-20 w-12 rounded-t-lg bg-red-500"
                aria-label="Obstacle"
              />
              <div className="absolute bottom-2 right-4 text-sm font-bold text-green-300">
                FINISH
              </div>
            </div>

            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              An if statement runs its action only when its condition is true.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose a condition
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {availableConditions.map((condition) => (
                  <Button
                    key={condition}
                    variant={
                      selectedCondition === condition ? 'secondary' : 'outline'
                    }
                    disabled={isRunning}
                    onClick={() => chooseCondition(condition)}
                    className="justify-start gap-2"
                  >
                    <Icon icon={conditionDetails[condition].icon} size="sm" />
                    {conditionDetails[condition].label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                2. Choose an action
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {availableActions.map((action) => (
                  <Button
                    key={action}
                    variant={
                      selectedAction === action ? 'secondary' : 'outline'
                    }
                    disabled={isRunning}
                    onClick={() => chooseAction(action)}
                    className="justify-start gap-2"
                  >
                    <Icon icon={actionDetails[action].icon} size="sm" />
                    {actionDetails[action].label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                3. Your program
              </h3>
              <ol className="mt-3 grid gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 font-mono dark:border-slate-600 dark:bg-slate-900">
                <li
                  className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-3 transition ${activeLine === 1 ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300' : 'border-indigo-200 bg-indigo-50 text-indigo-950 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-100'}`}
                >
                  <span className="font-sans text-xs font-extrabold text-slate-500">
                    1
                  </span>
                  IF{' '}
                  <strong>
                    {selectedCondition
                      ? conditionDetails[selectedCondition].label
                      : '___'}
                  </strong>
                </li>
                <li
                  className={`flex items-center gap-2 rounded-lg border px-3 py-3 pl-8 transition ${activeLine === 2 ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300' : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'}`}
                >
                  <span className="font-sans text-xs font-extrabold text-slate-500">
                    2
                  </span>
                  <strong>
                    {selectedAction
                      ? actionDetails[selectedAction].label
                      : '___'}
                  </strong>
                </li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runProgram}
                disabled={isRunning}
                className="min-w-32 flex-1"
              >
                {!isRunning && <Icon icon={Play} size="sm" />}
                {isRunning ? 'Running...' : 'Run program'}
              </Button>
              <Button
                onClick={undoSelection}
                disabled={isRunning || (!selectedCondition && !selectedAction)}
                variant="secondary"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>

              {testPassed && testNumber < 2 && (
                <Button onClick={goToNextTest} variant="secondary">
                  Next test <Icon icon={ArrowRight} size="sm" />
                </Button>
              )}

              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {testPassed && testNumber === 2 && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-green-100 p-3 text-center font-extrabold text-green-800 dark:bg-green-950 dark:text-green-200">
                <Icon icon={Check} size="sm" /> If statement tests complete!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
