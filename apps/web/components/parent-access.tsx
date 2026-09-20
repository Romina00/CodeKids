'use client';

import { Button } from '@repo/ui/button';
import { useEffect, useState, type ReactNode } from 'react';
import {
  authorizedFetch,
  getAccessToken,
  getSessionUser,
} from '../lib/auth-session';
import { Logo } from './logo';

export function ParentAccess({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState('Checking your parent session…');

  useEffect(() => {
    let active = true;
    async function checkAccess() {
      setAllowed(false);
      if (!getAccessToken() || getSessionUser()?.role !== 'parent') {
        setMessage(
          'Sign in with your parent account to view or add child profiles. Kids Mode cannot manage profiles.',
        );
        return;
      }
      try {
        const response = await authorizedFetch('/auth/me');
        if (!active) return;
        if (!response.ok) {
          setMessage('Your session has expired. Please sign in again.');
          return;
        }
        const user = (await response.json()) as { role: string };
        if (!active) return;
        if (user.role.toLowerCase() === 'parent') setAllowed(true);
        else
          setMessage(
            'Please sign in with your parent account to manage child profiles.',
          );
      } catch {
        if (active)
          setMessage(
            'Could not check your session. Please reload to try again.',
          );
      }
    }
    void checkAccess();
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) void checkAccess();
    }
    window.addEventListener('pageshow', onPageShow);
    return () => {
      active = false;
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  if (allowed) return children;
  return (
    <div className="min-h-svh pt-[2rem] pr-[1rem] pb-[2rem] pl-[1rem] bg-[#f3f7ff] max-[576px]:pt-[1rem] max-[576px]:pb-[1rem] [&::before]:fixed [&::before]:w-[4rem] [&::before]:h-[4rem] [&::before]:[content:''] [&::before]:rounded-[1rem] [&::before]:bg-[#e5efff] [&::before]:top-[12%] [&::before]:left-[15%] max-[576px]:[&::before]:hidden [&::after]:fixed [&::after]:w-[4rem] [&::after]:h-[4rem] [&::after]:[content:''] [&::after]:rounded-[50%] [&::after]:bg-[#e5f7f5] [&::after]:right-[16%] [&::after]:bottom-[10%] max-[576px]:[&::after]:hidden">
      <main
        className="relative grid [justify-items:center] w-[min(100%,_31rem)] mt-[3rem] mr-[auto] mb-[3rem] ml-[auto] max-[576px]:mt-[1rem] max-[576px]:mb-[1rem]"
        id="main-content"
      >
        <Logo
          className="mb-[1rem] [&_.logoMark]:w-[3.25rem] [&_.logoCopy]:hidden"
          showTagline={false}
        />
        <section className="w-full p-[2rem] bg-[#fff] border-[length:1px] border-solid border-[color:#d8e2ef] rounded-[1.1rem] shadow-[0_2px_5px_rgb(25_45_75_/_10%)] max-[576px]:pt-[1.25rem] max-[576px]:pr-[1.25rem] max-[576px]:pb-[1.25rem] max-[576px]:pl-[1.25rem]">
          <div className="grid gap-[1rem] [&_input]:min-h-[2.75rem] [&_input]:border-[color:#dbe6f3] [&_input]:rounded-[0.8rem] [&_input]:shadow-[0_2px_5px_rgb(30_60_90_/_5%)] [&_button]:w-full [&_button]:mt-[0.25rem] [&_button]:rounded-[0.75rem] [&_button]:bg-[#5890eb]">
            <h1>Parent access</h1>
            <p role="status">{message}</p>
            <Button onClick={() => window.location.assign('/login')}>
              Sign in as a parent
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
