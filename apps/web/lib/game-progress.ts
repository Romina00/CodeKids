import { apiBaseUrl, getAccessToken } from './auth-session';

export type GameLevel = {
  id: number;
  slug: string;
  title: string;
  position: number;
  completed: boolean;
  unlocked: boolean;
  activities: {
    id: number;
    completed: boolean;
    content: { game?: string } | null;
  }[];
};

export async function loadGameLevels(): Promise<GameLevel[]> {
  const token = getAccessToken();
  if (!token) throw new Error('Please log in again.');
  const response = await fetch(`${apiBaseUrl}/learning/levels`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Could not load progress.');
  const levels = (await response.json()) as GameLevel[];
  return levels.filter((level) => level.slug === `game-gl${level.position}`);
}
