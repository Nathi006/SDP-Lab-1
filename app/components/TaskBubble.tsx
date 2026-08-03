import { TaskWithComputed } from '@/app/lib/types';
import { StatusTicks } from './StatusTicks';
import { OverdueStamp } from './OverdueStamp';

export function TaskBubble({
  task,
  align,
  onEdit,
  onArchive,
}: {
  task: TaskWithComputed;
  align: 'left' | 'right';
  onEdit: (t: TaskWithComputed) => void;
  onArchive: (id: number) => void;
}) {
  const isRight = align === 'right';

  return (
    <div className={`relative flex ${isRight ? 'justify-end' : 'justify-start'} mb-5`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] bg-card border-[3px] border-ink shadow-brutal p-4
          ${isRight ? 'rounded-tl-xl rounded-bl-xl rounded-tr-xl' : 'rounded-tr-xl rounded-br-xl rounded-tl-xl'}`}
      >
        {task.is_overdue && <OverdueStamp />}

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-sm leading-tight">{task.title}</h3>
          <span className="font-mono text-[10px] bg-progress border-2 border-ink px-1.5 py-0.5 shrink-0">
            {task.topic_name}
          </span>
        </div>

        {task.description && (
          <p className="text-sm mt-2 text-ink/80">{task.description}</p>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t-2 border-ink/10">
          <span className="font-mono text-[11px] text-ink/60">Due {task.due_date}</span>
          <StatusTicks status={task.status} />
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(task)}
            className="press flex-1 font-mono text-[11px] uppercase border-2 border-ink bg-white shadow-brutal-sm px-2 py-1"
          >
            Edit
          </button>
          <button
            onClick={() => onArchive(task.id)}
            className="press flex-1 font-mono text-[11px] uppercase border-2 border-ink bg-white shadow-brutal-sm px-2 py-1"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}