'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Scenario = {
  id: number;
  hasKey: boolean;
  hasCard: boolean;
  answer: boolean;
};

const scenarios: Scenario[] = [
  { id: 1, hasKey: true, hasCard: true, answer: true },
  { id: 2, hasKey: true, hasCard: false, answer: false },
  { id: 3, hasKey: false, hasCard: true, answer: false },
  { id: 4, hasKey: false, hasCard: false, answer: false },
];

export default function GameGL6() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [message, setMessage] = useState('Can the robot open the gate?');
  const [isWinner, setIsWinner] = useState(false);
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const scenario = scenarios[scenarioIndex];

  function checkAnswer(answer: boolean) {
    if (!scenario) return;

    if (answer === scenario.answer) {
      const isLastScenario = scenarioIndex === scenarios.length - 1;

      if (isLastScenario) {
        setMessage('Correct! You finished the gate game.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setScenarioIndex((prev) => prev + 1);
        setMessage('Correct! Try the next one.');
        setGuideMood('happy');
      }
    } else {
      setMessage('Not quite. The gate needs both the key and the card.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setScenarioIndex(0);
    setMessage('Can the robot open the gate?');
    setIsWinner(false);
    setGuideMood('idle');
  }

  return (
    <div className="w-full min-w-0 max-w-none overflow-x-hidden">
      <GameGuide mood={guideMood} message={message} />
      <section className="mt-6 border border-black p-4">
        <p className="mb-4 text-sm font-bold">
          Question {scenarioIndex + 1} of {scenarios.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          The gate opens only when the robot has both the key and the card.
        </p>

        <div className="mb-3 grid gap-2 border border-black p-4">
          <div className="flex items-center justify-between border border-black p-2">
            <span>Key</span>
            <span className="font-bold">{scenario?.hasKey ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center justify-between border border-black p-2">
            <span>Card</span>
            <span className="font-bold">
              {scenario?.hasCard ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            disabled={isWinner}
            onClick={() => checkAnswer(true)}
          >
            Yes, open the gate
          </Button>
          <Button
            variant="outline"
            disabled={isWinner}
            onClick={() => checkAnswer(false)}
          >
            No, keep it closed
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
  );
}
