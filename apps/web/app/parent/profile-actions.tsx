'use client';

import { Alert, AlertDescription } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog';
import { FormField } from '@repo/ui/form-field';
import { ArrowRight, Icon } from '@repo/ui/icon';
import { Input } from '@repo/ui/input';
import { FormEvent, useState } from 'react';
import {
  apiBaseUrl,
  clearSession,
  getAccessToken,
  readApiError,
  saveSession,
} from '../../lib/auth-session';
import styles from './parent-dashboard.module.css';

function authorizedHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken() ?? ''}`,
  };
}

export function EnterKidsMode({ childId }: { childId: number }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function enter() {
    setPending(true);
    setError('');
    try {
      const response = await fetch(
        `${apiBaseUrl}/parents/children/${childId}/kids-mode`,
        {
          method: 'POST',
          headers: authorizedHeaders(),
        },
      );
      if (!response.ok) throw new Error(await readApiError(response));
      const session = (await response.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      saveSession(session);
      window.location.assign('/kid');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Kids Mode could not start.',
      );
      setPending(false);
    }
  }

  return (
    <div>
      <Button
        className={styles.profileAction}
        disabled={pending}
        onClick={enter}
        variant="ghost"
      >
        {pending ? 'Opening…' : 'Open Kids Mode'}{' '}
        <Icon icon={ArrowRight} size="sm" />
      </Button>
      {error ? (
        <small className={styles.actionError} role="alert">
          {error}
        </small>
      ) : null}
    </div>
  );
}

export function AddChildProfile() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${apiBaseUrl}/parents/children`, {
        method: 'POST',
        headers: authorizedHeaders(),
        body: JSON.stringify({
          nickname: data.get('nickname'),
          birthYear: Number(data.get('birthYear')),
          avatar: data.get('avatar'),
          learningLevel: data.get('learningLevel'),
        }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      window.location.reload();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'The profile could not be created.',
      );
      setPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={styles.addChild}>Add child profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a child profile</DialogTitle>
        <DialogDescription>
          Children do not need an email or password. This private profile stays
          under your parent account.
        </DialogDescription>
        {error ? (
          <Alert variant="danger">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <form className={styles.childForm} onSubmit={submit}>
          <FormField label="Nickname" required>
            <Input maxLength={50} name="nickname" required />
          </FormField>
          <FormField
            description="Used to choose age-appropriate learning content."
            label="Birth year"
            required
          >
            <Input
              max={new Date().getFullYear()}
              min={2010}
              name="birthYear"
              required
              type="number"
            />
          </FormField>
          <label>
            Avatar
            <select defaultValue="robot-blue" name="avatar">
              <option value="robot-blue">Blue robot</option>
              <option value="robot-green">Green robot</option>
              <option value="robot-orange">Orange robot</option>
            </select>
          </label>
          <label>
            Starting point
            <select defaultValue="beginner" name="learningLevel">
              <option value="beginner">New to coding</option>
              <option value="curious">Some coding experience</option>
            </select>
          </label>
          <DialogActions>
            <Button disabled={pending} type="submit">
              {pending ? 'Creating…' : 'Create profile'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ParentLogout() {
  async function logout() {
    const token = getAccessToken();
    try {
      if (token)
        await fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
    } finally {
      clearSession();
      window.location.assign('/login');
    }
  }
  return (
    <button onClick={logout} type="button">
      Log out
    </button>
  );
}
