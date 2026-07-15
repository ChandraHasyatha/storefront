import { useState } from 'react';
import { X, Shuffle } from 'lucide-react';
import { useWishlists } from '../context/WishlistContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MergeModal({ open, onClose }: Props) {
  const { wishlists, mergeInto } = useWishlists();
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');
  const [name, setName] = useState('');

  if (!open) return null;

  const listA = wishlists.find((w) => w.id === idA);
  const listB = wishlists.find((w) => w.id === idB);
  const sameList = idA && idA === idB;
  const canMerge = idA && idB && !sameList;

  const previewCount = canMerge && listA && listB
    ? new Set([...listA.items, ...listB.items].map((i) => i.productId)).size
    : null;

  const handleConfirm = () => {
    if (!canMerge) return;
    mergeInto(idA, idB, name);
    setIdA('');
    setIdB('');
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-label="Merge wishlists"
        className="animate-modal-in relative w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg text-text">
            <Shuffle size={18} className="text-accent" /> Merge lists
          </h2>
          <button onClick={onClose} aria-label="Close merge dialog" className="text-text-muted hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <ListSelect label="First list" value={idA} onChange={setIdA} lists={wishlists} exclude={idB} />
          <ListSelect label="Second list" value={idB} onChange={setIdB} lists={wishlists} exclude={idA} />

          <label className="flex flex-col gap-1 text-xs text-text-muted">
            New list name (optional)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={listA && listB ? `${listA.name} + ${listB.name}` : 'Merged list'}
              className="rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>

          {sameList && (
            <p className="text-xs text-accent2">Pick two different lists — a list can't merge with itself.</p>
          )}

          {previewCount !== null && (
            <p className="rounded-lg bg-elevated px-3 py-2 text-xs text-text-muted">
              Result: <span className="text-text">{previewCount} unique item{previewCount === 1 ? '' : 's'}</span>{' '}
              (duplicates merged, earliest "added" date kept). Both source lists stay untouched.
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm text-text-muted hover:text-text"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canMerge}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Merge
          </button>
        </div>
      </div>
    </div>
  );
}

function ListSelect({
  label,
  value,
  onChange,
  lists,
  exclude,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  lists: { id: string; name: string; items: unknown[] }[];
  exclude: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-text outline-none focus:border-accent"
      >
        <option value="">Select a list…</option>
        {lists.map((w) => (
          <option key={w.id} value={w.id} disabled={w.id === exclude}>
            {w.name} ({w.items.length})
          </option>
        ))}
      </select>
    </label>
  );
}
