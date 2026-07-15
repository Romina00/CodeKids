'use client';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { FormField } from '@repo/ui/form-field';
import { Icon, LockKeyhole, ShieldCheck } from '@repo/ui/icon';
import { Input } from '@repo/ui/input';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Logo } from '../../components/logo';
import {
  apiBaseUrl,
  AuthSession,
  readApiError,
  saveSession,
} from '../../lib/auth-session';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          password: data.get('password'),
        }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      const session = (await response.json()) as AuthSession;
      saveSession(session);
      window.location.assign(
        session.user.role === 'admin' ? '/admin' : '/parent',
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Login failed.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/">
          <Logo showTagline={false} />
        </Link>
        <Link className={styles.backLink} href="/">
          ← Back to home
        </Link>
      </header>
      <main className={styles.layout} id="main-content">
        <aside className={styles.aside}>
          <Icon icon={LockKeyhole} size="xl" />
          <h1>Welcome back, grown-up.</h1>
          <p>
            Only parents and administrators sign in. Child profiles are opened
            safely from the Parent Dashboard.
          </p>
          <ul className={styles.trustList}>
            <li>
              <Icon icon={ShieldCheck} size="sm" /> Parent-controlled access
            </li>
            <li>
              <Icon icon={ShieldCheck} size="sm" /> Separate progress for every
              child
            </li>
            <li>
              <Icon icon={ShieldCheck} size="sm" /> Kids Mode hides all parent
              controls
            </li>
          </ul>
        </aside>
        <section className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h2>Parent login</h2>
            <p>Use the email connected to your family account.</p>
          </div>
          {error ? (
            <Alert className={styles.error} variant="danger">
              <AlertTitle>We could not sign you in</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <form className={styles.form} onSubmit={submit}>
            <FormField label="Email address" required>
              <Input
                autoComplete="email"
                name="email"
                placeholder="parent@example.com"
                required
                type="email"
              />
            </FormField>
            <FormField label="Password" required>
              <Input
                autoComplete="current-password"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </FormField>
            <Button disabled={pending} size="lg" type="submit">
              {pending ? 'Signing in…' : 'Log in'}
            </Button>
          </form>
          <p className={styles.switchText}>
            New to CodeKids? <a href="/register">Create a parent account</a>
          </p>
        </section>
      </main>
    </div>
  );
}
