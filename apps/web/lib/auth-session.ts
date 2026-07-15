export type SessionUser = {
  id: number;
  role: 'parent' | 'kid' | 'admin';
  email: string | null;
  displayName: string | null;
  nickname: string | null;
};

export type AuthSession = {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
  redirectTo?: string;
};

const ACCESS_TOKEN = 'codekids.accessToken';
const REFRESH_TOKEN = 'codekids.refreshToken';
const USER = 'codekids.user';

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_CODEKIDS_API_URL ?? 'http://localhost:3001';

export function saveSession(
  session: Pick<AuthSession, 'accessToken' | 'refreshToken'> & {
    user?: SessionUser;
  },
) {
  window.sessionStorage.setItem(ACCESS_TOKEN, session.accessToken);
  window.sessionStorage.setItem(REFRESH_TOKEN, session.refreshToken);
  if (session.user) {
    window.sessionStorage.setItem(USER, JSON.stringify(session.user));
  } else {
    window.sessionStorage.removeItem(USER);
  }
}

export function getAccessToken() {
  return window.sessionStorage.getItem(ACCESS_TOKEN);
}

export function clearSession() {
  window.sessionStorage.removeItem(ACCESS_TOKEN);
  window.sessionStorage.removeItem(REFRESH_TOKEN);
  window.sessionStorage.removeItem(USER);
  // Remove keys used by the earliest frontend draft as well.
  window.sessionStorage.removeItem('codekids_access_token');
  window.sessionStorage.removeItem('codekids_refresh_token');
}

export async function readApiError(response: Response) {
  const fallback = 'Something went wrong. Please try again.';
  try {
    const data = (await response.json()) as {
      message?: string | string[];
      error?: { message?: string };
    };
    const message = data.error?.message ?? data.message;
    return Array.isArray(message)
      ? (message[0] ?? fallback)
      : (message ?? fallback);
  } catch {
    return fallback;
  }
}
