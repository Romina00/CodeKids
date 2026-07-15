# CodeKids ESLint Config

Shared flat ESLint configurations for CodeKids workspaces. The private package is published only inside the npm workspace as `@repo/eslint-config`.

## Exports

| Import                               | File                | Intended use                                    |
| ------------------------------------ | ------------------- | ----------------------------------------------- |
| `@repo/eslint-config/base`           | `base.js`           | TypeScript packages and general workspace code. |
| `@repo/eslint-config/next-js`        | `next.js`           | Next.js applications.                           |
| `@repo/eslint-config/react-internal` | `react-internal.js` | Internal React component packages.              |

## Usage

Import the appropriate configuration from a workspace ESLint file:

```js
import { nextJsConfig } from '@repo/eslint-config/next-js';

export default nextJsConfig;
```

Each configuration is an ESLint flat-config export. Consumers should extend the closest shared configuration and add local rules only when the workspace has a documented requirement.

See the [project style guide](../../STYLEGUIDE.md) for repository-wide conventions and the [root README](../../README.md) for workspace commands.
