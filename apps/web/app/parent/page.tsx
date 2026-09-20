import { Badge } from '@repo/ui/badge';
import { ArrowRight, Icon, Settings, ShieldCheck } from '@repo/ui/icon';
import { LogoMark } from '../../components/logo';
import { AddChildProfile, ParentLogout } from './profile-actions';
import { ChildProfiles } from './child-profiles';

export default function ParentDashboard() {
  return (
    <div className="min-h-svh bg-[var(--color-surface-subtle)]">
      <header className="flex min-h-19 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-[max(var(--space-5),calc((100%-76rem)/2))] max-md:flex-col max-md:items-start max-md:p-4">
        <div className="flex items-center gap-2 font-bold">
          <LogoMark className="w-10" title="" />
          <span>CodeKids Parent</span>
        </div>
        <nav
          aria-label="Parent account"
          className="flex items-center gap-5 max-md:w-full max-md:overflow-x-auto"
        >
          <a
            className="flex min-h-11 items-center text-sm font-semibold text-[var(--color-text-muted)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus-ring)]"
            href="#children"
          >
            Children
          </a>
          <a
            className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus-ring)]"
            href="#settings"
          >
            <Icon icon={Settings} size="sm" /> Settings
          </a>
          <ParentLogout />
        </nav>
      </header>

      <main
        className="mx-auto grid grid-cols-[minmax(0,1fr)] w-[min(76rem,calc(100%-var(--space-8)))] gap-12 pt-10 pb-16 max-md:w-[calc(100%-var(--space-5))]"
        id="main-content"
        tabIndex={-1}
      >
        <section className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start">
          <div className="grid min-w-0 gap-2 max-md:w-full">
            <Badge variant="primary">Family overview</Badge>
            <h1 className="mt-2 text-[clamp(var(--font-size-2xl),5vw,3.25rem)] leading-[var(--text-heading-line-height)]">
              Welcome back.
            </h1>
            <p className="text-[var(--color-text-muted)] leading-[var(--line-height-relaxed)]">
              Here is a calm snapshot of how learning is going—without rankings
              or pressure.
            </p>
          </div>
          <AddChildProfile />
        </section>

        <section
          aria-labelledby="children-title"
          className="grid scroll-mt-6 gap-5"
          id="children"
        >
          <ChildProfiles />
        </section>

        <section
          aria-labelledby="settings-title"
          className="flex items-center justify-between gap-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 max-md:flex-col max-md:items-start"
          id="settings"
        >
          <Icon
            icon={ShieldCheck}
            size="lg"
            className="text-[var(--color-primary)]"
          />
          <div className="mr-auto grid gap-1">
            <h2
              id="settings-title"
              className="text-[length:var(--font-size-2xl)] leading-[var(--text-heading-line-height)]"
            >
              Family controls
            </h2>
            <p className="text-[var(--color-text-muted)] leading-[var(--line-height-relaxed)]">
              Manage child profiles, privacy choices, and account security in
              one place.
            </p>
          </div>
          <a
            className="flex items-center gap-2 font-semibold text-[var(--color-primary)]! focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-focus-ring)]"
            href="/parent/settings"
          >
            Manage settings <Icon icon={ArrowRight} size="sm" />
          </a>
        </section>
      </main>
    </div>
  );
}
