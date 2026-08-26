'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type PseudocodeGame = {
  id: number;
  goal: string;
  options: string[];
  answer: string;
};

const pseudocodeGames: PseudocodeGame[] = [
  {
    id: 1,
    goal: 'Move forward, then jump.',
    options: ['MOVE → JUMP', 'JUMP → MOVE', 'STOP → JUMP'],
    answer: 'MOVE → JUMP',
  },
  {
    id: 2,
    goal: 'Pick up the key, then open the door.',
    options: ['OPEN DOOR → GET KEY', 'GET KEY → OPEN DOOR', 'RUN → GET KEY'],
    answer: 'GET KEY → OPEN DOOR',
  },
  {
    id: 3,
    goal: 'Find enemy, then attack.',
    options: ['FIND ENEMY → ATTACK', 'ATTACK → FIND ENEMY', 'SLEEP → ATTACK'],
    answer: 'FIND ENEMY → ATTACK',
  },
];

export default function GameGL11() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState('Choose the correct pseudocode.');
  const [isWinner, setIsWinner] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const game = pseudocodeGames[gameIndex];

  function checkAnswer(answer: string) {
    if (!game) return;

    setSelectedAnswer(answer);

    if (answer === game.answer) {
      const isLastGame = gameIndex === pseudocodeGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You can read pseudocode.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! Try the next one.');
        setGuideMood('happy');
      }

      setSelectedAnswer('');
    } else {
      setMessage('Not quite. Check the order of the steps.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('Choose the correct pseudocode.');
    setIsWinner(false);
    setSelectedAnswer('');
    setGuideMood('idle');
  }

  return (
    <div className="w-full min-w-0 max-w-none overflow-x-hidden">
      <GameGuide mood={guideMood} message={message} />
      <section>
        <p className="mb-2 font-bold">
          Question {gameIndex + 1} of {pseudocodeGames.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          Pseudocode describes a program using simple words.
        </p>

        <div className="mb-4 border border-black p-4">
          <p className="mb-2 text-sm">Goal</p>
          <p className="font-bold">{game?.goal}</p>
        </div>

        <div className="flex flex-col gap-2">
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
