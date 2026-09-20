import type { HTMLAttributes } from 'react';
const styles = {
  'badge-neutral':
    'text-[color:var(--color-text)] bg-[var(--color-surface-subtle)] border-[color:var(--color-border)]',
  'badge-primary':
    'text-[color:var(--color-on-primary)] bg-[var(--color-primary)]',
  'badge-success':
    'text-[color:var(--color-on-primary)] bg-[var(--color-success)]',
  'badge-warning':
    'text-[color:var(--palette-slate-900)] bg-[var(--color-warning)]',
  'badge-danger':
    'text-[color:var(--color-on-primary)] bg-[var(--color-danger)]',
} as const;

export type BadgeVariant =
  'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'ck-components-badge inline-flex items-center min-h-[1.5rem] pt-1 pr-2 pb-1 pl-2 border-[length:1px] border-solid border-[color:transparent] rounded-[var(--radius-full)] text-[length:var(--font-size-xs)] font-semibold leading-[1]',
        styles[`badge-${variant}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
