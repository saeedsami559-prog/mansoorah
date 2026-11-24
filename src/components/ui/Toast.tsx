import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { useI18n } from '../../i18n';

interface ToastItem {
  id: number;
  text: string;
  tone: 'success' | 'info';
}
const Ctx = createContext<(text: string, tone?: ToastItem['tone']) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const { t } = useI18n();
  const dismiss = useCallback((id: number) => setItems((l) => l.filter((x) => x.id !== id)), []);
  const push = useCallback(
    (text: string, tone: ToastItem['tone'] = 'success') => {
      const id = Date.now() + Math.random();
      setItems((l) => [...l.slice(-2), { id, text, tone }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );
  const value = useMemo(() => push, [push]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-label={t('toast.region')}
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="pop-in pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-ink shadow-[var(--shadow-lg)]"
          >
            {item.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <Info className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden="true" />
            )}
            <p className="flex-1 text-sm font-medium">{item.text}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="cursor-pointer rounded-md p-0.5 text-muted hover:text-ink"
              aria-label={t('common.close')}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
