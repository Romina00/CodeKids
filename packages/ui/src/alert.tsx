import type { HTMLAttributes } from 'react';
import styles from './components.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export function Alert({ className, variant = 'info', ...props }: AlertProps) {
  return (
    <div
      className={[styles.alert, styles[`alert-${variant}`], className]
        .filter(Boolean)
        .join(' ')}
      role={variant === 'danger' ? 'alert' : 'status'}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={[styles.alertTitle, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={[styles.alertDescription, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
