'use client';

import { FormEvent, useState } from 'react';
import {
  apiBaseUrl,
  getAccessToken,
  readApiError,
} from '../../../lib/auth-session';

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
    <main className="min-h-[100vh] p-[clamp(1.5rem,_5vw,_4rem)] bg-[#fffaf2] text-[color:#243047] [&_header]:max-w-[68rem] [&_header]:mt-[0] [&_header]:mr-[auto] [&_header]:mb-[2rem] [&_header]:ml-[auto] [&_header_p]:mt-[2rem] [&_header_p]:mr-[0] [&_header_p]:mb-[0.25rem] [&_header_p]:ml-[0] [&_header_p]:text-[color:#6d4aff] [&_header_p]:font-[number:700] [&_h1]:mt-[0] [&_h1]:mr-[0] [&_h1]:mb-[0] [&_h1]:ml-[0] [&_h1]:text-[length:clamp(2rem,_5vw,_3.5rem)] [&_a]:text-[color:inherit] [&_a:focus-visible]:[outline:3px_solid_#ffb000] [&_a:focus-visible]:outline-offset-[3px]">
      <header>
        <a href="/parent">← Parent dashboard</a>
        <p>Account settings</p>
        <h1>Keep your family account current</h1>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(min(100%,_20rem),_1fr))] gap-[1.5rem] max-w-[68rem] mt-[auto] mr-[auto] mb-[auto] ml-[auto]">
        <form
          onSubmit={saveProfile}
          className="grid gap-[1rem] [align-content:start] p-[clamp(1.25rem,_4vw,_2rem)] bg-[white] border-[length:1px] border-solid border-[color:#ded8ef] rounded-[1.5rem] shadow-[0_1rem_2.5rem_rgb(45_35_75_/_8%)] [&_h2]:mt-[0] [&_h2]:mr-[0] [&_h2]:mb-[0] [&_h2]:ml-[0] [&_p]:mt-[0] [&_p]:mr-[0] [&_p]:mb-[0] [&_p]:ml-[0] [&_label]:grid [&_label]:gap-[0.4rem] [&_label]:font-[number:700] [&_input]:min-h-[2.9rem] [&_input]:pt-[0.7rem] [&_input]:pr-[0.8rem] [&_input]:pb-[0.7rem] [&_input]:pl-[0.8rem] [&_input]:border-[length:1px] [&_input]:border-solid [&_input]:border-[color:#9991ab] [&_input]:rounded-[0.75rem] [&_input:focus-visible]:[outline:3px_solid_#ffb000] [&_input:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:[outline:3px_solid_#ffb000] [&_button:focus-visible]:outline-offset-[3px] [&_button]:min-h-[3rem] [&_button]:border-0 [&_button]:rounded-[0.85rem] [&_button]:bg-[#6246d8] [&_button]:text-[color:white] [&_button]:font-[number:800] [&_button]:cursor-pointer"
        >
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
        <form
          onSubmit={changePassword}
          className="grid gap-[1rem] [align-content:start] p-[clamp(1.25rem,_4vw,_2rem)] bg-[white] border-[length:1px] border-solid border-[color:#ded8ef] rounded-[1.5rem] shadow-[0_1rem_2.5rem_rgb(45_35_75_/_8%)] [&_h2]:mt-[0] [&_h2]:mr-[0] [&_h2]:mb-[0] [&_h2]:ml-[0] [&_p]:mt-[0] [&_p]:mr-[0] [&_p]:mb-[0] [&_p]:ml-[0] [&_label]:grid [&_label]:gap-[0.4rem] [&_label]:font-[number:700] [&_input]:min-h-[2.9rem] [&_input]:pt-[0.7rem] [&_input]:pr-[0.8rem] [&_input]:pb-[0.7rem] [&_input]:pl-[0.8rem] [&_input]:border-[length:1px] [&_input]:border-solid [&_input]:border-[color:#9991ab] [&_input]:rounded-[0.75rem] [&_input:focus-visible]:[outline:3px_solid_#ffb000] [&_input:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:[outline:3px_solid_#ffb000] [&_button:focus-visible]:outline-offset-[3px] [&_button]:min-h-[3rem] [&_button]:border-0 [&_button]:rounded-[0.85rem] [&_button]:bg-[#6246d8] [&_button]:text-[color:white] [&_button]:font-[number:800] [&_button]:cursor-pointer"
        >
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
          <p className="text-[color:#5d6575] text-[length:0.9rem]">
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
