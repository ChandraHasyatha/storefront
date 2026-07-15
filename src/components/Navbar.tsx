import { Heart } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export function Navbar({ query, onQueryChange, wishlistCount, onOpenWishlist }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <a href="#" className="font-display text-xl tracking-tight text-text shrink-0">
          Ledger
        </a>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
          <SearchBar value={query} onChange={onQueryChange} />
        </div>

        <button
          onClick={onOpenWishlist}
          aria-label={`Open wishlists, ${wishlistCount} item${wishlistCount === 1 ? '' : 's'} in current list`}
          className="order-2 sm:order-3 relative flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-text transition-colors hover:border-accent"
        >
          <Heart size={16} />
          <span className="hidden sm:inline">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[0.7rem] font-semibold text-bg">
              {wishlistCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
