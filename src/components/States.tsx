import { PackageSearch, Heart } from 'lucide-react';

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="aspect-square bg-elevated" />
          <div className="space-y-2 p-4">
            <div className="h-3.5 w-3/4 rounded bg-elevated" />
            <div className="h-3 w-full rounded bg-elevated" />
            <div className="h-3 w-1/2 rounded bg-elevated" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
      <PackageSearch size={32} className="text-text-faint" />
      <p className="font-display text-lg text-text">Nothing matches "{query}"</p>
      <p className="max-w-xs text-sm text-text-muted">
        Try a different search term, or clear the category filter.
      </p>
    </div>
  );
}

export function EmptyWishlistState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Heart size={28} className="text-text-faint" />
      <p className="font-display text-base text-text">This list is empty</p>
      <p className="max-w-[22rem] text-sm text-text-muted">
        Tap the heart on any product to add it here.
      </p>
    </div>
  );
}
