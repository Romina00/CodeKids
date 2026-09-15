'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Coins,
  Icon,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Undo2,
  Variable,
  WalletCards,
  type LucideIcon,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Command = 'addOne' | 'addTwo' | 'removeOne';

type Mission = {
  startCoins: number;
  targetCoins: number;
};

const missions: [Mission, Mission, Mission] = [
  { startCoins: 0, targetCoins: 3 },
  { startCoins: 2, targetCoins: 5 },
  { startCoins: 5, targetCoins: 2 },
];

const commandDetails: Record<
  Command,
  { label: string; code: string; change: number; icon: LucideIcon }
> = {
  addOne: {
    label: 'Add 1 coin',
    code: 'coins = coins + 1',
    change: 1,
    icon: Plus,
  },
  addTwo: {
    label: 'Add 2 coins',
    code: 'coins = coins + 2',
    change: 2,
    icon: Plus,
  },
  removeOne: {
    label: 'Remove 1 coin',
    code: 'coins = coins - 1',
    change: -1,
    icon: Minus,
  },
};

const availableCommands = Object.keys(commandDetails) as Command[];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL6() {
  const [missionNumber, setMissionNumber] = useState<0 | 1 | 2>(0);
  const [commands, setCommands] = useState<Command[]>([]);
  const [coins, setCoins] = useState(missions[0].startCoins);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [missionPassed, setMissionPassed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Build a program that changes the coins variable.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const mission = missions[missionNumber];

  function addCommand(command: Command) {
    if (commands.length === 8) return;

    setCommands([...commands, command]);
    setCoins(mission.startCoins);
    setMissionPassed(false);
    setMessage('Good. Add more commands or run your program.');
    setGuideMood('idle');
  }

  function undoCommand() {
    setCommands(commands.slice(0, -1));
    setCoins(mission.startCoins);
    setMissionPassed(false);
  }

  async function runProgram() {
    if (commands.length === 0) {
      setMessage('Add at least one command before you press Run.');
      setGuideMood('sad');
      return;
    }

    setIsRunning(true);
    setMissionPassed(false);
    setGuideMood('idle');
    setMessage('The program is changing the variable...');

    let currentCoins = mission.startCoins;

    setActiveLine(0);
    setCoins(currentCoins);
    await wait(700);

    for (let index = 0; index < commands.length; index += 1) {
      const command = commands[index];

      if (!command) continue;

      setActiveLine(index + 1);

      const newValue = currentCoins + commandDetails[command].change;

      if (newValue < 0) {
        setMessage(`Line ${index + 2} cannot run. Coins cannot be below zero.`);
        setGuideMood('sad');
        setIsRunning(false);
        return;
      }

      currentCoins = newValue;
      setCoins(currentCoins);
      await wait(650);
    }

    setActiveLine(null);
    setIsRunning(false);

    if (currentCoins === mission.targetCoins) {
      setMissionPassed(true);
      setMessage(`Correct! The coins variable is now ${currentCoins}.`);
      setGuideMood('happy');
    } else {
      setMessage(
        `Your program made ${currentCoins} coins. The target is ${mission.targetCoins}.`,
      );
      setGuideMood('sad');
    }
  }

  function goToNextMission() {
    const nextMissionNumber = missionNumber === 0 ? 1 : 2;
    const nextMission = missions[nextMissionNumber];

    setMissionNumber(nextMissionNumber);
    setCommands([]);
    setCoins(nextMission.startCoins);
    setMissionPassed(false);
    setMessage('Build a new program for this target.');
    setGuideMood('idle');
  }

  function resetGame() {
    setMissionNumber(0);
    setCommands([]);
    setCoins(missions[0].startCoins);
    setActiveLine(null);
    setMissionPassed(false);
    setMessage('Build a program that changes the coins variable.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint={`Start at ${mission.startCoins}. Use plus or minus commands to reach ${mission.targetCoins}.`}
        tutorial={[
          'Goal: change the coin count until it reaches the target.',
          'A variable is a named box that stores information. Here, the box is called coins.',
          'Use plus or minus commands to change the number, then run your plan!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-amber-200 border-l-4 border-l-amber-500 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Icon icon={Variable} size="sm" /> Variables
            </p>
            <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-200">
              Mission {missionNumber + 1} of {missions.length}
            </p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Coin Lab
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Change <strong className="font-mono">coins</strong> from{' '}
            <strong>{mission.startCoins}</strong> to{' '}
            <strong>{mission.targetCoins}</strong>.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid min-h-80 content-between rounded-2xl border border-amber-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-lg font-extrabold">
                <Icon icon={WalletCards} size="lg" /> Coin wallet
              </h3>
              <span className="rounded-full bg-amber-400 px-3 py-1 text-sm font-extrabold text-amber-950">
                Target: {mission.targetCoins}
              </span>
            </div>

            <div className="grid place-items-center py-6 text-center">
              <div className="grid size-40 place-items-center rounded-full border-4 border-amber-400 bg-amber-400/10 text-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.25)]">
                <Icon icon={Coins} size="xl" className="size-20" />
              </div>
              <p className="mt-5 font-mono text-lg text-slate-300">coins =</p>
              <p
                className="text-6xl font-extrabold text-amber-300 transition-all duration-300"
                aria-live="polite"
              >
                {coins}
              </p>
            </div>

            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              A variable stores a value that your program can change.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose commands
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {availableCommands.map((command) => (
                  <Button
                    key={command}
                    variant="outline"
                    disabled={isRunning || commands.length === 8}
                    onClick={() => addCommand(command)}
                    className="justify-start gap-2"
                  >
                    <Icon icon={commandDetails[command].icon} size="sm" />
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
                  {commands.length + 1} lines
                </span>
              </div>

              <ol className="mt-3 grid gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 font-mono dark:border-slate-600 dark:bg-slate-900">
                <li
                  className={`flex items-center gap-2 rounded-lg border px-3 py-3 transition ${
                    activeLine === 0
                      ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                      : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  <span className="font-sans text-xs font-extrabold text-slate-500">
                    1
                  </span>
                  coins = {mission.startCoins}
                </li>

                {commands.map((command, index) => (
                  <li
                    key={`${command}-${index}`}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-3 transition ${
                      activeLine === index + 1
                        ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                        : 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100'
                    }`}
                  >
                    <span className="font-sans text-xs font-extrabold text-slate-500">
                      {index + 2}
                    </span>
                    {commandDetails[command].code}
                  </li>
                ))}
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
                onClick={undoCommand}
                disabled={isRunning || commands.length === 0}
                variant="secondary"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>

              {missionPassed && missionNumber < 2 && (
                <Button onClick={goToNextMission} variant="secondary">
                  Next mission <Icon icon={ArrowRight} size="sm" />
                </Button>
              )}

              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {missionPassed && missionNumber === 2 && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-green-100 p-3 text-center font-extrabold text-green-800 dark:bg-green-950 dark:text-green-200">
                <Icon icon={Check} size="sm" /> Variable missions complete!
              </p>
            )}

            <p className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Icon icon={CircleDollarSign} size="sm" /> Maximum 8 commands
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
