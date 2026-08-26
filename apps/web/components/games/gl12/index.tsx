'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type DecompositionGame = {
  id: number;
  project: string;
  question: string;
  options: string[];
  answer: string;
};

const decompositionGames: DecompositionGame[] = [
  {
    id: 1,
    project: 'Build a castle',
    question: 'Which is a smaller task?',
    options: ['Build the door', 'Build everything', 'Finish the game'],
    answer: 'Build the door',
  },
  {
    id: 2,
    project: 'Make a racing game',
    question: 'Which is a smaller task?',
    options: ['Create the car', 'Make the whole game', 'Do everything'],
    answer: 'Create the car',
  },
  {
    id: 3,
    project: 'Create a robot adventure',
    question: 'Which is a smaller task?',
    options: [
      'Design one enemy',
      'Build all levels at once',
      'Make everything',
    ],
    answer: 'Design one enemy',
  },
];

export default function GameGL12() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState(
    'Break the big problem into a smaller task.',
  );
  const [isWinner, setIsWinner] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const game = decompositionGames[gameIndex];

  function checkAnswer(answer: string) {
    if (!game) return;

    setSelectedAnswer(answer);

    if (answer === game.answer) {
      const isLastGame = gameIndex === decompositionGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You know how to divide a problem.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! Try another project.');
        setGuideMood('happy');
      }

      setSelectedAnswer('');
    } else {
      setMessage('Try choosing one small part of the project.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('Break the big problem into a smaller task.');
    setIsWinner(false);
    setSelectedAnswer('');
    setGuideMood('idle');
  }

  return (
    <div className="grid h-full max-h-full w-full min-w-0 max-w-none grid-cols-1 gap-5 overflow-x-hidden min-[701px]:grid-cols-2">
      <GameGuide mood={guideMood} message={message} hint={game?.answer ?? ''} />
      <div className="min-w-0">
        <section>
          <p className="mb-2 font-bold">
            Question {gameIndex + 1} of {decompositionGames.length}
          </p>

          <p className="mb-4 text-sm text-black/70">
            Big problems are easier when we divide them into small tasks.
          </p>

          <div className="mb-4 border border-black p-4">
            <p className="mb-2 text-sm">Project</p>
            <p className="font-bold">{game?.project}</p>
          </div>

          <p className="mb-3 font-bold">{game?.question}</p>

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
    </div>
  );
}
