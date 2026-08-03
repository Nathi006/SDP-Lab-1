import { Status } from '@/app/lib/types';

export function StatusTicks({ status }: { status: Status }) {
  const config = {
    todo: { ticks: 1, color: '#9CA3AF', label: 'Todo' },
    in_progress: { ticks: 2, color: '#9CA3AF', label: 'In-Progress' },
    complete: { ticks: 2, color: '#25D366', label: 'Complete' },
  }[status];

  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs" aria-label={config.label}>
      <svg width={config.ticks === 1 ? 14 : 20} height="12" viewBox="0 0 20 12" fill="none">
        <path d="M1 6L5 10L13 2" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {config.ticks === 2 && (
          <path d="M7 6L11 10L19 2" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      <span className="uppercase tracking-wide" style={{ color: config.color }}>
        {config.label}
      </span>
    </span>
  );
}