'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  CreditCard,
  DoorClosed,
  DoorOpen,
  GitFork,
  Icon,
  KeyRound,
  Play,
  RotateCcw,
  Undo2,
  X,
  type LucideIcon,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Condition = 'hasGoldenKey' | 'hasMagicCard' | 'hasCoin';
type ProgramStatus = 'idle' | 'running' | 'correct' | 'incorrect';

type Test = {
  hasGoldenKey: boolean;
  hasMagicCard: boolean;
  hasCoin: boolean;
};

const tests: [Test, Test, Test] = [
  { hasGoldenKey: true, hasMagicCard: false, hasCoin: false },
  { hasGoldenKey: false, hasMagicCard: true, hasCoin: false },
  { hasGoldenKey: false, hasMagicCard: false, hasCoin: true },
];

const conditionDetails: Record<Condition, { label: string; icon: LucideIcon }> =
  {
    hasGoldenKey: { label: 'Has golden key', icon: KeyRound },
    hasMagicCard: { label: 'Has magic card', icon: CreditCard },
    hasCoin: { label: 'Has coin', icon: CircleDollarSign },
  };

const availableConditions = Object.keys(conditionDetails) as Condition[];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL5({ onComplete }: { onComplete?: () => void }) {
  const [testNumber, setTestNumber] = useState<0 | 1 | 2>(0);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [gateIsOpen, setGateIsOpen] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [programStatus, setProgramStatus] = useState<ProgramStatus>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Choose the two items that can open the gate.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const currentTest = tests[testNumber];

  function addCondition(condition: Condition) {
    if (selectedConditions.length === 2) return;
    if (selectedConditions.includes(condition)) return;

    setSelectedConditions([...selectedConditions, condition]);
    setGateIsOpen(false);
    setTestPassed(false);
    setProgramStatus('idle');
    setMessage('Good. Complete the OR condition and run your program.');
    setGuideMood('idle');
  }

  function undoCondition() {
    setSelectedConditions(selectedConditions.slice(0, -1));
    setGateIsOpen(false);
    setTestPassed(false);
    setProgramStatus('idle');
    setMessage('Choose two conditions. At least one must be true.');
    setGuideMood('idle');
  }

  async function runProgram() {
    if (selectedConditions.length < 2) {
      setMessage('Your OR program needs two conditions.');
      setGuideMood('thinking');
      return;
    }

    const firstCondition = selectedConditions[0];
    const secondCondition = selectedConditions[1];

    if (!firstCondition || !secondCondition) return;

    setIsRunning(true);
    setGateIsOpen(false);
    setTestPassed(false);
    setProgramStatus('running');
    setMessage('Checking both sides of OR...');
    setGuideMood('idle');

    setActiveLine(1);
    await wait(800);

    const result = currentTest[firstCondition] || currentTest[secondCondition];

    setActiveLine(2);
    setGateIsOpen(result);
    await wait(800);

    setActiveLine(null);
    setIsRunning(false);

    if (!result) {
      setProgramStatus('incorrect');
      setMessage(
        'Both conditions are false. Choose at least one true condition to open the gate.',
      );
      setGuideMood('thinking');
      return;
    }

    setTestPassed(true);
    setProgramStatus('correct');
    setGuideMood('happy');
    if (testNumber === 2) onComplete?.();
    setMessage(
      'Correct! At least one condition is true, so OR opens the gate.',
    );
  }

  function goToNextTest() {
    if (testNumber === 0) setTestNumber(1);
    if (testNumber === 1) setTestNumber(2);

    setSelectedConditions([]);
    setActiveLine(null);
    setGateIsOpen(false);
    setTestPassed(false);
    setProgramStatus('idle');
    setMessage(
      'New test! Choose two conditions. At least one must be true in the current values.',
    );
    setGuideMood('idle');
  }

  function resetGame() {
    setTestNumber(0);
    setSelectedConditions([]);
    setActiveLine(null);
    setGateIsOpen(false);
    setTestPassed(false);
    setProgramStatus('idle');
    setMessage('Choose the two items that can open the gate.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        key={testNumber}
        mood={guideMood}
        message={message}
        hint="Look at the current values. Choose two conditions with at least one marked true. OR only needs one true condition."
        tutorial={[
          'Goal: find a way to open the gate.',
          'Programs can use “or”: one true choice is enough to continue.',
          'Choose two conditions from the current values. At least one must be true to open the gate!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-sky-200 border-l-4 border-l-sky-600 bg-sky-50 p-5 dark:border-sky-800 dark:bg-sky-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              <Icon icon={GitFork} size="sm" /> Boolean · OR
            </p>
            <p className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-200">
              Test {testNumber + 1} of {tests.length}
            </p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Magic Gate
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Choose two conditions from the current values. The gate opens when
            at least one is true.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid min-h-80 content-between rounded-2xl border border-sky-200 bg-slate-950 p-5 text-white">
            <div>
              <h3 className="text-lg font-extrabold">Current values</h3>
              <div className="mt-3 grid gap-2">
                {availableConditions.map((condition) => {
                  const value = currentTest[condition];

                  return (
                    <div
                      key={condition}
                      className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <Icon
                          icon={conditionDetails[condition].icon}
                          size="sm"
                        />
                        {conditionDetails[condition].label}
                      </span>
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold ${
                          value
                            ? 'bg-green-400 text-green-950'
                            : 'bg-red-400 text-red-950'
                        }`}
                      >
                        <Icon icon={value ? Check : X} size="sm" />
                        {String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid place-items-center py-5 text-center">
              <div
                className={`grid size-36 place-items-center rounded-3xl border-4 transition duration-500 ${
                  programStatus === 'correct'
                    ? 'border-green-400 bg-green-400/20 text-green-300 shadow-[0_0_35px_rgba(74,222,128,0.4)]'
                    : programStatus === 'incorrect'
                      ? 'border-red-500 bg-red-500/10 text-red-300'
                      : programStatus === 'running'
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-slate-500 bg-slate-500/10 text-slate-300'
                }`}
              >
                <Icon
                  icon={gateIsOpen ? DoorOpen : DoorClosed}
                  size="xl"
                  className="size-20"
                />
              </div>
              <p className="mt-4 font-extrabold">
                {programStatus === 'correct'
                  ? gateIsOpen
                    ? 'Gate correctly opened'
                    : 'Gate correctly stayed closed'
                  : programStatus === 'incorrect'
                    ? 'Gate stayed closed because both conditions are false'
                    : gateIsOpen
                      ? 'Gate open'
                      : 'Gate closed'}
              </p>
            </div>

            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              With OR, one true condition is enough.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose two conditions
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {availableConditions.map((condition) => (
                  <Button
                    key={condition}
                    variant="outline"
                    disabled={
                      isRunning ||
                      selectedConditions.includes(condition) ||
                      selectedConditions.length === 2
                    }
                    onClick={() => addCondition(condition)}
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
                2. Your program
              </h3>
              <ol className="mt-3 grid gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 font-mono dark:border-slate-600 dark:bg-slate-900">
                <li
                  className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-3 transition ${
                    activeLine === 1
                      ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                      : 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100'
                  }`}
                >
                  <span className="font-sans text-xs font-extrabold text-slate-500">
                    1
                  </span>
                  IF
                  <strong>
                    {selectedConditions[0]
                      ? conditionDetails[selectedConditions[0]].label
                      : '___'}
                  </strong>
                  <span className="rounded bg-sky-600 px-2 py-1 font-extrabold text-white">
                    OR
                  </span>
                  <strong>
                    {selectedConditions[1]
                      ? conditionDetails[selectedConditions[1]].label
                      : '___'}
                  </strong>
                </li>
                <li
                  className={`flex items-center gap-2 rounded-lg border px-3 py-3 pl-8 transition ${
                    activeLine === 2
                      ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                      : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  <span className="font-sans text-xs font-extrabold text-slate-500">
                    2
                  </span>
                  OPEN gate
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
                onClick={undoCondition}
                disabled={isRunning || selectedConditions.length === 0}
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
                <Icon icon={Check} size="sm" /> All OR tests passed!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
