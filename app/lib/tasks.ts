import db from './db';
import { Task, TaskWithComputed, Status } from './types';

interface TaskRow extends Task {
  topic_name: string;
}

function computeOverdue(row: TaskRow): TaskWithComputed {
  const is_overdue =
    row.status !== 'complete' &&
    row.archived_at === null &&
    row.due_date < new Date().toISOString().slice(0, 10);
  return { ...row, is_overdue };
}

type SortField = 'topic' | 'status' | 'due_date';

const SORT_COLUMN: Record<SortField, string> = {
  topic: 't.name',
  status: 'tasks.status',
  due_date: 'tasks.due_date',
};

export function getTasks(
  sortBy: SortField = 'due_date',
  includeArchived = false
): TaskWithComputed[] {
  const column = SORT_COLUMN[sortBy] ?? SORT_COLUMN.due_date;
  const whereClause = includeArchived ? '' : 'WHERE tasks.archived_at IS NULL';

  const rows = db
    .prepare(
      `SELECT tasks.*, t.name AS topic_name
       FROM tasks
       JOIN topics t ON t.id = tasks.topic_id
       ${whereClause}
       ORDER BY ${column} ASC`
    )
    .all() as TaskRow[];

  return rows.map(computeOverdue);
}

function getTaskById(id: number): TaskRow | undefined {
  return db
    .prepare(
      `SELECT tasks.*, t.name AS topic_name
       FROM tasks JOIN topics t ON t.id = tasks.topic_id
       WHERE tasks.id = ?`
    )
    .get(id) as TaskRow | undefined;
}

export function getOrCreateTopic(name: string): number {
  const existing = db.prepare('SELECT id FROM topics WHERE name = ?').get(name) as
    | { id: number }
    | undefined;
  if (existing) return existing.id;

  const result = db.prepare('INSERT INTO topics (name) VALUES (?)').run(name);
  return result.lastInsertRowid as number;
}

export function createTask(input: {
  title: string;
  description?: string;
  due_date: string;
  topic: string; // topic name from the form; resolved to topic_id here
}): TaskWithComputed {
  const topic_id = getOrCreateTopic(input.topic);

  const result = db
    .prepare(
      `INSERT INTO tasks (title, description, due_date, topic_id)
       VALUES (@title, @description, @due_date, @topic_id)`
    )
    .run({
      title: input.title,
      description: input.description ?? null,
      due_date: input.due_date,
      topic_id,
    });

  return computeOverdue(getTaskById(result.lastInsertRowid as number)!);
}

export function updateTask(
  id: number,
  updates: Partial<{
    title: string;
    description: string;
    due_date: string;
    topic: string;
    status: Status;
  }>
): TaskWithComputed | null {
  const existing = getTaskById(id);
  if (!existing) return null;

  const topic_id = updates.topic ? getOrCreateTopic(updates.topic) : existing.topic_id;

  db.prepare(
    `UPDATE tasks
     SET title = ?, description = ?, due_date = ?, topic_id = ?, status = ?,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
     WHERE id = ?`
  ).run(
    updates.title ?? existing.title,
    updates.description ?? existing.description,
    updates.due_date ?? existing.due_date,
    topic_id,
    updates.status ?? existing.status,
    id
  );

  return computeOverdue(getTaskById(id)!);
}

export function archiveTask(id: number): TaskWithComputed | null {
  const existing = getTaskById(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE tasks SET archived_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`
  ).run(id);

  return computeOverdue(getTaskById(id)!);
}