import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, inverted = false }: { items: Crumb[]; inverted?: boolean }) {
  const { t } = useI18n();
  const all: Crumb[] = [{ label: t('nav.home'), to: '/' }, ...items];
  return (
    <nav aria-label={t('nav.breadcrumb')} className="mb-4">
      <ol className={`m-0 flex list-none flex-wrap items-center gap-1 p-0 text-sm ${inverted ? 'text-white/80' : 'text-muted'}`}>
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1">
              {c.to && !last ? (
                <Link
                  to={c.to}
                  className={`no-underline hover:underline ${inverted ? 'text-white/85 hover:text-white' : 'text-muted hover:text-brand-700'}`}
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={`font-semibold ${inverted ? 'text-white' : 'text-ink'}`}
                >
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="flip-rtl size-3.5 opacity-70" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
