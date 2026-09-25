# AI Usage Log

Last updated: 2026-09-20.

## Scope and evidence

This is a retrospective disclosure of AI assistance in CodeKids, not a declaration that every use complied with the thesis agreement. It follows the documentation fields in `Vereinbarung-Einsatz-KI.docx`, supplied by the author: tool/model, purpose, affected work, type of use, and meaningful prompt examples.

Sources are the author's statements, the conversation available for this update, the repository, and the pre-existing log below. Requests do not prove that an implementation was adopted. Original authorship, later AI edits, and shared dependencies are distinguished. Exact dates, models, commits, and personal review steps are recorded only when known. This log is not an exhaustive transcript or independently verified authorship audit.

## Consolidated attribution for author review

This summary incorporates the author's latest corrections. It distinguishes her original work, delegated implementation, and subsequent AI assistance. It covers the areas discussed; missing historical evidence is listed at the end rather than invented.

### Work performed by the author

- Independently researching public GitHub/Turborepo examples, selecting suitable approaches, and adapting them to CodeKids.
- Designing the architecture and repository organization and creating the original folders herself.
- Selecting technologies and their purposes, including the frontend/backend separation, Turborepo, Tailwind CSS, Lucide, Swagger, Husky, and ESLint.
- Creating the original style guide and AI instructions, defining fixed colors and consistent icon/design rules, and specifying the required simple coding style.
- Designing Milo in Figma, creating the SVG artwork, and integrating the original artwork into the project.
- Hand-coding every original learning game and the original complete Kids and parent dashboards.
- Writing the game-specific database connections/integration herself, as clarified in her latest account. Exact file boundaries have not been supplied; this contribution is not attributed to AI.
- Developing the registration/login concept, specifying the required behavior, and instructing AI how and where to implement it.
- Personally reviewing whether authentication met her requirements and considering possible security weaknesses; supplying feedback and corrections. This is her reported review, not a claim of a documented penetration test.
- Choosing Swagger for inspecting/testing the API before the frontend was ready, and Husky/ESLint to enforce quality rules before commits.

### Implementation delegated to AI

- Writing backend code in the folders and according to the requirements provided by the author. The author's game-specific database integration is an explicit exception to a blanket backend/database attribution.
- Implementing the general database/persistence code outside that exception, according to the author's account. The older log mentions entities, services, migrations, and fixtures, but does not establish line-by-line authorship.
- Implementing the landing page under the author's requirements, including subsequent content/layout changes and Tailwind conversion.
- Implementing the admin page according to the author's architecture and instructions.
- Implementing registration and login, including related backend functionality, according to the author's own concept.

### Later AI assistance, distinct from original authorship

- Converting the remaining CSS Modules to Tailwind across the project, including Kids pages and shared UI. The wish for consistency and the design rules came from the author.
- Refactoring and investigating requested changes to profiles, parent views, navigation, Milo presentation, and game behavior. The visible conversation records requests; a complete list of accepted earlier logic changes requires matching them to revisions. Such requests do not establish AI authorship of the original games, dashboards, or artwork.
- Running formatting, lint/type checks, builds and simulated browser checks, and rebuilding the Docker web container for the migration.
- Drafting and updating this AI usage log and its template. This does not attribute the original author-created style guide or architecture instructions to AI.

Conceptual decisions, original file/folder creation, generated code, later edits, and verification are separate contributions. The current versions must not be described as entirely untouched by AI merely because their original versions were hand-written.

## Agreement and matters requiring clarification

The supplied agreement lists introductory research assistance, language revision, frontend UI prototypes, the landing page, UI animation/visual improvement, and backend implementation as permitted uses. It identifies research decisions, solution concepts, evaluation, learning-game implementation, and implementation of parent pages as independent core work. It also excludes complete generation of thesis text passages. This is a summary of the supplied document, not confirmation of its signature status or of any later amendment.

