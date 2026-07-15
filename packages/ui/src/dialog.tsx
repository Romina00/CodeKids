'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentProps } from 'react';
import { Icon, X } from './icon';
import styles from './components.module.css';

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
      <DialogPrimitive.Overlay className={styles.dialogOverlay} />
      <DialogPrimitive.Content
        className={[styles.dialogContent, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Close dialog"
          className={styles.dialogClose}
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
      className={[styles.dialogTitle, className].filter(Boolean).join(' ')}
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
      className={[styles.dialogDescription, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}

export function DialogActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={[styles.dialogActions, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
