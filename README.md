# CodeKids

[![Quality](https://github.com/Romina00/CodeKids/actions/workflows/quality.yml/badge.svg)](https://github.com/Romina00/CodeKids/actions/workflows/quality.yml)

CodeKids is a learning platform for children, supported by tools for parents and administrators. The repository is an npm workspace managed with Turborepo and contains a Next.js frontend, a NestJS API, and shared TypeScript packages.

## Repository Structure

```text
.
|-- apps/
|   |-- api/                  # NestJS API, authentication, and learning modules
|   `-- web/                  # Next.js web application
|-- packages/
|   |-- eslint-config/        # Shared ESLint configurations
|   |-- typescript-config/    # Shared TypeScript configurations
|   `-- ui/                   # Shared React components
|-- Dokument_EN.md            # Product and architecture documentation
|-- PROJECT_GUIDE.md          # Project-wide implementation rules
|-- STYLEGUIDE.md             # Code style conventions
|-- package.json              # Workspace scripts and dependencies
`-- turbo.json                # Turborepo task configuration
```

## Architecture

- **Web:** Next.js 16 with React 19 and TypeScript.
- **API:** NestJS 11 with TypeORM, MySQL, JWT authentication, and Swagger/OpenAPI.
- **Shared packages:** reusable UI components plus centralized ESLint and TypeScript configuration.
- **Task orchestration:** Turborepo runs build, development, lint, and type-check tasks across workspaces.

The API is organized into domain modules for authentication, users, learning, parents, administration, and uploads. See [Dokument_EN.md](./Dokument_EN.md) for the broader product and technical design.

## Prerequisites

- Node.js 18 or newer
- npm 11 (the repository currently targets npm 11.8.0)
- MySQL 8 or a compatible MySQL server

## Setup

1. Clone the repository and enter its directory.
2. Install all workspace dependencies:

   ```bash
   npm install
   ```

3. Create `apps/api/.env` and configure the backend environment variables described below.
4. Make sure the configured MySQL database exists and is reachable.
5. Start the frontend development task:

   ```bash
   npm run dev
   ```

   The root command currently starts the web workspace because the API exposes `start:dev` rather than a `dev` script.

6. In a second terminal, start the API:

   ```bash
   npm run start:dev --workspace @codekids/backend
   ```

The web application runs at [http://localhost:3003](http://localhost:3003). The API defaults to port `3000`, so use a different backend `PORT` when running both applications, for example `PORT=3001`.

To run one application at a time:

```bash
npm run dev --workspace web
npm run start:dev --workspace @codekids/backend
```

When the API is running, Swagger UI is available at `/api/docs` on the configured API host and port.

## Environment Variables

The backend reads variables from `apps/api/.env` when it is started from that workspace.
Using this file keeps environment setup identical in PowerShell, Command Prompt, and POSIX shells; do not rely on shell-specific inline assignments such as `PORT=3001 npm ...`.

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=code_kids
DB_SYNCHRONIZE=false

AVATAR_UPLOAD_DIR=./storage/avatars

JWT_SECRET=replace-with-a-secure-secret
JWT_REFRESH_SECRET=replace-with-a-different-secure-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Do not commit real credentials or production secrets. The values above are local development examples.

## Commands

Run these commands from the repository root unless stated otherwise.

| Command                                                  | Purpose                                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                                            | Start workspaces that define a `dev` script (currently the web application). |
| `npm run build`                                          | Build all applications and packages.                                         |
| `npm run lint`                                           | Run workspace lint tasks.                                                    |
| `npm run lint:fix`                                       | Apply safe ESLint fixes across workspaces.                                   |
| `npm run check-types`                                    | Run TypeScript checks across workspaces.                                     |
| `npm run format`                                         | Format TypeScript, TSX, and Markdown files with Prettier.                    |
| `npm run format:check`                                   | Verify Prettier formatting without changing files.                           |
| `npm run test --workspace @codekids/backend`             | Run backend unit tests.                                                      |
| `npm test`                                               | Run the repository unit-test gate.                                           |
| `npm run test:e2e --workspace @codekids/backend`         | Run backend end-to-end tests.                                                |
| `npm run test:cov --workspace @codekids/backend`         | Run backend tests with coverage.                                             |
| `npm run migration:run --workspace @codekids/backend`    | Apply pending TypeORM migrations.                                            |
| `npm run migration:revert --workspace @codekids/backend` | Revert the most recent TypeORM migration.                                    |

All repository commands above use Node.js/npm tooling and work unchanged on Windows, macOS, and Linux. Paths in scripts and application code are handled by the tools or Node APIs instead of shell-specific separators. The GitHub Actions quality matrix verifies formatting, linting, type checks, unit tests, and builds on all three operating systems.

There is currently no frontend test script. The repository-wide `npm test` gate therefore runs the backend unit-test suite.

## API Development

Useful backend-specific commands:

```bash
npm run start:dev --workspace @codekids/backend
npm run start:debug --workspace @codekids/backend
npm run build --workspace @codekids/backend
npm run start:prod --workspace @codekids/backend
```

The production start command expects the backend to have been built first.
Database schema synchronization is disabled by default. Apply the reviewed
TypeORM migrations before starting a new environment; use
`DB_SYNCHRONIZE=true` only for explicitly disposable local databases.

## Project Documentation

- [Product and architecture documentation](./Dokument_EN.md)
- [Project guide](./PROJECT_GUIDE.md)
- [Style guide](./STYLEGUIDE.md)
- [AI usage appendix](./AI_USAGE_APPENDIX.md)
- [AI usage log template](./AI_USAGE_LOG_TEMPLATE.md)
- [AI usage log](./AI_USAGE_LOG.md)
- [Role and access matrix](./ACCESS_CONTROL_MATRIX.md)
- [Authentication security policy](./docs/AUTH_SECURITY_POLICY.md)
- [Session security policy](./docs/SESSION_SECURITY.md)
- [Child privacy and consent requirements](./docs/CHILD_PRIVACY_REQUIREMENTS.md)
- [Learning schema decision](./docs/LEARNING_SCHEMA.md)
- [Similar-product comparison framework](./docs/PRODUCT_COMPARISON_CRITERIA.md)
- [K–12 standards review framework](./docs/K12_STANDARDS_REVIEW_FRAMEWORK.md)
- [MVP options and decision record](./docs/MVP_OPTIONS.md)
- [Skip-level criteria proposal](./docs/SKIP_LEVEL_CRITERIA.md)
- [Backend guide](./apps/api/README.md)
- [Frontend guide](./apps/web/README.md)

## Current Status

The repository is under active development. Some modules and UI areas are still incomplete, and the current documentation describes the implemented repository rather than a finished production release.

The pre-commit hook runs staged-file ESLint and Prettier checks, blocks newly
added `console.log` calls, and runs workspace type checking. Run
`npm run check:staged` manually to reproduce the staged-file portion.

### Game progress

The 15 games save level status through the authenticated learning progress API.
The dashboard and learning path read the same database records after login on any device.
A completed game unlocks the next level; moves inside an unfinished game are not restored.

The game catalog is included in the migrations. For an existing database whose tables
were created with schema synchronization, populate the catalog once with:

```sh
npm run seed:games --workspace @codekids/backend
```

This command uses `apps/api/.env`, is safe to repeat, and keeps existing progress.

## Repair missing administrator columns

If `create:admin` reports `Unknown column 'User.blockedAt'`, an existing
`users` table is missing the administrator account-control columns. Run from
the repository root:

```bash
npm run db:repair-admin --workspace @codekids/backend
npm run create:admin --workspace @codekids/backend
```

Both commands load `apps/api/.env`. The repair adds only missing nullable
`blockedAt`, `blockedReason`, and `recoveryRequestedAt` columns. It preserves
existing columns and account records and can be repeated. It does not run
unrelated migrations, recreate removed tables, or mark historical migrations
as applied. It requires an existing `users` table and is not a replacement
for the full schema setup on a new database.
