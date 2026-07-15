# CodeKids Notes and Structured Project Outline

This document is an English, structured version of the contents from `Dokument.docx`.
It keeps the original ideas, but organizes them into clearer sections for further planning, implementation, and thesis documentation.

## 1. Main Areas

- UI / UX
- Frontend
- Backend
- Database

## 2. Notes From the Meeting on June 3, 2026

Meeting with Schirmacher on June 3, 2026:

- Instead of forcing a multiple-choice level immediately, consider checking whether the child is doing well and asking: "Would you like to skip this?"
- Document clearly what was created by AI and what was created independently.
- Save prompts or document them in comments or a separate appendix.
- Define a design system.
- The web application should run on macOS, Windows, and similar platforms.
- Include scientific references or a proper academic basis for website-related decisions where needed.

## 3. General Concept Notes

- Describe the implementation concept in detail, but do not make it unnecessarily long.
- Explain why these specific tasks and features were chosen.
- Use free and accessible technologies where possible.

## 4. Platform Overview

### 4.1 Landing Page

The landing page should explain what the platform does and attract users to the platform.

Core functions:

- project introduction
- user acquisition
- login
- sign-up

### 4.2 Kids Panel

The Kids Panel should be simple and easy for children to understand.
Navigation and actions should be easy to find.

Possible entry points:

- Beginner button
- Knowledge check for children who already know some topics

Planned features:

- multiple-choice tests
- study content with game-based interaction
- reward system to motivate and challenge children
- child profile including:
  - editable display name
  - birth date
  - profile picture
  - history of points earned through games

### 4.3 Parent Panel

The Parent Panel should help parents track their child's learning progress.

Planned features:

- separate parent login
- parent entry button visible on the website
- overview of the child's learning progress
- learning process tracking
- time spent on the website
- history of completed levels

### 4.4 Admin Panel

Planned features:

- dashboard overview
- user management
- block users
- change passwords
- kid status overview
- level management
- edit landing page buttons or content

## 5. Technical Direction

### 5.1 Frontend

Planned technologies and topics:

- Next.js
- TypeScript
- animation library
- icon library
- CSS with `shadcn`
- custom color palette in `tailwind.config.js`
- style guide
- possibly `lucide-react`
- Husky
- Swagger
- ESLint, for example:
  - `"lint": "eslint . --ext .js,.jsx,.ts,.tsx"`

### 5.2 Gamification and Content Research

Still under research:

- whether Scratch Junior open-source material can be reused
- puzzle-based interactions
- CodeMonkey as a reference example:
  - `https://www.codemonkey.com`
- whether an embedded game should be used
- K-12 computer science standards as a reference:
  - `https://csteachers.org/k12standards/interactive/`
- Code.org curriculum as a content reference:
  - `https://code.org/en-US/curriculum/computer-science-discoveries?utm_source=chatgpt.com`
- whether video content is possible
- define the minimum viable scope

### 5.3 Backend

Planned technologies:

- NestJS
- TypeORM for database connection

### 5.4 Database

Planned database:

- MySQL

## 6. Existing Project Foundation

Already available or already decided:

- Husky
- linting
- Swagger
- folder structure
- modules
- MySQL database
- Turborepo architecture:
  - `https://turborepo.dev/docs/getting-started/installation`

Reason for using Turborepo:

- one repository in Git
- shared DTO usage across applications

Reference:

- `https://github.com/vercel/turborepo/tree/main/examples/with-nestjs`

## 7. Technology Selection and Architectural Decisions

### 7.1 Backend Framework: NestJS

The backend is implemented with NestJS, a progressive Node.js framework built on TypeScript.
NestJS was chosen because it provides a clear, modular structure that fits larger applications with multiple roles and domains.

Reasons for choosing NestJS:

- built-in TypeScript support
- modular architecture
- dependency injection
- separation of concerns
- maintainability
- scalability
- extensive documentation
- industry relevance
- easy integration with databases and authentication systems

The modular architecture allows separation into areas such as:

- authentication
- user management
- learning content
- administration
- parent features

### 7.2 Database: MySQL

MySQL was selected for persistent data storage because the platform manages highly structured data.

Examples of stored data:

- users
- learning progress
- levels
- quizzes
- achievements
- rewards

Reasons for choosing MySQL:

- reliable and mature database system
- open source and free to use
- strong performance
- good NestJS integration
- supports complex relationships
- widely used in industry
- easy deployment and maintenance

Relevant relationships include:

- users and progress
- users and rewards
- parents and children
- levels and activities
- quizzes and questions

### 7.3 ORM: TypeORM

TypeORM is used as the ORM between NestJS and MySQL.

Reasons for choosing TypeORM:

- native NestJS integration
- entity-based database design
- migration support
- TypeScript support
- simplified database operations

TypeORM makes it possible to represent the database as TypeScript classes instead of raw SQL.

### 7.4 API Documentation: Swagger

Swagger is used to generate API documentation automatically.

Reasons for choosing Swagger:

- automatic API documentation
- easy endpoint testing
- better maintainability
- simpler frontend-backend communication
- industry-standard solution

Example endpoints:

- `POST /auth/login`
- `GET /learning/levels`
- `POST /learning/quiz/submit`

### 7.5 Code Quality: ESLint

ESLint is integrated to keep code quality consistent.

Reasons for choosing ESLint:

- consistent coding style
- early error detection
- improved readability
- better maintainability
- readiness for team development

Example command:

```bash
npm run lint
```

### 7.6 Git Hooks: Husky

Husky is used to automate code quality checks before commits.

Planned or existing pre-commit checks:

- search for `console.log`
- run ESLint
- block commits when violations are found

Reasons for choosing Husky:

- improved code quality
- prevents debugging code from reaching production
- automated validation
- cleaner repository management

