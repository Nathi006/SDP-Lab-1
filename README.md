# Tasks

A local-first todo app built with Next.js and SQLite for COMS3011A Lab 1. No accounts, no server deployment — download it, run it, it's yours.

## Features

- Create, edit, and archive tasks (title, description, due date, topic). Archiving hides a task from the active list without deleting it — archived tasks stay viewable.
- Sort the task list by topic, status, or due date.
- Three fixed statuses: Todo, In-Progress, Complete.
- Overdue tasks are flagged visually — overdue is never a selectable status.
- All data persists in a local SQLite file (`data/todo.db`) and survives a restart.

## Theme

A WhatsApp-inspired palette (teal header, WhatsApp green accents, mint highlights, a dotted chat-wallpaper background) rendered in a neubrutalist style: thick black borders, hard flat offset shadows instead of blur, no gradients, and chunky buttons that visibly "press" on click.

## Documentation

- [`docs/THIRD_PARTY_CODE.md`](docs/THIRD_PARTY_CODE.md) — every dependency and why it's here
- [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md) — schema, relationships, and the reasoning behind each design decision
- [`docs/RUNNING_IT.md`](docs/RUNNING_IT.md) — exact install / run / test commands from a clean clone

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. See `docs/RUNNING_IT.md` for the full picture, including tests and resetting local data.

## Project structure

```
app/
  page.tsx                 entry point, renders the task board
  api/tasks/route.ts        list + create tasks
  api/tasks/[id]/route.ts   edit, change status, archive/unarchive a task
  api/topics/route.ts       list + create topics
components/
  TaskBoard.tsx              top-level state: fetches tasks/topics, wires up actions
  TaskCard.tsx               a single task, with status control, edit and archive
  TaskFormModal.tsx          create/edit form
  SortBar.tsx                sort field + direction + archived toggle
  StatusBadge.tsx            status chip and overdue stamp
lib/
  db.ts                      SQLite connection + schema
  tasks.ts                   all data-access functions (create, update, archive, sort, overdue)
tests/
  tasks.test.ts              vitest suite against a throwaway database
docs/                        submission documentation (see above)
```

