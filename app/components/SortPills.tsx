type SortField = 'topic' | 'status' | 'due_date';

const OPTIONS: { key: SortField; label: string }[] = [
  { key: 'due_date', label: 'Due date' },
  { key: 'status', label: 'Status' },
  { key: 'topic', label: 'Topic' },
];

export function SortPills({
  active,
  onChange,
}: {
  active: SortField;
  onChange: (field: SortField) => void;
}) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`press font-mono text-xs uppercase whitespace-nowrap px-3 py-1.5 border-2 border-ink shadow-brutal-sm
            ${active === opt.key ? 'bg-wagreen text-white' : 'bg-white text-ink'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}