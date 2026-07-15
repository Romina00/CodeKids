# CodeKids Repository Gap Analysis

This audit compares the repository as of 2026-07-15 with the target scope in
[`Dokument_EN.md`](./Dokument_EN.md). It records implementation gaps and likely
starter artifacts without deleting or restructuring files.

## Executive Summary

The repository has a credible NestJS modular skeleton for authentication,
users, parents, learning, administration, and uploads. Parent registration,
JWT/refresh-token handling, child profiles, Kids Mode token issuance, and a
basic parent dashboard have substantive service logic. The main delivery gap is
that the web application and most learning, upload, administration, persistence,
and test behavior remain prototypes or placeholders.

## Current Structure

| Area      | Current state                                                                           | Evidence                                     |
| --------- | --------------------------------------------------------------------------------------- | -------------------------------------------- |
| Monorepo  | npm workspaces with Turborepo tasks for build, lint, and type checking                  | `package.json`, `turbo.json`                 |
| Web       | Next.js application showing a logo showcase only                                        | `apps/web/app/page.tsx`                      |
| API       | NestJS modules for auth, users, parents, learning, admin, and upload                    | `apps/api/src/app.module.ts`                 |
| Database  | TypeORM/MySQL configured; only User, Invitation, Progress, and Reward are real entities | `apps/api/src/app.module.ts`, entity files   |
| Shared UI | Three starter-level components: Button, Card, and Code                                  | `packages/ui/src/`                           |
| Quality   | ESLint, Prettier, TypeScript checks, and a pre-commit hook exist                        | workspace package files, `.husky/pre-commit` |

## Implemented Foundations

- Parent registration and login validate credentials, hash passwords, and issue
  access/refresh tokens.
- Refresh-token hashes are stored and checked, and logout revokes the stored
  token.
- Parent-owned child profiles, invitation acceptance, Kids Mode tokens, parent
  profile updates, and password changes have service implementations.
- Progress and reward records are aggregated into a basic parent dashboard.
- Role and JWT guards exist and are applied to protected parent/admin routes.
- Swagger bootstrap and configuration modules are present.

These foundations should be hardened and tested rather than rewritten.

## Gaps Against `Dokument_EN.md`

### P0 — Delivery and security blockers

1. **Database lifecycle is unsafe for production.** `synchronize: true` is
   enabled and there is no migrations directory or migration command. Replace
   synchronization with reviewed TypeORM migrations before shared deployment.
2. **Learning persistence is incomplete.** `LevelEntity`, `ActivityEntity`, and
   `AchievementEntity` are plain placeholder classes, are not registered as
   TypeORM entities, and have no relationships or repositories.
3. **Learning services are placeholders.** Levels echoes the request DTO,
   quizzes echo submissions, progress echoes updates, and rewards always returns
   an empty array. No Blockly, scoring, XP, achievement, prerequisite, or
   skip-level behavior is implemented.
4. **Upload is a stub.** The endpoint returns `{ uploaded: true }` without file
   handling, validation, storage, ownership checks, or deletion.
5. **Frontend product flows are absent.** The current page is a logo preview;
   landing, registration/login, parent, child, Kids Mode, and admin screens and
   API integration are not implemented.
6. **API boundary validation is weak.** Several controllers accept inline object
   types and learning DTOs contain fields without runtime validation decorators.
   A global validation pipe is not configured.
7. **Security configuration needs hardening.** JWT secrets have development
   fallbacks, invitation requests lack rate limiting/abuse controls, and refresh
   sessions do not yet support multiple devices, explicit token identifiers, or
   an audit trail.

### P1 — Required product capabilities

1. Admin behavior is limited to an overview; user blocking, password recovery,
   level/content management, landing content management, and platform
   configuration are absent.
2. Parent reporting lacks completed-level history, reward detail, trends, and a
   defensible time-tracking model.
3. Quiz/question entities, answer choices, attempts, scoring rules, and result
   persistence are absent.
4. Blockly workspace/task storage and server-side completion validation are
   absent.
5. XP, reward assignment rules, achievement rules, and duplicate-award
   prevention are absent.
6. Avatar upload and profile-picture management are absent despite the upload
   module.
7. No reusable design-token layer or complete accessible base-component set
   exists yet.
8. No CI workflow runs install, lint, type checks, tests, and builds.

### P1 — Verification gaps

- The API has one E2E test for `GET /users`; there are no unit tests for auth,
  authorization, invitations, progress, rewards, or admin behavior.
- The E2E test imports the production database module, so it requires an
  external MySQL configuration instead of an isolated test setup.
- The root does not expose aggregate `test` or `test:e2e` scripts.
- No accessibility, component, browser-flow, or cross-platform test suite exists.

### P2 — Research and governance gaps

- K–12 curriculum mapping, product-comparison evidence, MVP rationale, and
  skip-level criteria are described as future work but are not represented by
  reviewed artifacts.
- Child privacy, parental consent, retention, deletion/export, and analytics
  minimization requirements need an explicit, independently reviewed checklist.

## Likely Starter or Unused Artifacts

The following files appear to be inherited demonstration assets or unused
scaffolding. They should be verified through import/reference searches before a
separate cleanup task removes anything:

- `apps/web/public/vercel.svg`
- `apps/web/public/turborepo-light.svg`
- `apps/web/public/turborepo-dark.svg`
- `apps/web/public/next.svg`
- `apps/web/public/globe.svg`
- `apps/web/public/window.svg`
- `packages/ui/src/code.tsx`
- `packages/ui/src/card.tsx` and `packages/ui/src/button.tsx` if they are not
  adopted into the CodeKids design system

The Geist font files and current logo implementation are actively referenced and
should not be classified as unused.

## Recommended Execution Order

1. Stabilize validation, error responses, secrets, database migrations, and test
   infrastructure.
2. Finish persistent learning entities and APIs for levels, activities, quizzes,
   progress, Blockly, XP, rewards, and achievements.
3. Complete authentication/authorization edge cases, invitations, child privacy,
   uploads, and administrative controls.
4. Establish design tokens and accessible shared UI components, then implement
   landing, parent, child, and admin flows.
5. Add unit/E2E/accessibility coverage, CI, cross-platform verification, and the
   final definition-of-done review.

## Audit Boundary

This report is an evidence-based structural audit, not a claim that every listed
module is completely nonfunctional. Runtime behavior still needs verification
with an isolated database and full test suite. No files were deleted or renamed
as part of this task.
