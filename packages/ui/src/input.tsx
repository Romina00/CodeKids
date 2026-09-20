import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={[
        "[transition:color_160ms_ease,_background-color_160ms_ease,_border-color_160ms_ease,_box-shadow_160ms_ease,_transform_160ms_ease] w-full min-h-[2.75rem] p-[var(--input-padding)] text-[color:var(--input-foreground)] bg-[var(--input-background)] border-[length:1px] border-solid border-[color:var(--input-border)] rounded-[var(--input-radius)] motion-reduce:[transition:none] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[2px] [&:disabled]:cursor-not-allowed [&:disabled]:opacity-[0.55] [&[aria-invalid='true']]:border-[color:var(--color-danger)]",
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
