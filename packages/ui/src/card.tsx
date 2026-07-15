import type { HTMLAttributes } from 'react';
import styles from './components.module.css';

function withClassName(base: string | undefined, className?: string) {
  return [base, className].filter(Boolean).join(' ');
}

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article className={withClassName(styles.card, className)} {...props} />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={withClassName(styles.cardHeader, className)} {...props} />
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={withClassName(styles.cardTitle, className)} {...props}>
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
      className={withClassName(styles.cardDescription, className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={withClassName(styles.cardContent, className)} {...props} />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={withClassName(styles.cardFooter, className)} {...props} />
  );
}
