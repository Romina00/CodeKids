'use client';

import { Button } from '@repo/ui/button';
import { useState } from 'react';
import { GameGuide, type GuideMood } from '../game-guide';

type Question = {
  fact: string;
  statement: string;
  answer: boolean;
};

const questions: Question[] = [
  {
    fact: 'The key is on the table.',
    statement: 'The robot has the key.',
    answer: false,
  },
  {
    fact: 'The key is in the robot backpack.',
    statement: 'The robot has the key.',
    answer: true,
  },
  {
    fact: 'The door is closed.',
    statement: 'The door is open.',
    answer: false,
  },
];

export default function GameGL4() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [message, setMessage] = useState('Choose True or False.');
  const [isWinner, setIsWinner] = useState(false);
  const [guideMood, setGuideMood] = useState<GuideMood>('idle');

  const question = questions[questionIndex];

  function checkAnswer(answer: boolean) {
    if (!question || answer !== question.answer) {
      setMessage('That is not correct. Try again.');
      setGuideMood('sad');
      return;
    }

    const isLastQuestion = questionIndex === questions.length - 1;

    if (isLastQuestion) {
      setMessage('Correct. You understand Boolean values.');
      setIsWinner(true);
      setGuideMood('happy');
    } else {
      setQuestionIndex(questionIndex + 1);
      setMessage('Correct. Try the next one.');
      setGuideMood('happy');
    }
  }

  function resetGame() {
    setQuestionIndex(0);
    setMessage('Choose True or False.');
    setIsWinner(false);
    setGuideMood('idle');
  }

  return (
    <div className="grid w-full min-w-0 max-w-none grid-cols-1 gap-5 overflow-x-hidden min-[701px]:grid-cols-2">
      <GameGuide
        mood={guideMood}
        message={message}
        hint={question?.answer ? 'True' : 'False'}
      />
      <div className="min-w-0">
        <section className="mt-6 border border-black p-4">
          <p className="mb-4 text-sm font-bold">
            Question {questionIndex + 1} of {questions.length}
          </p>

          {question && (
            <>
              <div className="border border-black p-4">
                <p className="mb-2 text-sm">Fact</p>
                <p className="font-bold">{question.fact}</p>
              </div>

              <div className="mt-3 border border-black p-4">
                <p className="mb-2 text-sm">Statement</p>
                <p className="font-bold">{question.statement}</p>
              </div>
            </>
          )}

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              disabled={isWinner}
              onClick={() => checkAnswer(true)}
            >
              True
            </Button>
            <Button
              variant="outline"
              disabled={isWinner}
              onClick={() => checkAnswer(false)}
            >
              False
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

        <Button variant="secondary" onClick={resetGame}>
          Reset
        </Button>
      </div>
    </div>
  );
}
