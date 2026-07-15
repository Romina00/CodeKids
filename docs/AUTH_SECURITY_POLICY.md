# Authentication security policy

This policy records the controls implemented for parent authentication and the decisions that require review when authentication changes.

## Current controls

- Email addresses are trimmed and lower-cased before lookup. The database also enforces a unique email constraint.
- Parent passwords must contain at least eight characters, including upper-case, lower-case, and numeric characters. Validation runs in both the request DTO and service boundary.
- Passwords and refresh tokens are hashed with bcrypt using cost factor 10. Plain-text credentials are never returned by serializers.
- Failed login attempts for an unknown email and an incorrect password use the same response, reducing account enumeration.
- Children cannot authenticate through the direct email/password endpoint.
- Access and refresh tokens use separate secrets, explicit token types, expirations, and payload validation. Only a bcrypt hash of the active refresh token is persisted.
- Logout removes the stored refresh-token hash. Refreshing replaces it with the newly issued token.
- Protected endpoints use the bearer authentication guard and are described as bearer-protected in Swagger.

## Operational requirements

- Production secrets must be high-entropy, stored outside source control, and rotated through the deployment secret manager.
- Access tokens belong only in the `Authorization: Bearer` header. Clients must keep refresh tokens in secure platform storage and never write either token to logs.
- Authentication events and rate-limit decisions must not include passwords or raw tokens.
- Changes to password rules, bcrypt cost, token lifetime, token storage, or login error wording require security review and regression tests.

## Follow-up boundary

This module provides one active refresh session per user. Broader refresh-token lifecycle hardening, including multi-device revocation and operational rotation procedures, is tracked separately in CK-055.
