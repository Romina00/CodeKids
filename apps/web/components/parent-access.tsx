'use client';

import { Button } from '@repo/ui/button';
import { useEffect, useState, type ReactNode } from 'react';
import {
  authorizedFetch,
  getAccessToken,
  getSessionUser,
} from '../lib/auth-session';
import { Logo } from './logo';
import styles from '../app/auth.module.css';

export function ParentAccess({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState('Checking your parent session…');

  useEffect(() => {
    let active = true;
    async function checkAccess() {
      setAllowed(false);
      if (!getAccessToken() || getSessionUser()?.role !== 'parent') {
        setMessage(
          'Sign in with your parent account to view or add child profiles. Kids Mode cannot manage profiles.',
        );
        return;
      }
      try {
        const response = await authorizedFetch('/auth/me');
        if (!active) return;
        if (!response.ok) {
          setMessage('Your session has expired. Please sign in again.');
          return;
        }
        const user = (await response.json()) as { role: string };
        if (!active) return;
        if (user.role.toLowerCase() === 'parent') setAllowed(true);
        else
          setMessage(
            'Please sign in with your parent account to manage child profiles.',
          );
      } catch {
        if (active)
          setMessage(
            'Could not check your session. Please reload to try again.',
          );
      }
    }
    void checkAccess();
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) void checkAccess();
    }
    window.addEventListener('pageshow', onPageShow);
    return () => {
      active = false;
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  if (allowed) return children;
  return (
    <div className={styles.page}>
      <main className={styles.layout} id="main-content">
        <Logo className={styles.logo} showTagline={false} />
        <section className={styles.formPanel}>
          <div className={styles.form}>
            <h1>Parent access</h1>
            <p role="status">{message}</p>
            <Button onClick={() => window.location.assign('/login')}>
              Sign in as a parent
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
