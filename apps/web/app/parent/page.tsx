import { Badge } from '@repo/ui/badge';
import { ArrowRight, Icon, Settings, ShieldCheck } from '@repo/ui/icon';
import Link from 'next/link';
import { LogoMark } from '../../components/logo';
import styles from './parent-dashboard.module.css';
import { AddChildProfile, ParentLogout } from './profile-actions';
import { ChildProfiles } from './child-profiles';

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
          <a href="#settings">
            <Icon icon={Settings} size="sm" /> Settings
          </a>
          <ParentLogout />
        </nav>
      </header>

      <main className={styles.main} id="main-content" tabIndex={-1}>
        <section className={styles.welcome}>
          <div>
            <Badge variant="primary">Family overview</Badge>
            <h1>Welcome back.</h1>
            <p>
              Here is a calm snapshot of how learning is going—without rankings
              or pressure.
            </p>
          </div>
          <AddChildProfile />
        </section>

        <section
          aria-labelledby="children-title"
          className={styles.section}
          id="children"
        >
          <ChildProfiles />
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
          <a href="/parent/settings">
            Manage settings <Icon icon={ArrowRight} size="sm" />
          </a>
        </section>
      </main>
    </div>
  );
}
