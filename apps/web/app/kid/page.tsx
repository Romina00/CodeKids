import { Badge } from '@repo/ui/badge';
import { Icon, Play, Rocket, Trophy } from '@repo/ui/icon';
import Link from 'next/link';
import styles from './kid-dashboard.module.css';

export default function KidDashboard() {
  return (
    <>
      <header className={styles.welcome} id="home">
        <div>
          <Badge variant="primary">Your coding space</Badge>
          <h1>Ready for your next coding adventure?</h1>
          <p>
            Choose a level, solve the challenge, and see your ideas come to
            life.
          </p>
        </div>
        <div className={styles.welcomeIcon} aria-hidden="true">
          <Icon icon={Rocket} size="xl" />
        </div>
      </header>
      <section className={styles.continueCard} aria-labelledby="continue-title">
        <div className={styles.continueCopy}>
          <span className={styles.eyebrow}>Start here</span>
          <h2 id="continue-title">Level 1: Tom &amp; Jerry</h2>
          <p>
            Help Jerry find a safe path by putting the right instructions in
            order.
          </p>
          <Link className={styles.primaryAction} href="/kid/levels/1">
            <Icon icon={Play} size="sm" />
            Start level
          </Link>
          <Link className={styles.secondaryAction} href="/kid/levels">
            Browse all levels
          </Link>
        </div>
        <div className={styles.challengePreview} aria-hidden="true">
          <Icon icon={Trophy} size="xl" />
          <span>Build. Test. Learn.</span>
        </div>
      </section>
    </>
  );
}
