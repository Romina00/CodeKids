# Administration and Content Management

## Scope

An administrator manages user accounts and the learning content intended for administration. The `/admin` page provides the existing account search, role filters, blocking/unblocking, recovery requests, and learning overview. The **Content** section adds management of learning levels and their activities.

The interface uses the shared `@repo/ui` cards, buttons, fields, badges, and accessible dialogs, with existing semantic design tokens. Product text remains English as required by the project guide. No dependencies, environment variables, database tables, or migrations were added.

## Content workflow

- Search levels by title or slug and filter published levels or drafts.
- Create a level with a unique slug, title, description, position, optional prerequisite, and publication status. New forms default to draft.
- Edit a level to publish it or return it to draft. The child learning API only returns published levels; unpublishing preserves progress.
- Add or edit activities with a title, description, type, position, estimated duration, and optional JSON object content. The JSON field follows the existing activity contract; arbitrary JSON values and arrays are rejected.
- Confirm deletion in a dialog. Deleting a level also removes its activities and level progress through existing database relations. References from dependent levels are cleared by the database.
- Activities with progress cannot be deleted. Return their level to draft instead. The existing activity foreign key uses `SET NULL`; allowing such deletion would otherwise turn activity progress into apparent level progress.

The page displays loading, empty, success, and failure states. Failed saves keep the editor open. Failed deletion stays in its confirmation dialog. Refresh reloads the current content catalog.

## Existing game integration

The Kids game path currently uses 15 built-in game components and recognizes levels by the `game-gl{position}` slug convention. Additional catalog entries do not automatically create playable games or a lesson renderer. The content editor keeps built-in level slugs/positions and existing game bindings read-only to prevent accidental changes to this mapping. This is an editor safeguard; it does not introduce a new API immutability policy. Game-specific component text and behavior remain in the original game components.

Unpublishing or deleting a prerequisite may affect access to subsequent games. Review prerequisite relationships when changing the game catalog. Prefer drafts when content should be temporarily unavailable.

## API and implementation

All content mutations reuse the existing NestJS learning controller and its administrator role guard. Parents and children cannot create, edit, or delete content. Read access for children remains restricted to published levels. Server DTOs validate content fields, and the service validates prerequisites and reports duplicate slugs with HTTP 409.

| Operation                  | Endpoint                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| List levels and activities | `GET /learning/levels`                                                                                              |
| Create level               | `POST /learning/levels`                                                                                             |
| Update or delete level     | `PATCH /learning/levels/:levelId`, `DELETE /learning/levels/:levelId`                                               |
| Create activity            | `POST /learning/levels/:levelId/activities`                                                                         |
| Update or delete activity  | `PATCH /learning/levels/:levelId/activities/:activityId`, `DELETE /learning/levels/:levelId/activities/:activityId` |

- `apps/web/lib/admin-content.ts`: typed authenticated content requests and content parsing.
- `apps/web/components/admin/content-management.tsx`: catalog, filters, operation state, and dialogs.
- `apps/web/components/admin/content-editor.tsx`: labeled forms and input validation.
- `apps/web/app/admin/page.tsx`: navigation and integration with the existing account administration.
- `apps/api/src/learning/services/levels.service.ts`: content persistence, prerequisite checks, slug conflicts, and deletion protection.

Existing account recovery records a request and revokes refresh access; email delivery is not implemented by this feature.

## Verification

Automated checks performed for this implementation:

- `npm test`: 23 suites, 110 tests passed, including mutation role restrictions, DTO validation, drafts, duplicate slugs, unpublishing, and protection of activity progress.
- `npm run check-types`: passed across the workspaces.
- `npm run lint`: passed across the workspaces.
- One-off isolated frontend API checks: JSON validation, request paths/methods, empty DELETE responses, and API error propagation passed.

The repository does not have a browser test harness. The following acceptance checks still require a running API/database and an authenticated browser:

1. Sign in as an administrator and select **Content**. Verify loading and the stored level/activity list.
2. Create a draft level and an activity; reload and verify persistence.
3. Edit the content, publish the level, and confirm the status filter updates. Check that drafts are absent from the child API.
4. Try an existing slug, a cyclic prerequisite, and invalid activity JSON; verify clear errors and that the form stays open.
5. Cancel deletion and verify nothing changes. Confirm deletion of an unused activity. Verify deletion is refused when the activity has progress.
6. Use the dialogs with the keyboard; verify labels, focus containment, Escape, and disabled controls during saving.
7. Check the existing account search and block/unblock actions alongside content management.

## Local versus Docker administrator accounts

The CLI loads database settings from `apps/api/.env`. The running Docker API uses
its own database settings from `compose.yaml`; those may point to a different
database. An administrator created by the local CLI is not automatically present
in the Docker database. Use database settings matching the running API when
creating the account. In the default Compose setup, MySQL is exposed on host
port `3307`, while the API is exposed on `3001`.

After setup, verify login against the running API: it must return role `ADMIN`
and redirect `/admin`. A successful CLI message alone does not verify that the
web application's database contains the account.
