export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="New task"
      className="press fixed bottom-6 right-6 w-14 h-14 bg-wagreen border-[3px] border-ink shadow-brutal-lg
                 flex items-center justify-center font-display text-2xl text-white z-20"
    >
      +
    </button>
  );
}