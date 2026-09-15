'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  BellRing,
  Bot,
  Check,
  DoorOpen,
  Icon,
  Play,
  RotateCcw,
  X,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type BooleanValue = true | false;

type Mission = {
  variableName: string;
  action: string;
  goal: string;
  correctValue: BooleanValue;
};

const missions: [Mission, Mission] = [
  {
    variableName: 'robotIsPowered',
    action: 'START robot',
    goal: 'Give the robot power so it can start.',
    correctValue: true,
  },
  {
    variableName: 'alarmIsOn',
    action: 'OPEN door',
    goal: 'Turn off the alarm so the door can open.',
    correctValue: false,
  },
];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL3() {
  const [missionNumber, setMissionNumber] = useState<0 | 1>(0);
  const [selectedValue, setSelectedValue] = useState<BooleanValue | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [resultValue, setResultValue] = useState<BooleanValue | null>(null);
  const [message, setMessage] = useState(
    'Choose a Boolean value, then run the program.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const mission = missions[missionNumber];
  const completedFirstMission = missionNumber === 1;
  const missionSucceeded = resultValue === mission.correctValue;

  function chooseValue(value: BooleanValue) {
    setSelectedValue(value);
    setResultValue(null);
    setMessage(`You chose ${String(value)}. Now run the program.`);
    setGuideMood('idle');
  }

  async function runProgram() {
    if (selectedValue === null) {
      setMessage('Choose true or false before you run the program.');
      setGuideMood('sad');
      return;
    }

    setIsRunning(true);
    setResultValue(null);
    setGuideMood('idle');
    setMessage('The program is running...');

    setActiveLine(1);
    await wait(700);

    setResultValue(selectedValue);
    setActiveLine(2);
    await wait(700);

    setActiveLine(null);
    setIsRunning(false);

    if (selectedValue === mission.correctValue) {
      setMessage(
        missionNumber === 0
          ? 'Correct! true means the robot has power.'
          : 'Correct! false means the alarm is off. Level complete!',
      );
      setGuideMood('happy');
    } else {
      setMessage(
        missionNumber === 0
          ? 'The robot cannot start because its power is false.'
          : 'The door stays closed because the alarm is true.',
      );
      setGuideMood('sad');
    }
  }

  function goToNextMission() {
    setMissionNumber(1);
    setSelectedValue(null);
    setResultValue(null);
    setMessage('This time, choose the value that turns the alarm off.');
    setGuideMood('idle');
  }

  function resetGame() {
    setMissionNumber(0);
    setSelectedValue(null);
    setResultValue(null);
    setActiveLine(null);
    setMessage('Choose a Boolean value, then run the program.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint={
          mission.correctValue
            ? 'The robot needs power. Which value means on?'
            : 'The alarm must be off. Which value means off?'
        }
        tutorial={[
          'Goal: choose the value that makes the robot do the right thing.',
          'A Boolean is a simple answer with only two choices: true means yes or on; false means no or off.',
          'Read the mission, choose true or false, then run the program. Great coders test their ideas!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-violet-200 border-l-4 border-l-violet-600 bg-violet-50 p-5 dark:border-violet-800 dark:bg-violet-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-300">
              Boolean · True or False
            </p>
            <p className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-200">
              Mission {missionNumber + 1} of {missions.length}
            </p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Boolean Control Room
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {mission.goal}
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid min-h-80 content-between rounded-2xl border border-violet-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-extrabold">Control room</h3>
              <span
                className={`rounded-full px-3 py-1 text-sm font-extrabold ${
                  resultValue === null
                    ? 'bg-slate-700 text-slate-200'
                    : resultValue
                      ? 'bg-green-500 text-green-950'
                      : 'bg-red-500 text-red-950'
                }`}
              >
                {resultValue === null
                  ? 'NOT SET'
                  : String(resultValue).toUpperCase()}
              </span>
            </div>

            <div className="grid place-items-center py-6">
              {missionNumber === 0 ? (
                <div className="text-center">
                  <div
                    className={`grid size-36 place-items-center rounded-3xl border-4 text-7xl transition duration-500 ${
                      missionSucceeded
                        ? 'border-green-400 bg-green-400/20 shadow-[0_0_35px_rgba(74,222,128,0.5)]'
                        : 'border-slate-600 bg-slate-800 grayscale'
                    }`}
                  >
                    <Icon icon={Bot} size="xl" className="size-20" />
                  </div>
                  <p className="mt-4 font-bold">
                    {missionSucceeded ? 'Robot started!' : 'Robot is waiting'}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div
                    className={`grid size-36 place-items-center rounded-3xl border-4 text-7xl transition duration-500 ${
                      missionSucceeded
                        ? 'border-green-400 bg-green-400/20'
                        : 'border-red-500 bg-red-500/10'
                    }`}
                  >
                    <Icon
                      icon={missionSucceeded ? DoorOpen : BellRing}
                      size="xl"
                      className="size-20"
                    />
                  </div>
                  <p className="mt-4 font-bold">
                    {missionSucceeded ? 'Door opened!' : 'Alarm is active'}
                  </p>
                </div>
              )}
            </div>

            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              A Boolean can only be{' '}
              <strong className="text-green-400">true</strong> or{' '}
              <strong className="text-red-400">false</strong>.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose a value
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => chooseValue(true)}
                  className={`rounded-xl border-2 px-4 py-4 text-lg font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    selectedValue === true
                      ? 'border-green-600 bg-green-100 text-green-900 ring-2 ring-green-300'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-green-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  <Icon icon={Check} size="lg" />
                  TRUE
                </button>
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => chooseValue(false)}
                  className={`rounded-xl border-2 px-4 py-4 text-lg font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    selectedValue === false
                      ? 'border-red-600 bg-red-100 text-red-900 ring-2 ring-red-300'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-red-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  <Icon icon={X} size="lg" />
                  FALSE
                </button>
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
                      : 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-100'
                  }`}
                >
                  <span className="font-sans text-xs font-extrabold text-slate-500">
                    1
                  </span>
                  SET <strong>{mission.variableName}</strong> TO{' '}
                  <strong>
                    {selectedValue === null ? '___' : String(selectedValue)}
                  </strong>
                </li>
                <li
                  className={`flex items-center gap-2 rounded-lg border px-3 py-3 transition ${
                    activeLine === 2
                      ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                      : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  <span className="font-sans text-xs font-extrabold text-slate-500">
                    2
                  </span>
                  {mission.action}
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

              {missionNumber === 0 && missionSucceeded && (
                <Button onClick={goToNextMission} variant="secondary">
                  Next mission <Icon icon={ArrowRight} size="sm" />
                </Button>
              )}

              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" />
                Reset
              </Button>
            </div>

            {completedFirstMission && (
              <p className="flex items-center justify-center gap-1 text-center text-sm font-bold text-green-700 dark:text-green-400">
                <Icon icon={Check} size="sm" /> Mission 1 complete
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
