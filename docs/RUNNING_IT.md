# Running it

## Requirements

- **Node.js 20 or later** (developed and tested on Node 22). `better-sqlite3` installs a prebuilt native binary for common platforms; if none matches your machine, npm will compile it from source, which requires Python 3 and a C++ toolchain (already present on most systems with Xcode Command Line Tools / build-essential installed).
- No database server, no accounts, no environment variables to set — the app creates `data/todo.db` itself on first run.

## Install

From a clean clone, in the project root:

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Then open **http://localhost:3000**. The SQLite file is created automatically at `data/todo.db` the first time the server starts (with a default "General" topic seeded in). Stopping and restarting the dev server preserves all data — the database is a plain file on disk, not in-memory.

## Run (production build)

```bash
npm run build
npm start
```

Then open **http://localhost:3000**.

## Test

```bash
npm test
```

This runs the `vitest` suite in `tests/tasks.test.ts` against a fresh, throwaway SQLite file per test (created in the OS temp directory and deleted afterwards) — it never touches `data/todo.db`, so it's safe to run at any time, including against a clean clone with no existing data.

## Resetting local data

The app's own database is just a file. To start over:

```bash
rm -f data/todo.db data/todo.db-wal data/todo.db-shm
```

The next `npm run dev` / `npm start` recreates it with a fresh schema and the default topic.
