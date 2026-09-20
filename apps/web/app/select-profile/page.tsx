'use client';

import { ArrowRight, Icon, Plus, ShieldCheck, UsersRound } from '@repo/ui/icon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChildAvatar } from '../../components/child-avatar';
import { LogoMark } from '../../components/logo';
import {
  authorizedFetch,
  getAccessToken,
  readApiError,
} from '../../lib/auth-session';
import { AddChildProfile, EnterKidsMode } from '../parent/profile-actions';

type Child = {
  id: number;
  nickname: string | null;
  avatar: string | null;
  birthYear: number | null;
  learningLevel: string | null;
};
type Dashboard = {
  parent: { displayName: string | null; email: string };
  children: Child[];
};

export default function SelectProfilePage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [status, setStatus] = useState('Loading profiles…');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return window.location.assign('/login');
    authorizedFetch('/parents/dashboard')
      .then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response));
        return response.json() as Promise<Dashboard>;
      })
      .then((data) => {
        setDashboard(data);
        setStatus('');
      })
      .catch((error: unknown) =>
        setStatus(
          error instanceof Error
            ? error.message
            : 'Profiles could not be loaded.',
        ),
      );
  }, []);

  return (
    <main
      className="min-h-svh pt-8 pr-5 pb-8 pl-5 text-[color:var(--color-text)] bg-[var(--color-surface-subtle)]"
      id="main-content"
    >
      <div className="w-[min(100%,_60rem)] mx-[auto] grid gap-10">
        <header className="flex items-center gap-3 justify-between flex-wrap">
          <div className="flex items-center gap-3 text-[length:var(--font-size-xl)] font-bold [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]">
            <LogoMark className="w-[var(--space-8)]" title="" /> CodeKids
          </div>
          <span className="flex items-center gap-3 text-[color:var(--color-text-muted)]">
            <Icon icon={ShieldCheck} size="sm" /> Parent area
          </span>
        </header>
        <div className="[&_p]:text-[color:var(--color-text-muted)] [&_small]:text-[color:var(--color-text-muted)] grid gap-3 leading-[var(--line-height-relaxed)] [&_h1]:text-[length:var(--font-size-2xl)] [&_h1]:leading-[var(--line-height-tight)]">
          <h1>Your family’s learning space</h1>
          <p>
            Choose a child’s profile to open Kids Mode, or manage learning in
            your parent dashboard.
          </p>
          {dashboard && (
            <small>
              Signed in as{' '}
              {dashboard.parent.displayName || dashboard.parent.email}
            </small>
          )}
        </div>
        <section aria-labelledby="profiles-title">
          <div className="flex items-center gap-3 justify-between flex-wrap [&_h2]:text-[length:var(--font-size-xl)]">
            <h2 id="profiles-title">Child profiles</h2>
          </div>
          {status && (
            <p className="text-[color:var(--color-text-muted)]" role="status">
              {status}
            </p>
          )}
          {dashboard?.children.length === 0 && (
            <p className="text-[color:var(--color-text-muted)]">
              Add your first child profile to start the coding adventure.
            </p>
          )}
          <div className="flex flex-wrap justify-center items-start gap-8 my-5 [&_.ck-select-profile-profile]:grid [&_.ck-select-profile-profile]:w-[9rem] [&_.ck-select-profile-profile]:[justify-items:center] [&_.ck-select-profile-profile]:gap-3 [&_.ck-select-profile-profile]:pt-2 [&_.ck-select-profile-profile]:pr-2 [&_.ck-select-profile-profile]:pb-2 [&_.ck-select-profile-profile]:pl-2 [&_.ck-select-profile-profile]:text-[color:var(--color-text)] [&_.ck-select-profile-profile]:bg-[transparent] [&_.ck-select-profile-profile]:border-0 [&_.ck-select-profile-profile]:rounded-[var(--radius-lg)] [&_.ck-select-profile-profile]:whitespace-normal [&_.ck-select-profile-addProfile]:grid [&_.ck-select-profile-addProfile]:w-[9rem] [&_.ck-select-profile-addProfile]:[justify-items:center] [&_.ck-select-profile-addProfile]:gap-3 [&_.ck-select-profile-addProfile]:pt-2 [&_.ck-select-profile-addProfile]:pr-2 [&_.ck-select-profile-addProfile]:pb-2 [&_.ck-select-profile-addProfile]:pl-2 [&_.ck-select-profile-addProfile]:text-[color:var(--color-text)] [&_.ck-select-profile-addProfile]:bg-[transparent] [&_.ck-select-profile-addProfile]:border-0 [&_.ck-select-profile-addProfile]:rounded-[var(--radius-lg)] [&_.ck-select-profile-addProfile]:whitespace-normal [&_.ck-select-profile-profile:not(:disabled):hover]:bg-[transparent] [&_.ck-select-profile-addProfile:hover]:bg-[transparent]">
            {dashboard?.children.map((child) => (
              <EnterKidsMode
                key={child.id}
                childId={child.id}
                className="ck-select-profile-profile [&:not(:disabled):hover_.ck-select-profile-avatar]:shadow-[var(--shadow-md)] [&_strong]:text-[length:var(--font-size-lg)] [&_strong]:[overflow-wrap:anywhere] [&_small]:text-[color:var(--color-text-muted)] [&_>_span:last-child]:inline-flex [&_>_span:last-child]:items-center [&_>_span:last-child]:gap-2 [&_>_span:last-child]:text-[color:var(--color-primary)]"
                disabled={isOpening}
                onPendingChange={setIsOpening}
              >
                <span className="ck-select-profile-avatar grid w-[7rem] h-[7rem] place-items-center text-[color:var(--color-on-primary)] bg-[var(--color-primary)] rounded-[var(--radius-xl)]">
                  <ChildAvatar
                    avatar={child.avatar}
                    name={child.nickname || 'Young coder'}
                  />
                </span>
                <strong>{child.nickname || 'Young coder'}</strong>
                {child.birthYear !== null && (
                  <small>Born in {child.birthYear}</small>
                )}
              </EnterKidsMode>
            ))}
            {dashboard && (
              <AddChildProfile className="ck-select-profile-addProfile [&:hover_.ck-select-profile-addAvatar]:shadow-[var(--shadow-md)]">
                <span className="ck-select-profile-addAvatar grid w-[7rem] h-[7rem] place-items-center text-[color:var(--color-text-muted)] bg-[transparent] rounded-[var(--radius-xl)] border-[length:2px] border-dashed border-[color:var(--color-border)]">
                  <Icon icon={Plus} size="xl" />
                </span>
                <span>Add profile</span>
              </AddChildProfile>
            )}
          </div>
          {dashboard && dashboard.children.length > 0 && (
            <p className="text-[color:var(--color-text-muted)] text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)]">
              Selecting a profile switches to your child’s session. Sign in
              again to return to the parent area.
            </p>
          )}
        </section>
        <Link
          href="/parent"
          className="flex items-center gap-4 p-6 text-[color:var(--color-text)] bg-[var(--color-surface)] border-[length:1px] border-solid border-[color:var(--color-primary)] rounded-[var(--radius-xl)] [&_>_span]:grid [&_>_span]:[flex:1] [&_>_span]:gap-2 [&_small]:text-[color:var(--color-text-muted)] [&_small]:leading-[var(--line-height-normal)] [&_>_svg]:shrink-[0] [&_>_svg]:text-[color:var(--color-primary)] [&:hover]:shadow-[var(--shadow-md)] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[3px]"
        >
          <Icon icon={UsersRound} size="lg" />
          <span>
            <strong>Parent dashboard</strong>
            <small>
              View each child’s progress and manage your family’s profiles.
            </small>
          </span>
          <Icon icon={ArrowRight} size="md" />
        </Link>
      </div>
    </main>
  );
}
