import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import styles from './components.module.css';

export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  label: string;
}

export function Navigation({
  children,
  className,
  label,
  ...props
}: NavigationProps) {
  return (
    <nav
      aria-label={label}
      className={[styles.navigation, className].filter(Boolean).join(' ')}
      {...props}
    >
      <ul className={styles.navigationList}>{children}</ul>
    </nav>
  );
}

export function NavigationItem({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export interface NavigationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  current?: boolean;
}

export function NavigationLink({
  children,
  className,
  current,
  ...props
}: NavigationLinkProps) {
  return (
    <a
      aria-current={current ? 'page' : undefined}
      className={[
        styles.navigationLink,
        current ? styles.navigationLinkCurrent : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </a>
  );
}
