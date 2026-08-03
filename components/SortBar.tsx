"use client";

import { SortDirection, SortField } from "@/lib/tasks";

interface Props {
  sortField: SortField;
  sortDirection: SortDirection;
  showArchived: boolean;
  onSortFieldChange: (field: SortField) => void;
  onDirectionToggle: () => void;
  onToggleArchived: () => void;
}

const FIELDS: { value: SortField; label: string }[] = [
  { value: "due_date", label: "Due date" },
  { value: "topic", label: "Topic" },
  { value: "status", label: "Status" },
];

export function SortBar({
  sortField,
  sortDirection,
  showArchived,
  onSortFieldChange,
  onDirectionToggle,
  onToggleArchived,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-xs font-bold uppercase text-ink/60">Sort</span>
      {FIELDS.map((f) => (
        <button
          key={f.value}
          onClick={() => onSortFieldChange(f.value)}
          className={`brutal-chip px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
            sortField === f.value ? "bg-wa text-ink" : "bg-white text-ink/70"
          }`}
        >
          {f.label}
        </button>
      ))}

      <button
        onClick={onDirectionToggle}
        aria-label="Toggle sort direction"
        className="brutal-chip bg-white px-3 py-1.5 text-xs font-bold text-ink/70"
      >
        {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>

      <div className="ml-auto">
        <button
          onClick={onToggleArchived}
          className={`brutal-chip px-3 py-1.5 text-xs font-bold uppercase ${
            showArchived ? "bg-ink text-white" : "bg-white text-ink/70"
          }`}
        >
          {showArchived ? "Viewing archived" : "Show archived"}
        </button>
      </div>
    </div>
  );
}
