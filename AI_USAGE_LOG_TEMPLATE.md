# AI Usage Log Template

Use one entry for each material task or clearly related kind of AI use. This template follows the documentation fields in the author's supplied `Vereinbarung-Einsatz-KI.docx`. Keep entries in English to follow the repository guide. Remove placeholders before adding an entry to the log. Mark missing information as unknown rather than guessing.

Documentation records what actually happened; it does not by itself authorize a use or demonstrate compliance with the agreement. Distinguish original hand-written work from later AI edits and from AI-assisted shared components.

## Confirmed project attribution to preserve in future entries

The author's clarified contributions are: independent research and architecture; original folder creation; technology selection; original style guide and AI instructions; fixed colors and Lucide rules; Milo's Figma/SVG design and original integration; all original learning games; original Kids and parent dashboards; game-specific database connections/integration; and the authentication concept, requirements, and reported personal review.

Delegated AI implementation covers the landing page, admin page, registration/login, and backend/general persistence, with the author's game-specific database integration explicitly excluded. Later AI styling/refactoring, shared-component changes, checks, Docker work, and AI-log drafting must be recorded separately. File-level boundaries and unknown historical details must not be guessed. These project facts belong in the completed log; the fields below remain a reusable template, not a second completed historical record.

## Entry: [Task or type of use]

### Record details

| Field          | Value                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Date or period | [Actual date/range; say if retrospective or unknown]                                                                      |
| Tool and model | [Tool, model/version if known, and source of that information]                                                            |
| Purpose        | [Specific intended outcome]                                                                                               |
| Type of use    | [Research starting point, language revision, prototype, generation, refactoring, debugging, testing, documentation, etc.] |
| Evidence       | [Conversation reference, author statement, commit/diff, or other available record]                                        |

### Affected sections, code and artifacts

- [Relative path, thesis section, asset or other artifact]: [What was affected].
- Original work: [Who created it; distinguish author statement from verified history].
- Later AI changes: [Exact scope, including data handling, logic, styling, or shared dependencies].
- Accepted revision: [Commit/diff if available; unknown otherwise].

For database work, distinguish schema/entities, migrations, seed/learning content, backend services, and frontend data access. Do not infer authorship from the page that displays the data. If no files changed, state this and name the reviewed material.

### Meaningful prompt examples

> [Representative actual prompt, with private data removed. Label translations, paraphrases and omissions.]

[Relevant context and constraints. A request alone is not evidence that the resulting change was adopted.]

### AI contribution and adoption

[What AI generated, suggested, explained, changed, or checked. State what was adopted, rejected, reverted, or still only proposed. Do not claim an entire area was AI-free if it later received AI edits.]

### Distinguishing design from implementation

[Record architecture, product ideas, artwork creation, and implementation separately. An AI implementation of the author's concept does not make that concept AI-generated. For example, distinguish an author-created Figma/SVG asset from later AI-assisted integration or styling, and an author-designed login flow from AI-generated login code. When the author corrects an earlier attribution, identify the superseded statement and preserve independently observed later AI changes.]

### Architecture, folder structure and delegated coding

- Research and source selection: [Who researched examples, selected approaches, and adapted them; cite actual sources where available].
- Architecture and technology decisions: [Who defined the structure, tools, responsibilities, and requirements].
- Initial folder creation: [Who physically created the original folders; do not infer AI authorship from later edits inside them].
- Design and development rules: [Who created the style guide, fixed colors, icon rules, and instructions supplied to AI].
- Delegated coding: [Which target folders and concrete requirements the author provided, and what code or configuration AI actually wrote].

For CodeKids, the author has clarified that she performed the original architecture research, designed the structure, created the folders, selected tools, and established the style/design rules herself. Attribute those contributions to her. Describe AI-written backend code as implementation under her instructions, not as creation of her architecture. Retain documented later AI edits as a separate contribution. Configuration may express architecture; the distinction is who made the decision and who implemented it, not whether code exists.

### Author's own contribution and review

[Actual independent decisions, hand-written implementation, checks, adaptations and reasons. If the review is pending or undocumented, say so. Do not substitute generic statements of responsibility for evidence of review.]

[For security review, state the actual checks reported or evidenced. Do not turn a general review of possible vulnerabilities into a claim of a successful penetration test or an unhackable system.]

### Relationship to the agreement

- Relevant category: [Category in the supplied agreement].
- Status: [Explicitly permitted / independent core work / unclear; explain the basis].
- Clarification: [Any difference between reported use and the agreement; record an actual amendment only if available].

The supplied agreement lists parent-page and learning-game implementation as independent core work. Do not silently classify full implementations as UI prototypes or cosmetic improvements. Describe the actual work and record unresolved differences.

### Verification and limitations

- Checks performed: [Actual checks and scope; distinguish mocked data from real integration checks].
- Results: [Pass, fail, partial, or not checked; include known failures].
- Remaining uncertainty: [Missing evidence, unverified authorship, or follow-up].

### If no AI was used

[Only include this when applicable to a precisely identified scope/period and supported by the author's account or records. Distinguish an independently written original version from subsequent AI-assisted revisions.]

## Completion checklist

- [ ] Tool/model and date are recorded, or explicitly marked unknown.
- [ ] Purpose, affected work and type of use are specific.
- [ ] Meaningful prompt examples are included and their quotation/summary status is clear.
- [ ] Adopted work is distinguished from requests, rejected suggestions and reverted changes.
- [ ] Original authorship, subsequent edits and shared dependencies are distinguished.
- [ ] Personal review and adaptations describe actual actions.
- [ ] Differences from the agreement are disclosed without assuming approval.
- [ ] Verification results and limitations are accurate.
- [ ] Sensitive data is omitted.
- [ ] The author has reviewed the entry before academic submission.
