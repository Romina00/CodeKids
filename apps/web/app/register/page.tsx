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

export default function RegisterPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const password = String(data.get('password') ?? '');
    const confirmPassword = String(data.get('confirmPassword') ?? '');
    if (password !== confirmPassword)
      return setError('The passwords do not match.');
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register-parent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: data.get('displayName'),
          email: data.get('email'),
          password,
          confirmPassword,
        }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      const session = (await response.json()) as AuthSession;
      saveSession(session);
      window.location.assign('/select-profile');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Registration failed.',
      );
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
          <h1>Create a parent account</h1>
          <p>Set up an account to manage your kids&apos; learning</p>
        </header>
        <section className={styles.formPanel}>
          {error ? (
            <Alert className={styles.error} variant="danger">
              <AlertTitle>Please check the form</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <form className={styles.form} onSubmit={submit}>
            <FormField label="Your name" required>
              <Input
                autoComplete="name"
                maxLength={120}
                name="displayName"
                placeholder="Jane Doe"
                required
              />
            </FormField>
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
                autoComplete="new-password"
                minLength={8}
                name="password"
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
                placeholder="At least 8 characters"
                required
                type="password"
              />
            </FormField>
            <FormField label="Confirm password" required>
              <Input
                autoComplete="new-password"
                minLength={8}
                name="confirmPassword"
                placeholder="••••••••"
                required
                type="password"
              />
            </FormField>
            <Button disabled={pending} size="lg" type="submit">
              {pending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
          <p className={styles.finePrint}>
            Only parents create accounts. Kids simply pick their profile
            afterwards.
          </p>
          <p className={styles.switchText}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
