'use client';

import { Badge } from '@repo/ui/badge';
import {
  Award,
  BookOpen,
  CodeXml,
  Icon,
  Settings,
  Sparkles,
} from '@repo/ui/icon';
import {
  Navigation,
  NavigationItem,
  NavigationLink,
} from '@repo/ui/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogoMark } from '../../components/logo';
import { getSessionUser } from '../../lib/auth-session';
import styles from './kid-dashboard.module.css';
import { LearningPath } from './learning-path';
import { ParentModeExit } from './parent-mode-exit';
import GameGL1 from '../../components/games/gl1';

export default function KidDashboard() {
  const [profileName, setProfileName] = useState('Young coder');

  useEffect(() => {
    const user = getSessionUser();
    setProfileName(user?.nickname || user?.displayName || 'Young coder');
  }, []);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link aria-label="CodeKids home" className={styles.logoLink} href="/">
          <LogoMark title="" />
          <span>CodeKids</span>
        </Link>
        <Navigation label="Kid dashboard">
          <NavigationItem>
            <NavigationLink current href="#learning-path">
              <Icon icon={Sparkles} size="sm" /> Home
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="#learning-path">
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
          <span className={styles.avatar}>{profileName.charAt(0)}</span>
          <span>
            <strong>{profileName}</strong>
            <small>Explorer</small>
          </span>
          <Icon icon={Settings} size="sm" />
        </a>
        <ParentModeExit />
      </aside>

      <main className={styles.main} id="main-content" tabIndex={-1}>
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
        <LearningPath />
      </main>
    </div>
  );
}
