'use client';

import { Button } from '@repo/ui/button';
import { DialogActions } from '@repo/ui/dialog';
import { FormField } from '@repo/ui/form-field';
import { Input } from '@repo/ui/input';
import { useState, type FormEvent } from 'react';
import {
  type AdminActivity,
  type AdminLevel,
  type ActivityContent,
  type LevelContent,
  parseActivityContent,
} from '../../lib/admin-content';

export type ContentEditorTarget =
  | { kind: 'level'; level?: AdminLevel }
  | { kind: 'activity'; level: AdminLevel; activity?: AdminActivity };

const controlClassName =
  'w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-background)] p-[var(--input-padding)] text-[var(--input-foreground)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]';

export function ContentEditor({
  target,
  levels,
  onSave,
  onCancel,
  pending,
}: {
  target: ContentEditorTarget;
  levels: AdminLevel[];
  onSave: (content: LevelContent | ActivityContent) => Promise<void>;
  onCancel: () => void;
  pending: boolean;
}) {
  const existing = target.kind === 'level' ? target.level : target.activity;
  const [validationError, setValidationError] = useState('');
  const builtInLevel =
    target.kind === 'level' &&
    /^game-gl([1-9]|1[0-5])$/.test(target.level?.slug ?? '');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError('');
    const fields = new FormData(event.currentTarget);
    const title = String(fields.get('title') ?? '').trim();
    if (!title) {
      setValidationError('A title is required.');
      return;
    }
    const shared = {
      title,
      description: String(fields.get('description') ?? '').trim() || null,
      position: Number(fields.get('position')),
    };
    try {
      if (target.kind === 'level') {
        await onSave({
          ...shared,
          slug: String(fields.get('slug') ?? '').trim(),
          published: fields.get('published') === 'on',
          prerequisiteLevelId: fields.get('prerequisiteLevelId')
            ? Number(fields.get('prerequisiteLevelId'))
            : null,
        });
      } else {
        await onSave({
          ...shared,
          type: fields.get('type') as ActivityContent['type'],
          estimatedMinutes: Number(fields.get('estimatedMinutes')),
          content: parseActivityContent(String(fields.get('content') ?? '')),
        });
      }
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Content could not be saved.',
      );
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <fieldset disabled={pending} className="grid gap-4">
        <FormField label="Title" required>
          <Input
            name="title"
            maxLength={120}
            defaultValue={existing?.title ?? ''}
          />
        </FormField>
        <FormField label="Description">
          <textarea
            className={controlClassName}
            name="description"
            rows={3}
            defaultValue={existing?.description ?? ''}
          />
        </FormField>
        <FormField
          label="Position"
          description={
            builtInLevel
              ? 'The position is fixed for this built-in game.'
              : 'Controls the order within the catalog or level.'
          }
          required
        >
          <Input
            name="position"
            type="number"
            min={0}
            step={1}
            readOnly={builtInLevel}
            defaultValue={
              existing?.position ??
              (target.kind === 'level'
                ? Math.max(0, ...levels.map((level) => level.position)) + 1
                : Math.max(
                    0,
                    ...target.level.activities.map(
                      (activity) => activity.position,
                    ),
                  ) + 1)
            }
          />
        </FormField>
        {target.kind === 'level' ? (
          <>
            <FormField
              label="Slug"
              description={
                builtInLevel
                  ? 'The identifier is fixed for this built-in game.'
                  : 'Use lowercase letters, numbers, and hyphens.'
              }
              required
            >
              <Input
                name="slug"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                maxLength={120}
                readOnly={builtInLevel}
                defaultValue={target.level?.slug ?? ''}
              />
            </FormField>
            <FormField label="Prerequisite level">
              <select
                name="prerequisiteLevelId"
                className={controlClassName}
                defaultValue={target.level?.prerequisiteLevelId ?? ''}
              >
                <option value="">None</option>
                {levels
                  .filter((level) => level.id !== target.level?.id)
                  .map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.title}
                    </option>
                  ))}
              </select>
            </FormField>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                defaultChecked={target.level?.published ?? false}
              />
              Published
            </label>
          </>
        ) : (
          <>
            <FormField label="Activity type" required>
              <select
                name="type"
                className={controlClassName}
                defaultValue={target.activity?.type ?? 'LESSON'}
              >
                <option value="LESSON">Lesson</option>
                <option value="BLOCKLY">Blockly</option>
                <option value="CHALLENGE">Challenge</option>
              </select>
            </FormField>
            <FormField label="Estimated minutes" required>
              <Input
                type="number"
                name="estimatedMinutes"
                min={0}
                step={1}
                defaultValue={target.activity?.estimatedMinutes ?? 5}
              />
            </FormField>
            <FormField
              label="Activity content (JSON)"
              description="Enter a JSON object. Built-in game content identifies the game and is read-only."
            >
              <textarea
                name="content"
                className={`${controlClassName} font-mono`}
                rows={6}
                readOnly={typeof target.activity?.content?.game === 'string'}
                defaultValue={
                  target.activity?.content
                    ? JSON.stringify(target.activity.content, null, 2)
                    : ''
                }
              />
            </FormField>
          </>
        )}
        {validationError ? (
          <p role="alert" className="text-[var(--color-danger)]">
            {validationError}
          </p>
        ) : null}
        <DialogActions>
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">{pending ? 'Saving…' : 'Save changes'}</Button>
        </DialogActions>
      </fieldset>
    </form>
  );
}
