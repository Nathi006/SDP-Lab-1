export function Header() {
  return (
    <header className="bg-teal border-b-[3px] border-ink px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
      <div className="w-10 h-10 bg-wagreen border-2 border-ink shadow-brutal-sm flex items-center justify-center">
        <span className="font-display text-white text-lg">✓</span>
      </div>
      <h1 className="font-display text-white text-lg tracking-tight">TODO.APP</h1>
    </header>
  );
}