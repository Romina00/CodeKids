'use client';

import { Badge } from '@repo/ui/badge';
import { useEffect, useState } from 'react';
import { getSessionUser } from '../../lib/auth-session';
import styles from './kid-dashboard.module.css';
import { LearningPath } from './learning-path';
import GameGL1 from '../../components/games/gl1';
import GameGL2 from '../../components/games/gl2';
import GameGL3 from '../../components/games/gl3';
import GameGL4 from '../../components/games/gl4';
import GameGL5 from '../../components/games/gl5';
import GameGL6 from '../../components/games/gl6';
import GameGL7 from '../../components/games/gl7';
import GameGL8 from '../../components/games/gl8';

export default function KidDashboard() {
  const [profileName, setProfileName] = useState('Young coder');

  useEffect(() => {
    const user = getSessionUser();
    setProfileName(user?.nickname || user?.displayName || 'Young coder');
  }, []);

  return (
    <>
      <header className={styles.welcome} id="home">
        <div>
          <Badge variant="success">Algorithms</Badge>
          <h1>Hi {profileName}, ready to build?</h1>
        </div>
      </header>
      <section
        className={styles.gameArea}
        id="tom-and-jerry"
        aria-label="Tom and Jerry level"
      >
        <GameGL1 />
      </section>

      <section
        className={styles.gameArea}
        id="pizza-order"
        aria-label="Pizza order level"
      >
        <GameGL2 />
      </section>

      <section
        className={styles.gameArea}
        id="treasure-loop"
        aria-label="Treasure loop level"
      >
        <GameGL3 />
      </section>

      <section
        className={styles.gameArea}
        id="true-or-false"
        aria-label="True or false level"
      >
        <GameGL4 />
      </section>

      <section
        className={styles.gameArea}
        id="if-adventure"
        aria-label="If adventure level"
      >
        <GameGL5 />
      </section>

      <section
        className={styles.gameArea}
        id="secret-gates"
        aria-label="Secret gates level"
      >
        <GameGL6 />
      </section>

      <section
        className={styles.gameArea}
        id="coin-count"
        aria-label="Coin count level"
      >
        <GameGL7 />
      </section>

      <section
        className={styles.gameArea}
        id="data-types"
        aria-label="Data types level"
      >
        <GameGL8 />
      </section>
      <LearningPath />
    </>
  );
}
