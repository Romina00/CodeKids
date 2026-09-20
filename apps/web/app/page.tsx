import { Badge } from '@repo/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  Clock3,
  CodeXml,
  Gamepad2,
  Icon,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
  X,
} from '@repo/ui/icon';
import Image from 'next/image';
import { Logo } from '../components/logo';
import {
  HappyStickman,
  ThinkingStickman,
} from '../components/games/game-guide';
const toneClasses = {
  green: 'bg-[#28bd72]',
  blue: 'bg-[#1598f3]',
  mint: 'bg-[#83ded4]',
  amber: 'bg-[#f0bd5b]',
} as const;
import { LearningOverview } from './learning-overview';

const paths = [
  {
    label: 'Total beginner',
    title: 'Never coded before?',
    description: 'Explore coding step by step through 15 playable levels.',
    icon: BrainCircuit,
    tone: 'green',
    items: [
      'Learn how computers think',
      'Master AND, OR & simple logic',
      'Build your first mini-programs',
    ],
    action: 'Start from zero',
    planned: false,
  },
  {
    label: 'Planned extension',
    title: 'Know some coding?',
    description:
      'This bachelor’s project currently focuses on beginners. A dedicated route for children with coding experience is planned.',
    icon: Rocket,
    tone: 'blue',
    items: [
      'Planned: a check of existing skills',
      'Planned: an entry point matching your skills',
      'Planned: more advanced coding challenges',
    ],
    action: 'Coming soon — not available yet',
    planned: true,
  },
] as const;

const learningPath = [
  {
    title: 'Sequences & first loops',
    description:
      'Guide Tom to Jerry, put pizza steps in order and repeat moves to reach treasure.',
    icon: BrainCircuit,
    status: 'Levels 1–3',
    tone: 'green',
  },
  {
    title: 'Conditions & variables',
    description:
      'Explore AND and OR, change a coin count, choose data types and control a robot with conditions.',
    icon: CodeXml,
    status: 'Levels 4–8',
    tone: 'blue',
  },
  {
    title: 'Loops, plans & functions',
    description:
      'Clean with loops, grow a grid garden, plan a delivery, arrange a mission, build castle parts and reuse a spell.',
    icon: BookOpen,
    status: 'Levels 9–14',
    tone: 'mint',
  },
  {
    title: 'Your own mini game',
    description:
      'Set your goal, combine moves, loops, conditions and a function, then test your treasure quest with and without a key.',
    icon: Gamepad2,
    status: 'Level 15',
    tone: 'amber',
  },
] as const;

