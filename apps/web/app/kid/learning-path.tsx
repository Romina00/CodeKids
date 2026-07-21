import { Icon, LockKeyhole } from '@repo/ui/icon';
import styles from './learning-path.module.css';

const worlds = [
  { title: 'World 1 – Think Like a Programmer', firstLevel: 1, lastLevel: 6 },
  { title: 'World 2 – Programming Fundamentals', firstLevel: 7, lastLevel: 11 },
  { title: 'World 3 – Problem Solving', firstLevel: 12, lastLevel: 14 },
  { title: 'World 4 – Reusable Code', firstLevel: 15, lastLevel: 16 },
  { title: 'World 5 – Build Your Own Game', firstLevel: 17, lastLevel: 20 },
];

function getLevels(firstLevel: number, lastLevel: number) {
  return Array.from(
    { length: lastLevel - firstLevel + 1 },
    (_, index) => firstLevel + index,
  );
}

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
        {worlds.map((world) => (
          <section className={styles.world} key={world.title}>
            <h3>{world.title}</h3>
            <ol className={styles.levels}>
              {getLevels(world.firstLevel, world.lastLevel).map((level) => {
                const isAvailable = level === 1;

                return (
                  <li className={styles.level} key={level}>
                    {isAvailable ? (
                      <a
                        className={styles.availableLevel}
                        href="#tom-and-jerry"
                      >
                        <span className={styles.levelNumber}>{level}</span>
                        <span>
                          <strong>Level {level}</strong>
                          <small>Tom &amp; Jerry</small>
                        </span>
                      </a>
                    ) : (
                      <span className={styles.lockedLevel} aria-disabled="true">
                        <span className={styles.levelNumber}>{level}</span>
                        <span>
                          <strong>Level {level}</strong>
                          <small>Locked</small>
                        </span>
                        <Icon icon={LockKeyhole} size="sm" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
