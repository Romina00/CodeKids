import { Badge } from '@repo/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import {
  BookOpen,
  Check,
  Clock,
  CodeXml,
  Icon,
  LockKeyhole,
  Settings,
  ShieldCheck,
  UsersRound,
} from '@repo/ui/icon';
import Link from 'next/link';
import { LogoMark } from '../../components/logo';
import styles from './admin-panel.module.css';

const users = [
  {
    name: 'Sara Ahmadi',
    email: 'sara@example.com',
    role: 'Parent',
    status: 'Active',
  },
  {
    name: 'Mina Ahmadi',
    email: 'Child profile',
    role: 'Kid',
    status: 'Active',
  },
  {
    name: 'Test Account',
    email: 'test@example.com',
    role: 'Parent',
    status: 'Blocked',
  },
] as const;

const levels = [
  { title: 'Meet the blocks', activities: 8, status: 'Published' },
  { title: 'Loops in the garden', activities: 6, status: 'Published' },
  { title: 'Secret conditions', activities: 5, status: 'Draft' },
] as const;

export default function AdminPanel() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link aria-label="CodeKids home" className={styles.brand} href="/">
          <LogoMark title="" />
          <span>CodeKids Admin</span>
        </Link>
        <nav aria-label="Admin panel">
          <a className={styles.current} href="#overview">
            <Icon icon={ShieldCheck} size="sm" /> Overview
          </a>
          <a href="#users">
            <Icon icon={UsersRound} size="sm" /> Users
          </a>
          <a href="#levels">
            <Icon icon={BookOpen} size="sm" /> Learning
          </a>
          <a href="#landing">
            <Icon icon={CodeXml} size="sm" /> Landing content
          </a>
        </nav>
        <a className={styles.settingsLink} href="#settings">
          <Icon icon={Settings} size="sm" /> Admin settings
        </a>
      </aside>

      <main className={styles.main} id="main-content" tabIndex={-1}>
        <header className={styles.header} id="overview">
          <div>
            <Badge variant="primary">Admin workspace</Badge>
            <h1>Platform overview</h1>
            <p>
              Operational signals and protected management actions in one place.
            </p>
          </div>
          <span className={styles.adminIdentity}>
            <Icon icon={ShieldCheck} size="md" /> Romina · Administrator
          </span>
        </header>

        <section aria-label="Platform statistics" className={styles.metrics}>
          <Card>
            <CardContent>
              <Icon icon={UsersRound} size="lg" />
              <strong>1,284</strong>
              <span>Active families</span>
              <small>+8% this month</small>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Icon icon={BookOpen} size="lg" />
              <strong>4,920</strong>
              <span>Activities completed</span>
              <small>Last 30 days</small>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Icon icon={Clock} size="lg" />
              <strong>18m</strong>
              <span>Median session</span>
              <small>Privacy-safe aggregate</small>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Icon icon={Check} size="lg" />
              <strong>98.7%</strong>
              <span>Successful API requests</span>
              <small>Last 24 hours</small>
            </CardContent>
          </Card>
        </section>

        <section
          aria-labelledby="users-title"
          className={styles.panel}
          id="users"
        >
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.eyebrow}>Account operations</span>
              <h2 id="users-title">User management</h2>
            </div>
            <label className={styles.search}>
              <span>Search users</span>
              <input placeholder="Name or email" type="search" />
            </label>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.name}>
                    <td>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </td>
                    <td>{user.role}</td>
                    <td>
                      <Badge
                        variant={
                          user.status === 'Blocked' ? 'danger' : 'success'
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className={
                          user.status === 'Blocked'
                            ? styles.restore
                            : styles.block
                        }
                        type="button"
                      >
                        <Icon icon={LockKeyhole} size="sm" />
                        {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="levels-title"
          className={styles.panel}
          id="levels"
        >
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.eyebrow}>Curriculum operations</span>
              <h2 id="levels-title">Learning levels</h2>
            </div>
            <button className={styles.primaryAction} type="button">
              Create level
            </button>
          </div>
          <div className={styles.levelList}>
            {levels.map((level, index) => (
              <article key={level.title}>
                <span className={styles.order}>{index + 1}</span>
                <span>
                  <strong>{level.title}</strong>
                  <small>{level.activities} activities</small>
                </span>
                <Badge
                  variant={level.status === 'Published' ? 'success' : 'warning'}
                >
                  {level.status}
                </Badge>
                <button type="button">Edit</button>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="landing-title"
          className={styles.contentGrid}
          id="landing"
        >
          <Card>
            <CardHeader>
              <Badge variant="success">Published</Badge>
              <CardTitle id="landing-title">Landing hero</CardTitle>
              <CardDescription>
                Big ideas become playful coding adventures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button type="button">Edit content</button>
              <small>Last updated 2 days ago by Romina</small>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="neutral">Scheduled</Badge>
              <CardTitle>Parent story</CardTitle>
              <CardDescription>
                A new trust section prepared for editorial review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button type="button">Review draft</button>
              <small>Scheduled for Friday</small>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
