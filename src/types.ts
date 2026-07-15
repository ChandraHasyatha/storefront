export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  /** Percent discount, 0 if none. Discounted price = price * (1 - discount/100) */
  discount: number;
  rating: number; // 0-5
  stock: number; // 0 = out of stock
  image: string;
  tags: string[];
}

/**
 * A single entry in a wishlist. Stores productId (a reference), not a
 * snapshot of the product, so price/stock changes are reflected live.
 * The tradeoff: if a product is deleted from the catalog entirely, the
 * wishlist item becomes "orphaned" — handled explicitly, see lib/merge.ts.
 */
export interface WishlistItem {
  wishlistId: string;
  productId: string;
  addedAt: string; // ISO 8601 timestamp
}

export interface Wishlist {
  id: string;
  name: string;
  createdAt: string; // ISO 8601 timestamp
  items: WishlistItem[];
}

export interface ToastMessage {
  id: string;
  text: string;
  variant: 'default' | 'success' | 'error';
}
