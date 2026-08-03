import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// A single file, on-disk SQLite database. Location can be overridden with
// TODO_DB_PATH — used by the test suite to point at a throwaway database
// instead of the real one, per the lab's testing requirement.
const DEFAULT_DB_PATH = path.join(process.cwd(), "data", "todo.db");

function resolveDbPath(): string {
  const override = process.env.TODO_DB_PATH;
  if (override) return override;
  return DEFAULT_DB_PATH;
}

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS topics (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tasks (
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

CREATE INDEX IF NOT EXISTS idx_tasks_topic_id    ON tasks(topic_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status      ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date    ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_archived_at ON tasks(archived_at);
`;

let instance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (instance) return instance;

  const dbPath = resolveDbPath();
  if (dbPath !== ":memory:") ensureDir(dbPath);

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);

  // Seed a default topic on first run so the app is usable immediately
  // after a clean clone, without forcing the user through topic setup.
  const topicCount = db.prepare("SELECT COUNT(*) as n FROM topics").get() as { n: number };
  if (topicCount.n === 0) {
    db.prepare("INSERT INTO topics (name) VALUES (?)").run("General");
  }

  instance = db;
  return db;
}

// Only used by tests: forces a fresh connection so each test file can point
// TODO_DB_PATH at its own throwaway database.
export function resetDbConnection() {
  if (instance) {
    instance.close();
    instance = null;
  }
}
