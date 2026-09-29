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
import { getAccessToken, getUserSession } from '../../lib/auth-session';

import { ParentModeExit } from './parent-mode-exit';

export function KidLayout({ children }: { children: ReactNode }) {
  const [profileName, setProfileName] = useState('Young coder');
  const pathname = usePathname();

  useEffect(() => {
    const user = getUserSession();
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
    <div className="h-auto min-h-svh [overflow-x:visible] [overflow-y:visible] bg-[var(--color-surface-subtle)]">
      <aside className="fixed [inset:0_auto_0_0] z-[10] flex w-[16rem] p-6 bg-[var(--color-surface)] border-r-[length:1px] border-solid border-r-[color:var(--color-border)] flex-col max-[1024px]:static max-[1024px]:w-full max-[1024px]:pt-4 max-[1024px]:pr-4 max-[1024px]:pb-4 max-[1024px]:pl-4 max-[1024px]:border-r-0 max-[1024px]:min-h-auto max-[1024px]:border-b-[length:1px] max-[1024px]:border-solid max-[1024px]:border-b-[color:var(--color-border)] [&_nav_ul]:grid [&_nav_ul]:gap-2 max-[1024px]:[&_nav_ul]:flex max-[1024px]:[&_nav_ul]:grid-cols-[repeat(3,_minmax(0,_1fr))] max-[1024px]:[&_nav_ul]:[overflow-x:auto] max-[640px]:[&_nav_ul]:grid-cols-[1fr] [&_nav_a]:gap-3 [&_nav_a]:min-h-[3rem]">
        <div className="flex items-center gap-2 mb-8 text-[length:var(--font-size-xl)] font-bold max-[1024px]:mb-3 [&_svg]:w-[2.75rem] [&_svg]:h-[2.75rem] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]">
          <LogoMark title="" />
          <span>CodeKids</span>
        </div>

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

        <Link
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 mt-[auto] border-[length:1px] border-solid border-[color:var(--color-border)] rounded-[var(--radius-lg)] max-[1024px]:hidden max-[1024px]:mt-6 [&_>_span:nth-child(2)]:grid [&_small]:text-[color:var(--color-text-muted)] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
          href="/profile"
        >
          <span className="grid text-[color:var(--color-on-primary)] bg-[var(--color-primary)] rounded-[var(--radius-full)] font-bold place-items-center w-[2.5rem] h-[2.5rem]">
            {profileName.charAt(0)}
          </span>
          <span>
            <strong>{profileName}</strong>
            <small>Your profile</small>
          </span>
          <Icon icon={Settings} size="sm" />
        </Link>

        <ParentModeExit />
      </aside>

      <main
        className="grid h-auto min-w-0 max-w-[88rem] gap-10 p-10 ml-[16rem] [overflow-y:visible] min-h-svh [overflow-x:visible] max-[1024px]:pt-6 max-[1024px]:pr-6 max-[1024px]:pb-6 max-[1024px]:pl-6 max-[1024px]:ml-[0] max-[1024px]:min-h-auto max-[720px]:gap-8 max-[720px]:pt-4 max-[720px]:pr-4 max-[720px]:pb-4 max-[720px]:pl-4"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}