const miloMoments = [
  {
    mood: 'idle',
    title: 'Ready when you are',
    description:
      'Milo introduces each challenge and helps you take the first step.',
  },
  {
    mood: 'thinking',
    title: 'Stuck? Think with Milo',
    description:
      'A tricky puzzle is a chance to learn. Milo offers clues so you can try again.',
  },
  {
    mood: 'happy',
    title: 'Your win. A shared celebration.',
    description:
      'Solved it? Milo cheers you on. Every small success is a step forward.',
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-svh text-[color:var(--color-text)] bg-[#f6faff]">
      <header className="sticky top-[0] z-[20] flex w-full min-h-[4.25rem] items-center justify-between pt-[0] pr-[max(1.25rem,_calc((100%_-_74rem)_/_2))] pb-[0] pl-[max(1.25rem,_calc((100%_-_74rem)_/_2))] bg-[rgb(255_255_255_/_92%)] border-b-[length:1px] border-solid border-b-[color:#dfe9f5] [backdrop-filter:blur(14px)]">
        <div className="inline-flex items-center [&_.logoMark]:w-[2rem] [&_.logoWordmark]:text-[length:1rem] [&_.logoWordmark]:tracking-[-0.04em] max-[640px]:[&_.logoWordmark]:hidden [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]">
          <Logo showTagline={false} />
        </div>
        <nav
          aria-label="Primary navigation"
          className="inline-flex items-center gap-[0.6rem]"
        >
          <a
            className="inline-flex items-center min-h-[2.25rem] gap-[0.35rem] pt-[0.4rem] pr-[0.85rem] pb-[0.4rem] pl-[0.85rem] text-[color:#fff] bg-[#0e86e7] rounded-[999px] text-[length:0.82rem] font-[number:700] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
            href="/login"
          >
            Log in
          </a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="w-[min(calc(100%_-_2.5rem),_74rem)] mx-[auto] grid grid-cols-[minmax(0,_1fr)_minmax(22rem,_1fr)] items-center gap-[clamp(2rem,_7vw,_6rem)] py-[clamp(4rem,_9vw,_7rem)_3rem] max-[928px]:grid-cols-[1fr] max-[640px]:pt-[3rem]">
          <div className="grid [justify-items:start] gap-[1.4rem] max-[928px]:[justify-items:center] max-[928px]:text-center [&_[class*='badge']]:gap-2 [&_[class*='badge']]:pt-3 [&_[class*='badge']]:pr-4 [&_[class*='badge']]:pb-3 [&_[class*='badge']]:pl-4 [&_[class*='badge']]:text-[color:var(--color-text)] [&_[class*='badge']]:bg-[var(--color-surface)] [&_[class*='badge']]:border-[length:2px] [&_[class*='badge']]:border-solid [&_[class*='badge']]:border-[color:var(--color-primary)] [&_[class*='badge']]:text-[length:var(--font-size-md)] [&_[class*='badge']]:font-bold [&_[class*='badge']]:leading-[var(--line-height-normal)] [&_[class*='badge']]:shadow-[var(--shadow-sm)] [&_h1]:text-[length:clamp(2.6rem,_5vw,_4.35rem)] [&_h1]:leading-[1.03] [&_h1]:tracking-[-0.055em] [&_h1_span]:text-[color:#1197fa] [&_>_p]:max-w-[38rem] [&_>_p]:text-[color:#5d6b80] [&_>_p]:text-[length:1.05rem] [&_>_p]:leading-[1.75]">
            <Badge variant="neutral">
              <Icon icon={UsersRound} size="lg" /> For ages 10–15 only
            </Badge>
            <h1>
              Coding feels hard.
              <br />
              <span>We make it a game.</span>
            </h1>
            <p>
              Textbooks are boring and tutorials move too fast. On CodeKids,
              children learn programming through short lessons, playful puzzles
              and clickable challenges, from pure logic to real programming.
            </p>
            <div className="inline-flex items-center flex-wrap gap-[0.8rem]">
              <a
                className="ck-page-primaryAction inline-flex items-center justify-center min-h-[3rem] gap-[0.5rem] pt-[0.75rem] pr-[1.2rem] pb-[0.75rem] pl-[1.2rem] rounded-[0.8rem] text-[length:0.9rem] font-[number:750] [transition:transform_160ms_ease,_box-shadow_160ms_ease,_background_160ms_ease] text-[color:#fff] bg-[#1298f5] shadow-[0_10px_24px_rgb(18_152_245_/_22%)] motion-reduce:[transition:none] [&:hover]:[transform:translateY(-2px)] [&:hover]:shadow-[0_12px_28px_rgb(18_152_245_/_28%)] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
                href="/register"
              >
                <Icon icon={Rocket} size="sm" /> Get started
              </a>
              <LearningOverview />
            </div>
            <small className="text-[color:var(--color-text-muted)] text-[length:var(--font-size-sm)] leading-[var(--line-height-normal)]">
              Parents sign up first, then create a profile for their child.
            </small>
          </div>

          <div
            className="relative [overflow-x:visible] [overflow-y:visible] bg-[#fff] border-[length:1px] border-solid border-[color:#d5e1ed] rounded-[1.5rem] shadow-[0_24px_50px_rgb(37_76_115_/_15%)] max-[928px]:w-[min(100%,_38rem)] max-[928px]:mx-[auto]"
            aria-label="Children learning to code together"
          >
            <Image
              className="block w-full h-auto rounded-[inherit]"
              src="/hero-kids-coding.png"
              alt="Four children learning programming with colorful coding blocks"
              width={1024}
              height={1024}
              priority
            />
            <div className="inline-flex items-center absolute bottom-[-1rem] left-[-1.3rem] z-[4] gap-[0.7rem] pt-[0.8rem] pr-[1rem] pb-[0.8rem] pl-[1rem] bg-[#fff] border-[length:1px] border-solid border-[color:#d6e2ed] rounded-[1rem] shadow-[0_12px_25px_rgb(36_74_112_/_16%)] animate-badge-float max-[640px]:left-[0.6rem] motion-reduce:animate-none [&_>_span]:grid [&_>_span]:w-[2.4rem] [&_>_span]:h-[2.4rem] [&_>_span]:text-[color:#fff] [&_>_span]:bg-[#2ac47d] [&_>_span]:rounded-[0.75rem] [&_>_span]:place-items-center [&_div]:grid [&_div]:gap-[0.1rem] [&_strong]:text-[length:0.72rem] [&_small]:text-[color:#6d798a] [&_small]:text-[length:0.62rem]">
              <span>
                <Icon icon={Sparkles} size="sm" />
              </span>
              <div>
                <strong>No experience needed</strong>
                <small>Start from level 1</small>
              </div>
            </div>
          </div>
        </section>

        <section
          className="w-[min(calc(100%_-_2.5rem),_74rem)] mx-[auto] grid gap-[3rem] py-[clamp(5rem,_10vw,_8rem)]"
          id="how-it-works"
        >
          <div className="grid [justify-items:center] gap-[0.75rem] text-center [&_h2]:text-[length:clamp(2rem,_4vw,_3rem)] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em] [&_p]:text-[color:#6b788a] [&_p]:leading-[1.6]">
            <h2>
              Learning to code shouldn&apos;t
              <br />
              feel like homework
            </h2>
            <p>
              We turned everything that makes coding frustrating into something
              children actually enjoy.
            </p>
          </div>
          <div className="grid gap-[1.25rem] grid-cols-[repeat(2,_minmax(0,_1fr))] max-[640px]:grid-cols-[1fr] [&_article]:min-h-[23rem] [&_article]:shadow-[none] max-[640px]:[&_article]:min-h-auto [&_article_>_div]:pt-[2rem] [&_article_>_div]:pr-[2rem] [&_article_>_div]:pb-[2rem] [&_article_>_div]:pl-[2rem] [&_article_>_div:first-child]:flex [&_article_>_div:first-child]:items-center">
            <Card className="bg-[#fff5f7]! border-[color:#ffcbd5]! [&_ul]:grid [&_ul]:gap-[1.1rem] [&_ul]:pl-[1.2rem] [&_ul]:text-[color:#59677a] [&_li::marker]:text-[color:#ff6d7d]">
              <CardHeader>
                <span className="ck-page-smallIcon grid w-[2rem] h-[2rem] text-[color:#ff6f82] bg-[#ffe3e8] rounded-[50%] place-items-center">
                  <Icon icon={X} size="sm" />
                </span>
                <CardTitle>The usual way</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>Programming books are dry and full of confusing words</li>
                  <li>Online tutorials move too fast for beginners</li>
                  <li>It is hard to stay motivated when nothing feels fun</li>
                  <li>Kids give up before they build something cool</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#f1fbf7]! border-[color:#bfe9d4]! [&_.ck-page-smallIcon]:text-[color:#1cae69] [&_.ck-page-smallIcon]:bg-[#d9f6e6]">
              <CardHeader>
                <span className="ck-page-smallIcon grid w-[2rem] h-[2rem] text-[color:#ff6f82] bg-[#ffe3e8] rounded-[50%] place-items-center">
                  <Icon icon={Check} size="sm" />
                </span>
                <CardTitle>The CodeKids way</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-[1.25rem] [&_>_div]:flex [&_>_div]:gap-[0.8rem] [&_>_div]:text-[color:#23ae6d] [&_p]:grid [&_p]:gap-[0.2rem] [&_p]:text-[color:#253349] [&_span]:text-[color:#657388] [&_span]:text-[length:0.85rem] [&_span]:leading-[1.45]">
                <div>
                  <Icon icon={PlayCircle} size="sm" />
                  <p>
                    <strong>Guidance from Milo</strong>
                    <span>
                      Milo introduces each challenge, offers hints and
                      celebrates your success.
                    </span>
                  </p>
                </div>
                <div>
                  <Icon icon={Gamepad2} size="sm" />
                  <p>
                    <strong>Build, run and try again</strong>
                    <span>
                      Click to choose commands, arrange steps and test your
                      solution in playful coding challenges.
                    </span>
                  </p>
                </div>
                <div>
                  <Icon icon={Trophy} size="sm" />
                  <p>
                    <strong>See your progress</strong>
                    <span>
                      Complete levels to earn XP, unlock the next challenge and
                      collect milestone badges on your profile.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          className="w-[min(calc(100%_-_2.5rem),_74rem)] mx-[auto] grid gap-[3rem] py-[clamp(5rem,_10vw,_8rem)] [&_>_.ck-page-primaryAction]:mt-[0] [&_>_.ck-page-primaryAction]:mr-[auto] [&_>_.ck-page-primaryAction]:mb-[0] [&_>_.ck-page-primaryAction]:ml-[auto]"
          aria-labelledby="milo-title"
        >
          <div className="grid [justify-items:center] gap-[0.75rem] text-center [&_h2]:text-[length:clamp(2rem,_4vw,_3rem)] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em] [&_p]:text-[color:#6b788a] [&_p]:leading-[1.6]">
            <Badge variant="primary">Meet your coding buddy</Badge>
            <h2 id="milo-title">Small buddy. Big encouragement.</h2>
            <p>
              Meet Milo, your friendly guide through all 15 levels. From your
              first puzzle to your own mini game, you have a buddy by your side.
            </p>
          </div>
          <div className="grid gap-[1.25rem] grid-cols-[repeat(3,_1fr)] max-[928px]:grid-cols-[1fr]">
            {miloMoments.map((moment) => (
              <Card key={moment.mood}>
                <CardContent className="grid [justify-items:center] gap-4 p-6! text-center [&_h3]:text-[length:var(--font-size-lg)] [&_h3]:font-bold [&_p]:text-[color:var(--color-text-muted)] [&_p]:leading-[var(--line-height-relaxed)]">
                  <div
                    className={`grid place-items-center p-4 text-[color:var(--color-primary)] bg-[var(--color-surface-subtle)] rounded-[var(--radius-xl)] ${moment.mood === 'happy' ? 'text-[color:var(--color-success)]' : ''}`}
                  >
                    {moment.mood === 'thinking' ? (
                      <ThinkingStickman />
                    ) : (
                      <HappyStickman isCelebrating={moment.mood === 'happy'} />
                    )}
                  </div>
                  <h3>{moment.title}</h3>
                  <p>{moment.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="w-full mx-[auto] grid gap-[3rem] py-[clamp(5rem,_10vw,_8rem)] relative px-[max(1.25rem,_calc((100%_-_58rem)_/_2))] bg-[#edf6ff]">
          <div className="grid [justify-items:center] gap-[0.75rem] text-center [&_h2]:text-[length:clamp(2rem,_4vw,_3rem)] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em] [&_p]:text-[color:#6b788a] [&_p]:leading-[1.6]">
            <h2>Start today. More adventures ahead.</h2>
            <p>
              The beginner journey is ready to play. A separate route for
              experienced learners is part of our future plans.
            </p>
          </div>
          <div className="grid gap-[1.25rem] grid-cols-[repeat(2,_minmax(0,_1fr))] w-full max-[640px]:grid-cols-[1fr]">
            {paths.map((path) => (
              <Card
                className="min-h-[28rem] shadow-[0_7px_22px_rgb(41_76_113_/_6%)] [&_>_div]:px-[2rem] [&_>_div:first-child]:[align-content:start] [&_footer]:mt-[auto]"
                key={path.title}
              >
                <CardHeader>
                  <span
                    className={`grid w-[3rem] h-[3rem] text-[color:#fff] rounded-[0.75rem] place-items-center ${toneClasses[path.tone]}`}
                  >
                    <Icon icon={path.icon} size="md" />
                  </span>
                  <span className="mt-[1rem] text-[color:#788598] text-[length:0.68rem] font-[number:750] tracking-[0.08em] uppercase">
                    {path.label}
                  </span>
                  <CardTitle>{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-[0.7rem] p-[0] list-none [&_li]:flex [&_li]:items-center [&_li]:gap-[0.55rem] [&_li]:text-[color:#556379] [&_li]:text-[length:0.88rem] [&_svg]:text-[color:#27b96f]">
                    {path.items.map((item) => (
                      <li key={item}>
                        <Icon icon={Check} size="sm" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {path.planned ? (
                    <Badge variant="neutral">{path.action}</Badge>
                  ) : (
                    <a
                      className="inline-flex items-center justify-center min-h-[2.5rem] gap-[0.5rem] pt-[0.45rem] pr-[1.2rem] pb-[0.45rem] pl-[1.2rem] rounded-[0.8rem] text-[length:0.9rem] font-[number:750] [transition:transform_160ms_ease,_box-shadow_160ms_ease,_background_160ms_ease] w-full border-[length:1px] border-solid border-[color:#cbd9e7] motion-reduce:[transition:none] [&:hover]:[transform:translateY(-2px)] [&:hover]:shadow-[0_12px_28px_rgb(18_152_245_/_28%)] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
                      href="/register"
                    >
                      {path.action} <Icon icon={ArrowRight} size="sm" />
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="w-[min(calc(100%_-_2.5rem),_74rem)] mx-[auto] grid gap-[3rem] py-[clamp(5rem,_10vw,_8rem)] [&_>_.ck-page-primaryAction]:mt-[0] [&_>_.ck-page-primaryAction]:mr-[auto] [&_>_.ck-page-primaryAction]:mb-[0] [&_>_.ck-page-primaryAction]:ml-[auto]">
          <div className="grid [justify-items:center] gap-[0.75rem] text-center [&_h2]:text-[length:clamp(2rem,_4vw,_3rem)] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em] [&_p]:text-[color:#6b788a] [&_p]:leading-[1.6]">
            <h2>Your learning path</h2>
            <p>
              15 playable levels, from your first sequence to your own mini
              game. Complete each level to unlock the next.
            </p>
          </div>
          <ol className="grid grid-cols-[repeat(4,_1fr)] gap-[1rem] p-[0] list-none max-[928px]:grid-cols-[repeat(2,_1fr)] max-[640px]:grid-cols-[1fr] [&_li]:relative [&_li]:grid [&_li]:min-h-[15rem] [&_li]:[align-content:start] [&_li]:gap-[0.55rem] [&_li]:pt-[1.6rem] [&_li]:pr-[1.6rem] [&_li]:pb-[1.6rem] [&_li]:pl-[1.6rem] [&_li]:bg-[#fff] [&_li]:border-[length:1px] [&_li]:border-solid [&_li]:border-[color:#d5e1ed] [&_li]:rounded-[1rem] [&_li]:shadow-[0_5px_18px_rgb(41_76_113_/_5%)] [&_li:not(:last-child)::after]:absolute [&_li:not(:last-child)::after]:top-[1.3rem] [&_li:not(:last-child)::after]:right-[-1.05rem] [&_li:not(:last-child)::after]:z-[2] [&_li:not(:last-child)::after]:w-[1.7rem] [&_li:not(:last-child)::after]:h-[1.7rem] [&_li:not(:last-child)::after]:[content:''] [&_li:not(:last-child)::after]:border-t-[length:1px] [&_li:not(:last-child)::after]:border-solid [&_li:not(:last-child)::after]:border-t-[color:#c8d7e6] [&_h3]:mt-[0.5rem] [&_p]:text-[color:#758196] [&_p]:text-[length:0.8rem] [&_small]:mt-[auto] [&_small]:text-[color:#9aa5b4] [&_.ck-page-available]:text-[color:#25b96e] max-[928px]:[&_li::after]:hidden">
            {learningPath.map((step, index) => (
              <li key={step.title}>
                <span className="absolute top-[-0.8rem] right-[-0.55rem] z-[3] grid w-[1.7rem] h-[1.7rem] text-[color:#738197] bg-[#fff] border-[length:1px] border-solid border-[color:#cedae6] rounded-[50%] text-[length:0.75rem] place-items-center">
                  {index + 1}
                </span>
                <span
                  className={`grid w-[3rem] h-[3rem] text-[color:#fff] rounded-[0.75rem] place-items-center ${toneClasses[step.tone]}`}
                >
                  <Icon icon={step.icon} size="md" />
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <small>{step.status}</small>
              </li>
            ))}
          </ol>
          <a
            className="ck-page-primaryAction inline-flex items-center justify-center min-h-[3rem] gap-[0.5rem] pt-[0.75rem] pr-[1.2rem] pb-[0.75rem] pl-[1.2rem] rounded-[0.8rem] text-[length:0.9rem] font-[number:750] [transition:transform_160ms_ease,_box-shadow_160ms_ease,_background_160ms_ease] text-[color:#fff] bg-[#1298f5] shadow-[0_10px_24px_rgb(18_152_245_/_22%)] motion-reduce:[transition:none] [&:hover]:[transform:translateY(-2px)] [&:hover]:shadow-[0_12px_28px_rgb(18_152_245_/_28%)] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
            href="/register"
          >
            Discover all levels
          </a>
        </section>

        <section
          className="w-[min(calc(100%_-_2.5rem),_74rem)] mx-[auto] grid grid-cols-[0.9fr_1.1fr] gap-[clamp(2rem,_7vw,_6rem)] items-center my-[4rem_7rem] p-[clamp(2rem,_5vw,_4rem)] bg-[#fff] border-[length:1px] border-solid border-[color:#d5e1ed] rounded-[1.3rem] shadow-[0_8px_24px_rgb(36_74_112_/_6%)] max-[928px]:grid-cols-[1fr] [&_h2]:text-[length:clamp(2rem,_4vw,_3rem)] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em] [&_>_div:first-child]:grid [&_>_div:first-child]:[justify-items:start] [&_>_div:first-child]:gap-[1rem] [&_[class*='badge']]:gap-[0.4rem] [&_[class*='badge']]:text-[color:#1688df] [&_[class*='badge']]:bg-[#eaf5ff] [&_[class*='badge']]:border-[color:transparent] [&_p]:text-[color:#617086] [&_p]:leading-[1.65]"
          id="for-parents"
        >
          <div>
            <Badge variant="neutral">
              <Icon icon={UsersRound} size="sm" /> For parents
            </Badge>
            <h2>Stay in the loop—no tech skills required</h2>
            <p>
              Your account manages every child profile. When a child enters Kids
              Mode, parent controls disappear and returning requires logging out
              and signing in again.
            </p>
          </div>
          <div className="grid gap-[0.9rem] [&_article]:flex [&_article]:gap-[1rem] [&_article]:pt-[1rem] [&_article]:pr-[1rem] [&_article]:pb-[1rem] [&_article]:pl-[1rem] [&_article]:text-[color:#1496f2] [&_article]:bg-[#f1f7ff] [&_article]:rounded-[0.9rem] [&_p]:grid [&_p]:gap-[0.15rem] [&&_p]:text-[color:#243248] [&_span]:text-[color:#68768a] [&_span]:text-[length:0.82rem]">
            <article>
              <Icon icon={BarChart3} size="md" />
              <p>
                <strong>See real progress</strong>
                <span>
                  Progress bars, level status and completed lessons at a glance.
                </span>
              </p>
            </article>
            <article>
              <Icon icon={Clock3} size="md" />
              <p>
                <strong>Track learning time</strong>
                <span>
                  A simple overview of when and how much each child learns.
                </span>
              </p>
            </article>
            <article>
              <Icon icon={ShieldCheck} size="md" />
              <p>
                <strong>Safe by design</strong>
                <span>
                  No ads, no child registration and no parent controls in Kids
                  Mode.
                </span>
              </p>
            </article>
          </div>
        </section>

        <section className="w-[min(calc(100%_-_2.5rem),_74rem)] mx-[auto] mb-[6rem] p-[clamp(3rem,_7vw,_5.5rem)] text-[color:#fff] [background:linear-gradient(135deg,_#149bfa,_#098bea)] rounded-[1.4rem] [overflow-x:hidden] [overflow-y:hidden] text-center [&_h2]:text-[length:clamp(2rem,_4vw,_3rem)] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em] [&_>_div]:grid [&_>_div]:[justify-items:center] [&_>_div]:max-w-[45rem] [&_>_div]:gap-[1.25rem] [&_>_div]:mt-[auto] [&_>_div]:mr-[auto] [&_>_div]:mb-[auto] [&_>_div]:ml-[auto] [&_p]:max-w-[38rem] [&_p]:text-[color:rgb(255_255_255_/_80%)] [&_p]:leading-[1.6] [&_>_div_>_div]:flex [&_>_div_>_div]:flex-wrap [&_>_div_>_div]:justify-center [&_>_div_>_div]:gap-[0.8rem] [&_small]:flex [&_small]:items-center [&_small]:gap-[0.4rem] [&_small]:text-[color:rgb(255_255_255_/_75%)]">
          <div>
            <h2>Ready to turn screen time into skill time?</h2>
            <p>
              Create one parent account, add profiles for all your children and
              start the first level today.
            </p>
            <div>
              <a
                className="inline-flex items-center justify-center min-h-[3rem] gap-[0.5rem] pt-[0.75rem] pr-[1.2rem] pb-[0.75rem] pl-[1.2rem] rounded-[0.8rem] text-[length:0.9rem] font-[number:750] [transition:transform_160ms_ease,_box-shadow_160ms_ease,_background_160ms_ease] text-[color:#0b7fc8] bg-[#9df0d8] motion-reduce:[transition:none] [&:hover]:[transform:translateY(-2px)] [&:hover]:shadow-[0_12px_28px_rgb(18_152_245_/_28%)] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
                href="/register"
              >
                <Icon icon={Rocket} size="sm" /> Get started
              </a>
              <a
                className="inline-flex items-center justify-center min-h-[3rem] gap-[0.5rem] pt-[0.75rem] pr-[1.2rem] pb-[0.75rem] pl-[1.2rem] rounded-[0.8rem] text-[length:0.9rem] font-[number:750] [transition:transform_160ms_ease,_box-shadow_160ms_ease,_background_160ms_ease] text-[color:#fff] bg-[rgb(255_255_255_/_15%)] motion-reduce:[transition:none] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
                href="/login"
              >
                I already have an account
              </a>
            </div>
            <small>
              Parents sign up first, then create a profile for their child.
            </small>
            <small>
              <Icon icon={ShieldCheck} size="sm" /> Safe, ad-free and made for
              ages 10–15
            </small>
          </div>
        </section>
      </main>

      <footer className="w-[min(calc(100%_-_2.5rem),_74rem)] mx-[auto] flex items-center justify-between py-[2rem] border-t-[length:1px] border-solid border-t-[color:#d9e6f2] max-[640px]:items-start max-[640px]:flex-col max-[640px]:gap-[1rem] [&_.logoMark]:w-[2rem] [&_.logoWordmark]:text-[length:1rem] [&_p]:text-[color:#718096] [&_p]:text-[length:0.8rem]">
        <Logo showTagline={false} />
        <p>A safe learning platform for kids ages 10–15</p>
      </footer>
    </div>
  );
}
