import type { Wishlist } from '../types';

const STORAGE_KEY = 'storefront:wishlists:v1';

/**
 * Assumption: localStorage is available and roughly reliable for a demo app.
 * Reason: no backend was specified, and the brief's Phase 2 explicitly
 * calls for LocalStorage persistence to minimize complexity.
 * Tradeoff: no cross-device sync, no multi-tab conflict resolution beyond
 * "last write wins," and data is lost if the user clears site data. Private
 * browsing / storage-disabled contexts will silently no-op rather than crash.
 */
export function loadWishlists(): Wishlist[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    // Corrupted JSON or storage disabled — fail safe to an empty state
    // rather than crashing the app on load.
    return [];
  }
}

export function saveWishlists(wishlists: Wishlist[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists));
    return true;
  } catch {
    // Quota exceeded or storage disabled. Caller decides how to surface this
    // (e.g. a toast) — this layer just reports success/failure.
    return false;
  }
}
