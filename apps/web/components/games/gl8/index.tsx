'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type DataTypeGame = {
  id: number;
  item: string;
  kind: 'name' | 'number' | 'boolean';
  answer: string;
};

const dataGames: DataTypeGame[] = [
  { id: 1, item: 'Mina', kind: 'name', answer: 'Text' },
  { id: 2, item: '12', kind: 'number', answer: 'Number' },
  { id: 3, item: 'true', kind: 'boolean', answer: 'Boolean' },
];

export default function GameGL8() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState('What kind of data is this?');
  const [isWinner, setIsWinner] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const game = dataGames[gameIndex];

  function checkAnswer(answer: string) {
    if (!game) return;

    if (answer === game.answer) {
      const isLastGame = gameIndex === dataGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You know the data types.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! Try the next one.');
        setGuideMood('happy');
      }
      setSelectedAnswer('');
    } else {
      setMessage('Not quite. Think about the value type.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('What kind of data is this?');
    setIsWinner(false);
    setSelectedAnswer('');
    setGuideMood('idle');
  }

  return (
    <div>
      <GameGuide mood={guideMood} message={message} />
      <section className="mt-6 border border-black p-4">
        <p className="mb-4 text-sm font-bold">
          Question {gameIndex + 1} of {dataGames.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          Choose the correct data type for the value.
        </p>

        <div className="mb-3 border border-black p-4">
          <p className="mb-2 text-sm">Value</p>
          <p className="font-bold">{game?.item}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {['Text', 'Number', 'Boolean'].map((option) => (
            <Button
              key={option}
              variant={selectedAnswer === option ? 'secondary' : 'outline'}
              onClick={() => {
                setSelectedAnswer(option);
                checkAnswer(option);
              }}
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
