'use client';

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { FormField } from '@repo/ui/form-field';
import { Icon, ShieldCheck, UsersRound } from '@repo/ui/icon';
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

export default function RegisterPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const password = String(data.get('password') ?? '');
    const confirmPassword = String(data.get('confirmPassword') ?? '');
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register-parent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          password,
          confirmPassword,
        }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      const session = (await response.json()) as AuthSession;
      saveSession(session);
      window.location.assign('/parent');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Registration failed.',
      );
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
          <Icon icon={UsersRound} size="xl" />
          <h1>One account for your whole family.</h1>
          <p>
            Create your parent account first. Inside it, you can add one
            profile—or a different private learning space for every child.
          </p>
          <ul className={styles.trustList}>
            <li>
              <Icon icon={ShieldCheck} size="sm" /> Children never register
              directly
            </li>
            <li>
              <Icon icon={ShieldCheck} size="sm" /> You choose when Kids Mode
              starts
            </li>
            <li>
              <Icon icon={ShieldCheck} size="sm" /> Parent access requires a
              fresh login
            </li>
          </ul>
        </aside>
        <section className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h2>Create parent account</h2>
            <p>You will add child profiles after creating your account.</p>
          </div>
          {error ? (
            <Alert className={styles.error} variant="danger">
              <AlertTitle>Please check the form</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <form className={styles.form} onSubmit={submit}>
            <FormField label="Parent email" required>
              <Input
                autoComplete="email"
                name="email"
                placeholder="parent@example.com"
                required
                type="email"
              />
            </FormField>
            <FormField
              description="Use at least 8 characters."
              label="Password"
              required
            >
              <Input
                autoComplete="new-password"
                minLength={8}
                name="password"
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
                required
                type="password"
              />
            </FormField>
            <div className={styles.passwordHint}>
              <span>Uppercase letter</span>
              <span>Lowercase letter</span>
              <span>One number</span>
              <span>8+ characters</span>
            </div>
            <FormField label="Confirm password" required>
              <Input
                autoComplete="new-password"
                minLength={8}
                name="confirmPassword"
                required
                type="password"
              />
            </FormField>
            <Button disabled={pending} size="lg" type="submit">
              {pending ? 'Creating account…' : 'Create parent account'}
            </Button>
          </form>
          <p className={styles.finePrint}>
            By continuing, you confirm that you are the parent or legal guardian
            managing these child profiles.
          </p>
          <p className={styles.switchText}>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </section>
      </main>
    </div>
  );
}
