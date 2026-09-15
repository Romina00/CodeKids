'use client';

import { Button } from '@repo/ui/button';
import {
  Flame,
  Icon,
  Milk,
  Play,
  RotateCcw,
  Soup,
  Undo2,
  Utensils,
  Wheat,
  type LucideIcon,
} from '@repo/ui/icon';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Command = 'dough' | 'sauce' | 'cheese' | 'bake' | 'serve';

type PizzaState = {
  hasDough: boolean;
  hasSauce: boolean;
  hasCheese: boolean;
  isBaked: boolean;
  isServed: boolean;
};

const emptyPizza: PizzaState = {
  hasDough: false,
  hasSauce: false,
  hasCheese: false,
  isBaked: false,
  isServed: false,
};

const commandDetails: Record<Command, { icon: LucideIcon; label: string }> = {
  dough: { icon: Wheat, label: 'Prepare dough' },
  sauce: { icon: Soup, label: 'Add sauce' },
  cheese: { icon: Milk, label: 'Add cheese' },
  bake: { icon: Flame, label: 'Bake pizza' },
  serve: { icon: Utensils, label: 'Serve pizza' },
};

const availableCommands = Object.keys(commandDetails) as Command[];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function checkCommand(command: Command, pizza: PizzaState) {
  if (command === 'dough' && pizza.hasDough) {
    return 'The dough is already prepared.';
  }

  if (command === 'sauce' && !pizza.hasDough) {
    return 'Prepare the dough before adding sauce.';
  }

  if (command === 'sauce' && pizza.hasSauce) {
    return 'The pizza already has sauce.';
  }

  if (command === 'cheese' && !pizza.hasSauce) {
    return 'Add the sauce before adding cheese.';
  }

  if (command === 'cheese' && pizza.hasCheese) {
    return 'The pizza already has cheese.';
  }

  if (command === 'bake' && !pizza.hasCheese) {
    return 'Add the cheese before baking the pizza.';
  }

  if (command === 'bake' && pizza.isBaked) {
    return 'The pizza is already baked.';
  }

  if (command === 'serve' && !pizza.isBaked) {
    return 'Bake the pizza before serving it.';
  }

  if (command === 'serve' && pizza.isServed) {
    return 'The pizza is already served.';
  }

  return null;
}

function applyCommand(command: Command, pizza: PizzaState) {
  const newPizza = { ...pizza };

  if (command === 'dough') newPizza.hasDough = true;
  if (command === 'sauce') newPizza.hasSauce = true;
  if (command === 'cheese') newPizza.hasCheese = true;
  if (command === 'bake') newPizza.isBaked = true;
  if (command === 'serve') newPizza.isServed = true;

  return newPizza;
}

