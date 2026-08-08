'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';

type FinalGame = {
  id: number;
  scene: string;
  challenge: string;
  options: string[];
  answer: string;
};

const finalGames: FinalGame[] = [
  {
    id: 1,
    scene: 'You see 5 coins in a row.',
    challenge: 'What is the best way to collect them?',
    options: [
      'Repeat CollectCoin() 5 times',
      'Write 50 commands',
      'Do nothing',
    ],
    answer: 'Repeat CollectCoin() 5 times',
  },
  {
    id: 2,
    scene: 'You reach a locked gate.',
    challenge: 'You should only open it if you have the key.',
    options: ['If HasKey → OpenDoor()', 'Always OpenDoor()', 'Attack(100)'],
    answer: 'If HasKey → OpenDoor()',
  },
  {
    id: 3,
    scene: 'A monster has 10 health.',
    challenge: 'Which reusable command should you use?',
    options: ['Attack(10)', 'Jump()', 'Coins = true'],
    answer: 'Attack(10)',
  },
  {
    id: 4,
    scene: 'You collect 3 more coins. You already had 7.',
    challenge: 'What should the Coins variable become?',
    options: ['Coins = 10', 'Coins = false', 'Coins = "door"'],
    answer: 'Coins = 10',
  },
  {
    id: 5,
    scene: 'You finished the adventure!',
    challenge: 'Which idea helped you build the game?',
    options: [
      'Functions, loops and conditions',
      'Random clicking',
      'No instructions',
    ],
    answer: 'Functions, loops and conditions',
  },
];

export default function GameGL15() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState('Complete your final adventure.');
  const [isWinner, setIsWinner] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const game = finalGames[gameIndex];

  function checkAnswer(answer: string) {
    if (!game) return;

    setSelectedAnswer(answer);

    if (answer === game.answer) {
      const isLastGame = gameIndex === finalGames.length - 1;

      if (isLastGame) {
        setMessage('Amazing! You completed your programming adventure!');
        setIsWinner(true);
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Great! Continue your adventure.');
      }

      setSelectedAnswer('');
    } else {
      setMessage('Not quite. Think like a programmer and try again.');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('Complete your final adventure.');
    setIsWinner(false);
    setSelectedAnswer('');
  }

  return (
    <div>
      <section>
        <p className="mb-2 font-bold">
          Challenge {gameIndex + 1} of {finalGames.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          Use everything you learned to finish the adventure.
        </p>

        <div className="mb-3 border border-black p-4">
          <p className="mb-2 text-sm">Scene</p>
          <p className="font-bold">{game?.scene}</p>
        </div>

        <div className="mb-4 border border-black p-4">
          <p className="mb-2 text-sm">Challenge</p>
          <p className="font-bold">{game?.challenge}</p>
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
