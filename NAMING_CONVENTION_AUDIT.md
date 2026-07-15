# CodeKids Naming Convention Audit

This audit checks the repository against the conventions in
[`STYLEGUIDE.md`](./STYLEGUIDE.md). It proposes renames but does not perform
cross-cutting renames whose import, route, database, or deployment impact needs
separate verification.

## Result

Most TypeScript symbols and source filenames follow the documented conventions:

- React components, NestJS classes, DTOs, entities, guards, and decorators use
  `PascalCase`.
- Variables, functions, methods, parameters, and configuration keys use
  `camelCase`.
- Source filenames use `kebab-case` plus framework suffixes such as
  `.controller.ts`, `.service.ts`, and `.entity.ts`.
- Environment-variable reads use `UPPER_SNAKE_CASE`.

No case-only rename is required for the current TypeScript source tree.

## Findings

| Priority | Current name                                                          | Finding                                                                                                                                                | Safe proposal                                                                                                                                        |
| -------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | `LevelEntity`, `ActivityEntity`, `AchievementEntity`                  | The `Entity` suffix is inconsistent with real TypeORM classes (`User`, `Progress`, `Reward`) and the classes are placeholders, not decorated entities. | When persistence is implemented, rename them to `Level`, `Activity`, and `Achievement` in the same commit that adds `@Entity()` and updates imports. |
| P1       | workspace package `web`                                               | The generic package name is inconsistent with `@codekids/backend` and makes workspace logs less explicit.                                              | Rename package metadata to `@codekids/web`; no folder rename is needed.                                                                              |
| P1       | packages `@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config` | These inherited Turborepo names obscure CodeKids ownership.                                                                                            | Rename to `@codekids/ui`, `@codekids/eslint-config`, and `@codekids/typescript-config` together with all workspace references and lockfile updates.  |
| P1       | `Code` component                                                      | `Code` is vague and does not communicate whether it renders inline code, a block, or a product feature. It also appears to be starter scaffolding.     | If used, rename to `CodeBlock` or `InlineCode` based on behavior; otherwise remove it under the cleanup task after confirming no imports.            |
| P1       | `UploadService.upload()`                                              | `upload` does not identify the resource, storage operation, or result and currently returns a stub response.                                           | Replace with intent-specific methods such as `uploadAvatar`, `validateAvatarFile`, and `deleteAvatar` when upload behavior is implemented.           |
| P1       | `AdminService.getOverview()`                                          | The result is a user-count and role summary, so “overview” is broader than the implemented behavior.                                                   | Rename to `getUserOverview` now, or expand the result before retaining the broad name.                                                               |
| P1       | `ProgressService.update()`                                            | “update” hides what progress scope and identity are affected.                                                                                          | Use `recordActivityProgress` or `updateChildProgress` after the persistence contract is defined.                                                     |
| P1       | `QuizService.submit()`                                                | The method name omits the submitted object and expected result.                                                                                        | Rename to `submitQuizAttempt` when attempt persistence and scoring are implemented.                                                                  |
| P2       | `body` parameters in controllers/services                             | Repeated generic `body` names reduce readability and accompany inline request shapes.                                                                  | Introduce named DTOs and use intent names such as `registrationDto`, `createChildDto`, and `changePasswordDto`.                                      |
| P2       | `input` in multi-step domain methods                                  | `input` is acceptable locally but vague in service APIs that handle different commands.                                                                | Prefer `parentProfile`, `childProfile`, or a named `...Dto` when DTO validation is added.                                                            |

## Names That Should Remain Stable

- Public route segments such as `/auth`, `/parents`, and `/learning` are already
  lowercase and descriptive. Renaming them would be a versioned API change, not
  a naming cleanup.
- Database table names `users`, `invitations`, `progress`, and `rewards` are
  clear and consistently lowercase. Any change would require a migration.
- Framework-standard filenames such as `page.tsx`, `layout.tsx`, `main.ts`, and
  `app.module.ts` should not be renamed.
- `Logo` and `LogoMark` clearly distinguish the complete lockup and standalone
  mark.

## Safe Execution Groups

1. **Metadata-only package naming:** rename workspace package names and update
   imports, configuration extends, the lockfile, and documentation in one
   isolated commit; then run install, lint, type checks, and build.
2. **DTO naming:** introduce validated DTO classes and replace inline `body`
   shapes without changing routes or response contracts.
3. **Learning domain naming:** rename placeholder entity/service methods only
   while implementing their real persistence contracts and tests.
4. **Starter cleanup:** confirm reference searches for `Code` and public SVGs,
   then remove or rename them in the dedicated cleanup task.

## Verification Checklist for Future Renames

- Search TypeScript imports, package references, scripts, Markdown, Swagger
  examples, environment files, and the lockfile.
- Avoid case-only two-step renames on case-insensitive filesystems; use an
  intermediate name if one becomes necessary.
- Run `npm install`, `npm run lint`, `npm run check-types`, and `npm run build`.
- Treat route, table, environment-variable, and public package renames as
  compatibility changes and document a migration path.

No source symbol or file was renamed during this audit.
