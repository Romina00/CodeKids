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

type ApiSessionUser = Omit<SessionUser, 'role'> & {
  role: SessionUser['role'] | Uppercase<SessionUser['role']>;
};

const ACCESS_TOKEN = 'codekids.accessToken';
const REFRESH_TOKEN = 'codekids.refreshToken';
const USER = 'codekids.user';

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_CODEKIDS_API_URL ?? 'http://localhost:3001';

function normalizeUser(user: ApiSessionUser): SessionUser {
  return {
    ...user,
    role: user.role.toLowerCase() as SessionUser['role'],
  };
}

export function saveSession(
  session: Pick<AuthSession, 'accessToken' | 'refreshToken'> & {
    user?: ApiSessionUser;
  },
) {
  window.sessionStorage.setItem(ACCESS_TOKEN, session.accessToken);
  window.sessionStorage.setItem(REFRESH_TOKEN, session.refreshToken);
  if (session.user) {
    window.sessionStorage.setItem(
      USER,
      JSON.stringify(normalizeUser(session.user)),
    );
  } else {
    window.sessionStorage.removeItem(USER);
  }
}

export function getAccessToken() {
  return window.sessionStorage.getItem(ACCESS_TOKEN);
}

function getRefreshToken() {
  return window.sessionStorage.getItem(REFRESH_TOKEN);
}

export function getSessionUser(): SessionUser | null {
  const value = window.sessionStorage.getItem(USER);
  if (!value) return null;
  try {
    return normalizeUser(JSON.parse(value) as ApiSessionUser);
  } catch {
    return null;
  }
}

export function clearSession() {
  window.sessionStorage.removeItem(ACCESS_TOKEN);
  window.sessionStorage.removeItem(REFRESH_TOKEN);
  window.sessionStorage.removeItem(USER);
  // Remove keys used by the earliest frontend draft as well.
  window.sessionStorage.removeItem('codekids_access_token');
  window.sessionStorage.removeItem('codekids_refresh_token');
}

let pendingRefresh: Promise<string | null> | null = null;

export function refreshSession(): Promise<string | null> {
  if (!pendingRefresh) {
    pendingRefresh = requestSessionRefresh().finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
}

async function requestSessionRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearSession();
      return null;
    }
    throw new Error(await readApiError(response));
  }

  const session = (await response.json()) as AuthSession;
  saveSession(session);
  return session.accessToken;
}

export async function authorizedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();
  if (!token) throw new Error('Please log in again.');

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
  });
  if (response.status !== 401) return response;

  const nextToken = await refreshSession();
  if (!nextToken) return response;

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set('Authorization', `Bearer ${nextToken}`);
  return fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: retryHeaders,
  });
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
