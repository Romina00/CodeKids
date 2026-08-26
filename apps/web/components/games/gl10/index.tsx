'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type FlowGame = {
  id: number;
  situation: string;
  question: string;
  options: string[];
  answer: string;
};

const flowGames: FlowGame[] = [
  {
    id: 1,
    situation: 'Start → See a door',
    question: 'What should happen next?',
    options: ['Check if door is open', 'Finish game', 'Collect coin'],
    answer: 'Check if door is open',
  },
  {
    id: 2,
    situation: 'Enemy found → Enemy is strong',
    question: 'What should happen next?',
    options: ['Run', 'Bake pizza', 'Sleep'],
    answer: 'Run',
  },
  {
    id: 3,
    situation: 'Coin found → Pick up coin',
    question: 'What should happen next?',
    options: ['Increase score', 'Delete score', 'Restart computer'],
    answer: 'Increase score',
  },
];

export default function GameGL10() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState('Choose the next step in the flow.');
  const [isWinner, setIsWinner] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const game = flowGames[gameIndex];

  function checkAnswer(answer: string) {
    if (!game) return;

    setSelectedAnswer(answer);

    if (answer === game.answer) {
      const isLastGame = gameIndex === flowGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You can follow a program flow.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! Follow the next flow.');
        setGuideMood('happy');
      }

      setSelectedAnswer('');
    } else {
      setMessage('Not quite. Think about what should happen next.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('Choose the next step in the flow.');
    setIsWinner(false);
    setSelectedAnswer('');
    setGuideMood('idle');
  }

  return (
    <div className="w-full min-w-0 max-w-none overflow-x-hidden">
      <GameGuide mood={guideMood} message={message} />
      <section>
        <p className="mb-2 font-bold">
          Question {gameIndex + 1} of {flowGames.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          A flowchart shows what the program does step by step.
        </p>

        <div className="mb-3 border border-black p-4">
          <p className="mb-2 text-sm">Current flow</p>
          <p className="font-bold">{game?.situation}</p>
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
  );
}
