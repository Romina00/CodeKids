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
        session.user.role.toLowerCase() === 'admin'
          ? '/admin'
          : '/select-profile',
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Login failed.');
      setPending(false);
    }
  }

  return (
    <div className="min-h-svh pt-[2rem] pr-[1rem] pb-[2rem] pl-[1rem] bg-[#f3f7ff] max-[576px]:pt-[1rem] max-[576px]:pb-[1rem] [&::before]:fixed [&::before]:w-[4rem] [&::before]:h-[4rem] [&::before]:[content:''] [&::before]:rounded-[1rem] [&::before]:bg-[#e5efff] [&::before]:top-[12%] [&::before]:left-[15%] max-[576px]:[&::before]:hidden [&::after]:fixed [&::after]:w-[4rem] [&::after]:h-[4rem] [&::after]:[content:''] [&::after]:rounded-[50%] [&::after]:bg-[#e5f7f5] [&::after]:right-[16%] [&::after]:bottom-[10%] max-[576px]:[&::after]:hidden">
      <main
        className="relative grid [justify-items:center] w-[min(100%,_31rem)] mt-[3rem] mr-[auto] mb-[3rem] ml-[auto] max-[576px]:mt-[1rem] max-[576px]:mb-[1rem]"
        id="main-content"
      >
        <Link
          className="[justify-self:start] mb-[1.6rem] text-[color:#667085] text-[length:0.9rem]"
          href="/"
        >
          ← Back to home
        </Link>
        <Logo
          className="mb-[1rem] [&_.logoMark]:w-[3.25rem] [&_.logoCopy]:hidden"
          showTagline={false}
        />
        <header className="mb-[1.8rem] text-center [&_h1]:text-[color:#172033] [&_h1]:text-[length:1.7rem] [&_h1]:tracking-[-0.025em] [&_p]:mt-[0.45rem] [&_p]:text-[color:#667085]">
          <h1>Welcome back!</h1>
          <p>Log in to your parent account</p>
        </header>
        <section className="w-full p-[2rem] bg-[#fff] border-[length:1px] border-solid border-[color:#d8e2ef] rounded-[1.1rem] shadow-[0_2px_5px_rgb(25_45_75_/_10%)] max-[576px]:pt-[1.25rem] max-[576px]:pr-[1.25rem] max-[576px]:pb-[1.25rem] max-[576px]:pl-[1.25rem]">
          {error ? (
            <Alert className="mb-[1rem]" variant="danger">
              <AlertTitle>We could not sign you in</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <form
            className="grid gap-[1rem] [&_input]:min-h-[2.75rem] [&_input]:border-[color:#dbe6f3] [&_input]:rounded-[0.8rem] [&_input]:shadow-[0_2px_5px_rgb(30_60_90_/_5%)] [&_button]:w-full [&_button]:mt-[0.25rem] [&_button]:rounded-[0.75rem] [&_button]:bg-[#5890eb]"
            onSubmit={submit}
          >
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
          <p className="mt-[1.15rem] text-[color:#697386] text-[length:0.86rem] text-center [&_a]:text-[color:#4f8ff2] [&_a]:font-[number:700]">
            Don&apos;t have an account? <Link href="/register">Sign up</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
