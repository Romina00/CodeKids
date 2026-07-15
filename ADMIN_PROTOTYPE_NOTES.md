# Admin Panel Prototype Notes

Prototype route: `/admin`

- The overview separates aggregate platform health from account and content operations.
- User rows expose role and status before block/unblock actions. Production actions must require confirmation, a reason, authorization, and an immutable audit event.
- Learning levels show order, activity count, and publication state; editing and publishing remain separate concepts.
- Landing content cards show publication/schedule state and last-change context so editorial actions are reviewable.
- Statistics are labeled by time window or aggregation meaning and avoid child-level analytics.
- The responsive table remains horizontally scrollable rather than hiding security-relevant columns.

The prototype contains no privileged data mutation. Authorization, confirmation dialogs, recovery policy, content versioning, and audit-log behavior are implemented in later backend/admin tasks.
