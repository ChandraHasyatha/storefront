# Ledger — Storefront with Mergeable Wishlists

React + Vite + TypeScript + Tailwind v4. Persists wishlist state to
`localStorage`. No backend.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Deploy to GitHub Pages

**Option A — GitHub Actions (recommended, already set up):**

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Source**, select **GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds and deploys
   automatically. Your site will be at
   `https://<your-username>.github.io/<repo-name>/`.

**Option B — manual `gh-pages` branch:**

```bash
npm install -D gh-pages
npm run build
npx gh-pages -d dist
```

Then set **Settings → Pages → Source** to the `gh-pages` branch.

`vite.config.ts` uses `base: './'` (relative paths), so the build works
regardless of the repo name / subpath GitHub Pages serves it from — no
config edit needed either way.

## Architecture notes

- **State**: `WishlistContext` holds all wishlists in memory and persists to
  `localStorage` on every change (`src/lib/storage.ts`). Load failures
  (corrupted JSON, storage disabled) fail safe to an empty list rather than
  crashing.
- **Merge logic**: `src/lib/merge.ts` is a pure function, unit-testable in
  isolation from React. It de-duplicates by `productId`, keeps the earliest
  `addedAt` on conflict, and produces deterministic ordering. It does not
  touch product data — deleted-product handling is a rendering concern
  (see `WishlistDrawer.tsx`, which renders an "unavailable" state for any
  item whose `productId` no longer resolves to a catalog product).
- **Wishlist item references, not snapshots**: a `WishlistItem` stores
  `productId`, not a copy of the product. Price/stock changes are reflected
  live; the tradeoff is that deleting a product orphans any wishlist entries
  pointing to it (handled explicitly, not silently).
- **Ordering caveat (worth knowing about)**: the spec's worked example
  implies list-then-list insertion order, but also requires "earliest added
  date wins" and "deterministic ordering." Those two rules conflict once
  real timestamps are involved. This build sorts the merged list by the
  surviving `addedAt` ascending, since that's the only ordering rule that's
  actually well-defined. If you want strict "list A's items, then list B's
  new items" ordering instead, that's a one-line change in `mergeWishlists`
  (sort by original list position instead of timestamp).

## Manual test checklist

**Functional**
- [ ] Search filters by title, description, category, and tags
- [ ] Category pills filter correctly; "All" clears the filter
- [ ] Heart icon toggles a product in/out of the active wishlist
- [ ] Wishlist count badge in navbar updates immediately
- [ ] Creating a new list switches to it and it appears in the drawer tabs
- [ ] Deleting a list is blocked when it's the only list (toast shown)

**Merge**
- [ ] Merging two lists with no overlap produces the union of items
- [ ] Merging two lists with an overlapping product keeps ONE entry, with
      the earlier `addedAt` of the two
- [ ] Merging a list with an empty list returns the non-empty list's items
- [ ] Merging two identical lists collapses to one copy of each item
- [ ] Attempting to merge a list with itself shows an error, no-ops
- [ ] Merged list appears as a new third list; both source lists remain
      unchanged and still selectable

**Duplicates / deleted products**
- [ ] Adding the same product twice to one list is a no-op (toggle, not add)
- [ ] A wishlist item pointing at a since-deleted product shows "Item no
      longer available" instead of crashing or disappearing

**Persistence**
- [ ] Add items, refresh the page — wishlist state survives
- [ ] Create a second list, refresh — both lists and active selection persist
- [ ] Open dev tools → Application → Local Storage and confirm the
      `storefront:wishlists:v1` key updates on each change

**Responsive / dark mode / accessibility**
- [ ] Layout works at 375px width (mobile) through desktop
- [ ] Dark mode is the only mode (by design) and has no unstyled flashes
- [ ] All interactive elements show a visible focus ring on Tab navigation
- [ ] Buttons/icons have `aria-label`s (verify with a screen reader or the
      accessibility tree in dev tools)
- [ ] `prefers-reduced-motion` disables animations (toggle in OS settings)

**Browser refresh / empty states**
- [ ] Clearing `localStorage` and reloading seeds a fresh default list
- [ ] Empty wishlist shows the empty state, not a blank drawer
- [ ] Search with no matches shows the no-results state, not a blank grid
