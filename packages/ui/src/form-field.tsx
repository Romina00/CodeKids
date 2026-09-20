import { cloneElement, isValidElement, useId } from 'react';
import type { ReactElement, ReactNode } from 'react';

interface FieldControlProps {
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  id?: string;
  required?: boolean;
}

export interface FormFieldProps {
  children: ReactElement<FieldControlProps>;
  description?: ReactNode;
  error?: ReactNode;
  id?: string;
  label: ReactNode;
  required?: boolean;
}

export function FormField({
  children,
  description,
  error,
  id,
  label,
  required,
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error) || undefined,
        id: controlId,
        required,
      })
    : children;

  return (
    <div className="grid gap-2">
      <label
        className="text-[color:var(--color-text)] font-semibold"
        htmlFor={controlId}
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-[color:var(--color-danger)]">
            {' *'}
          </span>
        ) : null}
      </label>
      {control}
      {description ? (
        <p
          className="text-[length:var(--font-size-sm)] leading-[var(--line-height-normal)] text-[color:var(--color-text-muted)]"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      {error ? (
        <p
          className="text-[color:var(--color-danger)] text-[length:var(--font-size-sm)] leading-[var(--line-height-normal)]"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
