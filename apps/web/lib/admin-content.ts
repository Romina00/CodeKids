import { authorizedFetch, readApiError } from './auth-session';

export type ActivityContent = {
  title: string;
  description: string | null;
  type: 'LESSON' | 'BLOCKLY' | 'CHALLENGE';
  position: number;
  estimatedMinutes: number;
  content: Record<string, unknown> | null;
};

export type AdminActivity = ActivityContent & { id: number; levelId: number };

export type LevelContent = {
  title: string;
  slug: string;
  description: string | null;
  position: number;
  published: boolean;
  prerequisiteLevelId: number | null;
};

export type AdminLevel = LevelContent & {
  id: number;
  activities: AdminActivity[];
};

export async function loadAdminLevels(): Promise<AdminLevel[]> {
  const response = await authorizedFetch('/learning/levels', {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(await readApiError(response));
  return response.json() as Promise<AdminLevel[]>;
}

export async function saveAdminContent(
  path: string,
  content: LevelContent | ActivityContent,
  editing: boolean,
): Promise<void> {
  const response = await authorizedFetch(`/learning/levels${path}`, {
    method: editing ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  if (!response.ok) throw new Error(await readApiError(response));
}

export async function deleteAdminContent(path: string): Promise<void> {
  const response = await authorizedFetch(`/learning/levels${path}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(await readApiError(response));
}

export function parseActivityContent(
  value: string,
): Record<string, unknown> | null {
  if (!value.trim()) return null;
  let content: unknown;
  try {
    content = JSON.parse(value);
  } catch {
    throw new Error('Activity content must contain valid JSON.');
  }
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    throw new Error('Activity content must be a JSON object, or left empty.');
  }
  return content as Record<string, unknown>;
}
