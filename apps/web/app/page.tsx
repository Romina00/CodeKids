import { Logo, LogoMark } from "../components/logo";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <Logo className={styles.logoShowcase} />
          <p className={styles.description}>
            Responsive SVG lockup with a standalone mark, theme-aware colors,
            and a wordmark that matches the provided visual reference.
          </p>
        </section>
        <section className={styles.previewGrid}>
          <article className={styles.card}>
            <span className={styles.label}>Full Lockup</span>
            <Logo showTagline={false} className={styles.logoInline} />
          </article>
          <article className={styles.card}>
            <span className={styles.label}>Logo Mark</span>
            <LogoMark className={styles.markOnly} />
          </article>
        </section>
      </main>
    </div>
  );
}
