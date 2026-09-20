import type { HTMLAttributes } from 'react';

function withClassName(base: string | undefined, className?: string) {
  return [base, className].filter(Boolean).join(' ');
}

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={withClassName(
        '[overflow-x:hidden] [overflow-y:hidden] text-[color:var(--card-foreground)] bg-[var(--card-background)] border-[length:1px] border-solid border-[color:var(--card-border)] rounded-[var(--card-radius)] shadow-[var(--card-shadow)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={withClassName(
        'pt-[var(--card-padding)] pr-[var(--card-padding)] pb-3 pl-[var(--card-padding)] grid gap-2',
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={withClassName(
        'text-[length:var(--font-size-xl)] leading-[var(--text-heading-line-height)]',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={withClassName(
        'text-[color:var(--color-text-muted)] leading-[var(--line-height-normal)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={withClassName(
        'pt-3 pr-[var(--card-padding)] pb-3 pl-[var(--card-padding)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={withClassName(
        'pt-3 pr-[var(--card-padding)] pb-[var(--card-padding)] pl-[var(--card-padding)] flex items-center gap-3',
        className,
      )}
      {...props}
    />
  );
}
