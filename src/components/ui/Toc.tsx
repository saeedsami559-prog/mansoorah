import { useI18n } from '../../i18n';

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t('common.onThisPage')} className="card p-5 lg:sticky lg:top-28">
      <p className="mb-3 text-sm font-bold tracking-wide text-muted uppercase">{t('common.onThisPage')}</p>
      <ol className="m-0 list-none space-y-1 p-0">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="block rounded-lg px-2 py-1.5 text-sm text-ink no-underline hover:bg-brand-100 hover:text-brand-700"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
