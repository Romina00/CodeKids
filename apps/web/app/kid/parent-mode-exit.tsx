'use client';

import { Button } from '@repo/ui/button';
import {
  clearSession,
  getAccessToken,
  apiBaseUrl,
} from '../../lib/auth-session';
import styles from './kid-dashboard.module.css';

export function ParentModeExit() {
  async function logout() {
    const accessToken = getAccessToken();
    try {
      if (accessToken) {
        await fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } finally {
      clearSession();
      window.location.assign('/login');
    }
  }

  return (
    <Button
      className={styles.parentModeButton}
      onClick={logout}
      variant="outline"
    >
      Log out of Kids Mode
    </Button>
  );
}
