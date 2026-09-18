'use client';

import { Button } from '@repo/ui/button';
import {
  Check,
  CodeXml,
  Gamepad2,
  Icon,
  Play,
  RotateCcw,
  Rocket,
  Trophy,
  Undo2,
  Variable,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Block =
  'move' | 'repeat' | 'ifKey' | 'score' | 'defineFunction' | 'callFunction';

const blockDetails: Record<Block, { label: string; code: string }> = {
  move: { label: 'Move player', code: 'MOVE PLAYER' },
  repeat: { label: 'Repeat 3 times', code: 'REPEAT 3 TIMES' },
  ifKey: { label: 'If player has key', code: 'IF HAS KEY' },
  score: { label: 'Add one point', code: 'SCORE = SCORE + 1' },
  defineFunction: {
    label: 'Define collectReward()',
    code: 'DEFINE collectReward()',
  },
  callFunction: { label: 'Call collectReward()', code: 'CALL collectReward()' },
};

const availableBlocks = Object.keys(blockDetails) as Block[];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL15({ onComplete }: { onComplete?: () => void }) {
  const [projectName, setProjectName] = useState('');
  const [program, setProgram] = useState<Block[]>([]);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [score, setScore] = useState(0);
  const [hasTreasure, setHasTreasure] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [projectComplete, setProjectComplete] = useState(false);
  const [message, setMessage] = useState(
    'Create a small playable game with the blocks you learned.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const checklist = {
    sequence: program.length >= 2,
    variable: program.includes('score'),
    condition: program.includes('ifKey'),
    loop: program.includes('repeat'),
    function:
      program.includes('defineFunction') && program.includes('callFunction'),
  };
  const readyToRun = Object.values(checklist).every(Boolean);

  function addBlock(block: Block) {
    if (program.length === 8) return;

    setProgram([...program, block]);
    setIsSaved(false);
    setProjectComplete(false);
    setMessage('Block added. Your game is becoming interactive.');
    setGuideMood('idle');
  }

  function undoBlock() {
    setProgram(program.slice(0, -1));
    setIsSaved(false);
    setProjectComplete(false);
    setMessage('Choose another block for your game.');
    setGuideMood('idle');
  }

  function saveDraft() {
    if (!projectName.trim() || program.length === 0) {
      setMessage('Give your game a name and add at least one block.');
      setGuideMood('thinking');
      return;
    }

    setIsSaved(true);
    setMessage('Draft saved on this page. You can still keep improving it.');
    setGuideMood('happy');
  }

  async function runProject() {
    if (!projectName.trim()) {
      setMessage('Name your mini game before running it.');
      setGuideMood('thinking');
      return;
    }

    if (!readyToRun) {
      setMessage(
        'Add a sequence, variable, condition, loop, and function call.',
      );
      setGuideMood('thinking');
      return;
    }

    setIsRunning(true);
    setProjectComplete(false);
    setScore(0);
    setHasTreasure(false);
    setGuideMood('idle');
    setMessage('Playing your mini game...');

    let currentScore = 0;
    for (const block of program) {
      setActiveBlock(block);
      await wait(450);

      if (block === 'score') {
        currentScore += 1;
        setScore(currentScore);
      }
      if (block === 'ifKey') {
        setHasTreasure(true);
      }
    }

    setActiveBlock(null);
    setIsRunning(false);
    setProjectComplete(true);
    setMessage(
      `Your game is playable! ${projectName.trim()} earned ${currentScore} point(s).`,
    );
    setGuideMood('happy');
    onComplete?.();
  }

  function resetGame() {
    setProjectName('');
    setProgram([]);
    setActiveBlock(null);
    setScore(0);
    setHasTreasure(false);
    setIsRunning(false);
    setIsSaved(false);
    setProjectComplete(false);
    setMessage('Create a small playable game with the blocks you learned.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Name your game, add all five checklist ideas, then run and test it."
        tutorial={[
          'Goal: create and test your own mini game. You are the game designer now!',
          'Use the ideas you learned: steps in order, repeats, conditions, variables, and functions.',
          'Give your game a name, build one piece at a time, and press Run to test your creation!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-cyan-200 border-l-4 border-l-cyan-600 bg-cyan-50 p-5 dark:border-cyan-800 dark:bg-cyan-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
            <Icon icon={Gamepad2} size="sm" /> Final project
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Build Your Own Mini Game
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Choose your idea, build a program, run it, and improve it like a
            real game developer.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid content-start gap-4 rounded-2xl border border-cyan-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-extrabold">
                <Icon icon={Rocket} size="sm" /> Game preview
              </h3>
              {projectComplete && (
                <Icon icon={Trophy} size="md" className="text-amber-300" />
              )}
            </div>
            <div className="grid gap-3 rounded-xl bg-slate-900 p-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-800 p-3">
                <span className="font-bold">Player</span>
                <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-sm font-bold">
                  {hasTreasure ? 'has key' : 'looking for key'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-800 p-3">
                <span className="font-bold">Score</span>
                <span className="flex items-center gap-1 font-extrabold text-amber-200">
                  <Icon icon={Variable} size="sm" /> {score}
                </span>
              </div>
              <p className="rounded-lg border border-dashed border-cyan-400/50 p-3 text-center text-sm text-cyan-100">
                {projectName.trim() || 'Your game name'}
              </p>
            </div>
            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              A project is a program you can play, test, and improve.
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <label className="grid gap-2 font-bold text-slate-900 dark:text-white">
              Name your mini game
              <input
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                disabled={isRunning}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Example: Key Quest"
                value={projectName}
              />
            </label>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Add program blocks
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {availableBlocks.map((block) => (
                  <Button
                    key={block}
                    variant="outline"
                    disabled={isRunning || program.length === 8}
                    onClick={() => addBlock(block)}
                  >
                    {blockDetails[block].label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2 rounded-xl border-2 border-dashed border-cyan-300 bg-white p-3 font-mono dark:border-cyan-700 dark:bg-slate-900">
              {program.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Your program is empty...
                </p>
              ) : (
                program.map((block, index) => (
                  <p
                    className={`rounded px-3 py-2 text-sm font-bold ${
                      activeBlock === block
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-cyan-50 text-cyan-950 dark:bg-cyan-950/50 dark:text-cyan-100'
                    }`}
                    key={`${block}-${index}`}
                  >
                    {index + 1}. {blockDetails[block].code}
                  </p>
                ))
              )}
            </div>

            <div className="grid gap-2 rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900">
              <h3 className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                <Icon icon={CodeXml} size="sm" /> Project checklist
              </h3>
              {Object.entries({
                sequence: 'Algorithm sequence',
                variable: 'Variable changes score',
                condition: 'Condition reacts to the key',
                loop: 'Loop repeats an action',
                function: 'Function is defined and called',
              }).map(([key, label]) => (
                <p
                  className="flex items-center gap-2 text-sm font-bold"
                  key={key}
                >
                  <Icon
                    icon={
                      checklist[key as keyof typeof checklist] ? Check : CodeXml
                    }
                    size="sm"
                    className={
                      checklist[key as keyof typeof checklist]
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                    }
                  />
                  {label}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runProject}
                disabled={isRunning}
                className="min-w-32 flex-1"
              >
                <Icon icon={Play} size="sm" />{' '}
                {isRunning ? 'Playing...' : 'Run game'}
              </Button>
              <Button
                onClick={saveDraft}
                disabled={isRunning}
                variant="secondary"
              >
                {isSaved ? (
                  <Icon icon={Check} size="sm" />
                ) : (
                  <Icon icon={CodeXml} size="sm" />
                )}{' '}
                {isSaved ? 'Saved' : 'Save draft'}
              </Button>
              <Button
                onClick={undoBlock}
                disabled={isRunning || program.length === 0}
                variant="ghost"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {projectComplete && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-cyan-100 p-3 text-center font-extrabold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
                <Icon icon={Trophy} size="sm" /> Mini game complete!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
