"use client";

import { Status, Task } from "@/lib/tasks";
import { OverdueStamp, StatusBadge } from "./StatusBadge";

interface Props {
  task: Task;
  onStatusChange: (id: number, status: Status) => void;
  onEdit: (task: Task) => void;
  onArchive: (id: number) => void;
  onUnarchive: (id: number) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function TaskCard({ task, onStatusChange, onEdit, onArchive, onUnarchive }: Props) {
  const archived = !!task.archived_at;

  return (
    <div
      className={`brutal-panel relative flex flex-col gap-3 p-4 sm:p-5 ${
        archived ? "opacity-70" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="break-words font-display text-lg font-bold leading-snug text-ink">
            {task.title}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-ink/60">{task.topic_name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!!task.is_overdue && <OverdueStamp />}
          <StatusBadge status={task.status} />
        </div>
      </div>

      {task.description && (
        <p className="whitespace-pre-wrap text-sm text-ink/80">{task.description}</p>
      )}

      <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-ink/20 pt-3">
        <span className="font-mono text-xs font-bold text-ink/70">
          Due {formatDate(task.due_date)}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {!archived && (
            <select
              aria-label={`Status for ${task.title}`}
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
              className="brutal-input cursor-pointer px-2 py-1 text-xs font-bold uppercase"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="complete">Complete</option>
            </select>
          )}

          {!archived && (
            <button
              onClick={() => onEdit(task)}
              className="brutal-btn bg-wa-mint px-3 py-1 text-xs text-ink"
            >
              Edit
            </button>
          )}

          {archived ? (
            <button
              onClick={() => onUnarchive(task.id)}
              className="brutal-btn bg-white px-3 py-1 text-xs text-ink"
            >
              Restore
            </button>
          ) : (
            <button
              onClick={() => onArchive(task.id)}
              className="brutal-btn bg-ink px-3 py-1 text-xs text-white"
            >
              Archive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
