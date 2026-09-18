'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  Check,
  Hash,
  Icon,
  Play,
  RotateCcw,
  ToggleLeft,
  Type,
  UserRound,
  type LucideIcon,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type DataType = 'Number' | 'Text' | 'Boolean';
type VariableName = 'score' | 'playerName' | 'hasKey';
type ValueId = 'number12' | 'textAlex' | 'booleanTrue' | 'text12';

type ValueOption = {
  label: string;
  value: number | string | boolean;
  dataType: DataType;
  icon: LucideIcon;
};

type Mission = {
  variableName: VariableName;
  expectedValue: ValueId;
  expectedType: DataType;
  instruction: string;
};

type Profile = {
  score: number | null;
  playerName: string | null;
  hasKey: boolean | null;
};

const valueOptions: Record<ValueId, ValueOption> = {
  number12: { label: '12', value: 12, dataType: 'Number', icon: Hash },
  textAlex: { label: '"Alex"', value: 'Alex', dataType: 'Text', icon: Type },
  booleanTrue: {
    label: 'true',
    value: true,
    dataType: 'Boolean',
    icon: ToggleLeft,
  },
  text12: { label: '"12"', value: '12', dataType: 'Text', icon: Type },
};

const availableValues = Object.keys(valueOptions) as ValueId[];

const missions: [Mission, Mission, Mission] = [
  {
    variableName: 'score',
    expectedValue: 'number12',
    expectedType: 'Number',
    instruction: 'Store the number 12 in score.',
  },
  {
    variableName: 'playerName',
    expectedValue: 'textAlex',
    expectedType: 'Text',
    instruction: 'Store the text Alex in playerName.',
  },
  {
    variableName: 'hasKey',
    expectedValue: 'booleanTrue',
    expectedType: 'Boolean',
    instruction: 'Store true in hasKey.',
  },
];

const emptyProfile: Profile = {
  score: null,
  playerName: null,
  hasKey: null,
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function showValue(value: number | string | boolean | null) {
  if (value === null) return 'Not set';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

export default function GameGL7({ onComplete }: { onComplete?: () => void }) {
  const [missionNumber, setMissionNumber] = useState<0 | 1 | 2>(0);
  const [selectedValue, setSelectedValue] = useState<ValueId | null>(null);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [activeLine, setActiveLine] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Choose a value with the correct data type.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const mission = missions[missionNumber];

  function chooseValue(valueId: ValueId) {
    setSelectedValue(valueId);
    setMissionPassed(false);
    setMessage('Value selected. Now run your program.');
    setGuideMood('idle');
  }

  async function runProgram() {
    if (!selectedValue) {
      setMessage('Choose a value before you press Run.');
      setGuideMood('thinking');
      return;
    }

    const option = valueOptions[selectedValue];

    setIsRunning(true);
    setActiveLine(true);
    setMissionPassed(false);
    setMessage('The program is checking the data type...');
    setGuideMood('idle');
    await wait(900);

    setActiveLine(false);
    setIsRunning(false);

    if (option.dataType !== mission.expectedType) {
      setMessage(
        `Type error: ${mission.variableName} needs ${mission.expectedType}, but ${option.label} is ${option.dataType}.`,
      );
      setGuideMood('thinking');
      return;
    }

    if (selectedValue !== mission.expectedValue) {
      setMessage(`The type is correct, but choose the value in the mission.`);
      setGuideMood('thinking');
      return;
    }

    setProfile({ ...profile, [mission.variableName]: option.value });
    setMissionPassed(true);
    setMessage(`Correct! ${option.label} is a ${option.dataType} value.`);
    setGuideMood('happy');
    if (missionNumber === 2) onComplete?.();
  }

  function goToNextMission() {
    const nextMissionNumber = missionNumber === 0 ? 1 : 2;

    setMissionNumber(nextMissionNumber);
    setSelectedValue(null);
    setMissionPassed(false);
    setMessage('Choose a value for the next variable.');
    setGuideMood('idle');
  }

  function resetGame() {
    setMissionNumber(0);
    setSelectedValue(null);
    setProfile({ ...emptyProfile });
    setActiveLine(false);
    setMissionPassed(false);
    setMessage('Choose a value with the correct data type.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint={`${mission.variableName} needs a ${mission.expectedType} value.`}
        tutorial={[
          'Goal: put the right kind of value into each variable.',
          'A number is for counting, text is for words, and a Boolean is true or false.',
          'Read the variable name for a clue, choose its matching value, and test it!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-fuchsia-200 border-l-4 border-l-fuchsia-600 bg-fuchsia-50 p-5 dark:border-fuchsia-800 dark:bg-fuchsia-950/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-300">
              <Icon icon={Type} size="sm" /> Data types
            </p>
            <p className="rounded-full bg-fuchsia-100 px-3 py-1 text-sm font-bold text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-200">
              Mission {missionNumber + 1} of {missions.length}
            </p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Game Profile Builder
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {mission.instruction}
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid min-h-80 content-between rounded-2xl border border-fuchsia-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-2">
              <Icon icon={UserRound} size="lg" />
              <h3 className="text-lg font-extrabold">Player profile</h3>
            </div>

            <div className="grid gap-3 py-5">
              <div className="rounded-xl bg-slate-800 p-3">
                <p className="flex items-center gap-2 text-sm font-bold text-blue-300">
                  <Icon icon={Hash} size="sm" /> Number
                </p>
                <p className="mt-2 font-mono text-lg">
                  score = {showValue(profile.score)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-3">
                <p className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Icon icon={Type} size="sm" /> Text
                </p>
                <p className="mt-2 font-mono text-lg">
                  playerName = {showValue(profile.playerName)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-3">
                <p className="flex items-center gap-2 text-sm font-bold text-green-300">
                  <Icon icon={ToggleLeft} size="sm" /> Boolean
                </p>
                <p className="mt-2 font-mono text-lg">
                  hasKey = {showValue(profile.hasKey)}
                </p>
              </div>
            </div>

            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              Number stores quantities, Text stores words, and Boolean stores
              true or false.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose a value
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {availableValues.map((valueId) => {
                  const option = valueOptions[valueId];

                  return (
                    <button
                      key={valueId}
                      type="button"
                      disabled={isRunning}
                      onClick={() => chooseValue(valueId)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left font-mono font-extrabold transition disabled:opacity-60 ${
                        selectedValue === valueId
                          ? 'border-fuchsia-600 bg-fuchsia-100 text-fuchsia-950 ring-2 ring-fuchsia-300'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-fuchsia-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <Icon icon={option.icon} size="sm" /> {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                2. Your program
              </h3>
              <div
                className={`mt-3 flex flex-wrap items-center gap-2 rounded-xl border px-4 py-4 font-mono font-bold transition ${
                  activeLine
                    ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                    : 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950 dark:border-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-100'
                }`}
              >
                SET <strong>{mission.variableName}</strong> TO{' '}
                <strong>
                  {selectedValue ? valueOptions[selectedValue].label : '___'}
                </strong>
              </div>
              {selectedValue && (
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Selected type: {valueOptions[selectedValue].dataType}
                </p>
              )}
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
                <Icon icon={Check} size="sm" /> Player profile complete!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
