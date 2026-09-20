import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

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
      className={['', className].filter(Boolean).join(' ')}
      {...props}
    >
      <ul className="flex flex-wrap items-center gap-2 p-0 mt-0 mr-0 mb-0 ml-0 list-none">
        {children}
      </ul>
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
        '[transition:color_160ms_ease,_background-color_160ms_ease,_border-color_160ms_ease,_box-shadow_160ms_ease,_transform_160ms_ease] inline-flex items-center min-h-[2.5rem] pt-2 pr-3 pb-2 pl-3 text-[color:var(--color-text-muted)] rounded-[var(--radius-control)] motion-reduce:[transition:none] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[2px] [&:hover]:text-[color:var(--color-text)] [&:hover]:bg-[var(--color-surface-subtle)]',
        current
          ? 'text-[color:var(--color-text)] bg-[var(--color-surface-subtle)]'
          : '',
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
