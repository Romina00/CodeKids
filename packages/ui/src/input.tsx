import type { InputHTMLAttributes } from 'react';
import styles from './components.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={[styles.input, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
