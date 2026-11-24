import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';

/** Native <dialog> gives focus trapping, Esc to close and inert background for free. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="modal-title"
      className="m-auto w-[min(92vw,480px)] rounded-[20px] border border-line bg-surface p-0 text-ink shadow-[var(--shadow-lg)] backdrop:bg-[#0b2c6e]/45 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm -me-2 -mt-1 !min-h-9 !px-2"
            aria-label={t('common.close')}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