- The author corrected the earlier attribution: the original parent dashboard, Kids dashboard, and every individual learning game were hand-coded by her. The earlier statement that the entire parent area was AI-implemented is superseded. Subsequent AI refactoring, styling, and requested debugging are recorded separately from original implementation.
- The author reports that the original Kids page and learning games were hand-coded without AI. Later AI styling changes to Kids pages are documented below. Earlier requests for game debugging and changes require comparison with accepted commits before their actual scope can be established.
- The author has clarified that she wrote the game-specific database connections/integration herself. General backend/database implementation is attributed to AI with that explicit exception. The exact files and the extent of any schema work remain unspecified; neither the whole database nor all game-related persistence code is assigned to one contributor without that boundary.
- Admin implementation and other work not explicitly named in the permitted list must not automatically be treated as approved simply because it was performed.

## Author clarification: original work and delegated implementation

The author clarified the following on 2026-09-20:

- She designed Milo herself in Figma, created the SVG artwork, and subsequently integrated it into the project. Milo's original design and SVG creation are her own work, not AI-generated assets. Later requests about presentation or states do not transfer authorship of the original artwork to AI.
- She hand-coded every individual learning game and the complete original Kids and parent dashboards.
- She independently researched publicly available GitHub examples of Turborepo projects, selected relevant approaches, and adapted them to CodeKids. This research, selection, and adaptation were her work, without AI assistance, according to her clarification. Specific example repositories have not yet been recorded.
- She designed the project architecture and folder organization and created the folders herself. AI did not originate or create that initial structure. Writing backend code inside those folders must not be attributed as designing the architecture or setting up the original repository organization.
- She selected the technologies and tools and defined their intended roles. Her stated decisions include Turborepo, Tailwind CSS, Lucide icons, Swagger, Husky, and ESLint. The repository uses Next.js for the frontend and NestJS for the backend; her clarification attributes the architectural technology decisions to her, separately from AI-written implementation code.
- She created the style guide and instructions for AI, specified fixed colors and consistent icon use, and required generated code to follow her existing conventions. These original design and development rules are her own work, not AI-generated concepts.
- She chose Swagger to inspect and exercise API endpoints, including before a working frontend was available. She chose Husky and ESLint for automated quality checks and prevention of unwanted debugging code in commits. Choosing these tools and requirements is distinct from writing their configuration.
- The landing page received AI assistance, including a later conversion to Tailwind to match the style of her own hand-written code.
- The admin page was implemented entirely with AI, following her architecture.
- Registration and login were implemented entirely with AI. The concept and instructions for how they should work came from her.
- She reports personally checking whether authentication met her requirements and considering whether it could be easily compromised, and directing AI accordingly. No specific penetration-test procedure or evidence of comprehensive security assurance was supplied; her reported review is not described as proof that the application cannot be hacked.

The earlier blanket backend attribution is qualified by the author's latest clarification: she wrote the game-specific database connections/integration. The remaining backend implementation is attributed to AI under her architecture and instructions. Exact file-level boundaries are not yet recorded.

## Division of responsibility: architecture and code implementation

The architecture, initial folder creation, research, technology choices, design rules, and implementation requirements are attributed to the author on the basis of her explicit clarification. AI assistance consisted of writing or modifying code for specified tasks in the locations she supplied, and of the later checks/refactoring documented in this log. It must not be described as independently conceiving the project or creating its original folder structure.

A representative instruction, paraphrased from the author's explanation rather than quoted from an original implementation session, is: “Go to the specified backend folder and implement this code according to these requirements.” The author supplied the destination, required behavior, and rules; AI translated those instructions into code. Architecture and implementation are distinguished by responsibility, not simply by whether a file contains code: configuration can also express architectural decisions.

