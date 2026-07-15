# CodeKids Backend

NestJS backend for the CodeKids project.

## Tech Stack

- NestJS
- TypeORM
- MySQL
- Swagger / OpenAPI

## Project Setup

Install dependencies from the repository root:

```bash
npm install
```

## Run the Backend

Development:

```bash
npm run dev --workspace @codekids/backend
```

Watch mode:

```bash
npm run dev
```

Debug mode:

```bash
npm run start:debug --workspace @codekids/backend
```

Production build:

```bash
npm run build
npm run start:prod --workspace @codekids/backend
```

## Swagger API Documentation

This backend uses Swagger for API documentation.

Swagger is available after starting the server at:

```text
http://localhost:3000/api/docs
```

OpenAPI JSON can be accessed at:

```text
http://localhost:3000/api-json
```

Current Swagger setup:

- Title: `CodeKids API`
- Description: `API documentation for the CodeKids backend`
- Version: `1.0`
- Swagger route: `/api/docs`

Relevant package dependencies:

- `@nestjs/swagger`
- `swagger-ui-express`

## Useful Commands

Format code:

```bash
npm run format
```

Run lint:

```bash
npm run lint
```

Run unit tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e --workspace @codekids/backend
```

Run test coverage:

```bash
npm run test:cov --workspace @codekids/backend
```

## Environment Variables

The backend currently uses these environment variables:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=code_kids
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

## Main Entry Points

- Application bootstrap: [src/main.ts](./src/main.ts)
- Root module: [src/app.module.ts](./src/app.module.ts)
- Swagger setup: [src/main.ts](./src/main.ts)

## Folder Structure

The backend follows this module structure inside `src/`:

- `config/`
- `common/`
- `auth/`
- `users/`
- `learning/`
- `parents/`
- `admin/`
- `upload/`
- `database/`

## Notes

- Start the backend before opening Swagger.
- Default local port is `3000` unless `PORT` is changed.
- If the database is required for startup, make sure MySQL is running and the `.env` values are correct.
