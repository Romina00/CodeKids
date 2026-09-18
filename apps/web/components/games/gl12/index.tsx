'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  BookOpen,
  CodeXml,
  Icon,
  Play,
  RotateCcw,
  Undo2,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Token = 'move' | 'repeat' | 'collect' | 'ifKey' | 'openDoor';

const tokenDetails: Record<Token, { label: string; code: string }> = {
  move: { label: 'Move forward', code: 'MOVE FORWARD' },
  repeat: { label: 'Repeat 3 times', code: 'REPEAT 3 TIMES' },
  collect: { label: 'Collect supplies', code: 'COLLECT SUPPLIES' },
  ifKey: { label: 'If robot has key', code: 'IF HAS KEY' },
  openDoor: { label: 'Open door', code: 'OPEN DOOR' },
};

const availableTokens: Token[] = [
  'ifKey',
  'collect',
  'openDoor',
  'move',
  'repeat',
];
const correctPlan: Token[] = ['move', 'repeat', 'collect', 'ifKey', 'openDoor'];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL12({ onComplete }: { onComplete?: () => void }) {
  const [plan, setPlan] = useState<Token[]>([]);
  const [blocks, setBlocks] = useState<Token[]>([]);
  const [activeToken, setActiveToken] = useState<Token | null>(null);
  const [blocksReady, setBlocksReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);
  const [message, setMessage] = useState(
    'Write a clear plan before building the robot program.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function addToken(token: Token) {
    if (plan.length === correctPlan.length) return;

    setPlan([...plan, token]);
    setBlocks([]);
    setBlocksReady(false);
    setMissionPassed(false);
    setMessage('Good plan step. Put the steps in the order the robot needs.');
    setGuideMood('idle');
  }

  function undoToken() {
    setPlan(plan.slice(0, -1));
    setBlocks([]);
    setBlocksReady(false);
    setMissionPassed(false);
    setMessage('Choose the next pseudocode step.');
    setGuideMood('idle');
  }

  function convertToBlocks() {
    const planIsCorrect =
      plan.length === correctPlan.length &&
      plan.every((token, index) => token === correctPlan[index]);

    if (!planIsCorrect) {
      setMessage('The plan is not complete yet. Check the order of the steps.');
      setGuideMood('thinking');
      return;
    }

    setBlocks([...plan]);
    setBlocksReady(true);
    setMessage('Plan converted! Now execute the matching block program.');
    setGuideMood('happy');
  }

  async function runProgram() {
    if (!blocksReady) {
      setMessage('Complete the pseudocode and convert it to blocks first.');
      setGuideMood('thinking');
      return;
    }

    setIsRunning(true);
    setMissionPassed(false);
    setGuideMood('idle');
    setMessage('The rescue robot is following your plan...');

    for (const token of blocks) {
      setActiveToken(token);
      await wait(token === 'repeat' ? 700 : 450);
    }

    setActiveToken(null);
    setIsRunning(false);
    setMissionPassed(true);
    setMessage('Mission complete! Your plan and program match.');
    setGuideMood('happy');
    onComplete?.();
  }

  function resetGame() {
    setPlan([]);
    setBlocks([]);
    setActiveToken(null);
    setBlocksReady(false);
    setIsRunning(false);
    setMissionPassed(false);
    setMessage('Write a clear plan before building the robot program.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Use MOVE, REPEAT, COLLECT, IF HAS KEY, then OPEN DOOR."
        tutorial={[
          'Goal: make a clear plan before the robot starts its adventure.',
          'Planning means putting actions in a useful order before writing the program.',
          'Think: move, repeat, collect, check for the key, then open the door. Build your plan one token at a time!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-amber-200 border-l-4 border-l-amber-600 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            <Icon icon={BookOpen} size="sm" /> Pseudocode
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Mission Planner
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Plan the rescue in simple words, translate it to blocks, and run it.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-2">
          <div className="grid content-start gap-4 rounded-2xl border border-amber-200 bg-slate-950 p-5 text-white">
            <h3 className="flex items-center gap-2 text-lg font-extrabold">
              <Icon icon={BookOpen} size="sm" /> Pseudocode plan
            </h3>
            <p className="rounded-xl bg-slate-900 p-3 text-sm text-slate-300">
              Rescue the robot: move to the supply box, collect three supplies,
              check the key, and open the door.
            </p>
            <div className="grid gap-2">
              {plan.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-700 p-3 text-sm text-slate-500">
                  Choose a plan step...
                </p>
              ) : (
                plan.map((token, index) => (
                  <p
                    className="rounded-lg bg-amber-400/20 px-3 py-2 font-mono text-sm font-bold text-amber-100"
                    key={`${token}-${index}`}
                  >
                    {index + 1}. {tokenDetails[token].code}
                  </p>
                ))
              )}
            </div>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Add pseudocode steps
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {availableTokens.map((token) => (
                  <Button
                    key={token}
                    variant="outline"
                    disabled={isRunning || plan.length === correctPlan.length}
                    onClick={() => addToken(token)}
                  >
                    {tokenDetails[token].label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-2 border-dashed border-sky-300 bg-white p-3 dark:border-sky-700 dark:bg-slate-900">
              <h3 className="flex items-center gap-2 font-extrabold text-sky-700 dark:text-sky-300">
                <Icon icon={CodeXml} size="sm" /> Matching blocks
              </h3>
              {blocks.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Convert your plan here.
                </p>
              ) : (
                blocks.map((token, index) => (
                  <p
                    className={`mt-2 rounded px-3 py-2 font-mono text-sm font-bold ${
                      activeToken === token
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-sky-50 text-sky-950 dark:bg-sky-950/50 dark:text-sky-100'
                    }`}
                    key={`${token}-${index}`}
                  >
                    {index + 1}. {tokenDetails[token].code}
                  </p>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={convertToBlocks}
                disabled={isRunning}
                variant="secondary"
                className="flex-1"
              >
                <Icon icon={CodeXml} size="sm" /> Convert to blocks
              </Button>
              <Button
                onClick={runProgram}
                disabled={isRunning}
                className="flex-1"
              >
                <Icon icon={Play} size="sm" />{' '}
                {isRunning ? 'Running...' : 'Run program'}
              </Button>
              <Button
                onClick={undoToken}
                disabled={isRunning || plan.length === 0}
                variant="ghost"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {missionPassed && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-amber-100 p-3 text-center font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <Icon icon={ArrowRight} size="sm" /> Plan executed!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
