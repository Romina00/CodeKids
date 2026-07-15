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
  Check,
  Clock,
  CodeXml,
  Icon,
  Settings,
  Sparkles,
  UserRound,
} from '@repo/ui/icon';
import {
  Navigation,
  NavigationItem,
  NavigationLink,
} from '@repo/ui/navigation';
import Link from 'next/link';
import { LogoMark } from '../../components/logo';
import styles from './kid-dashboard.module.css';
import { ParentModeExit } from './parent-mode-exit';

const levels = [
  {
    name: 'Meet the blocks',
    status: 'Complete',
    progress: 100,
    state: 'complete',
  },
  {
    name: 'Loops in the garden',
    status: 'Continue',
    progress: 60,
    state: 'current',
  },
  {
    name: 'Secret conditions',
    status: 'Next up',
    progress: 0,
    state: 'locked',
  },
] as const;

export default function KidDashboard() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link aria-label="CodeKids home" className={styles.logoLink} href="/">
          <LogoMark title="" />
          <span>CodeKids</span>
        </Link>
        <Navigation label="Kid dashboard">
          <NavigationItem>
            <NavigationLink current href="#home">
              <Icon icon={Sparkles} size="sm" /> Home
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="#levels">
              <Icon icon={BookOpen} size="sm" /> Levels
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="#code-lab">
              <Icon icon={CodeXml} size="sm" /> Code lab
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="#rewards">
              <Icon icon={Award} size="sm" /> Rewards
            </NavigationLink>
          </NavigationItem>
        </Navigation>
        <a className={styles.profileLink} href="#profile">
          <span className={styles.avatar}>M</span>
          <span>
            <strong>Mina</strong>
            <small>Explorer</small>
          </span>
          <Icon icon={Settings} size="sm" />
        </a>
        <ParentModeExit />
      </aside>

      <main className={styles.main} id="main-content" tabIndex={-1}>
        <header className={styles.welcome} id="home">
          <div>
            <Badge variant="success">Level 2 explorer</Badge>
            <h1>Hi Mina, ready to build?</h1>
            <p>
              Pick up where you stopped or choose something new. There is no
              timer.
            </p>
          </div>
          <div className={styles.xpCard} aria-label="Experience points: 240">
            <Icon icon={Award} size="lg" />
            <span>
              <strong>240 XP</strong>
              <small>60 until your next badge</small>
            </span>
          </div>
        </header>

        <section
          aria-labelledby="continue-title"
          className={styles.continueCard}
        >
          <div className={styles.continueCopy}>
            <span className={styles.eyebrow}>Continue your mission</span>
            <h2 id="continue-title">Help the robot water every flower</h2>
            <p>Use a repeat block to make your instructions shorter.</p>
            <div
              aria-label="Mission progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={60}
              className={styles.progress}
              role="progressbar"
            >
              <span />
            </div>
            <a className={styles.primaryAction} href="#code-lab">
              Continue mission <Icon icon={ArrowRight} size="sm" />
            </a>
          </div>
          <div aria-hidden="true" className={styles.robotScene}>
            <LogoMark title="" />
            <span className={styles.flower}>✦</span>
            <span className={styles.flower}>✦</span>
            <span className={styles.flower}>✦</span>
          </div>
        </section>

        <section
          aria-labelledby="levels-title"
          className={styles.section}
          id="levels"
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Your learning path</span>
              <h2 id="levels-title">Levels</h2>
            </div>
            <a href="#all-levels">See all levels</a>
          </div>
          <div className={styles.levelGrid}>
            {levels.map((level, index) => (
              <Card key={level.name}>
                <CardHeader>
                  <span className={styles.levelNumber}>{index + 1}</span>
                  <CardTitle>{level.name}</CardTitle>
                  <CardDescription>{level.status}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    aria-label={`${level.name} progress`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={level.progress}
                    className={styles.levelProgress}
                    role="progressbar"
                  >
                    <span className={styles[level.state]} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="lab-title"
          className={styles.labGrid}
          id="code-lab"
        >
          <Card className={styles.blocklyCard}>
            <CardHeader>
              <Badge variant="primary">Blockly practice</Badge>
              <CardTitle id="lab-title">Build the flower loop</CardTitle>
              <CardDescription>
                Drag blocks into the workspace and test whenever you like.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                aria-label="Blockly workspace preview"
                className={styles.workspace}
                role="img"
              >
                <span className={styles.eventBlock}>when start</span>
                <span className={styles.loopBlock}>repeat 3 times</span>
                <span className={styles.moveBlock}>move forward</span>
              </div>
            </CardContent>
          </Card>

          <Card className={styles.quizCard}>
            <CardHeader>
              <Badge variant="warning">Quick quiz</Badge>
              <CardTitle>What does a loop do?</CardTitle>
              <CardDescription>
                Choose when you feel ready. Retrying is always okay.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.answers}>
              <button type="button">Repeats instructions</button>
              <button type="button">Changes a character</button>
              <button type="button">Ends every program</button>
            </CardContent>
          </Card>
        </section>

        <section
          aria-labelledby="rewards-title"
          className={styles.section}
          id="rewards"
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Things you earned</span>
              <h2 id="rewards-title">Rewards</h2>
            </div>
          </div>
          <div className={styles.rewardGrid}>
            <div>
              <Icon icon={Award} size="xl" />
              <strong>Loop learner</strong>
              <span>Used your first repeat block</span>
            </div>
            <div>
              <Icon icon={Check} size="xl" />
              <strong>Careful checker</strong>
              <span>Tested a solution three times</span>
            </div>
            <div>
              <Icon icon={Clock} size="xl" />
              <strong>Steady explorer</strong>
              <span>Learned on three different days</span>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="profile-title"
          className={styles.profile}
          id="profile"
        >
          <div className={styles.avatarLarge}>
            <Icon icon={UserRound} label="Mina's avatar" size="xl" />
          </div>
          <div>
            <span className={styles.eyebrow}>Your profile</span>
            <h2 id="profile-title">Mina the Explorer</h2>
            <p>2 levels started · 4 rewards · learning at your own pace</p>
          </div>
        </section>
      </main>
    </div>
  );
}
