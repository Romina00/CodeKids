'use client';

import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import {
  BookOpen,
  Clock,
  Icon,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  UserRound,
  UsersRound,
} from '@repo/ui/icon';
import { Input } from '@repo/ui/input';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ContentManagement } from '../../components/admin/content-management';
import { LogoMark } from '../../components/logo';
import {
  authorizedFetch,
  clearSession,
  getUserSession,
  readApiError,
  refreshSession,
} from '../../lib/auth-session';

type Role = 'PARENT' | 'KID' | 'ADMIN';

type AdminUser = {
  id: number;
  role: Role;
  email: string | null;
  displayName: string | null;
  parentId: number | null;
  parentEmail: string | null;
  nickname: string | null;
  learningLevel: string | null;
  lastKidsModeAt: string | null;
  createdAt: string;
  blockedAt?: string | null;
  blockedReason?: string | null;
};

type Overview = {
  totals: { users: number; parents: number; children: number; admins: number };
  parents: AdminUser[];
  children: AdminUser[];
  admins: AdminUser[];
};

const roleLabels: Record<Role, string> = {
  PARENT: 'Parent',
  KID: 'Child',
  ADMIN: 'Admin',
};

function userName(user: AdminUser) {
  return user.nickname || user.displayName || user.email || `User #${user.id}`;
}

