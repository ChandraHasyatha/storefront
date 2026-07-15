import { X, Trash2, AlertTriangle, Shuffle, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types';
import { useWishlists } from '../context/WishlistContext';
import { EmptyWishlistState } from './States';

interface Props {
  open: boolean;
  onClose: () => void;
  products: Product[];
  activeListId: string;
  onChangeActiveList: (id: string) => void;
  onOpenMerge: () => void;
}

export function WishlistDrawer({
  open,
  onClose,
  products,
  activeListId,
  onChangeActiveList,
  onOpenMerge,
}: Props) {
  const { wishlists, createWishlist, deleteWishlist, toggleItem } = useWishlists();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const activeList = wishlists.find((w) => w.id === activeListId) ?? wishlists[0];
  const productMap = new Map(products.map((p) => [p.id, p]));

  if (!open) return null;

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const list = createWishlist(name);
    onChangeActiveList(list.id);
    setNewName('');
    setCreating(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Wishlist"
        className="animate-drawer-in fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-bg shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg text-text">Wishlists</h2>
          <button
            onClick={onClose}
            aria-label="Close wishlist drawer"
            className="text-text-muted hover:text-text"
          >
            <X size={20} />
          </button>
        </header>

        {/* List switcher tabs */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {wishlists.map((w) => (
            <button
              key={w.id}
              onClick={() => onChangeActiveList(w.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                w.id === activeList.id
                  ? 'border-accent bg-accent text-bg'
                  : 'border-border bg-surface text-text-muted hover:text-text'
              }`}
            >
              {w.name}
              <span className="ml-1.5 opacity-70">{w.items.length}</span>
            </button>
          ))}
          {creating ? (
            <div className="flex shrink-0 items-center gap-1">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="List name"
                className="w-28 rounded-full border border-accent bg-surface px-3 py-1.5 text-xs text-text outline-none"
              />
              <button onClick={handleCreate} className="text-accent" aria-label="Confirm new list">
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-text-muted hover:text-text"
            >
              <Plus size={13} /> New list
            </button>
          )}
        </div>

        {/* Merge CTA */}
        {wishlists.length >= 2 && (
          <div className="border-b border-border px-4 py-3">
            <button
              onClick={onOpenMerge}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/10 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              <Shuffle size={15} />
              Merge two lists
            </button>
          </div>
        )}

        {/* Active list contents */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-text-faint">{activeList.name}</p>
            {wishlists.length > 1 && (
              <button
                onClick={() => deleteWishlist(activeList.id)}
                className="flex items-center gap-1 text-xs text-text-faint hover:text-accent2"
              >
                <Trash2 size={12} /> Delete list
              </button>
            )}
          </div>

          {activeList.items.length === 0 ? (
            <EmptyWishlistState />
          ) : (
            <ul className="flex flex-col gap-2.5">
              {activeList.items.map((item) => {
                const product = productMap.get(item.productId);
                const unavailable = !product;
                return (
                  <li
                    key={item.productId}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2.5"
                  >
                    {product ? (
                      <img
                        src={product.image}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-elevated">
                        <AlertTriangle size={18} className="text-text-faint" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-text">
                        {product?.title ?? 'Item no longer available'}
                      </p>
                      {unavailable ? (
                        <p className="text-xs text-accent2">This product was removed from the catalog</p>
                      ) : (
                        <p className="font-mono text-xs text-text-muted">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleItem(activeList.id, item.productId)}
                      aria-label={`Remove ${product?.title ?? 'item'} from ${activeList.name}`}
                      className="shrink-0 text-text-faint hover:text-accent2"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
