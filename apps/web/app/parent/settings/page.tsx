'use client';

import { Button } from '@repo/ui/button';
import { FormField } from '@repo/ui/form-field';
import { Input } from '@repo/ui/input';
import { FormEvent, useEffect, useState } from 'react';
import {
  apiBaseUrl,
  authorizedFetch,
  getAccessToken,
  readApiError,
} from '../../../lib/auth-session';

type ParentProfile = {
  displayName: string | null;
  email: string;
};

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
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  useEffect(() => {
    authorizedFetch('/parents/dashboard')
      .then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response));
        return response.json() as Promise<{ parent: ParentProfile }>;
      })
      .then((dashboard) => setParent(dashboard.parent))
      .catch((error: unknown) => {
        setProfileStatus(
          error instanceof Error
            ? error.message
            : 'Profile could not be loaded.',
        );
      });
  }, []);

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
    <main className="min-h-[100vh] p-[clamp(1.5rem,_5vw,_4rem)] bg-[#fffaf2] text-[color:#243047] [&_header]:max-w-[68rem] [&_header]:mt-[0] [&_header]:mr-[auto] [&_header]:mb-[2rem] [&_header]:ml-[auto] [&_header_p]:mt-[2rem] [&_header_p]:mr-[0] [&_header_p]:mb-[0.25rem] [&_header_p]:ml-[0] [&_header_p]:text-[color:#6d4aff] [&_header_p]:font-[number:700] [&_h1]:mt-[0] [&_h1]:mr-[0] [&_h1]:mb-[0] [&_h1]:ml-[0] [&_h1]:text-[length:clamp(2rem,_5vw,_3.5rem)] [&_a]:text-[color:inherit] [&_a:focus-visible]:[outline:3px_solid_#ffb000] [&_a:focus-visible]:outline-offset-[3px]">
      <header>
        <a href="/parent">← Parent dashboard</a>
        <p>Account settings</p>
        <h1>Keep your family account current</h1>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(100%,_20rem),_1fr))] gap-[1.5rem] max-w-[68rem] mt-[auto] mr-[auto] mb-[auto] ml-[auto]">
        <form
          key={parent ? `${parent.email}-${parent.displayName}` : 'loading'}
          onSubmit={saveProfile}
          className="grid gap-[1rem] [align-content:start] p-[clamp(1.25rem,_4vw,_2rem)] bg-[white] border-[length:1px] border-solid border-[color:#ded8ef] rounded-[1.5rem] shadow-[0_1rem_2.5rem_rgb(45_35_75_/_8%)] [&_h2]:mt-[0] [&_h2]:mr-[0] [&_h2]:mb-[0] [&_h2]:ml-[0] [&_p]:mt-[0] [&_p]:mr-[0] [&_p]:mb-[0] [&_p]:ml-[0]"
        >
          <h2>Parent profile</h2>
          <FormField label="Display name" required>
            <Input
              defaultValue={parent?.displayName ?? ''}
              name="displayName"
              maxLength={120}
              autoComplete="name"
              required
            />
          </FormField>
          <FormField label="Email" required>
            <Input
              defaultValue={parent?.email ?? ''}
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </FormField>
          <Button type="submit">Save profile</Button>
          <p role="status" aria-live="polite">
            {profileStatus}
          </p>
        </form>
        <form
          onSubmit={changePassword}
          className="grid gap-[1rem] [align-content:start] p-[clamp(1.25rem,_4vw,_2rem)] bg-[white] border-[length:1px] border-solid border-[color:#ded8ef] rounded-[1.5rem] shadow-[0_1rem_2.5rem_rgb(45_35_75_/_8%)] [&_h2]:mt-[0] [&_h2]:mr-[0] [&_h2]:mb-[0] [&_h2]:ml-[0] [&_p]:mt-[0] [&_p]:mr-[0] [&_p]:mb-[0] [&_p]:ml-[0]"
        >
          <h2>Change password</h2>
          <FormField label="Current password" required>
            <Input
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </FormField>
          <FormField label="New password" required>
            <Input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </FormField>
          <FormField label="Confirm new password" required>
            <Input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </FormField>
          <p className="text-[color:#5d6575] text-[length:0.9rem]">
            Use at least eight characters with uppercase, lowercase, and a
            number.
          </p>
          <Button type="submit">Change password</Button>
          <p role="status" aria-live="polite">
            {passwordStatus}
          </p>
        </form>
      </div>
    </main>
  );
}
