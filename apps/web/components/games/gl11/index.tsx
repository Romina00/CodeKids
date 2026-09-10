'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  Check,
  GitBranch,
  Icon,
  Map,
  Play,
  RotateCcw,
  Undo2,
  X,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type NodeType = 'start' | 'decision' | 'deliver' | 'end';
type Weather = 'clear' | 'rain';

const nodeDetails: Record<NodeType, { label: string; short: string }> = {
  start: { label: 'Start', short: 'START' },
  decision: { label: 'Check weather', short: 'IS WEATHER CLEAR?' },
  deliver: { label: 'Deliver package', short: 'DELIVER' },
  end: { label: 'End', short: 'END' },
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL11() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [hasRainPath, setHasRainPath] = useState(false);
  const [weather, setWeather] = useState<Weather>('clear');
  const [activeNode, setActiveNode] = useState<NodeType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [missionPassed, setMissionPassed] = useState(false);
  const [message, setMessage] = useState(
    'Build a flowchart for a delivery drone.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function addNode(node: NodeType) {
    if (nodes.length === 4 || nodes.includes(node)) return;

    setNodes([...nodes, node]);
    setMissionPassed(false);
    setMessage('Add the next flowchart symbol, then connect the rain path.');
    setGuideMood('idle');
  }

  function undoNode() {
    setNodes(nodes.slice(0, -1));
    setMissionPassed(false);
    setMessage('Choose the next symbol in the algorithm.');
    setGuideMood('idle');
  }

  async function runTrace() {
    const correctOrder =
      nodes.length === 4 &&
      nodes[0] === 'start' &&
      nodes[1] === 'decision' &&
      nodes[2] === 'deliver' &&
      nodes[3] === 'end';

    if (!correctOrder || !hasRainPath) {
      setMessage('A flowchart needs Start, a decision, both paths, and End.');
      setGuideMood('sad');
      return;
    }

    setIsRunning(true);
    setMissionPassed(false);
    setGuideMood('idle');
    setMessage(`Tracing the ${weather} route...`);

    const trace =
      weather === 'clear'
        ? (['start', 'decision', 'deliver', 'end'] as NodeType[])
        : (['start', 'decision', 'end'] as NodeType[]);

    for (const node of trace) {
      setActiveNode(node);
      await wait(500);
    }

    setActiveNode(null);
    setIsRunning(false);
    setMissionPassed(true);
    setMessage(
      weather === 'clear'
        ? 'Clear plan! The drone delivered the package.'
        : 'Clear plan! The drone used the safe rain path.',
    );
    setGuideMood('happy');
  }

  function resetGame() {
    setNodes([]);
    setHasRainPath(false);
    setWeather('clear');
    setActiveNode(null);
    setIsRunning(false);
    setMissionPassed(false);
    setMessage('Build a flowchart for a delivery drone.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[18rem_1fr] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Use Start → Check weather → Deliver package → End, and add the rain path."
      />

      <section className="grid min-w-0 content-start gap-5">
        <header className="rounded-2xl border border-violet-200 border-l-4 border-l-violet-600 bg-violet-50 p-5 dark:border-violet-800 dark:bg-violet-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-300">
            <Icon icon={GitBranch} size="sm" /> Flowcharts
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Connect the Path
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Draw the plan before running it. A decision must have a route for
            clear and rainy weather.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.9fr)_minmax(20rem,1fr)]">
          <div className="grid content-start gap-4 rounded-2xl border border-violet-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-extrabold">
                <Icon icon={Map} size="sm" /> Your flowchart
              </h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-bold">
                {nodes.length}/4 nodes
              </span>
            </div>
            <div className="grid gap-2 rounded-xl bg-slate-900 p-4">
              {nodes.length === 0 ? (
                <p className="text-sm text-slate-400">Add Start to begin.</p>
              ) : (
                nodes.map((node, index) => (
                  <div key={node}>
                    <div
                      className={`border-2 p-3 text-center font-bold transition ${
                        activeNode === node
                          ? 'border-amber-300 bg-amber-300/20 text-amber-100'
                          : node === 'start' || node === 'end'
                            ? 'rounded-full border-violet-400 bg-violet-400/20'
                            : node === 'decision'
                              ? 'border-dashed border-amber-400 bg-amber-400/20'
                              : 'rounded-lg border-sky-400 bg-sky-400/20'
                      }`}
                    >
                      {nodeDetails[node].short}
                    </div>
                    {index < nodes.length - 1 && (
                      <p className="py-1 text-center text-violet-300">↓</p>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <span className="rounded-lg bg-emerald-400/20 p-2 text-emerald-200">
                TRUE → Deliver
              </span>
              <span
                className={`rounded-lg p-2 ${
                  hasRainPath
                    ? 'bg-sky-400/20 text-sky-200'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                FALSE → Wait
              </span>
            </div>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Add flowchart nodes
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(Object.keys(nodeDetails) as NodeType[]).map((node) => (
                  <Button
                    key={node}
                    variant="outline"
                    disabled={
                      isRunning || nodes.length === 4 || nodes.includes(node)
                    }
                    onClick={() => addNode(node)}
                  >
                    {nodeDetails[node].label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              variant={hasRainPath ? 'secondary' : 'outline'}
              disabled={isRunning}
              onClick={() => {
                setHasRainPath(!hasRainPath);
                setMissionPassed(false);
                setGuideMood('idle');
              }}
            >
              {hasRainPath ? (
                <Icon icon={Check} size="sm" />
              ) : (
                <Icon icon={X} size="sm" />
              )}{' '}
              {hasRainPath
                ? 'Rain path connected'
                : 'Connect false / rain path'}
            </Button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                2. Test both outcomes
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant={weather === 'clear' ? 'secondary' : 'outline'}
                  disabled={isRunning}
                  onClick={() => setWeather('clear')}
                >
                  Weather: clear
                </Button>
                <Button
                  variant={weather === 'rain' ? 'secondary' : 'outline'}
                  disabled={isRunning}
                  onClick={() => setWeather('rain')}
                >
                  Weather: rain
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runTrace}
                disabled={isRunning}
                className="min-w-32 flex-1"
              >
                <Icon icon={Play} size="sm" />{' '}
                {isRunning ? 'Tracing...' : 'Run trace'}
              </Button>
              <Button
                onClick={undoNode}
                disabled={isRunning || nodes.length === 0}
                variant="secondary"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {missionPassed && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-violet-100 p-3 text-center font-extrabold text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                <Icon icon={ArrowRight} size="sm" /> Flowchart works!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
