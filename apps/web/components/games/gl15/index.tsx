'use client';

import { Button } from '@repo/ui/button';
import {
  Bot,
  KeyRound,
  LockKeyhole,
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

const availableBlocks: Block[] = [
  'ifKey',
  'callFunction',
  'move',
  'defineFunction',
  'repeat',
  'score',
];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL15({ onComplete }: { onComplete?: () => void }) {
  const [editorStep, setEditorStep] = useState<'design' | 'build' | 'test'>(
    'design',
  );
  const [projectName, setProjectName] = useState('');
  const [program, setProgram] = useState<Block[]>([]);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [hasTreasure, setHasTreasure] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [projectComplete, setProjectComplete] = useState(false);
  const [message, setMessage] = useState(
    'Design a treasure quest. Make one program work with a key AND without one.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');
  const [distance, setDistance] = useState(4);
  const [targetScore, setTargetScore] = useState(3);
  const [repeatCount, setRepeatCount] = useState(2);
  const [rewardPoints, setRewardPoints] = useState(1);
  const [position, setPosition] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  const [testWithKey, setTestWithKey] = useState(true);
  const [passedTests, setPassedTests] = useState({
    withKey: false,
    withoutKey: false,
  });
  const [sceneMessage, setSceneMessage] = useState(
    'Design your quest, then test your program.',
  );

  const blocks = {
    ...blockDetails,
    repeat: {
      label: `Repeat ${repeatCount} times`,
      code: `REPEAT NEXT ACTION ${repeatCount} TIMES`,
    },
    score: {
      label: `Add ${rewardPoints} points`,
      code: `SCORE = SCORE + ${rewardPoints}`,
    },
    ifKey: { label: 'If player has key', code: 'IF HAS KEY: NEXT ACTION' },
  };

  function clearPreview() {
    setPosition(0);
    setHasKey(false);
    setScore(0);
    setHasTreasure(false);
    setActiveBlock(null);
    setSceneMessage('Ready to test from the start.');
  }

  function clearResults() {
    clearPreview();
    setPassedTests({ withKey: false, withoutKey: false });
    setProjectComplete(false);
    setIsSaved(false);
    setGuideMood('idle');
    setMessage('Project changed. Test it with and without the key.');
  }

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

    clearResults();
    setProgram([...program, block]);
    setIsSaved(false);
    setProjectComplete(false);
    setMessage('Block added. Your game is becoming interactive.');
    setGuideMood('idle');
  }

  function undoBlock() {
    clearResults();
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

    if (program.length === 0) {
      setMessage(
        'Add some blocks first. You can try an unfinished program too.',
      );
      setGuideMood('thinking');
      return;
    }

    clearPreview();
    setIsRunning(true);
    setProjectComplete(false);
    setGuideMood('idle');
    setMessage(
      'Watch your program run. Each highlighted line changes the game.',
    );
    let currentPosition = 0;
    let currentScore = 0;
    let collectedKey = false;
    let openedTreasure = false;
    let functionDefined = false;
    let usedLoop = false;
    let usedCondition = false;
    let error = '';

    async function runAction(block: Block, index: number) {
      setActiveBlock(index);
      await wait(400);
      if (block === 'move') {
        if (currentPosition === distance) {
          error =
            'The player walked too far! Check your repeat count and movement blocks.';
          return;
        }
        currentPosition += 1;
        setPosition(currentPosition);
        if (currentPosition === distance && testWithKey) {
          collectedKey = true;
          setHasKey(true);
        }
        setSceneMessage(
          `Moved ${currentPosition} of ${distance} spaces.${collectedKey ? ' Key found!' : ''}`,
        );
      }
      if (block === 'score') {
        currentScore += rewardPoints;
        setScore(currentScore);
        setSceneMessage(`Added ${rewardPoints} points.`);
      }
      if (block === 'callFunction') {
        if (!functionDefined) {
          error =
            'Define collectReward() before calling it. Put the points block directly below the definition.';
          return;
        }
        if (!collectedKey) {
          error =
            'The function ran without a key! Use IF to skip the call when there is no key.';
          return;
        }
        currentScore += rewardPoints;
        setScore(currentScore);
        openedTreasure = true;
        setHasTreasure(true);
        setSceneMessage(
          `collectReward() opened the treasure and added ${rewardPoints} points!`,
        );
      }
      await wait(400);
    }

    for (let index = 0; index < program.length; index += 1) {
      const block = program[index];
      if (!block) continue;
      setActiveBlock(index);
      if (block === 'defineFunction') {
        if (program[index + 1] !== 'score') {
          error =
            'Put the points block directly below Define collectReward(). This is the action your function remembers.';
          break;
        }
        functionDefined = true;
        setSceneMessage(
          `Function defined: add ${rewardPoints} points when called. Nothing runs yet.`,
        );
        await wait(600);
        index += 1;
      } else if (block === 'repeat' || block === 'ifKey') {
        const nextBlock = program[index + 1];
        if (
          !nextBlock ||
          !['move', 'score', 'callFunction'].includes(nextBlock)
        ) {
          error =
            'REPEAT and IF need one action directly below them: Move, Add points, or Call. They cannot contain another REPEAT, IF, or definition.';
          break;
        }
        if (block === 'repeat') usedLoop = true;
        if (block === 'ifKey') usedCondition = true;
        const times = block === 'repeat' ? repeatCount : collectedKey ? 1 : 0;
        setSceneMessage(
          block === 'repeat'
            ? `Repeat the next action ${repeatCount} times.`
            : `Has key: ${collectedKey}. ${collectedKey ? 'Run' : 'Skip'} the next action.`,
        );
        await wait(600);
        for (let count = 0; count < times; count += 1) {
          await runAction(nextBlock, index + 1);
          if (error) break;
        }
        index += 1;
      } else {
        await runAction(block, index);
      }
      if (error) break;
    }

    setActiveBlock(null);
    setIsRunning(false);
    const reachedGoal = currentPosition === distance;
    const correctReward = testWithKey
      ? openedTreasure && currentScore === targetScore
      : !openedTreasure && currentScore === 0;
    const passed =
      !error &&
      reachedGoal &&
      correctReward &&
      readyToRun &&
      usedLoop &&
      usedCondition &&
      functionDefined;
    const nextTests = {
      ...passedTests,
      [testWithKey ? 'withKey' : 'withoutKey']: passed,
    };
    setPassedTests(nextTests);
    if (!passed) {
      const feedback =
        error ||
        (!reachedGoal
          ? `Your player moved ${currentPosition} spaces. Your treasure is ${distance} spaces away.`
          : !correctReward
            ? testWithKey
              ? `Open the treasure and earn exactly ${targetScore} points. You earned ${currentScore}.`
              : 'Without the key, the treasure must stay locked and the score must stay 0.'
            : 'Use all five ideas: a sequence, points, a working loop, an IF check, and a defined function.');
      setSceneMessage(feedback);
      setMessage(feedback);
      setGuideMood('thinking');
      return;
    }

    setGuideMood('happy');
    if (nextTests.withKey && nextTests.withoutKey) {
      setProjectComplete(true);
      setMessage(
        `You created ${projectName.trim()}! Your game passed both tests. You are a game maker!`,
      );
      setSceneMessage('Both tests passed! Your own mini game is ready.');
      onComplete?.();
    } else {
      setMessage(
        'Test passed! Now choose the other test and run the SAME program.',
      );
      setSceneMessage(
        'Test passed! Check the other situation before finishing.',
      );
    }
  }

  function resetGame() {
    clearResults();
    setEditorStep('design');
    setDistance(4);
    setTargetScore(3);
    setRepeatCount(2);
    setRewardPoints(1);
    setTestWithKey(true);
    setProjectName('');
    setProgram([]);
    setActiveBlock(null);
    setScore(0);
    setHasTreasure(false);
    setIsRunning(false);
    setIsSaved(false);
    setProjectComplete(false);
    setMessage(
      'Design a treasure quest. Make one program work with a key AND without one.',
    );
    setGuideMood('idle');
  }

  return (
    <main className="grid min-w-0 gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm lg:grid-cols-[minmax(12rem,22%)_minmax(0,1fr)] lg:items-start [&>aside]:min-h-0 [&>aside]:content-start [&>aside]:gap-3 [&>aside>div:first-child]:min-h-0 [&>aside>div:first-child]:gap-3 [&>aside_p]:text-base [&>aside_p]:leading-normal [&>aside_button]:min-h-10 [&>aside_button]:px-3 [&>aside_button]:py-2 [&>aside_button]:text-sm dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Your repeat count should match the distance. Define the reward before calling it: the points block below DEFINE is its body. IF controls the next action, so use it to protect the reward call. Match your reward to the target points."
        tutorial={[
          'You are the game designer! Name your quest and choose the distance and winning score.',
          'Build your program: DEFINE remembers the points action below it. REPEAT repeats the next action. IF runs the next action only when a key was found.',
          'Watch your robot move! Pass both tests with the same program: win the treasure with a key, but give no reward without one. Changes mean testing again!',
        ]}
      />

      <section className="grid min-w-0 content-start gap-3">
        <header className="rounded-2xl border border-cyan-200 border-l-4 border-l-cyan-600 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
            <Icon icon={Gamepad2} size="sm" /> Final project
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Build Your Own Mini Game
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Design your treasure quest, write its rules, and prove that the same
            program works with and without a key.
          </p>
        </header>

        <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="grid content-start gap-3 rounded-2xl border border-cyan-200 bg-slate-950 p-3 text-white">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-extrabold">
                <Icon icon={Rocket} size="sm" /> Game preview
              </h3>
              {projectComplete && (
                <Icon icon={Trophy} size="md" className="text-amber-300" />
              )}
            </div>
            <div className="rounded-xl bg-slate-900 p-3">
              <div className="relative h-28">
                <div className="absolute inset-x-0 bottom-0 flex gap-1">
                  {Array.from({ length: distance + 1 }, (_, square) => (
                    <div
                      key={square}
                      className="grid h-12 min-w-0 flex-1 place-items-center rounded-lg border border-cyan-500/40 bg-cyan-950 text-xs font-bold"
                    >
                      {square}
                    </div>
                  ))}
                </div>
                <div
                  className="absolute top-2 grid place-items-center transition-all duration-500 motion-reduce:transition-none"
                  style={{
                    left: `${(position / (distance + 1)) * 100}%`,
                    width: `${100 / (distance + 1)}%`,
                  }}
                >
                  <Icon
                    icon={Bot}
                    size="xl"
                    className="size-10 text-cyan-300"
                  />
                </div>
                {testWithKey && !hasKey && (
                  <Icon
                    icon={KeyRound}
                    size="lg"
                    className="absolute right-2 top-10 text-amber-300"
                  />
                )}
              </div>
              <div
                className={`mt-2 flex items-center justify-center gap-2 rounded-xl border-2 p-2 ${hasTreasure ? 'border-amber-300 bg-amber-400/20 text-amber-200' : 'border-slate-600 text-slate-300'}`}
              >
                <Icon icon={hasTreasure ? Trophy : LockKeyhole} size="xl" />
                <strong>
                  {hasTreasure ? 'Treasure unlocked!' : 'Locked treasure'}
                </strong>
              </div>
              <p
                role="status"
                className="mt-3 text-center text-sm text-cyan-100"
              >
                {sceneMessage}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900 p-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-800 p-3">
                <span className="font-bold">Player</span>
                <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-sm font-bold">
                  {hasKey ? 'has key' : 'no key'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-800 p-3">
                <span className="font-bold">Score</span>
                <span className="flex items-center gap-1 font-extrabold text-amber-200">
                  <Icon icon={Variable} size="sm" /> {score}
                </span>
              </div>
              <p className="col-span-2 rounded-lg border border-dashed border-cyan-400/50 p-3 text-center text-sm text-cyan-100">
                {projectName.trim() || 'Your game name'}
              </p>
            </div>
            <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300">
              With key: reach the treasure and earn exactly {targetScore}{' '}
              points. Without key: reach the end, keep the treasure locked and
              score 0.
            </p>
          </div>

          <div className="grid content-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="grid grid-cols-3 gap-2" aria-label="Project steps">
              {(['design', 'build', 'test'] as const).map((step, index) => (
                <Button
                  key={step}
                  variant={editorStep === step ? 'primary' : 'outline'}
                  aria-pressed={editorStep === step}
                  onClick={() => setEditorStep(step)}
                >
                  {index + 1}.{' '}
                  {step === 'design'
                    ? 'Design'
                    : step === 'build'
                      ? 'Build'
                      : 'Test'}
                </Button>
              ))}
            </div>
            {editorStep === 'design' && (
              <>
                <label className="grid gap-2 font-bold text-slate-900 dark:text-white">
                  Name your mini game
                  <input
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    disabled={isRunning}
                    onChange={(event) => {
                      setProjectName(event.target.value);
                      setIsSaved(false);
                    }}
                    placeholder="Example: Key Quest"
                    value={projectName}
                  />
                </label>

                <fieldset
                  disabled={isRunning}
                  className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-900 dark:text-white"
                >
                  <legend className="mb-2 text-lg">1. Design your game</legend>
                  {[
                    {
                      label: 'Treasure distance',
                      min: 3,
                      max: 6,
                      value: distance,
                      set: setDistance,
                    },
                    {
                      label: 'Winning score',
                      min: 2,
                      max: 5,
                      value: targetScore,
                      set: setTargetScore,
                    },
                    {
                      label: 'Repeat count',
                      min: 1,
                      max: 6,
                      value: repeatCount,
                      set: setRepeatCount,
                    },
                    {
                      label: 'Points per reward',
                      min: 1,
                      max: 5,
                      value: rewardPoints,
                      set: setRewardPoints,
                    },
                  ].map((setting) => (
                    <label key={setting.label} className="grid gap-1">
                      {setting.label} ({setting.min}–{setting.max})
                      <input
                        type="number"
                        min={setting.min}
                        max={setting.max}
                        value={setting.value}
                        className="w-full rounded border border-slate-300 bg-white p-2 text-slate-900"
                        onChange={(event) => {
                          const value = Math.floor(Number(event.target.value));
                          setting.set(
                            Math.max(
                              setting.min,
                              Math.min(setting.max, value || setting.min),
                            ),
                          );
                          clearResults();
                        }}
                      />
                    </label>
                  ))}
                </fieldset>
                <Button
                  onClick={() => setEditorStep('build')}
                  variant="secondary"
                >
                  Next: build your program
                </Button>
              </>
            )}

            {editorStep === 'build' && (
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  2. Build your program
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Maximum 8 blocks. DEFINE uses the points block below it.
                  REPEAT and IF each control just the next action.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {availableBlocks.map((block) => (
                    <Button
                      key={block}
                      variant="outline"
                      disabled={isRunning || program.length === 8}
                      onClick={() => addBlock(block)}
                    >
                      {blocks[block].label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {editorStep !== 'design' && (
              <div className="grid gap-1 rounded-xl border-2 border-dashed border-cyan-300 bg-white p-3 font-mono dark:border-cyan-700 dark:bg-slate-900">
                {program.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Your program is empty...
                  </p>
                ) : (
                  program.map((block, index) => (
                    <p
                      className={`rounded px-3 py-2 text-sm font-bold ${
                        activeBlock === index
                          ? 'bg-amber-100 text-amber-950'
                          : 'bg-cyan-50 text-cyan-950 dark:bg-cyan-950/50 dark:text-cyan-100'
                      }`}
                      key={`${block}-${index}`}
                    >
                      {index + 1}. {blocks[block].code}
                    </p>
                  ))
                )}
              </div>
            )}

            {editorStep === 'test' && (
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900">
                <h3 className="col-span-2 flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                  <Icon icon={CodeXml} size="sm" /> Coding blocks included
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
                        checklist[key as keyof typeof checklist]
                          ? Check
                          : CodeXml
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
            )}

            {editorStep === 'test' && (
              <div className="grid gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white">
                  3. Test both situations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[true, false].map((withKey) => (
                    <Button
                      key={String(withKey)}
                      variant={testWithKey === withKey ? 'primary' : 'outline'}
                      disabled={isRunning}
                      aria-pressed={testWithKey === withKey}
                      onClick={() => {
                        setTestWithKey(withKey);
                        clearPreview();
                        setGuideMood('idle');
                        setMessage('Run the same program in this situation.');
                      }}
                    >
                      {withKey ? 'With key' : 'Without key'}
                      {(withKey
                        ? passedTests.withKey
                        : passedTests.withoutKey) && (
                        <Icon icon={Check} size="sm" />
                      )}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {Number(passedTests.withKey) + Number(passedTests.withoutKey)}{' '}
                  of 2 tests passed. Run the same program in both situations.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setEditorStep('test');
                  void runProject();
                }}
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
                <Icon icon={Trophy} size="sm" /> I built my own mini game! Both
                tests passed.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
