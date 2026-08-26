'use client';

import { useEffect, useState } from 'react';

export type GuideMood = 'idle' | 'happy' | 'sad';

type GameGuideProps = {
  mood: GuideMood;
  message: string;
  hint: string;
};

function HappyStickman() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 250"
      className="h-[6.25rem] w-20 motion-safe:animate-bounce motion-reduce:animate-none sm:w-20"
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
      className="h-[6.25rem] w-20 motion-safe:animate-pulse motion-reduce:animate-none sm:w-20"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="100" cy="60" r="35" />
        <line x1="75" y1="48" x2="92" y2="55" />
        <line x1="108" y1="55" x2="125" y2="48" />
        <circle cx="85" cy="62" r="2" fill="currentColor" />
        <circle cx="115" cy="62" r="2" fill="currentColor" />
        <path d="M82 82 Q100 70 118 82" />
        <line x1="100" y1="95" x2="100" y2="170" />
        <line x1="100" y1="110" x2="50" y2="80" />
        <line x1="100" y1="110" x2="150" y2="80" />
        <line x1="100" y1="170" x2="60" y2="225" />
        <line x1="100" y1="170" x2="140" y2="225" />
      </g>
    </svg>
  );
}

export function GameGuide({ mood, message, hint }: GameGuideProps) {
  const [isHintVisible, setIsHintVisible] = useState(false);

  useEffect(() => {
    setIsHintVisible(false);
  }, [hint, message, mood]);

  const moodStyles = {
    idle: 'border-blue-600 bg-blue-50 text-blue-600',
    happy: 'border-green-700 bg-green-50 text-green-700',
    sad: 'border-red-600 bg-red-50 text-red-600',
  }[mood];

  return (
    <aside
      className={`grid h-full min-h-56 w-full max-w-none min-w-0 grid-cols-[minmax(0,1fr)_minmax(4.5rem,5rem)] items-center gap-3 overflow-hidden rounded-xl border-2 px-3 pb-2 pt-3 ${moodStyles} max-[700px]:min-h-0 max-[480px]:grid-cols-[minmax(0,1fr)_4.5rem] max-[480px]:px-2.5`}
      aria-live="polite"
      aria-label="Game guide"
    >
      <div className="relative rounded-[0.6rem] border border-slate-900 bg-white px-3.5 py-3 text-[0.95rem] font-bold leading-snug text-slate-900 after:absolute after:right-[-0.45rem] after:top-1/2 after:size-3 after:-translate-y-1/2 after:rotate-45 after:border-r after:border-t after:border-slate-900 after:bg-white">
        {message}
      </div>
      <div className="grid min-h-28 max-h-[calc(100svh-2rem)] min-w-0 place-items-center">
        {mood === 'sad' ? <SadStickman /> : <HappyStickman />}
      </div>
      <span className="col-start-2 -mt-2 text-center text-xs font-extrabold">
        Codey
      </span>
      {mood === 'sad' && (
        <div className="col-span-full grid gap-2 border-t border-current/20 pt-2">
          {!isHintVisible ? (
            <button
              className="justify-self-start rounded-md border border-current px-3 py-1.5 text-sm font-bold transition hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2"
              type="button"
              onClick={() => setIsHintVisible(true)}
            >
              Show hint
            </button>
          ) : (
            <p className="rounded-md bg-white/70 px-3 py-2 text-sm font-bold text-slate-900">
              Hint: {hint}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
