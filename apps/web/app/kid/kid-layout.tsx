'use client';

import { BookOpen, Gamepad2, Icon, Map, Settings } from '@repo/ui/icon';
import {
  Navigation,
  NavigationItem,
  NavigationLink,
} from '@repo/ui/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { LogoMark } from '../../components/logo';
import { getAccessToken, getSessionUser } from '../../lib/auth-session';
import styles from './kid-dashboard.module.css';
import { ParentModeExit } from './parent-mode-exit';

export function KidLayout({ children }: { children: ReactNode }) {
  const [profileName, setProfileName] = useState('Young coder');
  const pathname = usePathname();

  useEffect(() => {
    const user = getSessionUser();
    if (!getAccessToken()) {
      window.location.assign('/login');
      return;
    }
    if (user?.role !== 'kid') {
      window.location.assign('/select-profile');
      return;
    }
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
            <NavigationLink current={pathname === '/kid'} href="/kid">
              <Icon icon={Gamepad2} size="sm" /> Home
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink
              current={pathname === '/kid/levels'}
              href="/kid/levels"
            >
              <Icon icon={BookOpen} size="sm" /> Levels
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink href="/kid/levels/1">
              <Icon icon={Map} size="sm" /> Continue learning
            </NavigationLink>
          </NavigationItem>
        </Navigation>
        <Link className={styles.profileLink} href="/profile">
          <span className={styles.avatar}>{profileName.charAt(0)}</span>
          <span>
            <strong>{profileName}</strong>
            <small>Your profile</small>
          </span>
          <Icon icon={Settings} size="sm" />
        </Link>
        <ParentModeExit />
      </aside>

      <main className={styles.main} id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
