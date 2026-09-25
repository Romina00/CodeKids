# CodeKids Web

Next.js frontend for the CodeKids learning platform.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS utilities in JSX; global CSS for fonts, design tokens, and shared base styles
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

Open [http://localhost:3003](http://localhost:3003). The primary page entry point is [`app/page.tsx`](./app/page.tsx).

## Commands

| Command                               | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| `npm run dev --workspace web`         | Start the Next.js development server on port 3003. |
| `npm run build --workspace web`       | Create a production build.                         |
| `npm run start --workspace web`       | Start a previously built production application.   |
| `npm run lint --workspace web`        | Run ESLint with zero warnings allowed.             |
| `npm run check-types --workspace web` | Generate Next.js types and run TypeScript checks.  |

There is currently no frontend test script.

## Structure

- `app/` contains the App Router layout, page, styles, fonts, and metadata.
- `components/` contains frontend-specific reusable components.
- `public/` contains static assets.
- `eslint.config.js` composes the shared Next.js ESLint configuration.

Shared UI primitives are provided by [`@repo/ui`](../../packages/ui). Project-wide setup and architecture are documented in the [root README](../../README.md).

## Styling

Page and component styles use Tailwind classes directly in JSX. Small local maps
select complete class strings for button variants and colors. There are no CSS
Modules or separate `.styles.ts` files. Shared colors, spacing, and typography
remain in `styles/tokens/`; `app/globals.css` provides the Tailwind entry point,
fonts, base rules, and shared logo styling.

## Admin content management

Administrators can manage learning levels and activities in `/admin` → **Content**.
The feature reuses the learning API and shared UI components. See
[Administration and Content Management](../../docs/ADMIN_CONTENT_MANAGEMENT.md)
for supported operations, the existing game-catalog boundary, and verification steps.
