import { TaskWithComputed } from '@/app/lib/types';
import { TaskBubble } from './TaskBubble';

export function TaskList({
  tasks,
  onEdit,
  onArchive,
}: {
  tasks: TaskWithComputed[];
  onEdit: (t: TaskWithComputed) => void;
  onArchive: (id: number) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <p className="font-display text-sm text-ink/50">No tasks yet</p>
        <p className="font-mono text-xs text-ink/40 mt-1">Tap + to add your first one</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      {tasks.map((task, i) => (
        <TaskBubble
          key={task.id}
          task={task}
          align={i % 2 === 0 ? 'right' : 'left'}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}