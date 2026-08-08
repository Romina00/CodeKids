'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';

type FunctionGame = {
  id: number;
  mission: string;
  options: string[];
  answer: string;
};

const functionGames: FunctionGame[] = [
  {
    id: 1,
    mission: 'The robot must jump over a rock.',
    options: ['Jump()', 'Attack()', 'OpenDoor()'],
    answer: 'Jump()',
  },
  {
    id: 2,
    mission: 'The robot must fight an enemy.',
    options: ['Jump()', 'Attack()', 'OpenDoor()'],
    answer: 'Attack()',
  },
  {
    id: 3,
    mission: 'The robot finds a locked door.',
    options: ['Jump()', 'Attack()', 'OpenDoor()'],
    answer: 'OpenDoor()',
  },
];

export default function GameGL13() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState(
    'Choose the function for the mission.',
  );
  const [isWinner, setIsWinner] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const game = functionGames[gameIndex];

  function checkAnswer(answer: string) {
    if (!game) return;

    setSelectedAnswer(answer);

    if (answer === game.answer) {
      const isLastGame = gameIndex === functionGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You understand functions.');
        setIsWinner(true);
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! Choose the next function.');
      }

      setSelectedAnswer('');
    } else {
      setMessage('Not quite. Choose the function that matches the action.');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('Choose the function for the mission.');
    setIsWinner(false);
    setSelectedAnswer('');
  }

  return (
    <div>
      <section>
        <p className="mb-2 font-bold">
          Question {gameIndex + 1} of {functionGames.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          A function is a reusable command that performs an action.
        </p>

        <div className="mb-4 border border-black p-4">
          <p className="mb-2 text-sm">Mission</p>
          <p className="font-bold">{game?.mission}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {game?.options.map((option) => (
            <Button
              key={option}
              variant={selectedAnswer === option ? 'secondary' : 'outline'}
              onClick={() => checkAnswer(option)}
            >
              {option}
            </Button>
          ))}
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
