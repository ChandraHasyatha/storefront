import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Wishlist } from '../types';
import { loadWishlists, saveWishlists } from '../lib/storage';
import { mergeWishlists } from '../lib/merge';
import { useToast } from './ToastContext';

interface WishlistContextValue {
  wishlists: Wishlist[];
  createWishlist: (name: string) => Wishlist;
  deleteWishlist: (id: string) => void;
  toggleItem: (wishlistId: string, productId: string) => void;
  isInWishlist: (wishlistId: string, productId: string) => boolean;
  isInAnyWishlist: (productId: string) => boolean;
  mergeInto: (idA: string, idB: string, newName: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const DEFAULT_LIST_NAME = 'My Wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [wishlists, setWishlists] = useState<Wishlist[]>(() => {
    const loaded = loadWishlists();
    if (loaded.length > 0) return loaded;
    // First-run seed: every user starts with one default list rather than
    // an empty shelf of lists, so "add to wishlist" always has a target.
    return [
      {
        id: `wl_default_${Date.now()}`,
        name: DEFAULT_LIST_NAME,
        createdAt: new Date().toISOString(),
        items: [],
      },
    ];
  });

  useEffect(() => {
    const ok = saveWishlists(wishlists);
    if (!ok) {
      showToast('Could not save your wishlist changes locally.', 'error');
    }
    // showToast is stable (useCallback in ToastProvider) but omitted from
    // deps deliberately: we only want this effect to run on wishlists change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlists]);

  const createWishlist = useCallback((name: string) => {
    const list: Wishlist = {
      id: `wl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Untitled list',
      createdAt: new Date().toISOString(),
      items: [],
    };
    setWishlists((prev) => [...prev, list]);
    return list;
  }, []);

  const deleteWishlist = useCallback(
    (id: string) => {
      setWishlists((prev) => {
        if (prev.length <= 1) {
          showToast('You need at least one wishlist.', 'error');
          return prev;
        }
        return prev.filter((w) => w.id !== id);
      });
    },
    [showToast]
  );

  const toggleItem = useCallback((wishlistId: string, productId: string) => {
    setWishlists((prev) =>
      prev.map((w) => {
        if (w.id !== wishlistId) return w;
        const exists = w.items.some((i) => i.productId === productId);
        if (exists) {
          return { ...w, items: w.items.filter((i) => i.productId !== productId) };
        }
        return {
          ...w,
          items: [
            ...w.items,
            { wishlistId, productId, addedAt: new Date().toISOString() },
          ],
        };
      })
    );
  }, []);

  const isInWishlist = useCallback(
    (wishlistId: string, productId: string) => {
      const list = wishlists.find((w) => w.id === wishlistId);
      return list ? list.items.some((i) => i.productId === productId) : false;
    },
    [wishlists]
  );

  const isInAnyWishlist = useCallback(
    (productId: string) => wishlists.some((w) => w.items.some((i) => i.productId === productId)),
    [wishlists]
  );

  const mergeInto = useCallback(
    (idA: string, idB: string, newName: string) => {
      const listA = wishlists.find((w) => w.id === idA);
      const listB = wishlists.find((w) => w.id === idB);

      // Invalid wishlist ID handling: caught here, one layer above the
      // pure merge function, so mergeWishlists() can assume valid input.
      if (!listA || !listB) {
        showToast('One of the selected wishlists no longer exists.', 'error');
        return;
      }

      const result = mergeWishlists(listA, listB, newName);
      if (!result.ok || !result.merged) {
        showToast(result.error ?? 'Could not merge those wishlists.', 'error');
        return;
      }

      // Original lists A and B are kept intact (see merge.ts rationale);
      // the merged result is added as a new third list.
      setWishlists((prev) => [...prev, result.merged!]);
      showToast(`Merged into "${result.merged.name}" (${result.merged.items.length} items).`, 'success');
    },
    [wishlists, showToast]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        createWishlist,
        deleteWishlist,
        toggleItem,
        isInWishlist,
        isInAnyWishlist,
        mergeInto,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlists() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlists must be used within a WishlistProvider');
  return ctx;
}
