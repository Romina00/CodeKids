import type { HTMLAttributes } from 'react';
import styles from './components.module.css';

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
      className={[styles.badge, styles[`badge-${variant}`], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
