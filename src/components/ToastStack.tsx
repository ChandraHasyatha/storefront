import { Check, X, Info } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const variantStyles = {
  default: { icon: Info, ring: 'border-border', iconColor: 'text-text-muted' },
  success: { icon: Check, ring: 'border-success/40', iconColor: 'text-success' },
  error: { icon: X, ring: 'border-accent2/40', iconColor: 'text-accent2' },
};

export function ToastStack() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const style = variantStyles[toast.variant];
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            className={`animate-toast-in flex items-start gap-3 rounded-xl border ${style.ring} bg-elevated px-4 py-3 shadow-lg shadow-black/30`}
          >
            <Icon size={16} className={`mt-0.5 shrink-0 ${style.iconColor}`} />
            <p className="text-sm text-text leading-snug">{toast.text}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-auto shrink-0 text-text-faint hover:text-text-muted transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
