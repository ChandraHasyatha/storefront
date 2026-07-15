interface Props {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <Pill active={selected === null} onClick={() => onSelect(null)}>
        All
      </Pill>
      {categories.map((cat) => (
        <Pill key={cat} active={selected === cat} onClick={() => onSelect(cat)}>
          {cat}
        </Pill>
      ))}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-accent bg-accent text-bg'
          : 'border-border bg-surface text-text-muted hover:border-text-faint hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}
