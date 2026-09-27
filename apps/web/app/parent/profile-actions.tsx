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
import { FormEvent, useState, type ReactNode } from 'react';
import {
  apiBaseUrl,
  authorizedFetch,
  clearSession,
  getAccessToken,
  readApiError,
  saveSession,
} from '../../lib/auth-session';

export function EnterKidsMode({
  childId,
  children,
  className,
  disabled,
  onPendingChange,
}: {
  childId: number;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onPendingChange?: (pending: boolean) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function enter() {
    if (pending || disabled) return;
    setPending(true);
    onPendingChange?.(true);
    setError('');
    try {
      const response = await authorizedFetch(
        `/parents/children/${childId}/kids-mode`,
        {
          method: 'POST',
        },
      );
      if (!response.ok) throw new Error(await readApiError(response));
      const session = (await response.json()) as {
        accessToken: string;
        refreshToken: string;
        child: { id: number; nickname: string | null };
      };
      saveSession({
        ...session,
        user: {
          id: session.child.id,
          role: 'kid',
          email: null,
          displayName: null,
          nickname: session.child.nickname,
        },
      });
      window.location.assign('/profile');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Kids Mode could not start.',
      );
      setPending(false);
      onPendingChange?.(false);
    }
  }

  return (
    <div>
      <Button
        className={
          className ??
          'mt-5 min-h-11! gap-2 border-0! bg-transparent! p-0! text-[var(--color-primary)]! focus-visible:outline-offset-3!'
        }
        disabled={pending || disabled}
        aria-busy={pending}
        onClick={enter}
        variant="ghost"
      >
        {children}
        <span className="inline-flex items-center gap-2">
          {pending
            ? 'Opening…'
            : children
              ? 'Start learning'
              : 'Open Kids Mode'}{' '}
          <Icon icon={ArrowRight} size="sm" />
        </span>
      </Button>
      {error ? (
        <small className="mt-2 block text-[var(--color-danger)]" role="alert">
          {error}
        </small>
      ) : null}
    </div>
  );
}

export function AddChildProfile({
  className,
  label = 'Add child profile',
  children,
  onCreated,
}: {
  className?: string;
  label?: string;
  children?: ReactNode;
  onCreated?: () => void;
} = {}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await authorizedFetch('/parents/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: data.get('nickname'),
          birthYear: Number(data.get('birthYear')),
          avatar: data.get('avatar'),
          learningLevel: data.get('learningLevel'),
        }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      onCreated?.();
      if (!onCreated) window.location.reload();
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
        <Button
          className={
            className ??
            'max-md:w-full border-[var(--color-primary)]! px-4! focus-visible:outline-offset-3!'
          }
        >
          {children ?? label}
        </Button>
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
        <form className="grid gap-4" onSubmit={submit}>
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
          <label className="grid gap-2 font-semibold">
            Avatar
            <select
              className="min-h-11 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-text)]"
              defaultValue="robot-blue"
              name="avatar"
            >
              <option value="robot-blue">Blue profile</option>
              <option value="robot-green">Green profile</option>
              <option value="robot-orange">Orange profile</option>
            </select>
          </label>
          <label className="grid gap-2 font-semibold">
            Starting point
            <select
              className="min-h-11 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-text)]"
              defaultValue="beginner"
              name="learningLevel"
            >
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

export function EditChildProfile({
  child,
  onSaved,
}: {
  child: {
    id: number;
    nickname: string | null;
    avatar: string | null;
    birthYear: number | null;
    learningLevel: string | null;
  };
  onSaved?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await authorizedFetch(`/parents/children/${child.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: data.get('nickname'),
          birthYear: Number(data.get('birthYear')),
          avatar: data.get('avatar'),
          learningLevel: data.get('learningLevel'),
        }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      onSaved?.();
      if (!onSaved) window.location.reload();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'The profile could not be saved.',
      );
      setPending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="mt-3 min-h-10! border-[var(--color-border)]! px-3!"
          variant="outline"
        >
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit child profile</DialogTitle>
        <DialogDescription>
          Update the child profile connected to your family account.
        </DialogDescription>
        {error ? (
          <Alert variant="danger">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <form className="grid gap-4" onSubmit={submit}>
          <FormField label="Nickname" required>
            <Input
              defaultValue={child.nickname ?? ''}
              maxLength={50}
              name="nickname"
              required
            />
          </FormField>
          <FormField label="Birth year" required>
            <Input
              defaultValue={child.birthYear ?? ''}
              max={new Date().getFullYear()}
              min={2010}
              name="birthYear"
              required
              type="number"
            />
          </FormField>
          <label className="grid gap-2 font-semibold">
            Avatar
            <select
              className="min-h-11 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-text)]"
              defaultValue={child.avatar ?? 'robot-blue'}
              name="avatar"
            >
              <option value="robot-blue">Blue profile</option>
              <option value="robot-green">Green profile</option>
              <option value="robot-orange">Orange profile</option>
            </select>
          </label>
          <label className="grid gap-2 font-semibold">
            Starting point
            <select
              className="min-h-11 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-text)]"
              defaultValue={child.learningLevel ?? 'beginner'}
              name="learningLevel"
            >
              <option value="beginner">New to coding</option>
              <option value="curious">Some coding experience</option>
            </select>
          </label>
          <DialogActions>
            <Button disabled={pending} type="submit">
              {pending ? 'Saving…' : 'Save profile'}
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
