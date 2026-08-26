'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type PaintGame = {
  id: number;
  rows: number;
  columns: number;
  answer: number;
};

const paintGames: PaintGame[] = [
  { id: 1, rows: 2, columns: 3, answer: 6 },
  { id: 2, rows: 3, columns: 4, answer: 12 },
  { id: 3, rows: 4, columns: 5, answer: 20 },
];

export default function GameGL9() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState(
    'How many squares will the robot paint?',
  );
  const [isWinner, setIsWinner] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const game = paintGames[gameIndex];

  function checkAnswer(input: string) {
    if (!game) return;

    const answer = Number(input);

    if (Number.isNaN(answer)) {
      setMessage('Please type a number.');
      setGuideMood('sad');
      return;
    }

    if (answer === game.answer) {
      const isLastGame = gameIndex === paintGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You understand nested loops.');
        setIsWinner(true);
        setGuideMood('happy');
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! Try the next one.');
        setGuideMood('happy');
      }

      setInputValue('');
    } else {
      setMessage('Not quite. Multiply rows by columns.');
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('How many squares will the robot paint?');
    setIsWinner(false);
    setInputValue('');
    setGuideMood('idle');
  }

  return (
    <div className="w-full min-w-0 max-w-none overflow-x-hidden">
      <GameGuide mood={guideMood} message={message} />
      <section>
        <p className="mb-2 font-bold">
          Question {gameIndex + 1} of {paintGames.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          The robot paints every square in every row.
        </p>

        <div className="mb-3 border border-black p-4">
          <p className="mb-2 text-sm">Rows</p>
          <p className="font-bold">{game?.rows}</p>
        </div>

        <div className="mb-3 border border-black p-4">
          <p className="mb-2 text-sm">Squares in each row</p>
          <p className="font-bold">{game?.columns}</p>
        </div>

        <input
          className="w-full border border-black p-2"
          placeholder="Type total squares"
          type="number"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              checkAnswer(inputValue);
            }
          }}
        />

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => checkAnswer(inputValue)}>
            Check answer
          </Button>

          <Button variant="outline" onClick={resetGame}>
            Reset
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
    </div>
  );
}
