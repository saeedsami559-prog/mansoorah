import { Check } from 'lucide-react';
import { useI18n } from '../../i18n';

/** Horizontal booking step indicator: 1 Choose Service ✓ · 2 Select Technician · 3 Booking Details · 4 Confirm */
export function Stepper({ current }: { current: number }) {
  const { tl, t } = useI18n();
  const steps = tl('book.steps');
  return (
    <nav aria-label={t('book.stepsLabel')}>
      <ol className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <li key={label} className="flex min-w-0 shrink-0 items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-300 ${
                  done
                    ? 'bg-success text-white'
                    : active
                      ? 'bg-brand-700 text-on-brand ring-4 ring-brand-100'
                      : 'border-2 border-line bg-surface text-muted'
                }`}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : n}
              </span>
              <span
                className={`text-sm font-semibold whitespace-nowrap ${active ? 'text-heading' : done ? 'text-ink' : 'text-muted'} ${active ? '' : 'hidden sm:inline'}`}
              >
                {label}
                <span className="sr-only">{done ? ` – ${t('book.stepDone')}` : active ? ` – ${t('book.stepCurrent')}` : ''}</span>
              </span>
              {n < steps.length && (
                <span className={`h-0.5 w-6 rounded-full sm:w-10 ${done ? 'bg-success' : 'bg-line'}`} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
