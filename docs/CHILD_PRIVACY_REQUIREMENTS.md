# Child privacy, consent, and abuse-prevention requirements

**Prepared:** 2026-07-15  
**Status:** Engineering and research checklist—not legal advice  
**Approval owners:** Product owner, privacy/legal reviewer, safeguarding lead

## Source and jurisdiction boundary

The checklist uses official guidance from the
[US FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions),
the [European Commission's child-data safeguards](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en),
and the UK ICO
[Children's Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/).
These sources illustrate requirements; they do not determine which laws apply.
Before release, counsel must identify every user/deployment jurisdiction,
controller/processor role, lawful basis, age threshold, school exception,
cross-border transfer, breach-notification duty, and required contract.

## Release-blocking checklist

| Area                 | Requirement                                                                                                                                                     | CodeKids implementation impact                                                                                                                    | Evidence before release                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Data inventory       | Catalogue every parent/child field, derived event, log, upload, cookie, recipient, purpose, location, and retention rule.                                       | Include auth, birth year, progress, time, quiz attempts, Blockly workspace, XP, avatar, invitations, and admin audit data.                        | Approved data map and owner per field.                                                |
| Minimisation         | Collect only data necessary for an active feature; never condition participation on extra child data.                                                           | Prefer age band over full birth date; nickname over legal name; no location, contacts, chat, ad ID, biometrics, or third-party tracking.          | Field-by-field necessity decision and disabled analytics proof.                       |
| Child-first defaults | Highest-privacy settings by default; no profiling, sharing, public profile, discoverability, or manipulative privacy nudges.                                    | Keep learning data private to child/verified guardian and authorized operations staff.                                                            | Default-state screenshots and API authorization tests.                                |
| Notice               | Give guardians complete notice and children short, age-appropriate explanations.                                                                                | Explain what parents can see, when activity/time is recorded, why rewards exist, and how to get help.                                             | Readability/child comprehension test and versioned notices.                           |
| Consent/lawful basis | Obtain and verify required guardian authorization before child data collection; record scope/version/time/method and withdrawal.                                | Invitation is not consent. Child creation must be gated by an approved consent record when legally required.                                      | Counsel-approved flow, consent ledger, verification test, withdrawal test.            |
| Guardian rights      | Authenticated guardians can review, correct, export, delete, stop collection, and withdraw permission.                                                          | Export a structured package; deletion covers children, progress, quiz attempts, workspaces, XP/rewards, avatars, sessions, and processor copies.  | Identity-verification procedure, export fixture, deletion cascade/backup expiry test. |
| Retention            | Keep child data only for documented necessity, then securely delete.                                                                                            | Define durations per data class; expire pending invitations quickly; separate short operational logs from learning records and legal audit holds. | Retention schedule, automated jobs, deletion reports, exception approval.             |
| Security             | Least privilege, encryption in transit/at rest, secret rotation, session revocation, dependency/incident management.                                            | Apply parent ownership and role checks to every object; prevent IDOR; redact tokens, answers, child identifiers, and request bodies from logs.    | Threat model, penetration test, restore/deletion test, incident drill.                |
| Vendors/transfers    | Use only reviewed processors with child-data terms, security commitments, subprocessor/region disclosure, deletion support, and no independent advertising use. | Default to no third-party analytics, ads, pixels, AI training, or CDN-hosted child uploads.                                                       | Vendor register, DPAs, transfer mechanism, deletion verification.                     |
| Research/analytics   | Aggregate the minimum; prohibit advertising, ranking, unrelated profiling, and raw replay tools.                                                                | Use coarse counts and durations; suppress small cohorts; separate consented research exports from operations.                                     | Metric purpose register, access query audit, re-identification review.                |
| Safeguarding         | Provide a clear escalation route without adding open communication risks.                                                                                       | No child-to-child chat, public sharing, free-text bios, or unsolicited contact in MVP.                                                            | Abuse threat model, reporting/triage SLA, trained owner.                              |

## Consent lifecycle

1. Determine age band and jurisdiction with the least intrusive approved method,
   or apply child protections to all users where appropriate.
2. Show direct guardian notice: operator identity, fields, purposes, disclosures,
   retention, rights, contact, and optional feature choices.
3. Use a legally approved verifiable method and bind consent to the authenticated
   guardian, child, notice version, purposes, timestamp, and evidence reference.
4. Create/activate the child only after the required authorization; do not use a
   child-supplied parent email for anything beyond notice/consent acquisition.
5. Re-consent for material new purposes; make withdrawal as easy as acceptance.
6. On withdrawal, stop optional collection immediately and execute the approved
   deletion/restriction path while preserving only documented lawful holds.

## Invitation abuse prevention

The current cooldown and rolling daily limit are useful controls, not proof of
consent. Production requirements are:

- return a generic response that does not reveal whether a parent account exists;
- rate-limit by normalized destination and abuse-resistant client/network signal;
- use single-use, high-entropy, short-lived tokens stored as hashes, never logs;
- do not place invitation tokens in analytics, URLs sent to third parties, or
  support screenshots; revoke older pending tokens after acceptance/reissue;
- cap daily and account-level sends, add progressive friction and a global kill
  switch, monitor aggregate delivery/complaint rates, and block abusive sources;
- include purpose, expiry, ignore/report instructions, operator contact, and no
  child-written free text in messages;
- delete unused contact data after the approved notice window.

## Privacy-friendly analytics specification

- Maintain a metric register: question, owner, lawful purpose, input fields,
  aggregation, minimum cohort, retention, and deletion behavior.
- Prefer server-side counters already needed for the service. Do not capture full
  URLs with tokens, keystrokes, pointer trails, session replay, precise device
  fingerprint, location, contacts, or raw Blockly/quiz content for analytics.
- Use rotating pseudonymous identifiers only when aggregation cannot answer the
  question; keep the identity mapping separate with restricted access.
- Report family/child results only to that verified family. For research/export,
  remove direct identifiers, generalize rare attributes, suppress small groups,
  document residual re-identification risk, and require approved access.
- Analytics off means no collection, not merely no dashboard display.

## Export, deletion, and retention implementation

| Data class           | Export                                   | Deletion behavior                                              | Proposed maximum pending approval                             |
| -------------------- | ---------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| Pending invitation   | Guardian email, state, timestamps        | Delete token/contact after expiry or rejection                 | 7 days plus short abuse-only aggregate                        |
| Child profile/avatar | Profile fields and owned asset           | Delete database row and private object/derivatives             | Active account; prompt removal on request                     |
| Learning/progress    | Levels, attempts, duration, resume state | Cascade progress and workspaces                                | Active learning relationship plus owner-approved grace period |
| Quiz/XP/rewards      | Attempts/results and event history       | Cascade attempts, XP, and reward records                       | Same as learning record                                       |
| Auth/session         | Session metadata, not hashes/tokens      | Immediate refresh revocation; operational logs expire          | Short security window defined by reviewer                     |
| Admin/security audit | Relevant action history                  | Restrict/anonymize subject where lawful; documented holds only | Counsel-approved security/legal window                        |
| Backups              | State coverage and backup dates          | Cryptographic deletion or expiry through backup rotation       | Shortest operationally proven restore window                  |

Proposed durations are placeholders until the owner and legal reviewer approve a
jurisdiction-specific schedule. A deletion is complete only when primary data,
search/index/cache/object copies, processors, and expired backups are covered and
an auditable completion record remains without recreating child data.

## Required human decisions

- Launch countries/regions, child age bands, school/home context, and applicable
  COPPA/GDPR/UK or local child, education, consumer, accessibility, and research law.
- Controller/processor roles, lawful bases, verifiable consent method, age
  assurance proportionality, notice text, retention periods, and legal holds.
- Whether parent monitoring is necessary and how the child is clearly informed;
  the ICO warns that parental controls also affect a child's privacy.
- Vendor/hosting regions, incident and regulator/guardian notification process,
  safeguarding escalation, research ethics approval, and responsible staff.
- Final acceptance of the data map, DPIA/child-best-interests assessment, threat
  model, consent usability study, deletion/export evidence, and launch decision.
