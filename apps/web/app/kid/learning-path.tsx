import styles from './learning-path.module.css';

const levels = [
  { number: 1, title: 'Tom & Jerry', href: '#tom-and-jerry' },
  { number: 2, title: 'Pizza order', href: '#pizza-order' },
  { number: 3, title: 'Treasure loop', href: '#treasure-loop' },
  { number: 4, title: 'True or false', href: '#true-or-false' },
  { number: 5, title: 'If adventure', href: '#if-adventure' },
  { number: 6, title: 'Secret gates', href: '#secret-gates' },
  { number: 7, title: 'Coin count', href: '#coin-count' },
  { number: 8, title: 'Data types', href: '#data-types' },
];

export function LearningPath() {
  return (
    <section
      className={styles.learningPath}
      id="learning-path"
      aria-labelledby="learning-path-title"
    >
      <div className={styles.heading}>
        <span>Learning path</span>
        <h2 id="learning-path-title">Your coding journey</h2>
      </div>

      <div className={styles.worlds}>
        <section className={styles.world}>
          <h3>Available games</h3>
          <ol className={styles.levels}>
            {levels.map((level) => (
              <li className={styles.level} key={level.number}>
                <a
                  className={styles.availableLevel}
                  href={`/kid/levels/${level.number}`}
                >
                  <span className={styles.levelNumber}>{level.number}</span>
                  <span>
                    <strong>Level {level.number}</strong>
                    <small>{level.title}</small>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
