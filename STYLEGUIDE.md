# Project Styleguide - codeKids

This styleguide defines coding conventions and workflow practices for the project **"codeKids"**.

`codeKids` is developed as part of a **Bachelorarbeit** and is currently maintained by **one developer**. The workflow rules below therefore focus on clarity, traceability, and consistency rather than team review processes.

## 1. Naming Conventions

### 1.1 Language

- **English:**  
  All permanent parts of the codebase must be written in English. This includes variables, constants, functions, methods, classes, interfaces, types, enums, file and folder names, API routes, backend error messages, commit messages, and code comments.

- **German:**  
  German may be used for project notes and thesis-related documentation.

- **User-facing content:**  
  As the current website is entirely in English, UI text, frontend error messages, onboarding copy, and similar user-facing content must also be written in English unless the product language is changed intentionally later.

### 1.2 Variables and Constants

- **Local variables and function arguments:** `lowerCamelCase`
  ```ts
  const childProfile = getChildProfile(id);
  ```
- **Constants:** `UPPER_SNAKE_CASE` for shared fixed values, otherwise `lowerCamelCase` if the value behaves like a normal variable in local scope
  ```ts
  const MAX_LOGIN_ATTEMPTS = 5;
  ```
- **Environment variables:** `UPPER_SNAKE_CASE`
  ```ts
  process.env.DATABASE_URL;
  ```

### 1.3 Functions and Components

- **React components:** `UpperCamelCase`
  ```tsx
  function LearningCard() {}
  ```
- **Functions and methods:** `lowerCamelCase`
  ```ts
  function calculateProgress(score: number) {}
  ```
- **Event handlers and callbacks:** `handle` or `on` prefix
  ```ts
  const handleSubmit = () => {};
  const onSuccess = () => {};
  ```

### 1.4 Classes, Interfaces, Types, Enums

- **Classes:** `UpperCamelCase`
  ```ts
  class ProgressService {}
  ```
- **Interfaces:** `UpperCamelCase` without `I` prefix
  ```ts
  interface UserProfile {}
  ```
- **Types:** `UpperCamelCase`
  ```ts
  type DifficultyLevel = 'easy' | 'medium' | 'hard';
  ```
- **Enums:** `UpperCamelCase` with descriptive members
  ```ts
  enum UserRole {
    CHILD = 'CHILD',
    PARENT = 'PARENT',
    ADMIN = 'ADMIN',
  }
  ```

## 2. Git Workflow

### 2.1 Branch Strategy

As `codeKids` is a solo project, the branch strategy should stay lightweight.

| Branch       | Purpose                                                  |
| ------------ | -------------------------------------------------------- |
| **main**     | Stable project state                                     |
| **feat/\***  | New features                                             |
| **fix/\***   | Bug fixes                                                |
| **docs/\***  | Documentation changes, including thesis-related material |
| **refactor/\*** | Internal restructuring without intended behavior change |

### 2.2 Branch Naming

- Branch names should be short, descriptive, and written in English.
- Prefer names such as `feat/login-flow`, `fix/api-validation`, or `docs/styleguide-update`.
- For very small changes, direct commits to `main` are acceptable if traceability remains clear.

## 3. Commit Rules

### 3.1 Basics

- **Structure:**  
  `<type>(<scope>): <short imperative description>`
- Keep commit messages concise and descriptive.
- Reference a task, note, or thesis work package when it helps traceability, but this is optional in a solo workflow.

### 3.2 Types

| Type         | Meaning                                       |
| ------------ | --------------------------------------------- |
| **feat**     | A new feature                                 |
| **fix**      | A bug fix                                     |
| **docs**     | Documentation updates                         |
| **style**    | Formatting or style-only changes              |
| **refactor** | Internal code changes with no intended behavior change |
| **perf**     | Performance improvements                      |
| **test**     | Add or update tests                           |
| **chore**    | Maintenance tasks, dependency updates, config |
| **ci**       | CI or automation changes                      |
| **revert**   | Revert a previous commit                      |

### 3.3 Examples

| Bad             | Good                                          |
| --------------- | --------------------------------------------- |
| `updated stuff` | `feat(auth): add parent login flow`           |
| `fixed bug`     | `fix(api): validate empty progress payload`   |
| `cleanup`       | `refactor(web): simplify dashboard state`     |

## 4. Code Quality

| Purpose               | Tool / Rule                              | Recommended Configuration                          |
| --------------------- | ---------------------------------------- | -------------------------------------------------- |
| **Linting**           | ESLint                                   | Project-wide shared config                         |
| **Formatting**        | Prettier                                 | Consistent formatting across all packages          |
| **Type checking**     | TypeScript                               | `strict: true` where feasible                      |
| **Imports**           | Clear and stable import ordering         | Prefer automatic sorting via ESLint or formatter   |
| **Documentation**     | Markdown documents in the repository     | Keep technical decisions and thesis context traceable |

## 5. Documentation Rules

- Document non-obvious technical decisions.
- Keep README files aligned with the actual project state, not with starter templates.
- If a decision is relevant for the Bachelorarbeit, record it in a way that can be reused later in the written thesis.
