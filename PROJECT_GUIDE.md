# codeKids Project Guide

This guide is the binding working foundation for `codeKids`.
It applies to the backend, frontend, future extensions, and collaboration with AI assistance.

## 1. Goal

The project should:

- remain technically consistent,
- be documented clearly,
- remain understandable for the bachelor's thesis,
- and be extendable without stylistic breaks.

All rules in this document are to be understood as `MUST` unless explicitly marked otherwise.

## 2. Core Principles

### 2.1 Clean Code

- Code solves exactly one problem per component, file, or function.
- Readability takes priority over clever shortcuts.
- Duplicates should be reduced, but not replaced by unnecessary abstraction.
- New dependencies may only be introduced if their benefit is clearly justified.
- Incomplete workarounds without a comment or ticket are not allowed.

### 2.2 Consistency Over Personal Style

- Existing conventions must be followed.
- New patterns may only be introduced if they are documented and can be applied consistently across the project.
- Mixed styles in naming, folder structure, colors, icons, or API behavior must be avoided.

### 2.3 Simplicity

- Prefer simple, understandable solutions.
- No overengineering.
- No "precautionary" patterns for problems that do not actually exist in the project yet.

## 3. Language

- Code, identifiers, commit messages, branch names, API responses, and technical comments must be in English.
- Academic notes, bachelor's thesis context, and organizational documentation may be in German.
- UI texts must be written in the final product language of the respective screen. Unless defined otherwise, production UI texts should be created in German.

## 4. Naming

- Variables and functions: `camelCase`
- Classes, types, interfaces, DTOs, React components: `PascalCase`
- Constants and environment variables: `UPPER_SNAKE_CASE`
- Files and folders: `kebab-case`
- React component files: `PascalCase.tsx` is allowed if the frontend stack already uses it; otherwise, `kebab-case` remains the default. Before introducing a style, it must be defined once and then followed strictly.

Unclear names such as the following are forbidden:

- `data`
- `item`
- `temp`
- `stuff`
- `handleIt`
- `doSomething`

## 5. Project Structure

### 5.1 General

- Domain structure takes priority over technical catch-all structure.
- Every file has a clear responsibility.
- Shared utilities should only go into shared areas when there is real reuse.

### 5.2 Backend

- The backend follows the existing NestJS module structure.
- Controllers must not contain business logic.
- Services contain the business logic.
- DTOs must be used for inputs and outputs as soon as data crosses an API boundary.
- `any` is not allowed unless it is technically unavoidable and briefly justified.

Note: The repository-wide style guide in [STYLEGUIDE.md](/Users/rominamirmehdi/Desktop/bht/Bachloer/codeKids%20Turborepo/codekids/STYLEGUIDE.md) remains valid and is complemented by this document at the project level.

### 5.3 Frontend

The following rules become binding as soon as the frontend is implemented or extended:

- Components are structured by domain responsibility, not as unclear catch-all folders.
- Presentation logic and data logic must be kept separate.
- Reusable UI building blocks belong in a clearly named `ui` or `components` area.
- Page logic must not contain uncontrolled inline styles or ad hoc color values.
- Accessibility is mandatory: semantic HTML elements, meaningful labels, keyboard accessibility, and sufficient contrast.

## 6. Frontend Design System

### 6.1 Color Rule

The frontend uses fixed, centrally defined colors with a Thailand reference. Individual components must not introduce their own "random" colors.

Binding core palette:

- `--color-thai-red: #A51931`
- `--color-thai-blue: #2D2A4A`
- `--color-thai-white: #F8F7F4`
- `--color-sand: #E9D8B4`
- `--color-leaf: #5B8C5A`
- `--color-ink: #1F2430`

Rules:

- Colors are used exclusively through design tokens or CSS variables.
- No hex values directly inside components, except in the central theme file.
- Red and blue are brand colors and must not be arbitrarily replaced by other primary colors.
- Status colors such as error, success, or warning must also be defined centrally.

### 6.2 Icons

- Only `lucide-react` is allowed as the icon library.
- No mixing with Heroicons, Font Awesome, Material Icons, or SVG imports from external sources unless this is functionally required and explicitly documented.
- Icon sizes, stroke widths, and colors are controlled through central UI conventions.

### 6.3 Typography and Spacing

- Fonts, sizes, spacing, border radius, and shadows are defined centrally.
- No random one-off values per component.
- Spacing follows a fixed scale, for example `4 / 8 / 12 / 16 / 24 / 32`.

## 7. Implementation Rules

### 7.1 Before Every New Feature

Before implementation, it must be clear:

- which problem is being solved,
- which file or module is responsible,
- which data goes in and out,
- and how the behavior will be tested or at least manually verified.

### 7.2 During Implementation

- No dead imports.
- No commented-out code blocks in the final state.
- No debug logs in the final state.
- Functions should remain small and clearly named.
- Nesting should be kept as flat as possible.
- Error cases must be handled intentionally and not "swallowed."

### 7.3 After Implementation

- Linting must pass without new warnings or errors.
- Relevant tests must be run, or justified if no test foundation exists yet.
- New technical decisions must be documented if they affect project behavior or architecture.

## 8. Tests and Quality

- Every bug fix should, if possible, be backed by a test or at least a clearly documented reproduction case.
- Critical logic must not be added untested if the project already has a suitable test environment.
- Snapshots without clear value should be avoided.
- "Seems to work" is not a quality criterion.

## 9. API and Data Rules

- API names must be domain-clear and stable.
- Error responses must be specific.
- Inputs must be validated before business logic is executed.
- Database fields and API fields must be named deliberately; abbreviations without domain value should be avoided.

## 10. Documentation

The following must be documented when newly introduced:

- new libraries,
- new architectural decisions,
- new global UI rules,
- new environment variables,
- new AI-related ways of working, if they are subject to documentation for the bachelor's thesis.

Short decisions may be documented directly in Markdown files in the repo. Documentation should be concise, but reliable.

## 11. AI Usage in the Project

- AI may help with technical wording, refactoring, structure suggestions, UI ideas, and implementation support.
- Full responsibility for the domain remains with the project.
- Every adopted suggestion must be understood, reviewed, and adjusted if necessary.
- Code or text must not be adopted blindly.
- For thesis-relevant content, the appendix in [AI_USAGE_APPENDIX.md](/Users/rominamirmehdi/Desktop/bht/Bachloer/codeKids/AI_USAGE_APPENDIX.md) also applies.

## 12. Non-Negotiable Prohibitions

- No unexplained copy-paste solutions from the internet or AI output.
- No second icon library alongside `lucide-react`.
- No inconsistent color systems.
- No mixing of German and English in technical identifiers.
- No business logic in controllers or later in purely presentational components.
- No "temporary" quick fixes without visible tracking.

## 13. Working Rule for Future Collaboration

If new rules are added, they are not only stated verbally but also written into this guide. This guide is therefore the single source of truth for style, structure, and technical discipline in `codeKids`.
