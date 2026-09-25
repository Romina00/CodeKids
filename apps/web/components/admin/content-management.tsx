'use client';

import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogActions,
} from '@repo/ui/dialog';
import { Input } from '@repo/ui/input';
import { useCallback, useEffect, useState } from 'react';
import {
  type AdminLevel,
  type LevelContent,
  type ActivityContent,
  loadAdminLevels,
  saveAdminContent,
  deleteAdminContent,
} from '../../lib/admin-content';
import { ContentEditor, type ContentEditorTarget } from './content-editor';

export function ContentManagement({
  refreshVersion,
}: {
  refreshVersion: number;
}) {
  const [levels, setLevels] = useState<AdminLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [editor, setEditor] = useState<ContentEditorTarget | null>(null);
  const [deletion, setDeletion] = useState<{
    path: string;
    title: string;
    kind: 'level' | 'activity';
  } | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setLevels(await loadAdminLevels());
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Content could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload, refreshVersion]);

  async function handleSave(content: LevelContent | ActivityContent) {
    if (!editor) return;
    const editing =
      editor.kind === 'level'
        ? Boolean(editor.level)
        : Boolean(editor.activity);
    const path =
      editor.kind === 'level'
        ? editor.level
          ? `/${editor.level.id}`
          : ''
        : `/${editor.level.id}/activities${editor.activity ? `/${editor.activity.id}` : ''}`;
    setPending(true);
    try {
      await saveAdminContent(path, content, editing);
      setEditor(null);
      setMessage('Content saved.');
      await reload();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!deletion) return;
    setPending(true);
    setError('');
    try {
      await deleteAdminContent(deletion.path);
      setDeletion(null);
      setMessage('Content deleted.');
      await reload();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Content could not be deleted.',
      );
    } finally {
      setPending(false);
    }
  }

  const visibleLevels = levels.filter((level) => {
    const matchesQuery = `${level.title} ${level.slug}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return (
      matchesQuery &&
      (status === 'all' || level.published === (status === 'published'))
    );
  });

  return (
    <section aria-labelledby="content-title" className="mt-8 grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="content-title" className="text-xl font-extrabold">
            Learning content
          </h2>
          <p className="mt-1 text-[var(--color-text-muted)]">
            Manage levels, publication, and activities.
          </p>
        </div>
        <Button
          disabled={loading || pending || Boolean(error)}
          onClick={() => setEditor({ kind: 'level' })}
        >
          Add level
        </Button>
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">
        New levels start as drafts. The Kids game path displays the 15 built-in
        games; additional learning content is stored in the catalog.
      </p>
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Search learning content"
          type="search"
          placeholder="Search title or slug"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sm:max-w-sm"
        />
        <select
          aria-label="Filter publication status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-background)] p-[var(--input-padding)] text-[var(--input-foreground)]"
        >
          <option value="all">All levels</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>
      {message ? <p role="status">{message}</p> : null}
      {error && !deletion ? (
        <div role="alert" className="text-[var(--color-danger)]">
          <p>{error}</p>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => void reload()}
          >
            Try again
          </Button>
        </div>
      ) : null}
      {loading ? <p role="status">Loading content…</p> : null}
      {!loading && !error && !visibleLevels.length ? (
        <p>No learning content found.</p>
      ) : null}
      {visibleLevels.map((level) => (
        <Card key={level.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{level.title}</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {level.slug} · Position {level.position}
                </p>
              </div>
              <Badge variant={level.published ? 'success' : 'neutral'}>
                {level.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {level.description ? <p>{level.description}</p> : null}
            <p className="text-sm text-[var(--color-text-muted)]">
              Prerequisite:{' '}
              {levels.find(
                (candidate) => candidate.id === level.prerequisiteLevelId,
              )?.title ?? 'None'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={pending || loading}
                variant="outline"
                onClick={() => setEditor({ kind: 'level', level })}
                aria-label={`Edit level ${level.title}`}
              >
                Edit level
              </Button>
              <Button
                disabled={pending || loading}
                variant="outline"
                onClick={() => setEditor({ kind: 'activity', level })}
                aria-label={`Add activity to ${level.title}`}
              >
                Add activity
              </Button>
              <Button
                disabled={pending || loading}
                variant="danger"
                onClick={() => {
                  setError('');
                  setDeletion({
                    path: `/${level.id}`,
                    title: level.title,
                    kind: 'level',
                  });
                }}
                aria-label={`Delete level ${level.title}`}
              >
                Delete level
              </Button>
            </div>
            <ul
              className="divide-y divide-[var(--color-border)]"
              aria-label={`Activities in ${level.title}`}
            >
              {level.activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <strong>{activity.title}</strong>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {activity.type} · Position {activity.position} ·{' '}
                      {activity.estimatedMinutes} min
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      disabled={pending || loading}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditor({ kind: 'activity', level, activity })
                      }
                      aria-label={`Edit activity ${activity.title}`}
                    >
                      Edit
                    </Button>
                    <Button
                      disabled={pending || loading}
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setError('');
                        setDeletion({
                          path: `/${level.id}/activities/${activity.id}`,
                          title: activity.title,
                          kind: 'activity',
                        });
                      }}
                      aria-label={`Delete activity ${activity.title}`}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {!level.activities.length ? (
              <p className="text-[var(--color-text-muted)]">
                No activities yet.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
      <Dialog
        open={Boolean(editor)}
        onOpenChange={(open) => {
          if (!open && !pending) setEditor(null);
        }}
      >
        <DialogContent>
          <DialogTitle>
            {editor?.kind === 'activity'
              ? editor.activity
                ? 'Edit activity'
                : 'Add activity'
              : editor?.level
                ? 'Edit level'
                : 'Add level'}
          </DialogTitle>
          <DialogDescription>
            {editor?.kind === 'activity'
              ? `Manage an activity in ${editor.level.title}.`
              : 'Set the level details and publication status.'}
          </DialogDescription>
          {editor ? (
            <ContentEditor
              target={editor}
              levels={levels}
              pending={pending}
              onSave={handleSave}
              onCancel={() => setEditor(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(deletion)}
        onOpenChange={(open) => {
          if (!open && !pending) {
            setDeletion(null);
            setError('');
          }
        }}
      >
        <DialogContent>
          <DialogTitle>Delete {deletion?.kind}</DialogTitle>
          <DialogDescription>
            Delete “{deletion?.title}”?{' '}
            {deletion?.kind === 'level'
              ? 'Its activities and associated progress will also be deleted.'
              : 'Activities with learning progress cannot be deleted; unpublish the level instead.'}{' '}
            This cannot be undone.
          </DialogDescription>
          {error ? (
            <p role="alert" className="text-[var(--color-danger)]">
              {error}
            </p>
          ) : null}
          <DialogActions>
            <Button
              disabled={pending}
              variant="outline"
              onClick={() => setDeletion(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={pending}
              variant="danger"
              onClick={() => void handleDelete()}
            >
              {pending ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </section>
  );
}
