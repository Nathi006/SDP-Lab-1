# AI Transcript — COMS3011A Lab 1

## 1. AI Usage Declaration

This document contains the transcript of AI assistance used during the development of the COMS3011A Lab 1 Todo Application.

The AI tool used was:

* **Tool:** Claude Web
* **Model:** Claude Sonnet 5
* **Usage:** Code generation, database design, planning, debugging, and technical discussion

The AI was used as an assisting tool. All generated code and suggestions were reviewed, tested, and adapted before being incorporated into the project.

---

## 2. AI Usage Summary

| Field              | Details                                                   |
| ------------------ | --------------------------------------------------------- |
| Tool               | Claude Web                                                |
| Model              | Claude Sonnet 5                                           |
| Project            | COMS3011A Lab 1 — Todo Application                        |
| Main uses          | Code generation and database design                       |
| Additional uses    | Planning, debugging, and discussion                       |
| Human verification | Generated suggestions were reviewed and tested before use |

---

## 3. What Each Transcript Entry Should Include

For each significant AI interaction, include the following information:

### Tool

State which AI tool was used.

**Example:**

```text
Claude Web
```

### Model

State the model used.

**Example:**

```text
Claude Sonnet 5
```

### Purpose

Briefly explain what the AI was being used for.

Examples:

```text
Code generation
```

```text
Database design
```

```text
Debugging
```

```text
Planning
```

### Context / Prompt

Include the **actual prompt you gave the AI**.

Do not rewrite the prompt into a summary if the transcript is required to be unedited.

### AI Response

Include the **actual response produced by the AI**.

Do not remove incorrect suggestions, failed attempts, or corrections if submitting an unedited transcript.

### What I Did

Briefly explain what you actually did with the AI's output.

For example:

```text
I reviewed the proposed schema and used the task table structure in my
implementation. I changed the archive field to an integer flag and
verified that overdue status was derived from the due date rather than
stored in the database.
```

### Verification / Decision

Record whether you accepted, modified, or rejected the suggestion.

For example:

```text
Accepted after testing.
```

or:

```text
Partially accepted. I changed the proposed database structure to better
match the requirements of the lab.
```

or:

```text
Rejected. The suggested implementation did not satisfy the requirement
that archived tasks remain viewable.
```

This is particularly useful because the course rubric expects evidence that you can identify unsuitable AI output and redirect it rather than blindly accepting it.

---

# 4. Transcript

## 4.1 Database Design

**Tool:** Claude Web
**Model:** Claude Sonnet 5
**Purpose:** Database design

### User Prompt

```text
[Paste your original Claude prompt here exactly as it was sent.]
```

### AI Response

```text
[Paste Claude's response here exactly as it was produced.]
```

### My Decision / Implementation

```text
[Briefly state what you used, changed, or rejected from the response.]

For example:

I used the proposed tasks table as the basis for my SQLite schema.
I did not store "overdue" as a database status because the lab
requirements specify that overdue must be derived from the due date.
```

---

## 4.2 Code Generation — SQLite Setup

**Tool:** Claude Web
**Model:** Claude Sonnet 5
**Purpose:** Code generation

### User Prompt

```text
[Paste the original prompt used to request the SQLite/database code.]
```

### AI Response

```text
[Paste the complete Claude response here.]
```

### My Decision / Implementation

```text
[Explain which parts of the generated code you used and any changes
you made.]
```

---

## 4.3 Code Generation — Task Functionality

**Tool:** Claude Web
**Model:** Claude Sonnet 5
**Purpose:** Code generation

### User Prompt

```text
[Paste original prompt.]
```

### AI Response

```text
[Paste complete response.]
```

### My Decision / Implementation

```text
[Explain how the generated code was incorporated, modified, or rejected.]
```

---

## 4.4 Debugging

**Tool:** Claude Web
**Model:** Claude Sonnet 5
**Purpose:** Debugging

### User Prompt

```text
[Paste the error message and your original question.]
```

### AI Response

```text
[Paste the complete response.]
```

### My Decision / Verification

```text
[Explain whether the suggested solution worked.]

For example:

I applied the suggested configuration change and restarted the
development server. The application then compiled successfully.
```

---

# 5. AI Usage Categories

The following categories describe how Claude Sonnet 5 was used during the project.

## Code Generation

Claude Sonnet 5 was used to assist with generating portions of the application's code, including:

* SQLite database setup
* Database queries
* Task-related functionality
* Next.js components or routes
* Other implementation code where applicable

All generated code was reviewed and tested before being used.

## Database Design

Claude Sonnet 5 was used to discuss and develop the SQLite database design, including:

* Task fields
* Task status representation
* Archiving
* Relationships, where applicable
* Database constraints
* How overdue tasks should be represented

The final database design was checked against the COMS3011A Lab 1 requirements before implementation.

## Debugging

Claude Sonnet 5 was used to help investigate development and configuration errors.

Examples may include:

* Next.js configuration errors
* SQLite package errors
* TypeScript errors
* PostCSS/CSS errors
* Build errors

AI suggestions were tested against the actual application rather than being accepted without verification.

---

# 6. Final AI Declaration

The preceding document was generated/developed with the assistance of:

**Claude Web [Claude Sonnet 5]**

Claude Sonnet 5 was used for **code generation and database design**, as well as supporting planning and debugging during development.
