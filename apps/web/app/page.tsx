import { Badge } from '@repo/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import {
  ArrowRight,
  Award,
  BookOpen,
  CodeXml,
  Icon,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from '@repo/ui/icon';
import { Logo } from '../components/logo';
import styles from './page.module.css';

const learningSteps = [
  {
    icon: BookOpen,
    title: 'Choose a mission',
    description:
      'Short, age-friendly lessons turn coding ideas into clear goals.',
  },
  {
    icon: CodeXml,
    title: 'Build and experiment',
    description:
      'Interactive puzzles help children learn by trying, improving, and trying again.',
  },
  {
    icon: Award,
    title: 'Celebrate progress',
    description:
      'Levels, rewards, and useful feedback make every small win visible.',
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
          <a className={styles.textLink} href="#how-it-works">
            How it works
          </a>
          <a className={styles.textLink} href="#for-parents">
            For parents
          </a>
          <a className={styles.loginLink} href="/login">
            Log in
          </a>
          <a className={styles.primaryLink} href="/register">
            Sign up
          </a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <Badge variant="primary">Coding confidence starts here</Badge>
            <h1>Big ideas become playful coding adventures.</h1>
            <p>
              CodeKids helps children learn computational thinking one friendly
              mission at a time—while parents get a calm, useful view of their
              progress.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLinkLarge} href="/register">
                Start learning
                <Icon icon={ArrowRight} size="sm" />
              </a>
              <a className={styles.secondaryLinkLarge} href="#paths">
                Explore the paths
              </a>
            </div>
            <ul className={styles.trustList} aria-label="Platform benefits">
              <li>
                <Icon icon={ShieldCheck} size="sm" /> Parent-guided
              </li>
              <li>
                <Icon icon={Sparkles} size="sm" /> Child-friendly
              </li>
              <li>
                <Icon icon={BookOpen} size="sm" /> Learn at your pace
              </li>
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.orbit} aria-hidden="true" />
            <div className={styles.missionCard}>
              <span className={styles.eyebrow}>Today&apos;s mission</span>
              <div className={styles.missionIcon}>
                <Icon icon={CodeXml} size="xl" />
              </div>
              <strong>Guide Pixel home</strong>
              <p>Use three blocks to finish the path.</p>
              <div
                aria-label="Mission progress"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={75}
                className={styles.progressTrack}
                role="progressbar"
              >
                <span />
              </div>
              <Badge variant="success">3 stars ready</Badge>
            </div>
            <div className={styles.rewardBubble}>
              <Icon icon={Award} size="lg" />
              <span>+20 XP</span>
            </div>
          </div>
        </section>

        <section className={styles.pathsSection} id="paths">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>
              One platform, two clear paths
            </span>
            <h2>Made for curious kids and supportive grown-ups.</h2>
          </div>
          <div className={styles.pathGrid}>
            <Card className={styles.kidCard}>
              <CardHeader>
                <div className={styles.cardIcon}>
                  <Icon icon={Sparkles} size="lg" />
                </div>
                <CardTitle>Kid path</CardTitle>
                <CardDescription>
                  Explore levels, solve visual coding puzzles, earn rewards, and
                  see what comes next.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a className={styles.inlineLink} href="/register?role=kid">
                  Begin an adventure <Icon icon={ArrowRight} size="sm" />
                </a>
              </CardContent>
            </Card>

            <Card className={styles.parentCard} id="for-parents">
              <CardHeader>
                <div className={styles.cardIcon}>
                  <Icon icon={UsersRound} size="lg" />
                </div>
                <CardTitle>Parent path</CardTitle>
                <CardDescription>
                  Create child profiles, follow learning progress, and celebrate
                  completed levels together.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a className={styles.inlineLink} href="/register?role=parent">
                  Create a family account <Icon icon={ArrowRight} size="sm" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className={styles.stepsSection} id="how-it-works">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>How it works</span>
            <h2>A simple rhythm that keeps learning moving.</h2>
          </div>
          <ol className={styles.stepsGrid}>
            {learningSteps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <Icon icon={step.icon} size="lg" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.finalCta}>
          <div>
            <span className={styles.eyebrow}>Ready when your family is</span>
            <h2>Turn screen time into build time.</h2>
            <p>
              Create a parent account and help your child begin their first
              coding mission.
            </p>
          </div>
          <a className={styles.primaryLinkLarge} href="/register">
            Create a free account
            <Icon icon={ArrowRight} size="sm" />
          </a>
        </section>
      </main>

      <footer className={styles.footer}>
        <Logo showTagline={false} />
        <p>Playful coding education, guided by families.</p>
        <span>© 2026 CodeKids</span>
      </footer>
    </div>
  );
}
