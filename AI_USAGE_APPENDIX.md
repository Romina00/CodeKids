# AI Usage Appendix

This appendix transfers the underlying rule concept from the provided agreement to the `CodeKids` project.
It is written so that it can be used as a working basis for the bachelor's thesis and for ongoing development.

## 1. Goal

Generative AI may support the work, but it must not replace the independent core contribution.
What remains decisive is that domain decisions, justifications, selection processes, and the concept relevant for evaluation can be fully understood and defended by the author herself.

## 2. Permitted AI Support

For `CodeKids`, AI support is permitted in the following areas:

- technical code structuring,
- refactoring suggestions,
- explanation of existing framework features,
- support for UI prototypes,
- support for landing page implementation,
- support for animations and visual refinement,
- support for backend implementation,
- linguistic revision of texts already written independently,
- ideas for starting research or for comparison criteria regarding related products.

## 3. Non-Permitted AI Usage

AI usage is not permitted for:

- fully generating academic text passages,
- domain argumentation that was not developed independently,
- describing solution concepts without one's own derivation,
- interpreting results without one's own analysis,
- justifying technical or methodological decisions that were not personally understood,
- delegating the core work to be evaluated to AI.

## 4. Core Contributions That Must Be Produced Independently

The following points remain the author's own intellectual work:

- researching and selecting relevant sources,
- methodologically justifying the research,
- analyzing similar products,
- defining the domain goals,
- justifying the target group and its requirements,
- the domain UI and UX concept,
- the learning logic concept for children,
- the parent features concept,
- the authentication and role logic at the conceptual level,
- justifying the technology selection,
- structural decisions for the overall solution,
- evaluating and classifying the results.

## 5. Binding Working Rule

Any AI contribution may only be adopted if all of the following conditions are met:

- The content was understood from a domain perspective.
- The content was adapted to the project.
- The content was checked for correctness.
- The usage can later be documented transparently.

If any of these points is not fulfilled, the AI contribution must not be adopted as final project work.

## 6. Documentation Requirement

Every relevant AI usage must be recorded. The documentation should contain at least the following fields:

- tool / model
- purpose
- affected sections / files / artifacts
- type of usage
- short prompt or meaningful prompt description
- own review / adaptation

## 7. Documentation Template

The following table can be used directly for the bachelor's thesis or the project documentation:

| Tool / Model | Purpose | Affected Sections / Code Parts / Artifacts | Type of Usage | Example Prompt | Own Review / Adaptation |
| --- | --- | --- | --- | --- | --- |
| e.g. Codex / GPT | Refactoring a NestJS service | `src/auth/auth.service.ts` | Structure suggestion and code revision | "Refactor this service for clearer responsibility boundaries." | Reviewed the suggestion, adjusted exceptions, standardized naming |

## 8. Short Version for Daily Practice

Whenever AI is used in the project, this internal short rule always applies:

1. AI may help.
2. AI may not decide.
3. AI output may not be adopted without review.
4. Responsibility remains with the author.
