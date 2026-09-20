import type { HTMLAttributes } from 'react';
const styles = {
  'alert-info': 'border-l-[color:var(--color-primary)]',
  'alert-success': 'border-l-[color:var(--color-success)]',
  'alert-warning': 'border-l-[color:var(--color-warning)]',
  'alert-danger': 'border-l-[color:var(--color-danger)]',
} as const;

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export function Alert({ className, variant = 'info', ...props }: AlertProps) {
  return (
    <div
      className={[
        'p-4 text-[color:var(--color-text)] bg-[var(--color-surface-subtle)] border-[length:1px] border-solid border-[color:var(--color-border)] border-l-[length:var(--space-1)] rounded-[var(--radius-md)]',
        styles[`alert-${variant}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role={variant === 'danger' ? 'alert' : 'status'}
      {...props}
    />
  );
}

export function AlertTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={['mb-1 text-[length:var(--font-size-md)]', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </h4>
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={[
        'text-[color:var(--color-text-muted)] leading-[var(--line-height-normal)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
