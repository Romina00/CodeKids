'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';

type CoinGame = {
  id: number;
  coins: number;
  action: string;
  answer: number;
};

const coinGames: CoinGame[] = [
  { id: 1, coins: 5, action: 'You found 3 more coins.', answer: 8 },
  { id: 2, coins: 10, action: 'You found 2 more coins.', answer: 12 },
  { id: 3, coins: 7, action: 'You found 4 more coins.', answer: 11 },
];

export default function GameGL7() {
  const [gameIndex, setGameIndex] = useState(0);
  const [message, setMessage] = useState('How many coins do you have now?');
  const [isWinner, setIsWinner] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const game = coinGames[gameIndex];

  function checkAnswer(input: string) {
    if (!game) return;

    const answer = Number(input);

    if (Number.isNaN(answer)) {
      setMessage('Please type a number.');
      return;
    }

    if (answer === game.answer) {
      const isLastGame = gameIndex === coinGames.length - 1;

      if (isLastGame) {
        setMessage('Correct! You understand variables.');
        setIsWinner(true);
      } else {
        setGameIndex((prev) => prev + 1);
        setMessage('Correct! Try the next one.');
      }
      setInputValue('');
    } else {
      setMessage('Not quite. Try counting again.');
    }
  }

  function resetGame() {
    setGameIndex(0);
    setMessage('How many coins do you have now?');
    setIsWinner(false);
    setInputValue('');
  }

  return (
    <div>
      <section className="mt-6 border border-black p-4">
        <p className="mb-4 text-sm font-bold">
          Question {gameIndex + 1} of {coinGames.length}
        </p>

        <p className="mb-4 text-sm text-black/70">
          A variable stores a value. Count the coins carefully.
        </p>

        <div className="mb-3 border border-black p-4">
          <p className="mb-2 text-sm">Start</p>
          <p className="font-bold">{game?.coins} coins</p>
        </div>

        <div className="mb-3 border border-black p-4">
          <p className="mb-2 text-sm">Action</p>
          <p className="font-bold">{game?.action}</p>
        </div>

        <input
          className="w-full border border-black p-2"
          placeholder="Type the total"
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
