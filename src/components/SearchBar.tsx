import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative flex-1 min-w-0">
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products, tags, categories…"
        aria-label="Search products"
        className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-9 text-sm text-text placeholder:text-text-faint outline-none transition-colors focus:border-accent"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
