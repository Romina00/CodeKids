'use client';

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
import { useEffect, useState, type ReactNode } from 'react';
import { LogoMark } from '../../components/logo';
import { getSessionUser } from '../../lib/auth-session';
import styles from './kid-dashboard.module.css';
import { ParentModeExit } from './parent-mode-exit';

export function KidLayout({ children }: { children: ReactNode }) {
  const [profileName, setProfileName] = useState('Young coder');

  useEffect(() => {
    const user = getSessionUser();
    setProfileName(user?.nickname || user?.displayName || 'Young coder');
  }, []);

  return (
    <div
      className={`${styles.shell} h-svh overflow-hidden max-[1024px]:h-auto max-[1024px]:min-h-svh max-[1024px]:overflow-visible`}
    >
      <aside className={styles.sidebar}>
        <Link aria-label="CodeKids home" className={styles.logoLink} href="/">
          <LogoMark title="" />
          <span>CodeKids</span>
        </Link>
        <Navigation label="Kid dashboard">
          <NavigationItem>
            <NavigationLink current href="/kid#learning-path">
              <Icon icon={Sparkles} size="sm" /> Home
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="/kid#learning-path">
              <Icon icon={BookOpen} size="sm" /> Levels
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="/kid#code-lab">
              <Icon icon={CodeXml} size="sm" /> Code lab
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="/kid#rewards">
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

      <main
        className={`${styles.main} min-h-0 overflow-y-auto`}
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}
