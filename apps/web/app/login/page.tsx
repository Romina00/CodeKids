'use client';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { FormField } from '@repo/ui/form-field';
import { Input } from '@repo/ui/input';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
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
        session.user.role === 'admin' ? '/admin' : '/select-profile',
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Login failed.');
      setPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.layout} id="main-content">
        <Link className={styles.backLink} href="/">
          ← Back to home
        </Link>
        <Logo className={styles.logo} showTagline={false} />
        <header className={styles.pageHeading}>
          <h1>Welcome back!</h1>
          <p>Log in to your parent account</p>
        </header>
        <section className={styles.formPanel}>
          {error ? (
            <Alert className={styles.error} variant="danger">
              <AlertTitle>We could not sign you in</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <form className={styles.form} onSubmit={submit}>
            <FormField label="Email" required>
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
                placeholder="••••••••"
                required
                type="password"
              />
            </FormField>
            <Button disabled={pending} size="lg" type="submit">
              {pending ? 'Signing in…' : 'Log in'}
            </Button>
          </form>
          <p className={styles.switchText}>
            Don&apos;t have an account? <Link href="/register">Sign up</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
