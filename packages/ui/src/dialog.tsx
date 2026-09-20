'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentProps } from 'react';
import { Icon, X } from './icon';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  children,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed [inset:0] z-[50] bg-[color-mix(in_srgb,_var(--palette-black)_55%,_transparent)]" />
      <DialogPrimitive.Content
        className={[
          'fixed top-[50%] left-[50%] z-[51] grid w-[min(calc(100%_-_var(--space-8)),_32rem)] max-h-[calc(100svh_-_var(--space-8))] gap-4 p-6 [overflow-x:auto] [overflow-y:auto] text-[color:var(--color-text)] bg-[var(--color-surface)] border-[length:1px] border-solid border-[color:var(--color-border)] rounded-[var(--radius-surface)] shadow-[var(--shadow-lg)] [transform:translate(-50%,_-50%)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Close dialog"
          className="[transition:color_160ms_ease,_background-color_160ms_ease,_border-color_160ms_ease,_box-shadow_160ms_ease,_transform_160ms_ease] inline-flex items-center justify-center border-[length:1px] border-solid border-[color:transparent] rounded-[var(--button-radius)] font-semibold cursor-pointer absolute top-[var(--space-3)] right-[var(--space-3)] w-[2rem] h-[2rem] text-[color:var(--color-text-muted)] bg-[transparent] motion-reduce:[transition:none] [&:focus-visible]:[outline:3px_solid_var(--color-focus-ring)] [&:focus-visible]:outline-offset-[2px] [&:hover]:text-[color:var(--color-text)] [&:hover]:bg-[var(--color-surface-subtle)]"
        >
          <Icon icon={X} size="sm" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={[
        'pr-8 text-[length:var(--font-size-xl)] leading-[var(--text-heading-line-height)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={[
        'text-[color:var(--color-text-muted)] leading-[var(--line-height-normal)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}

export function DialogActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={['flex flex-wrap justify-end gap-3 mt-2', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
