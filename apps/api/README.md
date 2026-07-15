# CodeKids API

NestJS backend for the CodeKids learning platform.

## Tech Stack

- NestJS 11
- TypeORM
- MySQL
- JWT authentication
- Swagger/OpenAPI

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create `apps/api/.env` with the required configuration:

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=code_kids
JWT_SECRET=replace-with-a-secure-secret
JWT_REFRESH_SECRET=replace-with-a-different-secure-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Make sure the configured MySQL database exists before starting the API. Never commit real credentials or production secrets.

## Development

Run the API from the repository root:

```bash
npm run start:dev --workspace @codekids/backend
```

The API defaults to port `3000`; the example uses `3001` to avoid conflicting with the web application. Swagger UI is available at `/api/docs` on the configured host and port, and the OpenAPI document is available at `/api/docs-json`.

## Commands

| Command                                             | Purpose                                       |
| --------------------------------------------------- | --------------------------------------------- |
| `npm run start:dev --workspace @codekids/backend`   | Start the API in watch mode.                  |
| `npm run start:debug --workspace @codekids/backend` | Start the API in debug watch mode.            |
| `npm run build --workspace @codekids/backend`       | Compile the API to `dist/`.                   |
| `npm run start:prod --workspace @codekids/backend`  | Start a previously built API.                 |
| `npm run lint --workspace @codekids/backend`        | Run ESLint and apply safe fixes.              |
| `npm run check-types --workspace @codekids/backend` | Run TypeScript checks without emitting files. |
| `npm run test --workspace @codekids/backend`        | Run unit tests.                               |
| `npm run test:e2e --workspace @codekids/backend`    | Run end-to-end tests.                         |
| `npm run test:cov --workspace @codekids/backend`    | Run unit tests with coverage.                 |

## Modules

- `admin/` provides administration endpoints and services.
- `auth/` provides JWT authentication, authorization guards, roles, and invitations.
- `config/` defines application, database, and JWT configuration.
- `learning/` provides levels, progress, quizzes, and rewards.
- `parents/` provides parent-facing endpoints and services.
- `upload/` provides upload endpoints and services.
- `users/` provides user endpoints, services, and persistence entities.

The application starts in [`src/main.ts`](./src/main.ts), and the root module is [`src/app.module.ts`](./src/app.module.ts). Project-wide setup and architecture are documented in the [root README](../../README.md).
