# Learning schema decision

Status: approved for implementation on 2026-07-15 as part of CK-035.

## Model

- `Level` is an ordered, publishable learning unit identified by a stable unique slug.
- `Activity` belongs to one level and stores ordered lesson, Blockly, or challenge content plus an estimated duration.
- `Quiz` belongs to one level and owns ordered `Question` records. Answer keys are excluded from normal ORM selection so learner-facing reads cannot expose them accidentally.
- `Question` supports single- and multiple-choice answers, an optional explanation, and weighted points.
- `Progress` belongs to one child and one level, optionally points to an activity, and records status, completion, score, attempts, time, and lifecycle timestamps.
- `Achievement` defines reusable criteria and points under a stable unique code.
- `Reward` records an immutable award for one child and can reference the achievement that produced it while retaining a display snapshot.

## Integrity and lifecycle

- Deleting a level cascades to its activities, quizzes, questions, and progress records.
- Deleting an activity keeps level progress but clears its optional activity reference.
- Deleting a child removes owned progress and rewards.
- Deleting an achievement keeps the earned reward snapshot and clears only its optional definition reference.
- JSON-shaped content, criteria, options, and metadata use TypeORM `simple-json` for MySQL compatibility; application DTOs must validate their structures before persistence.
- Ordered collections use explicit integer positions. Publishing remains an explicit flag so draft content is never inferred from dates.

## Migration boundary

Migration `1721040000000-create-learning-schema` creates the seven learning tables, indexes, and foreign keys. It assumes the existing user/auth migration has already created `users`. Production deployments must run migrations with schema synchronization disabled.

Migration `1721030000000-create-core-schema` is that prerequisite: it creates `users`, the self-referencing Parent–Child foreign key, invitation storage, uniqueness constraints, and abuse-prevention indexes. The application defaults to `synchronize: false`; local schema synchronization requires the explicit `DB_SYNCHRONIZE=true` opt-in.
