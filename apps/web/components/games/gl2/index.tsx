'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Step = {
  id: number;
  title: string;
};

const correctSteps: Step[] = [
  { id: 1, title: 'Prepare the dough' },
  { id: 2, title: 'Add the sauce' },
  { id: 3, title: 'Add the cheese' },
  { id: 4, title: 'Bake the pizza' },
];

const mixedSteps: Step[] = [
  { id: 3, title: 'Add the cheese' },
  { id: 1, title: 'Prepare the dough' },
  { id: 4, title: 'Bake the pizza' },
  { id: 2, title: 'Add the sauce' },
];

export default function GameGL2() {
  const [steps, setSteps] = useState<Step[]>(mixedSteps);
  const [message, setMessage] = useState('Put the steps in the correct order.');
  const [isWinner, setIsWinner] = useState(false);
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function moveStep(index: number, direction: -1 | 1) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= steps.length) return;

    const newSteps = [...steps];

    const currentStep = newSteps[index];
    const otherStep = newSteps[newIndex];

    if (currentStep && otherStep) {
      newSteps[index] = otherStep;
      newSteps[newIndex] = currentStep;
    }

    setSteps(newSteps);
    setMessage('Now check your answer.');
    setGuideMood('idle');
    setIsWinner(false);
  }

  function cookPizza() {
    let answerIsCorrect = true;

    for (let index = 0; index < steps.length; index++) {
      if (steps[index]?.id !== correctSteps[index]?.id) {
        answerIsCorrect = false;
      }
    }

    if (answerIsCorrect) {
      setMessage('Correct. The pizza is ready.');
      setIsWinner(true);
      setGuideMood('happy');
    } else {
      setMessage('The order is not correct. Try again.');
      setIsWinner(false);
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setSteps(mixedSteps);
    setMessage('Put the steps in the correct order.');
    setIsWinner(false);
    setGuideMood('idle');
  }

  return (
    <div className="w-full min-w-0 max-w-none overflow-x-hidden">
      <GameGuide mood={guideMood} message={message} />
      <section className="mt-6">
        <ol className="grid list-none gap-2.5 p-0">
          {steps.map((step, index) => (
            <li
              className="flex items-center gap-2.5 border border-black bg-white p-2.5"
              key={step.id}
            >
              <span className="grid size-7 shrink-0 place-items-center border border-black">
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-bold sm:text-base">
                {step.title}
              </span>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 sm:flex-none"
                  disabled={index === 0}
                  onClick={() => moveStep(index, -1)}
                >
                  Up
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 sm:flex-none"
                  disabled={index === steps.length - 1}
                  onClick={() => moveStep(index, 1)}
                >
                  Down
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p
        className={`my-4 grid min-h-12 place-items-center border border-black p-2.5 text-center font-bold ${
          isWinner ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        {message}
      </p>

      <div className="flex gap-2.5">
        <Button variant="secondary" onClick={cookPizza}>
          Check answer
        </Button>
        <Button variant="secondary" onClick={resetGame}>
          Reset
        </Button>
      </div>
    </div>
  );
}
