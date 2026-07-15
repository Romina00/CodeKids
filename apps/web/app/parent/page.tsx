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
  Icon,
  Settings,
  ShieldCheck,
} from '@repo/ui/icon';
import Link from 'next/link';
import { LogoMark } from '../../components/logo';
import styles from './parent-dashboard.module.css';

const children = [
  { name: 'Mina', level: 'Level 2', progress: 62, active: true },
  { name: 'Arman', level: 'Level 1', progress: 28, active: false },
] as const;

const recentActivity = [
  {
    title: 'Loops in the garden',
    detail: 'Activity completed',
    time: 'Today, 16:20',
  },
  { title: 'Loop learner', detail: 'Reward earned', time: 'Today, 16:18' },
  {
    title: 'Meet the blocks',
    detail: 'Level completed',
    time: 'Monday, 17:05',
  },
] as const;

export default function ParentDashboard() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link aria-label="CodeKids home" className={styles.brand} href="/">
          <LogoMark title="" />
          <span>CodeKids Parent</span>
        </Link>
        <nav aria-label="Parent account">
          <a href="#children">Children</a>
          <a href="#progress">Progress</a>
          <a href="#settings">
            <Icon icon={Settings} size="sm" /> Settings
          </a>
        </nav>
      </header>

      <main className={styles.main} id="main-content" tabIndex={-1}>
        <section className={styles.welcome}>
          <div>
            <Badge variant="primary">Family overview</Badge>
            <h1>Good afternoon, Sara.</h1>
            <p>
              Here is a calm snapshot of how learning is going—without rankings
              or pressure.
            </p>
          </div>
          <button className={styles.addChild} type="button">
            Add child profile
          </button>
        </section>

        <section
          aria-labelledby="children-title"
          className={styles.section}
          id="children"
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Family profiles</span>
              <h2 id="children-title">Children</h2>
            </div>
            <span>2 profiles</span>
          </div>
          <div className={styles.childGrid}>
            {children.map((child) => (
              <Card
                className={child.active ? styles.activeChild : undefined}
                key={child.name}
              >
                <CardHeader>
                  <div className={styles.childIdentity}>
                    <span className={styles.avatar}>{child.name[0]}</span>
                    <span>
                      <CardTitle>{child.name}</CardTitle>
                      <CardDescription>{child.level}</CardDescription>
                    </span>
                  </div>
                  {child.active ? (
                    <Badge variant="success">Viewing</Badge>
                  ) : null}
                </CardHeader>
                <CardContent>
                  <div className={styles.progressLabel}>
                    <span>Overall progress</span>
                    <strong>{child.progress}%</strong>
                  </div>
                  <div
                    aria-label={`${child.name} overall progress`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={child.progress}
                    className={styles.progressTrack}
                    role="progressbar"
                  >
                    <span
                      className={
                        child.active
                          ? styles.minaProgress
                          : styles.armanProgress
                      }
                    />
                  </div>
                  <button className={styles.profileAction} type="button">
                    View profile <Icon icon={ArrowRight} size="sm" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="progress-title"
          className={styles.section}
          id="progress"
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Mina&apos;s learning</span>
              <h2 id="progress-title">Progress summary</h2>
            </div>
            <select aria-label="Summary period" defaultValue="week">
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>

          <div className={styles.metrics}>
            <Card>
              <CardContent>
                <Icon icon={Clock} size="lg" />
                <strong>1h 25m</strong>
                <span>Learning time</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Icon icon={BookOpen} size="lg" />
                <strong>3</strong>
                <span>Activities completed</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Icon icon={Award} size="lg" />
                <strong>2</strong>
                <span>Rewards earned</span>
              </CardContent>
            </Card>
          </div>

          <div className={styles.detailGrid}>
            <Card>
              <CardHeader>
                <CardTitle>Completed levels</CardTitle>
                <CardDescription>
                  Milestones finished at Mina&apos;s own pace.
                </CardDescription>
              </CardHeader>
              <CardContent className={styles.completedList}>
                <div>
                  <Icon icon={Check} size="sm" />
                  <span>
                    <strong>Meet the blocks</strong>
                    <small>8 activities · completed Monday</small>
                  </span>
                </div>
                <div>
                  <Icon icon={Check} size="sm" />
                  <span>
                    <strong>First directions</strong>
                    <small>6 activities · completed last week</small>
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>
                  Useful events, not a minute-by-minute activity log.
                </CardDescription>
              </CardHeader>
              <CardContent className={styles.activityList}>
                {recentActivity.map((activity) => (
                  <div key={activity.title}>
                    <span className={styles.activityDot} />
                    <span>
                      <strong>{activity.title}</strong>
                      <small>{activity.detail}</small>
                    </span>
                    <time>{activity.time}</time>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section aria-labelledby="rewards-title" className={styles.rewards}>
          <div>
            <Icon icon={Award} size="xl" />
            <span>
              <span className={styles.eyebrow}>Recent reward</span>
              <h2 id="rewards-title">Mina earned “Loop learner”</h2>
              <p>Acknowledge the strategy she used, not just the badge.</p>
            </span>
          </div>
          <button type="button">View reward history</button>
        </section>

        <section
          aria-labelledby="settings-title"
          className={styles.settings}
          id="settings"
        >
          <Icon icon={ShieldCheck} size="lg" />
          <div>
            <h2 id="settings-title">Family controls</h2>
            <p>
              Manage child profiles, privacy choices, and account security in
              one place.
            </p>
          </div>
          <a href="#manage">
            Manage settings <Icon icon={ArrowRight} size="sm" />
          </a>
        </section>
      </main>
    </div>
  );
}