| Contribution                | Author's own work                                                                                                                             | AI contribution to record separately                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Research and structure      | Reviewing public GitHub/Turborepo examples, selecting and adapting approaches, designing the organization, and creating the original folders. | Code written within the prescribed structure; no attribution of the original research or folder creation to AI.      |
| Architecture and technology | Determining the system structure, technology choices, responsibilities, and requirements.                                                     | Implementing specified behavior and configuration under those decisions, where AI actually wrote it.                 |
| Design and coding rules     | Creating the style guide and AI instructions, selecting Lucide, defining colors and consistency requirements.                                 | Applying those existing rules to generated or modified code, including later Tailwind refactoring.                   |
| Backend                     | Providing architectural decisions, target folders, and concrete implementation instructions.                                                  | Writing backend code according to those instructions.                                                                |
| Quality and API inspection  | Selecting Swagger, Husky, and ESLint and determining their purposes and required checks.                                                      | Any AI-written setup/configuration and AI-executed checks, distinguished from the author's selection and own review. |

## Retrospective usage overview

| Area                                                                         | Reported or observed contribution                                                                                                                                                                                                                    | Evidence and limits                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (`apps/api`)                                                         | AI wrote backend code under the author's architecture and explicit requirements, except for her self-written game-specific database connections/integration.                                                                                         | Author statement; the historical entry also describes API generation. Research, architecture, initial folder creation, and requirements belong to the author; AI supplied implementation code.                                                      |
| Database and persistence                                                     | The historical entry records AI work on entities, services, migrations, and fixtures. Relevant areas include `apps/api/src/data-source.ts`, `apps/api/src/migrations`, and learning/user entities.                                                   | The author wrote the game-specific database connections/integration. This is an explicit exception to general AI database implementation; exact file boundaries remain unrecorded. Schema/content decisions are not automatically attributed to AI. |
| Admin frontend (`apps/web/app/admin`)                                        | The author reports complete AI-assisted implementation.                                                                                                                                                                                              | Exact sessions/models and the author's individual adaptations have not been supplied.                                                                                                                                                               |
| Parent frontend (`apps/web/app/parent`)                                      | The author clarifies that she hand-coded the original complete parent dashboard. Subsequent requests concern simplification, profile creation, permissions, and layout changes; later AI work is distinct from original authorship.                  | Corrected author statement supersedes the earlier blanket AI attribution. Subsequent AI changes must be documented by their actual scope.                                                                                                           |
| Original Kids frontend and games (`apps/web/app/kid`)                        | The author reports hand-written original implementation without AI.                                                                                                                                                                                  | Author statement about original work, not a claim that the current files or their shared components were never changed by AI.                                                                                                                       |
| Later Kids-page changes                                                      | AI migrated Kids layout, learning path, dashboard, game wrapper/navigation and associated styles from CSS Modules to Tailwind.                                                                                                                       | Observed in this conversation. Shared UI changes also affect game presentation.                                                                                                                                                                     |
| Requested game assistance                                                    | Requests cover test-state issues in levels 4–6, feedback/undo in level 7, variation in level 8, difficulty in levels 12/15, progression in level 13, and build/run feedback.                                                                         | These are documented requests. A complete per-game record of accepted logic changes cannot be reconstructed from the available messages alone.                                                                                                      |
| Landing page (`apps/web/app/page.tsx`, `apps/web/app/learning-overview.tsx`) | AI assistance was requested for Milo presentation, accurate level descriptions, age messaging, removal of testimonials/statistics, and a parent explainer dialog. Styling was subsequently migrated with AI.                                         | Requests and current migration record; exact earlier implementation dates/models are not established.                                                                                                                                               |
| Profiles, authentication UI, shared components                               | AI-assisted styling migration affected `apps/web/app/profile`, `select-profile`, `login`, `register`, `parent/settings`, `design-system`, `apps/web/components`, and `packages/ui/src`. Earlier requests also concern profile access and navigation. | Migration observed; individual earlier requests should be linked to accepted commits where available.                                                                                                                                               |
| Milo assets and feedback                                                     | The author designed Milo in Figma, created the SVG artwork herself, and integrated it into the project. Later requests concern thinking/idle/happy presentation, SVG adjustments, and motivational messages.                                         | Original artwork is attributed to the author based on her clarification. Any adopted later AI edits must be distinguished from that original design.                                                                                                |
| Tooling, verification and Docker                                             | AI ran formatting, lint/type checks, builds, and browser checks, and rebuilt the web container for the Tailwind conversion.                                                                                                                          | Observed checks are detailed below; no claim that all historical checks passed.                                                                                                                                                                     |
| Documentation                                                                | AI produced the existing usage log and expanded this log/template using the supplied agreement and author statements.                                                                                                                                | The current disclosure itself is AI-assisted and requires author review before academic submission.                                                                                                                                                 |

