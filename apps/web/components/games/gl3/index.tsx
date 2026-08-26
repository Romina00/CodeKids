'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

const pathLength = 6;
const treasurePosition = pathLength - 1;

export default function GameGL3() {
  const [phase, setPhase] = useState<1 | 2>(1);
  const [moveCount, setMoveCount] = useState(0);
  const [repeatCount, setRepeatCount] = useState(1);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [message, setMessage] = useState(
    'Add Move forward commands to reach the treasure.',
  );
  const [isWinner, setIsWinner] = useState(false);
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  function addMove() {
    if (moveCount === treasurePosition) return;

    setMoveCount(moveCount + 1);
    setPlayerPosition(0);
    setMessage('Now run your commands.');
    setGuideMood('idle');
  }

  function runCommands() {
    setPlayerPosition(moveCount);

    if (moveCount === treasurePosition) {
      setPhase(2);
      setPlayerPosition(0);
      setMessage(
        'It works, but you repeated one command 5 times. Make it shorter.',
      );
      setGuideMood('happy');
    } else {
      setMessage('Not far enough. Add another Move forward command.');
      setGuideMood('sad');
    }
  }

  function changeRepeatCount(amount: -1 | 1) {
    const newCount = repeatCount + amount;

    if (newCount < 1 || newCount > treasurePosition) return;

    setRepeatCount(newCount);
    setPlayerPosition(0);
    setMessage('Now run the loop.');
    setIsWinner(false);
    setGuideMood('idle');
  }

  function runLoop() {
    setPlayerPosition(repeatCount);

    if (repeatCount === treasurePosition) {
      setMessage('Correct. You found the treasure.');
      setIsWinner(true);
      setGuideMood('happy');
    } else {
      setMessage('Not far enough. Increase the repeat number.');
      setIsWinner(false);
      setGuideMood('sad');
    }
  }

  function resetGame() {
    setRepeatCount(1);
    setPhase(1);
    setMoveCount(0);
    setPlayerPosition(0);
    setMessage('Add Move forward commands to reach the treasure.');
    setIsWinner(false);
    setGuideMood('idle');
  }

  return (
    <div className="grid w-full min-w-0 max-w-none grid-cols-1 gap-5 overflow-x-hidden min-[701px]:grid-cols-2">
      <GameGuide
        mood={guideMood}
        message={message}
        hint={
          phase === 1
            ? 'Add 5 Move forward commands.'
            : 'Repeat Move forward 5 times.'
        }
      />
      <div className="min-w-0">
        <section className="mt-6">
          <div className="grid grid-cols-6 gap-2" aria-label="Treasure path">
            {Array.from({ length: pathLength }).map((_, index) => (
              <div
                className={`grid min-h-16 place-items-center border border-black p-2 text-center text-xs font-bold sm:min-h-20 sm:text-sm ${
                  playerPosition === index
                    ? 'bg-black text-white'
                    : 'bg-white text-black'
                }`}
                key={index}
              >
                {playerPosition === index
                  ? 'PLAYER'
                  : index === treasurePosition
                    ? 'TREASURE'
                    : index === 0
                      ? 'START'
                      : index}
              </div>
            ))}
          </div>

          {phase === 1 ? (
            <>
              <div className="mt-4 border border-black p-4">
                <p className="mb-3 font-bold">Commands</p>
                <div className="grid gap-2">
                  {moveCount === 0 ? (
                    <p>No commands yet.</p>
                  ) : (
                    Array.from({ length: moveCount }).map((_, index) => (
                      <div className="border border-black p-3" key={index}>
                        Move forward
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  disabled={moveCount === treasurePosition}
                  onClick={addMove}
                >
                  Add Move
                </Button>
                <Button variant="secondary" onClick={runCommands}>
                  Run commands
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 border border-black p-4">
                <p className="mb-3 font-bold">Repeat {repeatCount} times</p>
                <div className="border border-black p-3">Move forward</div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  disabled={repeatCount === 1}
                  onClick={() => changeRepeatCount(-1)}
                >
                  Less
                </Button>
                <Button
                  variant="outline"
                  disabled={repeatCount === treasurePosition}
                  onClick={() => changeRepeatCount(1)}
                >
                  More
                </Button>
                <Button variant="secondary" onClick={runLoop}>
                  Run loop
                </Button>
              </div>
            </>
          )}
        </section>

        <p
          className={`my-4 grid min-h-12 place-items-center border border-black p-2.5 text-center font-bold ${
            isWinner ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          {message}
        </p>

        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={resetGame}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
