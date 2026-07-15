# CodeKids MVP options

**Prepared:** 2026-07-15  
**Decision owner:** Product owner  
**Decision status:** Options prepared; no scope selected

## Shared MVP outcome

Every option demonstrates one coherent family journey: a parent registers,
opens a simple dashboard, creates one child profile, the child completes a small
ordered learning path and quiz, progress is saved, and a reward is visible. The
options change fidelity and validation strength—not that core outcome.

The repository already contains authenticated parent/child APIs, role controls,
learning entities and endpoints, progress/reward logic, database migrations,
and parent/Kids Mode prototypes. Integration, real curriculum content, and
production operations remain the main scope choices.

## Option comparison

| Dimension            | A — Demonstration slice                       | B — Testable family pilot                                                   | C — Operational beta                                                     |
| -------------------- | --------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Intended decision    | Prove the end-to-end concept                  | Test usefulness and usability with invited families                         | Validate limited real-world operation                                    |
| Registration         | Parent email/password; verification simulated | Real email verification, reset, consent notice                              | Production email, consent/version audit, account deletion/export         |
| Parent dashboard     | One child, completion %, recent reward        | One child, level history, time/score summary, actionable empty/error states | Multiple children, filtering, support/admin visibility                   |
| Child profile        | One parent-created child; preset avatar       | Editable nickname/avatar/age band; secure Kids Mode switch                  | Guardian lifecycle controls, recovery, retention/deletion workflow       |
| Levels               | 3 short seeded levels, linear unlock          | 5–8 reviewed levels with retry and accessible instructions                  | Versioned curriculum, content moderation/publishing workflow             |
| Quiz                 | One fixed-answer quiz; server-side scoring    | Per-level quizzes, retry policy, useful feedback                            | Question bank/versioning and educator-reviewed analytics                 |
| Progress             | Completion, score, current level              | Activity state, attempts, elapsed time, resume behavior                     | Auditable events, reporting, anomaly/support tools                       |
| Rewards              | One rule-based achievement and badge          | Several transparent milestones; duplicate-safe assignment                   | Configurable catalogue, notification/preferences governance              |
| Quality evidence     | Automated API path plus scripted demo         | Cross-device/accessibility test and 5–8 consented family sessions           | Pilot monitoring, security/privacy review, incident and rollback drill   |
| Operations           | Local/test deployment and seeded data         | Password-protected staging, backups, basic telemetry                        | Managed production environment, alerts, backups/restore, support runbook |
| Relative effort/risk | Lowest / risk of learning too little          | Medium / balanced learning value                                            | Highest / operational and privacy overhead                               |

## Option A — Demonstration slice

Choose this when the immediate milestone is a thesis demonstration or technical
proof. Connect the existing UI prototypes to the API, seed three levels and one
quiz/achievement, restrict the product to one child, and provide a deterministic
reset script. Do not describe simulated verification or local hosting as
production-ready.

**Exit evidence:** a new parent can complete the shared journey without database
editing; a repeat run does not duplicate rewards; automated E2E tests cover the
happy path and key authorization failures.

## Option B — Testable family pilot

This is the recommended default for learning value. It remains deliberately
small while making the journey credible enough for supervised user research.
Add real verification/reset delivery, polished state handling, accessible level
and quiz interactions, a short human-reviewed curriculum sequence, and a
protected staging environment. Keep one child per family during the pilot to
avoid widening the support surface.

**Exit evidence:** all shared flows pass automated and accessibility checks;
5–8 consented family sessions complete the protocol; severe usability defects
are resolved or explicitly accepted; backup/restore and deletion are exercised.

## Option C — Operational beta

Choose this only when the owner intends to serve users outside a supervised
study. It adds multiple children, production operations, privacy lifecycle,
support/admin tooling, curriculum publishing discipline, and monitoring. These
features create substantially more policy and maintenance work and should not be
accepted merely because their domain models already exist.

**Exit evidence:** the Option B evidence plus threat/privacy review, operational
ownership, alert response, restore and rollback drills, documented retention and
deletion, support triage, and explicit beta capacity limits.

## Owner decision record

Before implementation, the owner completes this table:

| Decision                     | Owner entry                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Selected option and date     | _A, B, or C; date_                                                               |
| Primary learning objective   | _What uncertainty will this MVP reduce?_                                         |
| Target users and recruitment | _Age band, guardians, sample size, consent_                                      |
| Success measures             | _Completion, comprehension, usability, retention, or another measurable outcome_ |
| Time/capacity limit          | _Calendar and team constraints_                                                  |
| Included deviations          | _Explicit additions and why they are necessary_                                  |
| Excluded/deferred work       | _Named features and trigger for reconsideration_                                 |
| Risk acceptance              | _Privacy, safety, accessibility, curriculum, and operational owner_              |

## Scope-control rules

- A feature is in scope only when it supports the chosen learning objective or a
  required safety, privacy, accessibility, or operational control.
- Use one vertical journey before adding breadth; avoid parallel dashboards,
  social features, purchases, leaderboards, chat, or AI-generated child content.
- Each included item needs acceptance evidence and an owner; each deferred item
  needs a reconsideration trigger, not an implied promise.
- Changes to option, target users, personal-data handling, or deployment model
  require a new owner decision and risk review.