### 7.7 Authentication and Authorization

Authentication is based on JSON Web Tokens (JWT).
Passwords are hashed using bcrypt.

Reasons for choosing JWT:

- stateless authentication
- scalable session handling
- industry standard
- easy frontend integration

Reasons for choosing bcrypt:

- secure password hashing
- salt generation
- protection against password leaks

Role-based access control includes:

- Kid
- Parent
- Admin

Each role should only access features relevant to its responsibilities.

## 8. Modular Architecture

The application follows a modular architecture and is separated into business domains instead of a single large module.

Advantages:

- better maintainability
- improved scalability
- clear separation of responsibilities
- easier testing
- easier future extensions

### 8.1 Auth Module

Responsible for:

- registration
- login
- JWT authentication
- password management
- authorization

### 8.2 Users Module

Responsible for:

- user profiles
- user management
- user settings
- role assignment

### 8.3 Learning Module

The Learning Module contains the core business functionality of the platform.

Responsibilities:

- learning levels
- activities
- Blockly tasks
- quizzes
- progress tracking
- XP system
- rewards
- achievements

Reason for grouping these features into one module:

- learning is the main purpose of the platform
- separate modules for every learning feature would add complexity
- a single module is easier to understand
- a single module is easier to maintain
- a single module is easier to explain in the bachelor's thesis
- it fits the scale of the project better

### 8.4 Parent Module

Responsible for:

- monitoring child progress
- viewing completed levels
- viewing earned rewards
- viewing learning statistics

### 8.5 Admin Module

Responsible for:

- user management
- learning content management
- level management
- system administration
- platform statistics

### 8.6 Upload Module

Responsible for:

- avatar uploads
- profile picture management

## 9. Proposed Backend Project Structure

```text
src/
|-- config/
|-- common/
|-- auth/
|-- users/
|-- learning/
|-- parents/
|-- admin/
|-- upload/
`-- database/
```

Advantages:

- clear project organization
- separation of business domains
- improved readability
- easier maintenance
- support for future growth

## 10. Authentication and User Management Requirements

### 10.1 Project Context

CodeKids is a gamified web-based learning platform for children aged 10 to 15.

User groups:

- Kids
- Parents
- Administrators

Main goals:

- child safety
- parental control
- simple onboarding

### 10.2 General Authentication Concept

Only parents are allowed to create platform accounts.
Children are not allowed to register directly.

Reasons:

- ensure parental consent
- simplify authentication
- improve child safety
- reduce account abuse
- comply with privacy requirements for younger users

### 10.3 Landing Page Entry Points

The landing page should contain two main actions:

- `I am a Kid`
- `I am a Parent`

### 10.4 Parent Registration Flow

When the user clicks `I am a Parent`, show a standard registration form.

Fields:

- email
- password
- confirm password

Requirements:

- validate email format
- password must meet minimum security requirements
- passwords must be hashed with bcrypt
- email must be unique

After successful registration:

- create parent account
- automatically log in the parent
- redirect to the Parent Dashboard

### 10.5 Parent Login Flow

Fields:

- email
- password

Requirements:

- JWT authentication
- secure session handling
- remember login state

After successful login:

- redirect to the Parent Dashboard

### 10.6 Child Registration Request Flow

When the user clicks `I am a Kid`, show a form with:

- parent email address

When submitted:

- send an invitation email to the parent
- create a temporary invitation record

### 10.7 Parent Invitation Email

Example content:

> Your child would like to join CodeKids.
>
> A child has requested access using your email address.
>
> Create Child Account

### 10.8 Child Profile Creation

After accepting the invitation, the parent creates a child profile.

Fields:

- nickname
- avatar
- birth year

Optional:

- learning level

Rules:

- the child account must be linked to the parent account
- one parent may create multiple child profiles

### 10.9 Parent Dashboard

The Parent Dashboard should provide the following features.

Child management:

- view children
- create child profiles
- edit child profiles

Progress tracking:

- completed levels
- earned rewards
- learning statistics
- time spent learning

Account management:

- change password
- update profile

### 10.10 Kids Panel

Parents can open a child profile and switch into Kids Mode.

Example flow:

```text
Parent Dashboard
  -> Select Child
  -> Open Kids Panel
```

### 10.11 Kids Mode Restrictions

When Kids Mode is active, visible content should include:

- learning levels
- activities
- quizzes
- Blockly tasks
- rewards
- profile progress

Hidden content should include:

- Parent Dashboard
- parent settings
- admin features
- user management

Children should only see learning-related content.

### 10.12 Returning to Parent Mode

While in Kids Mode:

- parent navigation must not be visible
- Parent Dashboard must not be accessible

To return to Parent Mode:

```text
Logout
  -> Login Again
```

A fresh authentication process is required to prevent children from accessing parent functionality accidentally.

### 10.13 Administrator Accounts

Administrator accounts are not created through registration.
They are created manually in the database.

Permissions:

- user management
- parent management
- child management
- level management
- statistics
- platform configuration

### 10.14 Security Requirements

Authentication:

- JWT access tokens
- refresh tokens
- role-based access control

Password security:

- bcrypt hashing
- never store plain text passwords

Roles:

- `PARENT`
- `KID`
- `ADMIN`

Authorization:

- NestJS guards should protect all restricted routes

Example:

```ts
@Roles(Role.ADMIN)
```

### 10.15 Database Relationships

```text
Parent
  1:N
Child

Child
  1:N
Progress

Child
  1:N
Rewards
```

A single parent may manage multiple children.
Each child has its own learning progress, rewards, and achievements.

### 10.16 User Experience Goals

The onboarding process should:

- be easy for children
- maintain parental control
- minimize authentication complexity
- protect children from accessing administrative features
- provide a secure and privacy-friendly learning environment
