import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useI18n } from '../../i18n';

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function PasswordInput(props, ref) {
    const { t } = useI18n();
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <Lock className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input ref={ref} type={show ? 'text' : 'password'} className="input !ps-11 !pe-12" {...props} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute end-1.5 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
          aria-label={show ? t('auth.hide') : t('auth.show')}
          aria-pressed={show}
        >
          {show ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
        </button>
      </div>
    );
  },
);
