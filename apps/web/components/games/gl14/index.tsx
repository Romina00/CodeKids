'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type ParameterGame = {
  id: number;
  enemyHealth: number;
  options: string[];
  answer: string;
};

const parameterGames: ParameterGame[] = [
  {
    id: 1,
    enemyHealth: 5,
    options: ['Attack(2)', 'Attack(5)', 'Attack(1)'],
    answer: 'Attack(5)',
  },
  {
    id: 2,
    enemyHealth: 10,
    options: ['Attack(3)', 'Attack(10)', 'Attack(5)'],
    answer: 'Attack(10)',
  },
  {
    id: 3,
    enemyHealth: 20,
    options: ['Attack(5)', 'Attack(10)', 'Attack(20)'],
    answer: 'Attack(20)',
  },
];

export default function GameGL14() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState('Choose enough attack power.');
  const [isWinner, setIsWinner] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const game = parameterGames[gameIndex];

  function checkAnswer(answer: string) {
    if (!game) return;

    setSelectedAnswer(answer);

    if (answer === game.answer) {
      const isLastGame = gameIndex === parameterGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You understand parameters.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! A new enemy appears.');
        setGuideMood('happy');
      }

      setSelectedAnswer('');
    } else {
      setMessage('Not enough power. Check the parameter.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('Choose enough attack power.');
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
            Question {gameIndex + 1} of {parameterGames.length}
          </p>

          <p className="mb-4 text-sm text-black/70">
            A parameter changes how a function works.
          </p>

          <div className="mb-4 border border-black p-4">
            <p className="mb-2 text-sm">Enemy health</p>
            <p className="font-bold">{game?.enemyHealth}</p>
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
    </div>
  );
}
