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
import styles from './page.module.css';

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
    <div className={styles.page}>
      <header className={styles.siteHeader}>
        <a
          aria-label="CodeKids home"
          className={styles.brand}
          href="#main-content"
        >
          <Logo showTagline={false} />
        </a>
        <nav aria-label="Primary navigation" className={styles.headerActions}>
          <a className={styles.homeLink} href="#main-content">
            <Icon icon={Sparkles} size="sm" /> Home
          </a>
          <a className={styles.loginLink} href="/login">
            Log in
          </a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <Badge variant="neutral">
              <Icon icon={Sparkles} size="sm" /> Coding made fun for ages 10–15
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
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="/register">
                <Icon icon={Rocket} size="sm" /> Create a parent account
              </a>
              <a className={styles.secondaryAction} href="#how-it-works">
                <Icon icon={PlayCircle} size="sm" /> See how it works
              </a>
            </div>
          </div>

          <div
            className={styles.heroVisual}
            aria-label="Children learning to code together"
          >
            <Image
              className={styles.heroImage}
              src="/hero-kids-coding.png"
              alt="Four children learning programming with colorful coding blocks"
              width={1024}
              height={1024}
              priority
            />
            <div className={styles.experienceBadge}>
              <span>
                <Icon icon={Sparkles} size="sm" />
              </span>
              <div>
                <strong>No experience needed</strong>
                <small>Start from level 1</small>
              </div>
            </div>
          </div>

          <dl className={styles.stats}>
            <div>
              <dt>15</dt>
              <dd>Playable coding levels</dd>
            </div>
            <div>
              <dt>1</dt>
              <dd>Mini game to build in the final level</dd>
            </div>
            <div>
              <dt>100%</dt>
              <dd>Ad-free & kid-safe</dd>
            </div>
          </dl>
        </section>

        <section className={styles.problemSection} id="how-it-works">
          <div className={styles.sectionHeading}>
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
          <div className={styles.comparisonGrid}>
            <Card className={styles.problemCard}>
              <CardHeader>
                <span className={styles.smallIcon}>
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
            <Card className={styles.solutionCard}>
              <CardHeader>
                <span className={styles.smallIcon}>
                  <Icon icon={Check} size="sm" />
                </span>
                <CardTitle>The CodeKids way</CardTitle>
              </CardHeader>
              <CardContent className={styles.solutionList}>
                <div>
                  <Icon icon={PlayCircle} size="sm" />
                  <p>
                    <strong>Short, friendly lessons</strong>
                    <span>
                      Every idea is explained with simple words and colorful
                      examples.
                    </span>
                  </p>
                </div>
                <div>
                  <Icon icon={Gamepad2} size="sm" />
                  <p>
                    <strong>Learning as puzzles</strong>
                    <span>
                      Concepts become drag-and-click challenges instead of walls
                      of text.
                    </span>
                  </p>
                </div>
                <div>
                  <Icon icon={Trophy} size="sm" />
                  <p>
                    <strong>Rewards that motivate</strong>
                    <span>
                      Points, levels and badges keep children moving forward.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          className={styles.learningSection}
          aria-labelledby="milo-title"
        >
          <div className={styles.sectionHeading}>
            <Badge variant="primary">Meet your coding buddy</Badge>
            <h2 id="milo-title">Small buddy. Big encouragement.</h2>
            <p>
              Meet Milo, your friendly guide through all 15 levels. From your
              first puzzle to your own mini game, you have a buddy by your side.
            </p>
          </div>
          <div className={styles.reviewGrid}>
            {miloMoments.map((moment) => (
              <Card key={moment.mood}>
                <CardContent className={styles.miloCard}>
                  <div
                    className={`${styles.miloFigure} ${moment.mood === 'happy' ? styles.miloHappy : ''}`}
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

        <section className={styles.pathsSection}>
          <div className={styles.sectionHeading}>
            <h2>Start today. More adventures ahead.</h2>
            <p>
              The beginner journey is ready to play. A separate route for
              experienced learners is part of our future plans.
            </p>
          </div>
          <div className={styles.pathGrid}>
            {paths.map((path) => (
              <Card className={styles.pathCard} key={path.title}>
                <CardHeader>
                  <span className={`${styles.pathIcon} ${styles[path.tone]}`}>
                    <Icon icon={path.icon} size="md" />
                  </span>
                  <span className={styles.cardLabel}>{path.label}</span>
                  <CardTitle>{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className={styles.checkList}>
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
                    <a className={styles.cardAction} href="/register">
                      {path.action} <Icon icon={ArrowRight} size="sm" />
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className={styles.learningSection}>
          <div className={styles.sectionHeading}>
            <h2>Your learning path</h2>
            <p>
              15 playable levels, from your first sequence to your own mini
              game. Complete each level to unlock the next.
            </p>
          </div>
          <ol className={styles.learningGrid}>
            {learningPath.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <span className={`${styles.pathIcon} ${styles[step.tone]}`}>
                  <Icon icon={step.icon} size="md" />
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <small>{step.status}</small>
              </li>
            ))}
          </ol>
          <a className={styles.primaryAction} href="/register">
            Discover all levels
          </a>
        </section>

        <section className={styles.parentSection} id="for-parents">
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
          <div className={styles.parentBenefits}>
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

        <section className={styles.finalCta}>
          <div>
            <h2>Ready to turn screen time into skill time?</h2>
            <p>
              Create one parent account, add profiles for all your children and
              start the first level today.
            </p>
            <div>
              <a className={styles.ctaLight} href="/register">
                <Icon icon={Rocket} size="sm" /> Create parent account
              </a>
              <a className={styles.ctaGhost} href="/login">
                I already have an account
              </a>
            </div>
            <small>
              <Icon icon={ShieldCheck} size="sm" /> Safe, ad-free and made for
              ages 10–15
            </small>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <Logo showTagline={false} />
        <p>A safe learning platform for kids ages 10–15</p>
      </footer>
    </div>
  );
}
