# Skip-level criteria proposal

**Prepared:** 2026-07-15  
**Status:** Decision support only; educational logic is not approved  
**Decision owners:** Curriculum educator and product owner

## Principle

A skip is an optional shortcut, not a judgment about ability. The system may
offer it only when multiple recent signals suggest that the next level repeats
skills the child has already demonstrated. The child can decline without
penalty, change their mind, revisit skipped material, or ask an adult for help.

Response time is a confidence hint only after accessibility and device effects
are considered. It must never independently cause a skip, block progress,
compare children, or appear as pressure to finish faster.

## Signals and safeguards

| Signal          | Example evidence                                                                                | Guardrail                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Performance     | High score across at least two distinct activities measuring the prerequisite skill             | Do not reuse identical questions or reward memorization as mastery.                                                               |
| Correct answers | Correct first attempts plus an explanation, debug action, or transfer task                      | Require meaningful evidence, not completion alone.                                                                                |
| Response time   | Stable completion within a broad educator-set band compared with the child's own prior attempts | Ignore during first exposure, accessibility accommodations, interruptions, offline sync, or unreliable device/network conditions. |
| Error pattern   | No repeated misconception on the target prerequisites                                           | A safety-critical or foundational misconception prevents an automatic offer and triggers support.                                 |
| Recency         | Evidence collected recently enough to represent current understanding                           | Expire old evidence; do not assume a skill remains mastered indefinitely.                                                         |
| Learner choice  | Child explicitly chooses “Try the next level”                                                   | Offer “Keep practising” with equal visual weight and no negative wording.                                                         |
| Adult choice    | Guardian/educator can disable suggestions or review a pending recommendation                    | Never expose competitive ranking or label the child as fast/slow.                                                                 |

## Implementation options

| Option                   | Decision rule                                                                               | Strength                                                       | Risk/mitigation                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| A — Manual suggestion    | After viewing evidence, an educator/guardian offers or approves a skip.                     | Highest human oversight; suitable for early pilots.            | Slower and subjective; show a consistent evidence summary and record rationale.                 |
| B — Rules-based offer    | A transparent versioned rule creates a child-facing offer when all required gates pass.     | Testable, explainable, and scalable without opaque profiling.  | Threshold bias; pilot across ages/access needs and audit offer/accept/return rates.             |
| C — Diagnostic challenge | The child opts into a short, accessible transfer challenge; success unlocks the next level. | Directly samples the target prerequisite and preserves agency. | Extra assessment may feel like a test; keep it brief, retryable, private, and consequence-free. |

**Recommended pilot:** combine A and C. An adult enables the feature; the child
chooses whether to try a short diagnostic. Consider B only after educators have
reviewed pilot evidence and approved versioned thresholds.

## Candidate rules for educator review

These numbers are test values, not educational conclusions:

1. Use evidence from at least two different activities and one transfer or
   explanation item covering every prerequisite of the candidate level.
2. Require an educator-defined accuracy band (initial test value: at least 85%)
   and no unresolved foundational misconception.
3. Treat response time only as a supporting signal when at least three comparable
   uninterrupted attempts exist; cap its weight below accuracy and transfer.
4. Offer no more than one level at a time. Never chain automatic skips.
5. Expire a recommendation after 14 days or after new contradictory evidence.
6. Require a fresh explicit choice for each offer; silence is a decline.
7. Keep skipped levels available and offer a neutral “Review this level” route.

## Child-facing interaction

Suggested wording:

> You handled these ideas well. Would you like to try a quick challenge for the
> next level, or keep practising here? You can come back anytime.

Both actions use equal emphasis:

- **Try the challenge**
- **Keep practising**

Do not display timers, ability labels, streak loss, celebratory superiority,
warnings about being behind, or comparisons with siblings/classmates. After a
decline or unsuccessful challenge, respond neutrally and do not repeat the offer
during the same session.

## Decision flow

1. Confirm the candidate level's prerequisite map is complete and versioned.
2. Collect eligible evidence; exclude invalid time samples and accommodated
   interactions that are not comparable.
3. If any prerequisite evidence is missing or contradictory, continue normally
   and optionally offer support—not a skip.
4. Under Option A, show the evidence to the adult. Under B, evaluate the approved
   rule. Under C, invite the child to opt into the diagnostic.
5. Record offer, choice, rule/content version, broad evidence categories, result,
   and later return—without ranking or unnecessary raw interaction telemetry.
6. Unlock only the next level. Preserve access to the skipped level and provide
   an easy undo.

## Required validation before release

- Educators approve prerequisites, evidence tasks, thresholds, expiry, wording,
  and what counts as a foundational misconception.
- Child testing checks comprehension, pressure, disappointment, accidental taps,
  and willingness to decline across target ages and languages.
- Accessibility testing covers screen reader, keyboard/switch access, extra time,
  reduced motion, readable language, and alternatives to audio/color cues.
- Privacy review limits timing/behavior telemetry, retention, access, and use;
  skip evidence is never used for advertising or unrelated profiling.
- Monitoring compares offer, acceptance, successful transfer, return, and opt-out
  rates by age band and access needs without presenting individual rankings.
- A kill switch disables offers without blocking the ordinary learning path.

## Owner approval record

| Decision                            | Required owner entry                   |
| ----------------------------------- | -------------------------------------- |
| Selected option                     | _A, B, C, or combination_              |
| Approved prerequisites and evidence | _Curriculum version/link_              |
| Approved thresholds and expiry      | _Rule version and rationale_           |
| Child-facing wording                | _Research/educator approval reference_ |
| Accessibility/privacy approval      | _Review references_                    |
| Pilot population and success limits | _Age band, sample, stop criteria_      |
| Approval names and date             | _Educator and product owner_           |
