'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Scenario = {
  id: number;
  condition: string;
  action: string;
  answer: boolean;
};

const scenarios: Scenario[] = [
  {
    id: 1,
    condition: 'The robot sees a key.',
    action: 'The robot should pick up the key.',
    answer: true,
  },
  {
    id: 2,
    condition: 'The door is closed.',
    action: 'The robot should open the door.',
    answer: true,
  },
  {
    id: 3,
    condition: 'The path is empty.',
    action: 'The robot should keep walking.',
    answer: true,
  },
  {
    id: 4,
    condition: 'The robot is safe.',
    action: 'The robot should stop and rest.',
    answer: false,
  },
];

export default function GameGL5() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [message, setMessage] = useState('Choose what the robot should do.');
  const [isWinner, setIsWinner] = useState(false);
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const scenario = scenarios[scenarioIndex];

  function checkAnswer(answer: boolean) {
    if (!scenario) return;

    if (answer === scenario.answer) {
      const isLastScenario = scenarioIndex === scenarios.length - 1;

      if (isLastScenario) {
        setMessage('Correct! You finished the if-game.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setScenarioIndex((prev) => prev + 1);
        setMessage('Correct! Try the next one.');
        setGuideMood('happy');
      }
    } else {
      setMessage('Not quite. Think about the condition again.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setScenarioIndex(0);
    setMessage('Choose what the robot should do.');
    setIsWinner(false);
    setGuideMood('idle');
  }

  return (
    <div className="grid h-full max-h-full w-full min-w-0 max-w-none grid-cols-1 gap-5 overflow-x-hidden min-[701px]:grid-cols-2">
      <GameGuide
        mood={guideMood}
        message={message}
        hint={scenario?.answer ? 'Yes, do it' : 'No, skip it'}
      />
      <div className="min-w-0">
        <section className="mt-6 border border-black p-4">
          <p className="mb-4 text-sm font-bold">
            Question {scenarioIndex + 1} of {scenarios.length}
          </p>

          <p className="mb-4 text-sm text-black/70">
            If the condition is true, the robot should do the action.
          </p>

          <div className="mb-3 border border-black p-4">
            <p className="mb-2 text-sm">Condition</p>
            <p className="font-bold">{scenario?.condition}</p>
          </div>

          <div className="border border-black p-4">
            <p className="mb-2 text-sm">Action</p>
            <p className="font-bold">{scenario?.action}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              disabled={isWinner}
              onClick={() => checkAnswer(true)}
            >
              Yes, do it
            </Button>
            <Button
              variant="outline"
              disabled={isWinner}
              onClick={() => checkAnswer(false)}
            >
              No, skip it
            </Button>
          </div>
        </section>

        <p
          className={`my-4 grid min-h-12 place-items-center border border-black p-2.5 text-center font-bold ${
            isWinner ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          {message}
        </p>

        <Button variant="secondary" onClick={resetGame}>
          Reset
        </Button>
      </div>
    </div>
  );
}
