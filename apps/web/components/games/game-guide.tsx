'use client';

export type GuideMood = 'idle' | 'happy' | 'sad';

type GameGuideProps = {
  mood: GuideMood;
  message: string;
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

export function GameGuide({ mood, message }: GameGuideProps) {
  const moodStyles = {
    idle: 'border-blue-600 bg-blue-50 text-blue-600',
    happy: 'border-green-700 bg-green-50 text-green-700',
    sad: 'border-red-600 bg-red-50 text-red-600',
  }[mood];

  return (
    <aside
      className={`float-right mb-4 ml-4 grid w-[19rem] max-w-[42%] grid-cols-[1fr_5rem] items-center gap-3 rounded-xl border-2 px-3 pb-2 pt-3 ${moodStyles} max-[700px]:float-none max-[700px]:ml-0 max-[700px]:w-full max-[700px]:max-w-none max-[480px]:grid-cols-[1fr_4.5rem] max-[480px]:px-2.5`}
      aria-live="polite"
      aria-label="Game guide"
    >
      <div className="relative rounded-[0.6rem] border border-slate-900 bg-white px-3.5 py-3 text-[0.95rem] font-bold leading-snug text-slate-900 after:absolute after:right-[-0.45rem] after:top-1/2 after:size-3 after:-translate-y-1/2 after:rotate-45 after:border-r after:border-t after:border-slate-900 after:bg-white">
        {message}
      </div>
      <div className="grid min-h-28 place-items-center">
        {mood === 'sad' ? <SadStickman /> : <HappyStickman />}
      </div>
      <span className="col-start-2 -mt-2 text-center text-xs font-extrabold">
        Codey
      </span>
    </aside>
  );
}
