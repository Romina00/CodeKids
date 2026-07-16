'use client';

import { FormEvent, useState } from 'react';
import {
  apiBaseUrl,
  getAccessToken,
  readApiError,
} from '../../../lib/auth-session';
import styles from './settings.module.css';

async function api(path: string, body: object) {
  const token = getAccessToken();
  if (!token)
    throw new Error('Your parent session has expired. Please sign in again.');
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export default function ParentSettingsPage() {
  const [profileStatus, setProfileStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileStatus('Saving…');
    const data = new FormData(event.currentTarget);
    try {
      await api('/parents/account/profile', {
        displayName: data.get('displayName'),
        email: data.get('email'),
      });
      setProfileStatus('Profile saved.');
    } catch (error) {
      setProfileStatus(error instanceof Error ? error.message : 'Save failed.');
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordStatus('Saving…');
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await api('/parents/account/password', {
        currentPassword: data.get('currentPassword'),
        newPassword: data.get('newPassword'),
        confirmPassword: data.get('confirmPassword'),
      });
      form.reset();
      setPasswordStatus('Password changed.');
    } catch (error) {
      setPasswordStatus(
        error instanceof Error ? error.message : 'Save failed.',
      );
    }
  }

  return (
    <main className={styles.page}>
      <header>
        <a href="/parent">← Parent dashboard</a>
        <p>Account settings</p>
        <h1>Keep your family account current</h1>
      </header>
      <div className={styles.grid}>
        <form onSubmit={saveProfile} className={styles.card}>
          <h2>Parent profile</h2>
          <label>
            Display name
            <input
              name="displayName"
              maxLength={120}
              autoComplete="name"
              required
            />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button type="submit">Save profile</button>
          <p role="status" aria-live="polite">
            {profileStatus}
          </p>
        </form>
        <form onSubmit={changePassword} className={styles.card}>
          <h2>Change password</h2>
          <label>
            Current password
            <input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <label>
            New password
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <p className={styles.hint}>
            Use at least eight characters with uppercase, lowercase, and a
            number.
          </p>
          <button type="submit">Change password</button>
          <p role="status" aria-live="polite">
            {passwordStatus}
          </p>
        </form>
      </div>
    </main>
  );
}
