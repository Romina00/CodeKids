# Session security policy

- Access tokens are short-lived (default 15 minutes) and clients keep them only
  in memory or session-scoped storage; persistent `localStorage` is prohibited.
- Refresh tokens rotate on every use, are stored only as bcrypt hashes server-side,
  and are revoked by logout, password recovery, password/account administration,
  or account blocking. A replayed rotated token fails hash verification.
- Production web delivery should move refresh tokens to `Secure`, `HttpOnly`,
  `SameSite=Strict` cookies with CSRF protection; the current JSON-token contract
  is not approved for an unsupervised production launch.
- Login, registration, and refresh have per-client rolling-window limits. Invalid,
  malformed, wrong-type, bad-signature, and expired tokens return authorization
  errors without accepting partial payloads.
- Secret values must never be logged. TLS, proxy trust configuration, distributed
  rate-limit storage, key rotation, cookie deployment, and penetration testing
  require human security review before production.
