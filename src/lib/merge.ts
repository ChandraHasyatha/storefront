import type { Wishlist, WishlistItem } from '../types';

export interface MergeResult {
  ok: boolean;
  error?: string;
  merged?: Wishlist;
}

/**
 * Merge two wishlists into a new wishlist. Neither source list is mutated
 * or deleted — merging produces a third list, source lists remain intact.
 *
 * Assumption: "merge into one" means a NEW combined list is created, not
 * that source list B disappears and A absorbs it in place.
 * Reason: destructively merging in place is surprising and hard to undo;
 * producing a new list is safer and matches how e.g. playlist "combine"
 * features usually work.
 * Alternative: merge B into A in place (A survives, B is deleted).
 * Tradeoff: in-place merge is one less list for the user to manage, but
 * it's a destructive operation with no undo — riskier UX for a demo app.
 *
 * Rules implemented (see brief Phase 5):
 * 1. De-duplicate by productId.
 * 2. When the same productId exists in both lists, the surviving entry
 *    keeps the EARLIEST addedAt timestamp (first interest wins) — this
 *    was specified directly in the brief, not left to us to decide.
 * 3. Deterministic ordering: final list is sorted by addedAt ascending
 *    (oldest interest first), with productId as a tiebreaker for items
 *    added at the exact same instant. This is deterministic regardless
 *    of merge(A, B) vs merge(B, A) call order.
 * 4. Empty lists: merging with an empty list returns the other list's
 *    items untouched.
 * 5. Identical lists: de-duplication collapses them to one copy of each item.
 * 6. Invalid wishlist IDs: caller passes resolved Wishlist objects, not
 *    IDs, so "invalid ID" is handled one layer up (see WishlistContext) by
 *    returning a MergeResult error before this function is ever called.
 * 7. Deleted products: this function does NOT check product existence —
 *    that's a rendering concern, not a merge concern. A merged item whose
 *    product was deleted is still valid wishlist data; the UI marks it
 *    "unavailable" instead of dropping it (per the earlier product decision).
 */
export function mergeWishlists(
  a: Wishlist,
  b: Wishlist,
  newListName: string
): MergeResult {
  if (a.id === b.id) {
    return { ok: false, error: 'Cannot merge a wishlist with itself.' };
  }

  const byProductId = new Map<string, WishlistItem>();

  for (const item of [...a.items, ...b.items]) {
    const existing = byProductId.get(item.productId);
    if (!existing) {
      byProductId.set(item.productId, item);
      continue;
    }
    // Duplicate found across (or within) the two lists — keep earliest addedAt.
    const keepExisting = new Date(existing.addedAt) <= new Date(item.addedAt);
    byProductId.set(item.productId, keepExisting ? existing : item);
  }

  const mergedItems = Array.from(byProductId.values())
    .map((item) => ({ ...item, wishlistId: '' })) // set below once we know the new id
    .sort((x, y) => {
      const t = new Date(x.addedAt).getTime() - new Date(y.addedAt).getTime();
      if (t !== 0) return t;
      return x.productId.localeCompare(y.productId);
    });

  const newId = `wl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const finalItems = mergedItems.map((item) => ({ ...item, wishlistId: newId }));

  const merged: Wishlist = {
    id: newId,
    name: newListName.trim() || `${a.name} + ${b.name}`,
    createdAt: new Date().toISOString(),
    items: finalItems,
  };

  return { ok: true, merged };
}
