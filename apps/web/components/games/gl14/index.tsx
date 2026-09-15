'use client';

import { Button } from '@repo/ui/button';
import {
  Check,
  Flame,
  Icon,
  Play,
  RotateCcw,
  Sparkles,
  Undo2,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Direction = 'left' | 'right';

const directions: Direction[] = ['left', 'right'];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL14() {
  const [functionDefined, setFunctionDefined] = useState(false);
  const [functionBody, setFunctionBody] = useState(false);
  const [calls, setCalls] = useState<Direction[]>([]);
  const [litTorches, setLitTorches] = useState<Record<Direction, boolean>>({
    left: false,
    right: false,
  });
  const [activeCall, setActiveCall] = useState<Direction | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);
  const [message, setMessage] = useState(
    'Define one spell function and call it for both torches.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function defineFunction() {
    setFunctionDefined(true);
    setMissionPassed(false);
    setMessage('Function created. Now add an action to its body.');
    setGuideMood('idle');
  }

  function addFunctionBody() {
    setFunctionBody(true);
    setMissionPassed(false);
    setMessage('The function can light a torch. Call it with a direction.');
    setGuideMood('idle');
  }

  function addCall(direction: Direction) {
    if (!functionDefined || calls.length === 2) return;

    setCalls([...calls, direction]);
    setLitTorches({ left: false, right: false });
    setMissionPassed(false);
    setMessage(`Added castSpell(${direction}). Add the other direction too.`);
    setGuideMood('idle');
  }

  function undoCall() {
    setCalls(calls.slice(0, -1));
    setLitTorches({ left: false, right: false });
    setMissionPassed(false);
    setMessage('Choose the next function call.');
    setGuideMood('idle');
  }

  async function runProgram() {
    if (!functionDefined || !functionBody || calls.length < 2) {
      setMessage('Define the function, add its body, and call it twice.');
      setGuideMood('sad');
      return;
    }

    setIsRunning(true);
    setMissionPassed(false);
    setLitTorches({ left: false, right: false });
    setGuideMood('idle');
    setMessage('Running the same function with each parameter...');

    const torches = { left: false, right: false };
    for (const direction of calls) {
      setActiveCall(direction);
      await wait(600);
      torches[direction] = true;
      setLitTorches({ ...torches });
    }

    setActiveCall(null);
    setIsRunning(false);

    const usesBothDirections =
      calls.includes('left') && calls.includes('right');

    if (!usesBothDirections) {
      setMessage(
        'The function works, but use it with left and right parameters.',
      );
      setGuideMood('sad');
      return;
    }

    setMissionPassed(true);
    setMessage('Powerful design! One function works for every target.');
    setGuideMood('happy');
  }

  function resetGame() {
    setFunctionDefined(false);
    setFunctionBody(false);
    setCalls([]);
    setLitTorches({ left: false, right: false });
    setActiveCall(null);
    setIsRunning(false);
    setMissionPassed(false);
    setMessage('Define one spell function and call it for both torches.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Create castSpell(direction), put LIGHT TORCH inside it, then call it with left and right."
        tutorial={[
          'Goal: use one spell to light both torches.',
          'A function is a named mini-program you can use again whenever you need it.',
          'Define the spell once, put the torch action inside it, then call it for left and right!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-fuchsia-200 border-l-4 border-l-fuchsia-600 bg-fuchsia-50 p-5 dark:border-fuchsia-800 dark:bg-fuchsia-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-300">
            <Icon icon={Sparkles} size="sm" /> Functions
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Wizard Spells
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Define the spell once. The parameter tells it which torch to light.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.85fr)_minmax(20rem,1fr)]">
          <div className="grid content-start gap-4 rounded-2xl border border-fuchsia-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Magic room</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-bold">
                {Object.values(litTorches).filter(Boolean).length}/2 lit
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-900 p-4">
              {directions.map((direction) => (
                <div
                  className={`grid min-h-28 place-items-center rounded-xl border-2 p-3 text-center font-bold transition ${
                    activeCall === direction
                      ? 'border-amber-300 bg-amber-300/20 text-amber-100'
                      : litTorches[direction]
                        ? 'border-fuchsia-400 bg-fuchsia-400/30 text-fuchsia-100'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                  key={direction}
                >
                  <Icon
                    icon={Flame}
                    size="lg"
                    className={
                      litTorches[direction]
                        ? 'text-orange-400'
                        : 'text-slate-500'
                    }
                  />
                  {direction} torch
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="rounded-xl border-2 border-dashed border-fuchsia-300 bg-white p-3 font-mono dark:border-fuchsia-700 dark:bg-slate-900">
              <p className="font-bold text-fuchsia-700 dark:text-fuchsia-300">
                {functionDefined
                  ? 'DEFINE castSpell(direction)'
                  : 'DEFINE __________'}
              </p>
              <p className="mt-2 rounded bg-fuchsia-50 px-3 py-2 pl-6 text-sm font-bold text-fuchsia-950 dark:bg-fuchsia-950/50 dark:text-fuchsia-100">
                {functionBody
                  ? 'LIGHT TORCH(direction)'
                  : 'Choose the function body...'}
              </p>
              <p className="font-bold text-fuchsia-700 dark:text-fuchsia-300">
                {' }'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={defineFunction}
                disabled={isRunning || functionDefined}
                variant="outline"
              >
                Define function
              </Button>
              <Button
                onClick={addFunctionBody}
                disabled={isRunning || !functionDefined || functionBody}
                variant="outline"
              >
                Add light torch
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Calls with parameters
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {directions.map((direction) => (
                  <Button
                    key={direction}
                    onClick={() => addCall(direction)}
                    disabled={
                      isRunning || !functionDefined || calls.length === 2
                    }
                    variant="outline"
                  >
                    castSpell({direction})
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 bg-white p-3 font-mono dark:border-slate-600 dark:bg-slate-900">
              {calls.length === 0 ? (
                <p className="text-sm text-slate-500">Add two calls...</p>
              ) : (
                calls.map((direction, index) => (
                  <p
                    className={`mt-2 rounded px-3 py-2 text-sm font-bold ${
                      activeCall === direction
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    }`}
                    key={`${direction}-${index}`}
                  >
                    {index + 1}. castSpell({direction})
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
                onClick={undoCall}
                disabled={isRunning || calls.length === 0}
                variant="secondary"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {missionPassed && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-fuchsia-100 p-3 text-center font-extrabold text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200">
                <Icon icon={Check} size="sm" /> Level complete!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
