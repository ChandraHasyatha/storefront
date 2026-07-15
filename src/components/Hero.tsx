import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  productCount: number;
  onShopNow: () => void;
}

export function Hero({ productCount, onShopNow }: Props) {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
      aria-label="Introduction"
    >
      {/* Ambient signature glow — a single quiet gesture, not scattered decoration */}
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-accent/20 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-5 px-4 py-14 sm:px-6 sm:py-20">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted">
          <Sparkles size={12} className="text-accent" />
          New arrivals every season
        </span>

        <h1 className="max-w-xl font-display text-3xl leading-tight text-text sm:text-5xl">
          Small-batch goods, kept on the record.
        </h1>

        <p className="max-w-md text-sm text-text-muted sm:text-base">
          {productCount} pieces from independent makers — each one added to a
          running ledger of what's worth keeping. Save the ones you love,
          across as many lists as you need.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onShopNow}
            className="group flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20"
          >
            Shop the collection
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <span className="text-xs text-text-faint">
            Wishlists sync locally — no account needed.
          </span>
        </div>
      </div>
    </section>
  );
}
