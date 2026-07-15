# Dependency Audit

Audit date: 2026-07-15

## Outcome

- Updated `next` from 16.2.0 to 16.2.10 to resolve the reported Next.js security advisories.
- Updated `@nestjs/platform-express` to 11.1.28, which updates Multer from 2.1.1 to 2.2.0 and resolves the upload denial-of-service advisories.
- Removed all High findings. Two Moderate audit entries remain for the same transitive PostCSS advisory: Next.js 16.2.10 pins PostCSS 8.4.31, and npm's only proposed automatic fix is a breaking downgrade to Next.js 9.3.3. Track the upstream Next.js patch rather than applying that unsafe downgrade.
- No dependency was removed. Removal candidates below require human approval and a dedicated follow-up change.
- No icon library is currently installed. The project rule remains to use only `lucide-react` if an icon library is introduced.

## Audit Method

The audit used `npm audit`, `npm outdated`, `npm ls`, source searches, and `depcheck` at the repository and workspace levels. Static-analysis candidates are not automatically safe to remove because framework configuration, CLIs, type packages, and peer dependencies can be used without a direct source import.

## Candidates Requiring Human Approval

| Workspace | Candidate                                                                                     | Why it was flagged                                  | Required validation before removal                                                           |
| --------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| root      | `typescript`                                                                                  | No root source import                               | Confirm workspace tooling does not rely on the root compiler and run all quality gates.      |
| API       | `swagger-ui-express`                                                                          | Swagger is integrated through Nest APIs             | Confirm it is not a runtime peer requirement, then verify Swagger UI and production install. |
| API       | `@eslint/eslintrc`, `@nestjs/schematics`, `source-map-support`, `ts-loader`, `tsconfig-paths` | No direct import in scanned source                  | Review CLI/build/debug usage and run lint, debug, tests, and build after any removal.        |
| API       | `@types/jest`                                                                                 | Jest globals are resolved indirectly                | Run all TypeScript and Jest suites after any removal.                                        |
| web       | `@repo/ui`, `@types/node`, `@types/react-dom`                                                 | Not directly imported by the current starter page   | Confirm near-term UI imports and generated Next.js types before removal.                     |
| UI        | `react-dom`, `@types/node`, `@types/react-dom`                                                | Not directly imported by the two current components | Verify peer-dependency expectations and package consumer builds before removal.              |

`depcheck` also reports `express` as missing in the API because a response type is imported from it. Express is currently supplied transitively by Nest's platform adapter; making it a direct dependency should be considered when dependency-boundary cleanup is scheduled.

## Duplicate and Version Review

- Multiple TypeScript and `@types/node` versions exist across workspaces because the API and frontend currently declare different compatible toolchain ranges. Consolidation is deferred because it can affect compiler and framework compatibility.
- ESLint is declared in several workspaces intentionally so each package can lint independently; the lockfile currently resolves them to the same compatible version.
- No competing icon packages (Lucide, Heroicons, Font Awesome, Material Icons) were found.

## Dependency Change Policy

Every new dependency must include its purpose, why existing code or dependencies are insufficient, runtime versus development scope, security/license considerations, and the task that needs it. Dependency removals require explicit human approval. After an approved add, update, or removal, run `npm audit`, formatting, linting, type checks, tests, and builds.
