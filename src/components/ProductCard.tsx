import { Heart, Star } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product;
  inWishlist: boolean;
  onToggleWishlist: () => void;
}

export function ProductCard({ product, inWishlist, onToggleWishlist }: Props) {
  const discounted = product.discount > 0;
  const finalPrice = discounted
    ? product.price * (1 - product.discount / 100)
    : product.price;
  const outOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface border border-border overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="relative aspect-square overflow-hidden bg-elevated">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discounted && (
          <span className="absolute top-3 left-3 rounded-full bg-accent2 px-2.5 py-1 text-xs font-semibold text-bg">
            −{product.discount}%
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/70 backdrop-blur-[1px]">
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium tracking-wide text-text-muted">
              Out of stock
            </span>
          </div>
        )}
        <button
          onClick={onToggleWishlist}
          aria-pressed={inWishlist}
          aria-label={inWishlist ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/60 backdrop-blur-sm border border-border/60 transition-colors hover:bg-bg/90"
        >
          <Heart
            size={17}
            className={inWishlist ? 'fill-accent text-accent' : 'text-text'}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.05rem] leading-snug text-text">{product.title}</h3>
        </div>
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{product.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-base font-medium text-text">${finalPrice.toFixed(2)}</span>
            {discounted && (
              <span className="text-xs text-text-faint line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Star size={12} className="fill-accent text-accent" />
            {product.rating.toFixed(1)}
          </div>
        </div>
        {!outOfStock && product.stock <= 5 && (
          <p className="text-[0.7rem] text-accent2">Only {product.stock} left</p>
        )}
      </div>
    </div>
  );
}
