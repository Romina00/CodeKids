'use client';

import { Button } from '@repo/ui/button';
import {
  ArrowRight,
  Check,
  Icon,
  Play,
  RotateCcw,
  ShieldCheck,
  Undo2,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Part = 'wall' | 'gate' | 'tower';
type Action =
  | 'placeBricks'
  | 'strengthenWall'
  | 'buildGate'
  | 'addLock'
  | 'buildTower'
  | 'raiseFlag';

type PartInfo = {
  label: string;
  goal: string;
  actions: Action[];
};

const partInfo: Record<Part, PartInfo> = {
  wall: {
    label: 'Wall',
    goal: 'Place bricks, then strengthen the wall.',
    actions: ['placeBricks', 'strengthenWall'],
  },
  gate: {
    label: 'Gate',
    goal: 'Build the gate, then add its lock.',
    actions: ['buildGate', 'addLock'],
  },
  tower: {
    label: 'Tower',
    goal: 'Build the tower, then raise its flag.',
    actions: ['buildTower', 'raiseFlag'],
  },
};

const actionLabels: Record<Action, string> = {
  placeBricks: 'Place bricks',
  strengthenWall: 'Strengthen wall',
  buildGate: 'Build gate',
  addLock: 'Add lock',
  buildTower: 'Build tower',
  raiseFlag: 'Raise flag',
};

const parts = Object.keys(partInfo) as Part[];
const emptyPrograms: Record<Part, Action[]> = {
  wall: [],
  gate: [],
  tower: [],
};
const emptyTests: Record<Part, boolean> = {
  wall: false,
  gate: false,
  tower: false,
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default function GameGL13({ onComplete }: { onComplete?: () => void }) {
  const [selectedPart, setSelectedPart] = useState<Part>('wall');
  const [programs, setPrograms] =
    useState<Record<Part, Action[]>>(emptyPrograms);
  const [testedParts, setTestedParts] =
    useState<Record<Part, boolean>>(emptyTests);
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [castleBuilt, setCastleBuilt] = useState(false);
  const [message, setMessage] = useState(
    'Split the big castle problem into three smaller programs.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const currentProgram = programs[selectedPart];
  const currentInfo = partInfo[selectedPart];

  function addAction(action: Action) {
    if (currentProgram.length === 2 || currentProgram.includes(action)) return;

    setPrograms({ ...programs, [selectedPart]: [...currentProgram, action] });
    setTestedParts({ ...testedParts, [selectedPart]: false });
    setCastleBuilt(false);
    setMessage(`Program updated for the ${currentInfo.label.toLowerCase()}.`);
    setGuideMood('idle');
  }

  function undoAction() {
    setPrograms({
      ...programs,
      [selectedPart]: currentProgram.slice(0, -1),
    });
    setTestedParts({ ...testedParts, [selectedPart]: false });
    setCastleBuilt(false);
    setMessage('Choose the next action for this part.');
    setGuideMood('idle');
  }

  async function testPart() {
    if (currentProgram.length === 0) {
      setMessage('Add actions to this part before testing it.');
      setGuideMood('thinking');
      return;
    }

    setIsRunning(true);
    setGuideMood('idle');
    setMessage(`Testing the ${currentInfo.label.toLowerCase()} program...`);

    for (const action of currentProgram) {
      setActiveAction(action);
      await wait(500);
    }

    setActiveAction(null);
    setIsRunning(false);

    const isCorrect =
      currentProgram.length === currentInfo.actions.length &&
      currentProgram.every(
        (action, index) => action === currentInfo.actions[index],
      );

    if (!isCorrect) {
      setTestedParts({ ...testedParts, [selectedPart]: false });
      setMessage(
        `The ${currentInfo.label.toLowerCase()} needs a different action order.`,
      );
      setGuideMood('thinking');
      return;
    }

    setTestedParts({ ...testedParts, [selectedPart]: true });
    setMessage(
      `The ${currentInfo.label.toLowerCase()} works. Test the other parts.`,
    );
    setGuideMood('happy');
  }

  function buildCastle() {
    if (!parts.every((part) => testedParts[part])) {
      setMessage('Test the wall, gate, and tower before building the castle.');
      setGuideMood('thinking');
      return;
    }

    setCastleBuilt(true);
    setMessage(
      'Castle complete! You solved one big task with smaller programs.',
    );
    setGuideMood('happy');
    onComplete?.();
  }

  function resetGame() {
    setSelectedPart('wall');
    setPrograms({ wall: [], gate: [], tower: [] });
    setTestedParts({ wall: false, gate: false, tower: false });
    setActiveAction(null);
    setIsRunning(false);
    setCastleBuilt(false);
    setMessage('Split the big castle problem into three smaller programs.');
    setGuideMood('idle');
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(18rem,35%)_minmax(0,1fr)] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Test each part separately: Wall, Gate, and Tower."
        tutorial={[
          'Goal: build a castle by solving one small problem at a time.',
          'Big programs are easier when we split them into smaller parts. Each part gets its own plan.',
          'Choose a castle part, make its program work, and then move to the next part!',
        ]}
      />

      <section className="grid min-h-full min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-5">
        <header className="rounded-2xl border border-orange-200 border-l-4 border-l-orange-600 bg-orange-50 p-5 dark:border-orange-800 dark:bg-orange-950/40">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-orange-700 dark:text-orange-300">
            <Icon icon={ShieldCheck} size="sm" /> Decomposition
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            Build a Castle
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            A large problem is easier when each small part has its own program
            and test.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid content-start gap-3 rounded-2xl border border-orange-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Castle parts</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-bold">
                {parts.filter((part) => testedParts[part]).length}/3 tested
              </span>
            </div>
            {parts.map((part) => (
              <button
                className={`flex items-center justify-between rounded-xl border p-3 text-left font-bold transition ${
                  selectedPart === part
                    ? 'border-orange-300 bg-orange-300/20 text-orange-100'
                    : 'border-slate-700 bg-slate-800 text-slate-200'
                }`}
                disabled={isRunning}
                key={part}
                onClick={() => setSelectedPart(part)}
                type="button"
              >
                <span>{partInfo[part].label}</span>
                {testedParts[part] && <Icon icon={Check} size="sm" />}
              </button>
            ))}
            <div
              className={`mt-2 flex items-center justify-center gap-2 rounded-xl p-4 text-center text-lg font-extrabold ${
                castleBuilt
                  ? 'bg-emerald-400/25 text-emerald-100'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {castleBuilt && <Icon icon={ShieldCheck} size="md" />}
              {castleBuilt ? 'Castle ready!' : 'Castle in pieces'}
            </div>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Program for the {currentInfo.label}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {currentInfo.goal}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentInfo.actions.map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  disabled={isRunning || currentProgram.length === 2}
                  onClick={() => addAction(action)}
                >
                  {actionLabels[action]}
                </Button>
              ))}
            </div>

            <div className="rounded-xl border-2 border-dashed border-orange-300 bg-white p-3 font-mono dark:border-orange-700 dark:bg-slate-900">
              {currentProgram.length === 0 ? (
                <p className="text-sm text-slate-500">Add two actions...</p>
              ) : (
                currentProgram.map((action, index) => (
                  <p
                    className={`mt-2 rounded px-3 py-2 text-sm font-bold ${
                      activeAction === action
                        ? 'bg-amber-100 text-amber-950'
                        : 'bg-orange-50 text-orange-950 dark:bg-orange-950/50 dark:text-orange-100'
                    }`}
                    key={`${action}-${index}`}
                  >
                    {index + 1}. {actionLabels[action]}
                  </p>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={testPart}
                disabled={isRunning}
                className="min-w-32 flex-1"
              >
                <Icon icon={Play} size="sm" />{' '}
                {isRunning ? 'Testing...' : 'Test part'}
              </Button>
              <Button
                onClick={buildCastle}
                disabled={isRunning}
                variant="secondary"
              >
                <Icon icon={ShieldCheck} size="sm" /> Build castle
              </Button>
              <Button
                onClick={undoAction}
                disabled={isRunning || currentProgram.length === 0}
                variant="ghost"
              >
                <Icon icon={Undo2} size="sm" /> Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" /> Reset
              </Button>
            </div>

            {castleBuilt && (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-orange-100 p-3 text-center font-extrabold text-orange-800 dark:bg-orange-950 dark:text-orange-200">
                <Icon icon={ArrowRight} size="sm" /> Level complete!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
