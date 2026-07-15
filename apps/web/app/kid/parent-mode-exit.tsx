'use client';

import { Button } from '@repo/ui/button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog';
import { Input } from '@repo/ui/input';
import { FormEvent, useState } from 'react';
import styles from './kid-dashboard.module.css';

const apiBaseUrl =
  process.env.NEXT_PUBLIC_CODEKIDS_API_URL ?? 'http://localhost:3000';

export function ParentModeExit() {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setPending(true);
    const data = new FormData(event.currentTarget);
    const accessToken = sessionStorage.getItem('codekids.accessToken');

    try {
      const response = await fetch(`${apiBaseUrl}/auth/parent-mode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`,
        },
        body: JSON.stringify({ password: data.get('password') }),
      });
      if (!response.ok) {
        throw new Error('The parent password could not be verified.');
      }
      const session = (await response.json()) as {
        accessToken: string;
        refreshToken: string;
        redirectTo: string;
      };
      sessionStorage.setItem('codekids.accessToken', session.accessToken);
      sessionStorage.setItem('codekids.refreshToken', session.refreshToken);
      window.location.assign(session.redirectTo);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={styles.parentModeButton} variant="outline">
          Parent mode
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Return to Parent Mode</DialogTitle>
        <DialogDescription>
          A parent must enter their password before family settings become
          available.
        </DialogDescription>
        <form className={styles.parentModeForm} onSubmit={submit}>
          <label htmlFor="parent-mode-password">Parent password</label>
          <Input
            autoComplete="current-password"
            id="parent-mode-password"
            minLength={8}
            name="password"
            required
            type="password"
          />
          {error ? (
            <p
              aria-live="polite"
              className={styles.parentModeError}
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <DialogActions>
            <Button disabled={pending} type="submit">
              {pending ? 'Verifying…' : 'Unlock Parent Mode'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
