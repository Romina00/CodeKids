'use client';

import { Button } from '@repo/ui/button';
import { ArrowRight, BrainCircuit, CircleAlert, Icon } from '@repo/ui/icon';
import { useEffect, useState } from 'react';

export type GuideMood = 'idle' | 'happy' | 'sad';

type GameGuideProps = {
  mood: GuideMood;
  message: string;
  hint: string;
  tutorial?: string[];
};

function HappyStickman({ isCelebrating }: { isCelebrating: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 250"
      className={`h-48 w-36 sm:h-56 sm:w-44 ${
        isCelebrating
          ? 'motion-safe:animate-bounce motion-reduce:animate-none'
          : ''
      }`}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="100" cy="60" r="35" />
        <circle cx="85" cy="58" r="3" fill="currentColor" />
        <circle cx="115" cy="58" r="3" fill="currentColor" />
        <path d="M82 72 Q100 92 118 72" />
        <line x1="100" y1="95" x2="100" y2="170" />
        <line x1="100" y1="110" x2="50" y2="65" />
        <line x1="100" y1="110" x2="150" y2="65" />
        <line x1="100" y1="170" x2="60" y2="225" />
        <line x1="100" y1="170" x2="140" y2="225" />
      </g>
    </svg>
  );
}

function SadStickman() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 250"
      className="h-48 w-36 sm:h-56 sm:w-44"
    >
      <circle
        cx="100"
        cy="60"
        r="35"
        fill="var(--color-warning)"
        stroke="currentColor"
        strokeWidth="4"
      />
      <line
        x1="76"
        y1="50"
        x2="88"
        y2="54"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="112"
        y1="54"
        x2="124"
        y2="50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="85" cy="62" r="2.8" fill="currentColor" />
      <circle cx="115" cy="62" r="2.8" fill="currentColor" />
      <path
        d="M88 83 Q100 79 112 83"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="95"
        x2="100"
        y2="170"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="112"
        x2="62"
        y2="95"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="112"
        x2="118"
        y2="86"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="170"
        x2="70"
        y2="225"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="170"
        x2="130"
        y2="225"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GameGuide({ mood, message, hint, tutorial }: GameGuideProps) {
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  // Stickman Milo introduces itself
  const tutorialSteps = tutorial
    ? [
        "Hi, I'm Milo! I'm your coding buddy. I explain each challenge, give clues, and cheer you on.",
        ...tutorial,
      ]
    : [];
  const isTutorialVisible =
    mood === 'idle' && tutorialStep < tutorialSteps.length;
  const visibleMessage = isTutorialVisible
    ? tutorialSteps[tutorialStep]
    : message;

  function restartTutorial() {
    setTutorialStep(0);
    setIsHintVisible(false);
  }

  useEffect(() => {
    setIsHintVisible(false);
  }, [hint, message, mood]);

  const moodStyles = {
    idle: 'border-blue-600 bg-blue-50 text-blue-600',
    happy: 'border-green-700 bg-green-50 text-green-700',
    sad: 'border-orange-600 bg-blue-50 text-orange-600',
  }[mood];

  return (
    <aside
      className={`grid h-full min-h-[32rem] w-full max-w-none min-w-0 content-end gap-4 overflow-hidden rounded-xl border-2 p-4 ${moodStyles} max-[700px]:min-h-0 max-[480px]:p-3`}
      aria-live="polite"
      aria-label="Milo, your game guide"
    >
      <div className="relative grid min-h-72 w-full min-w-0 grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-5 rounded-xl border border-slate-900 bg-white p-3 text-slate-900 after:absolute after:bottom-[-0.45rem] after:left-1/2 after:size-3 after:-translate-x-1/2 after:rotate-45 after:border-b after:border-r after:border-slate-900 after:bg-white sm:p-4">
        {isTutorialVisible && (
          <div className="flex justify-start">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-600">
              Tip {tutorialStep + 1} of {tutorialSteps.length}
            </span>
          </div>
        )}
        <p className="text-xl font-bold leading-relaxed sm:text-2xl">
          {visibleMessage}
        </p>
        {isTutorialVisible && (
          <>
            <span aria-hidden="true" className="h-px w-full bg-slate-200" />
            <div className="flex justify-end">
              <Button
                className="min-h-14 gap-3 px-6 text-lg"
                onClick={() => setTutorialStep((step) => step + 1)}
                variant="primary"
              >
                {tutorialStep === tutorialSteps.length - 1
                  ? 'Start game'
                  : 'Next'}
                <Icon icon={ArrowRight} size="sm" />
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="grid place-items-center gap-1">
        {mood === 'sad' ? (
          <SadStickman />
        ) : (
          <HappyStickman isCelebrating={mood === 'happy'} />
        )}
        <span className="rounded-full bg-white/70 px-3 py-1 text-center text-sm font-extrabold">
          Milo
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tutorialSteps.length > 0 && !isTutorialVisible && (
          <Button
            className="min-h-11 gap-2"
            onClick={restartTutorial}
            variant="secondary"
          >
            <Icon icon={BrainCircuit} size="sm" />
            Ask Milo
          </Button>
        )}
        <Button
          aria-expanded={isHintVisible}
          className="min-h-12 gap-2 text-base"
          onClick={() => setIsHintVisible((visible) => !visible)}
          variant="outline"
        >
          <Icon icon={CircleAlert} size="sm" />
          {isHintVisible ? 'Hide hint' : 'Show hint'}
        </Button>
      </div>
      {isHintVisible && (
        <p className="rounded-lg bg-white px-5 py-4 text-lg font-bold leading-relaxed text-slate-900">
          Hint: {hint}
        </p>
      )}
    </aside>
  );
}