function formatDate(value: string | null) {
  if (!value) return 'Not active yet';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export default function AdminPanel() {
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>(
    'checking',
  );
  const [section, setSection] = useState('overview');
  const [contentRefreshVersion, setContentRefreshVersion] = useState(0);
  const [pending, setPending] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [message, setMessage] = useState('Loading admin data...');
  const [busyUserId, setBusyUserId] = useState<number | null>(null);

  const loadOverview = useCallback(async () => {
    const response = await authorizedFetch('/admin');
    if (!response.ok) throw new Error(await readApiError(response));
    const data = (await response.json()) as Overview;
    setOverview(data);
  }, []);

  const searchUsers = useCallback(async (nextQuery = '', nextRole = '') => {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    if (nextRole) params.set('role', nextRole);
    const suffix = params.size ? `?${params.toString()}` : '';
    const response = await authorizedFetch(`/admin/users${suffix}`);
    if (!response.ok) throw new Error(await readApiError(response));
    setUsers((await response.json()) as AdminUser[]);
  }, []);

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        const token = await refreshSession();
        if (!active) return;
        if (!token || getUserSession()?.role !== 'admin') {
          setAccess('denied');
          setMessage(
            'Please sign in with an administrator account. This session does not have administrator access.',
          );
          return;
        }
        setAccess('allowed');
        await Promise.all([loadOverview(), searchUsers()]);
        if (active) setMessage('');
      } catch (error) {
        if (active) {
          setAccess('denied');
          setMessage(
            error instanceof Error
              ? error.message
              : 'Admin data could not be loaded.',
          );
        }
      }
    }
    void initialize();
    return () => {
      active = false;
    };
  }, [loadOverview, searchUsers]);

  const children = useMemo(
    () => overview?.children ?? users.filter((user) => user.role === 'KID'),
    [overview, users],
  );
  const blockedCount = overview
    ? [...overview.parents, ...overview.children, ...overview.admins].filter(
        (user) => user.blockedAt,
      ).length
    : undefined;

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('Searching...');
    try {
      await searchUsers(query, role);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Search failed.');
    } finally {
      setPending(false);
    }
  }

  async function refreshData() {
    if (section === 'content') {
      setContentRefreshVersion((version) => version + 1);
      return;
    }
    setPending(true);
    setMessage('Refreshing...');
    try {
      await Promise.all([loadOverview(), searchUsers(query, role)]);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Refresh failed.');
    } finally {
      setPending(false);
    }
  }

  async function toggleBlocked(user: AdminUser) {
    const blocked = !user.blockedAt;
    const reason = blocked
      ? window.prompt(
          'Reason for blocking this account:',
          'Blocked by administrator',
        )
      : null;
    if (blocked && reason === null) return;

    setBusyUserId(user.id);
    try {
      const response = await authorizedFetch(`/admin/users/${user.id}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked, reason: reason || undefined }),
      });
      if (!response.ok) throw new Error(await readApiError(response));
      await Promise.all([loadOverview(), searchUsers(query, role)]);
      setMessage(`${userName(user)} was ${blocked ? 'blocked' : 'unblocked'}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Account update failed.',
      );
    } finally {
      setBusyUserId(null);
    }
  }

  async function requestRecovery(user: AdminUser) {
    if (!window.confirm(`Start password recovery for ${userName(user)}?`)) {
      return;
    }
    setBusyUserId(user.id);
    try {
      const response = await authorizedFetch(
        `/admin/users/${user.id}/password-recovery`,
        { method: 'POST' },
      );
      if (!response.ok) throw new Error(await readApiError(response));
      setMessage(`Password recovery was requested for ${userName(user)}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Recovery request failed.',
      );
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] text-[var(--color-text)]">
      <aside className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r lg:border-b-0 lg:px-6 lg:py-7">
        <div className="flex items-center justify-between lg:block">
          <div className="flex items-center gap-3 font-bold">
            <span className="w-10">
              <LogoMark title="" />
            </span>
            <span>CodeKids Admin</span>
          </div>
          <Badge variant="primary">Admin</Badge>
        </div>
        <nav
          aria-label="Admin panel"
          className="mt-4 flex gap-2 overflow-x-auto lg:mt-10 lg:grid"
        >
          {[
            { id: 'overview', label: 'Dashboard', icon: ShieldCheck },
            { id: 'users', label: 'Users', icon: UsersRound },
            { id: 'progress', label: 'Learning', icon: BookOpen },
            { id: 'content', label: 'Content', icon: BookOpen },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={section === item.id ? 'page' : undefined}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-left ${
                section === item.id
                  ? 'bg-[var(--color-primary)] font-semibold text-[var(--color-on-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
              }`}
            >
              <Icon icon={item.icon} size="sm" /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main
        className="mx-auto max-w-7xl px-5 py-8 lg:ml-64 lg:px-10 lg:py-10"
        id="main-content"
        tabIndex={-1}
      >
        <header
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          id="overview"
        >
          <div>
            <p className="text-sm font-bold text-[var(--color-primary)]">
              ADMIN PANEL
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              {section === 'content'
                ? 'Content management'
                : section === 'users'
                  ? 'User management'
                  : section === 'progress'
                    ? "Children's learning"
                    : 'Platform overview'}
            </h1>
            <p className="mt-2 text-[var(--color-text-muted)]">
              The essentials for managing CodeKids.
            </p>
          </div>
          <Button
            disabled={access !== 'allowed' || pending}
            onClick={() => void refreshData()}
            variant="outline"
          >
            <span className="flex items-center gap-2">
              <Icon icon={RotateCcw} size="sm" /> Refresh
            </span>
          </Button>
        </header>

        {message ? (
          <p
            className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm"
            role="status"
          >
            {message}
          </p>
        ) : null}

        {access === 'denied' ? (
          <Button
            className="mt-4"
            onClick={() => {
              clearSession();
              window.location.assign('/login');
            }}
          >
            Sign in as administrator
          </Button>
        ) : null}

        {access === 'allowed' ? (
          <>
            {section === 'content' ? (
              <ContentManagement refreshVersion={contentRefreshVersion} />
            ) : null}
            <section
              hidden={section !== 'overview'}
              aria-label="Platform statistics"
              className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <MetricCard
                icon={UsersRound}
                label="Parents"
                tone="bg-blue-500/10 text-[var(--color-primary)]"
                value={overview?.totals.parents}
              />
              <MetricCard
                icon={UserRound}
                label="Children"
                tone="bg-green-500/10 text-[var(--color-success)]"
                value={overview?.totals.children}
              />
              <MetricCard
                icon={LockKeyhole}
                label="Blocked accounts"
                tone="bg-amber-500/10 text-[var(--color-warning)]"
                value={blockedCount}
              />
              <MetricCard
                icon={ShieldCheck}
                label="Total users"
                tone="bg-violet-500/10 text-violet-500"
                value={overview?.totals.users}
              />
            </section>

            <section
              hidden={section !== 'overview' && section !== 'users'}
              aria-labelledby="users-title"
              className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-6"
              id="users"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold" id="users-title">
                    Users
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Search accounts and manage access.
                  </p>
                </div>
                <form
                  className="flex flex-col gap-2 sm:flex-row"
                  onSubmit={handleSearch}
                >
                  <Input
                    aria-label="Search users"
                    className="sm:w-64"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Name or email"
                    type="search"
                    value={query}
                  />
                  <select
                    aria-label="Filter by role"
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
                    onChange={(event) =>
                      setRole(event.target.value as Role | '')
                    }
                    value={role}
                  >
                    <option value="">All roles</option>
                    <option value="PARENT">Parents</option>
                    <option value="KID">Children</option>
                    <option value="ADMIN">Admins</option>
                  </select>
                  <Button disabled={pending} type="submit">
                    {pending ? 'Loading…' : 'Search'}
                  </Button>
                </form>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="border-b border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                    <tr>
                      <th className="px-3 py-3" scope="col">
                        User
                      </th>
                      <th className="px-3 py-3" scope="col">
                        Role
                      </th>
                      <th className="px-3 py-3" scope="col">
                        Status
                      </th>
                      <th className="px-3 py-3" scope="col">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-3 py-4">
                          <strong className="block">{userName(user)}</strong>
                          <small className="text-[var(--color-text-muted)]">
                            {user.email ||
                              user.parentEmail ||
                              `Account #${user.id}`}
                          </small>
                        </td>
                        <td className="px-3 py-4">{roleLabels[user.role]}</td>
                        <td className="px-3 py-4">
                          <Badge
                            variant={user.blockedAt ? 'danger' : 'success'}
                          >
                            {user.blockedAt ? 'Blocked' : 'Active'}
                          </Badge>
                          {user.blockedReason ? (
                            <small className="mt-1 block max-w-56 text-[var(--color-text-muted)]">
                              {user.blockedReason}
                            </small>
                          ) : null}
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              disabled={busyUserId === user.id}
                              onClick={() => void toggleBlocked(user)}
                              size="sm"
                              variant={user.blockedAt ? 'outline' : 'danger'}
                            >
                              <span className="flex items-center gap-2">
                                <Icon icon={LockKeyhole} size="sm" />
                                {user.blockedAt ? 'Unblock' : 'Block'}
                              </span>
                            </Button>
                            {user.role === 'PARENT' ? (
                              <Button
                                disabled={busyUserId === user.id}
                                onClick={() => void requestRecovery(user)}
                                size="sm"
                                variant="ghost"
                              >
                                <span className="flex items-center gap-2">
                                  <Icon icon={KeyRound} size="sm" /> Recovery
                                </span>
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!users.length && !message ? (
                  <p className="py-8 text-center text-[var(--color-text-muted)]">
                    No users found.
                  </p>
                ) : null}
              </div>
            </section>

            <section
              hidden={section !== 'overview' && section !== 'progress'}
              aria-labelledby="progress-title"
              className="mt-8"
              id="progress"
            >
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-extrabold" id="progress-title">
                    Children&apos;s learning
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Current level and most recent activity.
                  </p>
                </div>
                <Badge variant="neutral">
                  {overview ? `${children.length} children` : 'Not loaded'}
                </Badge>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {children.map((child) => (
                  <Card className="shadow-sm" key={child.id}>
                    <CardHeader className="flex-row items-center justify-between">
                      <span className="flex items-center gap-3">
                        <span className="rounded-full bg-blue-500/10 p-3 text-[var(--color-primary)]">
                          <Icon icon={UserRound} />
                        </span>
                        <span>
                          <CardTitle>{userName(child)}</CardTitle>
                          <small className="text-[var(--color-text-muted)]">
                            {child.parentEmail ||
                              `Parent #${child.parentId ?? '—'}`}
                          </small>
                        </span>
                      </span>
                      <Badge variant="primary">
                        {child.learningLevel || 'Beginner'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                        <Icon icon={Clock} size="sm" /> Last active:{' '}
                        {formatDate(child.lastKidsModeAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {!children.length && !message ? (
                <Card className="mt-5">
                  <CardContent className="text-center text-[var(--color-text-muted)]">
                    No child profiles found.
                  </CardContent>
                </Card>
              ) : null}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: Parameters<typeof Icon>[0]['icon'];
  label: string;
  tone: string;
  value: number | undefined;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4">
        <span className={`rounded-xl p-3 ${tone}`}>
          <Icon icon={icon} size="lg" />
        </span>
        <span>
          <strong className="block text-2xl">{value ?? '—'}</strong>
          <small className="text-[var(--color-text-muted)]">{label}</small>
        </span>
      </CardContent>
    </Card>
  );
}
