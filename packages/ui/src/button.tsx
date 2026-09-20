import type { ButtonHTMLAttributes } from 'react';
const styles = {
  primary:
    'text-[color:var(--button-foreground)] bg-[var(--button-background)] [&:hover:not(:disabled)]:bg-[var(--button-background-hover)]',
  secondary:
    'text-[color:var(--color-text)] bg-[var(--color-surface-subtle)] border-[color:var(--color-border)] [&:hover:not(:disabled)]:bg-[var(--color-surface-subtle)]',
  outline:
    'text-[color:var(--color-text)] bg-[transparent] border-[color:var(--color-border)] [&:hover:not(:disabled)]:bg-[var(--color-surface-subtle)]',
  ghost:
    'text-[color:var(--color-text)] bg-[transparent] [&:hover:not(:disabled)]:bg-[var(--color-surface-subtle)]',
  danger: 'text-[color:var(--color-on-primary)] bg-[var(--color-danger)]',
  sm: 'min-h-[2rem] pt-2 pr-3 pb-2 pl-3 text-[length:var(--font-size-sm)]',
  md: 'min-h-[2.75rem] p-[var(--button-padding)]',
  lg: 'min-h-[3.25rem] pt-4 pr-6 pb-4 pl-6 text-[length:var(--font-size-lg)]',
  icon: 'w-[2.75rem] h-[2.75rem] p-0',
} as const;

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  className,
  disabled,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        '[transition:color_160ms_ease,_background-color_160ms_ease,_border-color_160ms_ease,_box-shadow_160ms_ease,_transform_160ms_ease] inline-flex items-center justify-center border-[length:1px] border-solid border-[color:transparent] rounded-[var(--button-radius)] font-semibold cursor-pointer motion-reduce:[transition:none] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[2px] [&:disabled]:cursor-not-allowed [&:disabled]:opacity-[0.55] [&:not(:disabled):active]:[transform:translateY(1px)]',
        styles[variant],
        styles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      type={type}
      {...props}
    />
  );
}
