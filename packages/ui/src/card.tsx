import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return <article {...props}>{children}</article>;
}
