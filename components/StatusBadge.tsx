import { Status } from "@/lib/tasks";

const STATUS_LABEL: Record<Status, string> = {
  todo: "Todo",
  in_progress: "In progress",
  complete: "Complete",
};

const STATUS_COLOR: Record<Status, string> = {
  todo: "bg-status-todo",
  in_progress: "bg-status-progress",
  complete: "bg-status-complete",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`brutal-chip inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-ink ${STATUS_COLOR[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function OverdueStamp() {
  return (
    <span className="brutal-chip inline-block -rotate-2 bg-status-overdue px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
      Overdue
    </span>
  );
}
