import { getDb } from "./db";

export type Status = "todo" | "in_progress" | "complete";
export const STATUSES: Status[] = ["todo", "in_progress", "complete"];

export interface Topic {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  topic_id: number;
  topic_name: string;
  status: Status;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  is_overdue: 0 | 1;
}

export type SortField = "due_date" | "topic" | "status";
export type SortDirection = "asc" | "desc";

const STATUS_ORDER: Record<Status, number> = {
  todo: 0,
  in_progress: 1,
  complete: 2,
};

function nowIso(): string {
  return new Date().toISOString();
}

// --- Topics ---------------------------------------------------------------

export function listTopics(): Topic[] {
  const db = getDb();
  return db.prepare("SELECT id, name FROM topics ORDER BY name ASC").all() as Topic[];
}

export function createTopic(name: string): Topic {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Topic name is required");
  const db = getDb();
  const existing = db.prepare("SELECT id, name FROM topics WHERE name = ?").get(trimmed) as
    | Topic
    | undefined;
  if (existing) return existing;
  const info = db.prepare("INSERT INTO topics (name) VALUES (?)").run(trimmed);
  return { id: Number(info.lastInsertRowid), name: trimmed };
}

// --- Tasks ------------------------------------------------------------------

interface ListOptions {
  sortField?: SortField;
  sortDirection?: SortDirection;
  includeArchived?: boolean;
}

const BASE_SELECT = `
  SELECT
    tasks.id, tasks.title, tasks.description, tasks.due_date, tasks.topic_id,
    topics.name AS topic_name, tasks.status, tasks.archived_at,
    tasks.created_at, tasks.updated_at,
    CASE
      WHEN tasks.status != 'complete'
       AND tasks.archived_at IS NULL
       AND tasks.due_date < date('now')
      THEN 1 ELSE 0
    END AS is_overdue
  FROM tasks
  JOIN topics ON topics.id = tasks.topic_id
`;

export function listTasks(opts: ListOptions = {}): Task[] {
  const { sortField = "due_date", sortDirection = "asc", includeArchived = false } = opts;
  const db = getDb();

  const where = includeArchived ? "" : "WHERE tasks.archived_at IS NULL";

  // Status has a fixed, non-alphabetical order (todo -> in_progress -> complete),
  // so it's sorted in JS rather than with a plain SQL ORDER BY on the text column.
  if (sortField === "status") {
    const rows = db.prepare(`${BASE_SELECT} ${where}`).all() as Task[];
    rows.sort((a, b) => {
      const diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return sortDirection === "asc" ? diff : -diff;
    });
    return rows;
  }

  const column = sortField === "topic" ? "topics.name" : "tasks.due_date";
  const dir = sortDirection === "desc" ? "DESC" : "ASC";
  return db.prepare(`${BASE_SELECT} ${where} ORDER BY ${column} ${dir}, tasks.id ASC`).all() as Task[];
}

export function getTask(id: number): Task | undefined {
  const db = getDb();
  return db.prepare(`${BASE_SELECT} WHERE tasks.id = ?`).get(id) as Task | undefined;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  due_date: string;
  topic_id: number;
}

export function createTask(input: CreateTaskInput): Task {
  if (!input.title?.trim()) throw new Error("Title is required");
  if (!input.due_date?.trim()) throw new Error("Due date is required");
  if (!input.topic_id) throw new Error("Topic is required");

  const db = getDb();
  const ts = nowIso();
  const info = db
    .prepare(
      `INSERT INTO tasks (title, description, due_date, topic_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'todo', ?, ?)`
    )
    .run(input.title.trim(), input.description ?? null, input.due_date, input.topic_id, ts, ts);

  return getTask(Number(info.lastInsertRowid))!;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  due_date?: string;
  topic_id?: number;
  status?: Status;
}

export function updateTask(id: number, input: UpdateTaskInput): Task {
  const existing = getTask(id);
  if (!existing) throw new Error("Task not found");

  if (input.status && !STATUSES.includes(input.status)) {
    throw new Error(`Invalid status: ${input.status}`);
  }

  const db = getDb();
  db.prepare(
    `UPDATE tasks SET
       title = ?, description = ?, due_date = ?, topic_id = ?, status = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.title?.trim() ?? existing.title,
    input.description !== undefined ? input.description : existing.description,
    input.due_date ?? existing.due_date,
    input.topic_id ?? existing.topic_id,
    input.status ?? existing.status,
    nowIso(),
    id
  );

  return getTask(id)!;
}

// Archiving flips a timestamp; the row is never deleted, so it stays
// viewable via listTasks({ includeArchived: true }).
export function archiveTask(id: number): Task {
  const existing = getTask(id);
  if (!existing) throw new Error("Task not found");
  const db = getDb();
  db.prepare("UPDATE tasks SET archived_at = ?, updated_at = ? WHERE id = ?").run(
    nowIso(),
    nowIso(),
    id
  );
  return getTask(id)!;
}

export function unarchiveTask(id: number): Task {
  const existing = getTask(id);
  if (!existing) throw new Error("Task not found");
  const db = getDb();
  db.prepare("UPDATE tasks SET archived_at = NULL, updated_at = ? WHERE id = ?").run(nowIso(), id);
  return getTask(id)!;
}
