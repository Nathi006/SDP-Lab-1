# Database design

SQLite, accessed through `better-sqlite3`. Two tables, one relationship.

## Entity-relationship diagram

```
topics (1) ────── categorises ──────▶ (∞) tasks
```

Each task references exactly one topic via the `topic_id` foreign key. A topic can have many tasks. There is no `ON DELETE` clause, so SQLite's default `RESTRICT` behaviour applies — the schema does not support deleting a topic that still has tasks attached to it.

## Table: `topics`

Stores the set of topics a task can belong to. Normalised into its own table rather than a free-text column on `tasks`, so the value is consistent everywhere it's used (no "Work" vs "work" duplicates) and so sorting/grouping by topic is a plain join, not a distinct-string scan.

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Surrogate key referenced by `tasks.topic_id`. |
| `name` | `TEXT` | `NOT NULL UNIQUE` | The topic label shown in the UI. |

## Table: `tasks`

Stores every task the user has created, including archived ones — archiving never deletes a row.

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Surrogate key for the task. |
| `title` | `TEXT` | `NOT NULL` | Required task field. |
| `description` | `TEXT` | nullable | Optional task field. |
| `due_date` | `TEXT` | `NOT NULL` | ISO-8601 date (`YYYY-MM-DD`). Stored as text since SQLite has no native date type; ISO-8601 sorts correctly as a plain string, which is what the due-date sort and the overdue comparison rely on. |
| `topic_id` | `INTEGER` | `NOT NULL`, `REFERENCES topics(id)` | Links the task to exactly one topic. |
| `status` | `TEXT` | `NOT NULL DEFAULT 'todo'`, `CHECK (status IN ('todo','in_progress','complete'))` | Fixed, non-user-customisable status. A `CHECK` constraint enforces the three allowed values without needing a lookup table. |
| `archived_at` | `TEXT` | nullable | `NULL` = active, visible in the main list. A timestamp = archived, and when. Tasks are never deleted, so archiving is a flag on the row, not a row removal or a copy elsewhere. |
| `created_at` | `TEXT` | `NOT NULL DEFAULT now` | Row creation time. |
| `updated_at` | `TEXT` | `NOT NULL DEFAULT now` | Last-modified time, updated on every edit. |

Indexes: `topic_id`, `status`, `due_date`, and `archived_at` each have a plain index, since all four are used to filter or sort the task list.

## Design decisions

- **Archiving is a flag, not a delete or a copy.** `archived_at` is nullable: `NULL` means active, a timestamp means archived. A task "cannot be deleted, only archived, so that it remains viewable" — the row never moves or disappears; the active list simply filters on `archived_at IS NULL`.
- **Status is a `CHECK` constraint, not a lookup table.** The three statuses (Todo, In-Progress, Complete) are fixed and not user-customisable, so a separate `statuses` table would add a join for no benefit.
- **Overdue is derived, never stored.** It is not a column and not a fourth status value — overdue must be indicated "but not as a status." It's computed at query time, and it does **not** apply to archived tasks: once a task is archived it leaves the active list, so the overdue rule shown there no longer applies to it (overdue is also never a selectable status, so an archived+overdue task doesn't need a status change to lose the flag).
- **Dates are stored as ISO-8601 text.** SQLite has no native date/time type; ISO-8601 strings sort and compare correctly as plain text.
- **`topic_id` is `NOT NULL`.** Every task must belong to a topic. The app seeds a default "General" topic on first run rather than allowing `NULL`, so sorting/grouping by topic never needs a null-handling special case.

## Deriving "overdue" at read time

```sql
SELECT *,
       (status != 'complete'
        AND archived_at IS NULL
        AND due_date < date('now')) AS is_overdue
FROM tasks;
```

Implemented in `lib/tasks.ts` as part of the shared `BASE_SELECT` used by every task query, so every endpoint returns a consistent `is_overdue` flag rather than each caller re-deriving it.

## Full DDL

```sql
CREATE TABLE topics (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE tasks (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    description  TEXT,
    due_date     TEXT NOT NULL,
    topic_id     INTEGER NOT NULL REFERENCES topics(id),
    status       TEXT NOT NULL DEFAULT 'todo'
                 CHECK (status IN ('todo', 'in_progress', 'complete')),
    archived_at  TEXT,
    created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_tasks_topic_id    ON tasks(topic_id);
CREATE INDEX idx_tasks_status      ON tasks(status);
CREATE INDEX idx_tasks_due_date    ON tasks(due_date);
CREATE INDEX idx_tasks_archived_at ON tasks(archived_at);
```

This exactly matches the schema shipped in `lib/db.ts`.
