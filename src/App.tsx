import { useEffect, useMemo, useState } from 'react';
import { products, categories } from './data/products';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { LoadingGrid, NoResultsState } from './components/States';
import { WishlistDrawer } from './components/WishlistDrawer';
import { MergeModal } from './components/MergeModal';
import { ToastStack } from './components/ToastStack';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider, useWishlists } from './context/WishlistContext';

function StoreContent() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [activeListId, setActiveListId] = useState('');

  const { wishlists, toggleItem, isInWishlist } = useWishlists();

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!activeListId && wishlists.length > 0) {
      setActiveListId(wishlists[0].id);
    }
  }, [wishlists, activeListId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = !category || p.category === category;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const activeList = wishlists.find((w) => w.id === activeListId);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        wishlistCount={activeList?.items.length ?? 0}
        onOpenWishlist={() => setDrawerOpen(true)}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-3">
          <div>
            <h1 className="font-display text-2xl text-text">Small-batch goods, chosen carefully</h1>
            <p className="mt-1 text-sm text-text-muted">{filtered.length} of {products.length} products</p>
          </div>
          <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
        </div>

        {loading ? (
          <LoadingGrid />
        ) : filtered.length === 0 ? (
          <NoResultsState query={query} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                inWishlist={activeListId ? isInWishlist(activeListId, product.id) : false}
                onToggleWishlist={() => activeListId && toggleItem(activeListId, product.id)}
              />
            ))}
          </div>
        )}
      </main>

      <WishlistDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        products={products}
        activeListId={activeListId}
        onChangeActiveList={setActiveListId}
        onOpenMerge={() => setMergeOpen(true)}
      />

      <MergeModal open={mergeOpen} onClose={() => setMergeOpen(false)} />

      <ToastStack />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <WishlistProvider>
        <StoreContent />
      </WishlistProvider>
    </ToastProvider>
  );
}