## Entry: Delegated landing, admin, backend and persistence implementation

- Date/period: original implementation dates not supplied.
- Tool/model: AI assistance reported by the author; exact original tool/model versions are not established here.
- Purpose: implement the author's requirements within her existing architecture, folders, and design rules.
- Affected work: landing page, admin frontend, backend and general persistence; excludes the author's self-written game-specific database integration.
- Type: code generation and implementation under the author's direction; subsequent refactoring recorded separately.
- Prompt example (paraphrase of the author's account, not an original transcript): Implement the specified functionality in the backend folder I have identified, following my requirements and coding rules.
- Additional prompt example (verbatim request for later styling): “alle css module in meinem Projekt sollen tailwand css sein”.
- Author contribution: research, architecture, folder creation, requirements, technology/style choices, and review/feedback as described above.
- AI contribution: implementation code for the identified delegated areas; not the original architecture, folder organization, or Milo design.
- Verification: the historical log and later migration checks are recorded separately below. Their results must not be treated as proof that every original generated feature was fully checked. Original prompt transcripts and complete per-file evidence are unavailable here.

## Entry: Registration and login implementation

- Date/period: not supplied retrospectively.
- Tool/model: AI assistance reported by the author; exact tool/model for the original implementation not established.
- Purpose: implement the author's registration and login concept and requirements.
- Affected work: `apps/web/app/register`, `apps/web/app/login`, and related backend authentication functionality.
- Type: implementation/code generation under the author's direction.
- Prompt evidence: original implementation prompts are not available here. The current clarification states that the author determined how authentication should work and instructed AI accordingly; this is a summary, not a verbatim original prompt.
- AI contribution: the author reports complete AI implementation of registration and login.
- Author contribution: concept, implementation instructions, and personal checks of suitability and potential security weaknesses, as reported by the author.
- Verification limits: no specific security-test procedure or results were provided in this clarification. This entry does not assert that a penetration test passed or that authentication is invulnerable.

## Entry: Project-wide CSS Modules to Tailwind migration

### Record details

- Date: completed in the conversation preceding this update; exact execution date not independently established.
- Tool/model: OpenAI Codex; exact model identifier for that earlier execution not independently established.
- Purpose: replace remaining CSS Modules with Tailwind while retaining the existing interface.
- Type: code refactoring, debugging, styling, verification, and documentation.
- Prompt example (verbatim): “alle css module in meinem Projekt sollen tailwand css sein”.

### Affected work and adopted contribution

Twelve remaining CSS Modules were removed. Tailwind classes were introduced in the web pages/components and shared UI components listed in the overview. Global style layering and Tailwind configuration in `apps/web/app/globals.css` were adjusted, and `apps/web/README.md` was updated. This includes Kids-page presentation and therefore counts as later AI assistance even where the original code was hand-written. Styling-only work must not be described as original game-logic authorship.

### Review and verification

AI performed desktop/mobile browser checks, including scrolling to level 15 and opening/closing landing and parent dialogs with simulated data. Web/UI lint, Prettier, TypeScript and the Docker build passed. The web container was rebuilt. Project-wide lint still reported a missing ESLint rule referenced in `apps/api/src/create-admin.ts`. Simulated browser checks do not prove all real-account/database flows or all game logic. The author's final line-by-line review has not been recorded.

## Entry: Retrospective completion of AI documentation

### Record details

- Date: 2026-09-20.
- Tool/model: OpenAI Codex, GPT-6 (session-provided identity; exact deployment version unavailable).
- Purpose: reconcile the AI log and template with the supplied agreement and the author's account of implementation work.
- Type: document extraction, analysis, and documentation drafting.
- Affected files: `AI_USAGE_LOG.md`, `AI_USAGE_LOG_TEMPLATE.md`.
- Input: `Vereinbarung-Einsatz-KI.docx` supplied by the author; its Word document text was read locally.
- Prompt example (translated summary, not verbatim): Complete both AI documents using the agreement and the author's implementation account. A later clarification corrects parent-dashboard authorship and identifies Milo, all games, both dashboards, architecture, and the authentication concept as the author's own contributions; AI implementation and later edits are recorded separately.

### Contribution, review and limits

AI expanded the area-by-area disclosure, retained the historical record with an uncertainty notice, distinguished original authorship from delegated implementation and later edits, and added missing evidence fields to the template. The author has clarified ownership of game-specific database integration; its exact file boundaries, further personal adaptations, missing dates/model versions, and accepted earlier game changes remain to be recorded. No claim is made that the supervisor approved a deviation. These files are working documentation, not an independently authored thesis passage or a signed compliance declaration.

## Historical record retained from the previous log

The following entry predates this update and is preserved for traceability. Its date/model, Kanban actions, broad verification claims, and personal-review statements have not been independently revalidated here. Its references to architecture/design documentation do not establish AI authorship of the architecture, original style guide, research, or initial folder structure: those are the author's work according to her correction. Its broad references to parent/Kid prototypes do not establish AI authorship of the final original dashboards or games. The author has clarified that she hand-coded those and designed Milo herself; those corrections take precedence over blanket attributions in this historical entry. It must not be used as blanket proof that all work was verified or approved.

## Entry: Kanban implementation and verification

### Record Details

| Field           | Value                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Date            | 2026-07-15                                                                                        |
| Tool and model  | OpenAI Codex, GPT-5                                                                               |
| Purpose         | Implement and verify the approved CodeKids Kanban tasks in sequence.                              |
| Assistance type | Repository analysis, code generation, refactoring, testing, debugging, documentation, and review. |

### Affected Work

- `apps/api`: authentication, authorization, users, parents, learning entities and services, migrations, uploads, Swagger contracts, unit tests, and E2E tests.
- `apps/web`: shared design-system adoption, parent/kid/admin prototypes, Kids Mode transition UI, and default avatar assets.
- `packages/ui`: reusable accessible components and design-token integration.
- Project documentation: setup, architecture, design system, accessibility, security, role policy, dependency review, and Definition-of-Done evidence.
- Google Sheets Kanban: completed-task status and commit traceability notes.

### Prompt Summary

The project owner requested that every open CodeKids task be completed in Kanban order, verified in proportion to risk, committed independently, and then marked Done in the connected Google Sheet with its commit identifier.

### AI Contribution

Codex inspected the existing repository and Kanban acceptance criteria, proposed implementation details within the approved architecture, edited project files, generated focused tests and fixtures, ran quality gates, diagnosed failures, created independent commits, and updated the corresponding Kanban records.

### Personal Review and Adaptation

The owner approved proceeding through all tasks and the required security, role, schema, and UI decisions. Each adopted change was reconciled with the repository's existing code and product documentation. Failed or incomplete checks were treated as defects and corrected before the related task was marked Done. Final responsibility for accepting the implementation and its academic use remains with the project author.

### Verification

- Checks performed: Prettier, ESLint, TypeScript, Jest unit tests, Supertest E2E tests, production builds, OpenAPI contract extraction, staged debug-log prevention, and task-specific audits.
- Result: pass for the completed tasks recorded in the Kanban.
- Limitations or follow-up: Later Kanban tasks remain tracked separately and must pass their own verification before the project goal is closed.

---

## Outstanding evidence

- Identify the files containing the author's independently written game-specific database connections/integration, and any related schema work; the stated authorship itself is already recorded.
- Link material accepted later AI changes to commits or diffs, distinguishing them from the author's original games and dashboards.
- Add actual dates and tool/model versions where records exist; retain “unknown” otherwise.
- Add the public GitHub/Turborepo examples used by the author as research sources when their exact references are available; do not invent URLs or attribute that research to AI.
- Add details of the author's reported authentication review and any other adaptations or rejected suggestions where records exist, without inventing test results.
- Assess any adopted later AI changes to independent core work by their actual scope against the agreement; do not repeat the superseded claim that the original parent dashboard was entirely AI-generated.
- Review this disclosure before using it in the thesis; it is not a claim of exhaustive completeness.

## Entry: Admin learning content management

### Record details

- Date: 2026-09-25 (session environment date).
- Tool and model: OpenAI Codex, GPT-6 (session-provided identity).
- Purpose: implement the requested administrator content management using the existing code style, documentation, and design system.
- Type of use: repository inspection, implementation, tests, and documentation.
- Evidence: current conversation and uncommitted workspace diff. The user explicitly selected learning levels and activities as the content scope.

### Affected artifacts and contribution

AI added the admin content client, catalog component, and editor under `apps/web/lib/admin-content.ts` and `apps/web/components/admin/`, and connected them to the existing admin page. Existing NestJS learning endpoints were reused. AI added duplicate-slug feedback and protection against deleting activities with progress in the learning service, plus focused authorization, validation, and service tests. AI documented the workflow and limitations in `docs/ADMIN_CONTENT_MANAGEMENT.md` and the frontend README. Earlier session edits to admin access/navigation remain separate from this content feature.

The author's original game components, game-specific frontend/database integration, architecture, style guide, and design tokens were read as existing constraints and were not authored by AI in this task. The feature manages existing learning entities; it adds no schema or seed changes. Additional content does not create new playable game components.

### Prompt and verification

Prompt summary: implement administration of user accounts and administration content, following the existing code style, documentation, and style guide. Clarification: learning levels and activities.

Checks performed: all 110 backend tests in 23 suites passed; workspace type checks and full workspace lint passed. Isolated frontend helper checks covered JSON parsing, request methods, DELETE responses, and API errors. Browser acceptance against a running database was not performed and is documented as pending manual verification. Personal review, acceptance, and further adaptation by the author have not been observed; no commit was created.

## Entry: Repair missing administrator account columns

- Date: 2026-09-25 (session environment date).
- Tool/model: OpenAI Codex, GPT-6 (session-provided identity).
- Prompt: fix the `Unknown column 'User.blockedAt'` failure when creating an administrator.
- AI contribution: inspected the configured database schema; added a narrowly scoped, repeatable `db:repair-admin` CLI command and tests; documented its use in the root README. The command adds only the missing nullable administrator fields and does not run the full historical migration chain or alter existing account roles.
- Execution: the approved repair added `blockedAt`, `blockedReason`, and `recoveryRequestedAt`; the existing `create:admin` command then successfully created the configured administrator account. Credentials were loaded from the existing environment file; no password was printed or included in this log.
- Verification: three focused schema-repair tests, backend type checking, and targeted lint. Tests cover repeat execution, partially updated tables, and refusal to create a missing user table. Browser login was not tested.
- Attribution and acceptance: AI authored the repair helper, CLI entry point, tests, and this documentation. Existing authentication, schema definitions, and prior project authorship remain unchanged. User approval covered executing the database repair and administrator creation; personal code review has not been observed.

## Follow-up: Verify administrator login against the running Docker API

On 2026-09-25, the user reported that login still failed after administrator creation. AI verified that the configured local database contained the account and that its password matched, but the running API returned HTTP 401. The local services on ports 3001 and 3003 were Docker services using the separate Compose database on host port 3307. The earlier repair and account creation had targeted the database in `apps/api/.env`, not the database used by the browser-facing API. AI acknowledged this missed integration check.

With execution approval, AI created the configured administrator in the Compose database using the existing administrator credentials, without printing the password. Verification against the running API then returned HTTP 200 for login with role `ADMIN` and redirect `/admin`, and HTTP 200 for `/admin`, `/admin/users`, and `/learning/levels`. No browser interaction was performed. The difference between local CLI and Docker database configuration is now documented in the administration guide.
