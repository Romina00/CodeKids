# CodeKids Web

Next.js frontend for the CodeKids learning platform.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- CSS Modules and global CSS
- Shared components from `@repo/ui`

## Setup

Install dependencies from the repository root:

```bash
npm install
```

## Development

Run the frontend from the repository root:

```bash
npm run dev --workspace web
```

Open [http://localhost:3000](http://localhost:3000). The primary page entry point is [`app/page.tsx`](./app/page.tsx).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev --workspace web` | Start the Next.js development server on port 3000. |
| `npm run build --workspace web` | Create a production build. |
| `npm run start --workspace web` | Start a previously built production application. |
| `npm run lint --workspace web` | Run ESLint with zero warnings allowed. |
| `npm run check-types --workspace web` | Generate Next.js types and run TypeScript checks. |

There is currently no frontend test script.

## Structure

- `app/` contains the App Router layout, page, styles, fonts, and metadata.
- `components/` contains frontend-specific reusable components.
- `public/` contains static assets.
- `eslint.config.js` composes the shared Next.js ESLint configuration.

Shared UI primitives are provided by [`@repo/ui`](../../packages/ui). Project-wide setup and architecture are documented in the [root README](../../README.md).
