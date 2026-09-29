'use client';

import { Badge } from '@repo/ui/badge';
import { useEffect, useState } from 'react';
import { authorizedFetch, readApiError } from '../../lib/auth-session';

type Dashboard = {
  parent: { displayName: string | null; email: string };
};

export function DashboardOverview() {
  const [name, setName] = useState('');

  useEffect(() => {
    authorizedFetch('/parents/dashboard')
      .then(async (response) => {
        if (!response.ok) throw new Error(await readApiError(response));
        return response.json() as Promise<Dashboard>;
      })
      .then((dashboard) => {
        setName(dashboard.parent.displayName || dashboard.parent.email);
      })
      .catch(() => setName(''));
  }, []);

  return (
    <div className="grid min-w-0 gap-2 max-md:w-full">
      <Badge variant="primary">Family overview </Badge>
      <h1 className="mt-2 text-[clamp(var(--font-size-2xl),5vw,3.25rem)] leading-[var(--text-heading-line-height)]">
        {name ? `Welcome back, ${name}.` : 'Welcome back.'}
      </h1>
      <p className="text-[var(--color-text-muted)] leading-[var(--line-height-relaxed)]">
        Here is a calm snapshot of how learning is going without rankings or
        pressure.
      </p>
    </div>
  );
}