export default function GameGL2() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [pizza, setPizza] = useState<PizzaState>(emptyPizza);
  const [activeCommand, setActiveCommand] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    'Build a program that prepares and serves a pizza.',
  );
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function addCommand(command: Command) {
    setCommands([...commands, command]);
    setMessage('Nice! Add another command or run your program.');
    setGuideMood('idle');
  }

  function undoLastCommand() {
    setCommands(commands.slice(0, -1));
  }

  function resetGame() {
    setCommands([]);
    setPizza({ ...emptyPizza });
    setActiveCommand(null);
    setMessage('Build a program that prepares and serves a pizza.');
    setGuideMood('idle');
  }

  async function runProgram() {
    if (commands.length === 0) {
      setMessage('Add at least one command before you press Run.');
      setGuideMood('sad');
      return;
    }

    setIsRunning(true);
    setGuideMood('idle');
    setMessage('The chef is running your program...');

    let currentPizza = { ...emptyPizza };
    setPizza(currentPizza);
    await wait(300);

    for (let index = 0; index < commands.length; index += 1) {
      const command = commands[index];

      if (!command) continue;

      setActiveCommand(index);

      const errorMessage = checkCommand(command, currentPizza);

      if (errorMessage) {
        setMessage(`Command ${index + 1} cannot run. ${errorMessage}`);
        setGuideMood('sad');
        setIsRunning(false);
        return;
      }

      currentPizza = applyCommand(command, currentPizza);
      setPizza(currentPizza);
      await wait(700);
    }

    setActiveCommand(null);
    setIsRunning(false);

    if (currentPizza.isServed) {
      setMessage('Great job! Your program made and served the pizza.');
      setGuideMood('happy');
    } else {
      setMessage('The program finished, but the pizza is not served yet.');
      setGuideMood('sad');
    }
  }

  return (
    <main className="grid min-h-full gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[18rem_1fr] lg:p-6 dark:border-slate-700 dark:bg-slate-900">
      <GameGuide
        mood={guideMood}
        message={message}
        hint="Think like a chef: dough, sauce, cheese, bake, then serve."
        tutorial={[
          'Goal: give the chef the steps for one tasty pizza.',
          'A program is a recipe for a computer: it follows each step in order.',
          'Choose the pizza steps from first to last, then run your recipe!',
        ]}
      />

      <section className="grid min-w-0 content-start gap-5">
        <header className="rounded-2xl border border-orange-200 border-l-4 border-l-orange-500 bg-orange-50 p-5 dark:border-orange-800 dark:bg-orange-950/40">
          <p className="text-sm font-extrabold uppercase tracking-wider text-orange-700 dark:text-orange-300">
            Algorithm · Sequence
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            Pizza Builder
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Create a program and watch the chef follow every command.
          </p>
        </header>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(20rem,1fr)]">
          <div className="grid min-h-80 content-between overflow-hidden rounded-2xl border border-orange-200 bg-amber-50 p-5 dark:border-orange-800 dark:bg-amber-950/30">
            <div>
              <h3 className="text-center text-lg font-extrabold text-slate-900 dark:text-white">
                Pizza station
              </h3>
              <p className="mt-1 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                Each command changes the pizza.
              </p>
            </div>

            <div className="grid place-items-center py-6" aria-live="polite">
              {!pizza.hasDough ? (
                <div className="grid size-44 place-items-center rounded-full border-4 border-dashed border-orange-300 text-center text-sm font-bold text-orange-700 dark:text-orange-300">
                  The plate is empty
                </div>
              ) : (
                <div
                  className={`relative grid size-44 place-items-center rounded-full border-8 shadow-lg transition-all duration-500 ${
                    pizza.isBaked
                      ? 'border-amber-700 bg-orange-400'
                      : 'border-amber-500 bg-amber-200'
                  }`}
                >
                  {pizza.hasSauce && (
                    <div className="absolute inset-3 rounded-full bg-red-500" />
                  )}
                  {pizza.hasCheese && (
                    <div
                      className={`absolute inset-5 rounded-full ${
                        pizza.isBaked ? 'bg-yellow-300' : 'bg-yellow-100'
                      }`}
                    />
                  )}
                  {pizza.hasCheese && (
                    <div
                      className="absolute z-10 grid grid-cols-3 gap-5"
                      aria-hidden="true"
                    >
                      <span className="size-3 rounded-full bg-red-600" />
                      <span className="size-3 rounded-full bg-green-600" />
                      <span className="size-3 rounded-full bg-red-600" />
                      <span className="size-3 rounded-full bg-green-600" />
                      <span className="size-3 rounded-full bg-red-600" />
                      <span className="size-3 rounded-full bg-green-600" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="rounded-xl bg-white/80 px-3 py-2 text-center font-bold text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              {pizza.isServed
                ? 'Pizza served!'
                : pizza.isBaked
                  ? 'Pizza baked'
                  : pizza.hasCheese
                    ? 'Cheese added'
                    : pizza.hasSauce
                      ? 'Sauce added'
                      : pizza.hasDough
                        ? 'Dough prepared'
                        : 'Waiting for the first command'}
            </p>
          </div>

          <div className="grid content-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                1. Choose commands
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {availableCommands.map((command) => (
                  <Button
                    key={command}
                    variant="outline"
                    disabled={isRunning}
                    onClick={() => addCommand(command)}
                    className="justify-start gap-2"
                  >
                    <Icon icon={commandDetails[command].icon} size="lg" />
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
                  {commands.length} commands
                </span>
              </div>

              <ol
                aria-live="polite"
                className="mt-3 grid min-h-28 content-start gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-900"
              >
                {commands.length === 0 && (
                  <li className="m-auto text-center text-sm font-semibold text-slate-500">
                    Your command blocks will appear here.
                  </li>
                )}

                {commands.map((command, index) => (
                  <li
                    key={`${command}-${index}`}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 font-bold transition ${
                      activeCommand === index
                        ? 'border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300'
                        : 'border-orange-200 bg-orange-50 text-orange-950 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-100'
                    }`}
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-orange-500 text-xs text-white">
                      {index + 1}
                    </span>
                    <Icon icon={commandDetails[command].icon} size="lg" />
                    {commandDetails[command].label}
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
                onClick={undoLastCommand}
                disabled={isRunning || commands.length === 0}
                variant="secondary"
              >
                <Icon icon={Undo2} size="sm" />
                Undo
              </Button>
              <Button onClick={resetGame} disabled={isRunning} variant="ghost">
                <Icon icon={RotateCcw} size="sm" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
