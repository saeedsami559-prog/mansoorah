import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { REPO_URL } from '../config/site';

const FONTS = [
  {
    name: 'Plus Jakarta Sans',
    by: 'Tokotype',
    licence: 'SIL Open Font License 1.1',
    url: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans',
  },
  { name: 'Inter', by: 'Rasmus Andersson', licence: 'SIL Open Font License 1.1', url: 'https://rsms.me/inter/' },
  { name: 'IBM Plex Sans Arabic', by: 'IBM', licence: 'SIL Open Font License 1.1', url: 'https://github.com/IBM/plex' },
];
const SOFTWARE = [
  { name: 'Lucide icons', licence: 'ISC', url: 'https://lucide.dev' },
  { name: 'React', licence: 'MIT', url: 'https://react.dev' },
  { name: 'React Router', licence: 'MIT', url: 'https://reactrouter.com' },
  { name: 'Vite', licence: 'MIT', url: 'https://vite.dev' },
  { name: 'Tailwind CSS', licence: 'MIT', url: 'https://tailwindcss.com' },
  { name: 'Framer Motion', licence: 'MIT', url: 'https://motion.dev' },
  { name: 'React Hook Form', licence: 'MIT', url: 'https://react-hook-form.com' },
  { name: 'Zod', licence: 'MIT', url: 'https://zod.dev' },
  { name: 'Fontsource', licence: 'MIT (packages) / OFL (fonts)', url: 'https://fontsource.org' },
  { name: 'vite-plugin-pwa / Workbox', licence: 'MIT', url: 'https://vite-pwa-org.netlify.app' },
  { name: 'qrcode-generator', licence: 'MIT', url: 'https://github.com/kazuhikoarase/qrcode-generator' },
];

function Table({ rows, head }: { rows: { name: string; by?: string; licence: string; url: string }[]; head: [string, string] }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse bg-surface text-start text-sm">
        <thead className="bg-surface-2">
          <tr>
            <th scope="col" className="px-4 py-3 text-start font-bold">
              {head[0]}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-bold">
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-line">
              <td className="px-4 py-3" dir="ltr">
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.name}
                  <span className="sr-only"> {t('common.openInNew')}</span>
                </a>
                {r.by && <span className="text-muted"> – {r.by}</span>}
              </td>
              <td className="px-4 py-3" dir="ltr">
                {r.licence}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Credits() {
  const { t } = useI18n();
  return (
    <>
      <Seo title={t('meta.credits.title')} description={t('meta.credits.description')} />
      <PageHero title={t('legal.creditsTitle')} sub={t('credits.sub')} crumbs={[{ label: t('legal.creditsTitle') }]} compact />
      <div className="container-x max-w-4xl space-y-10 py-12">
        <section aria-labelledby="ill-h" className="card p-6">
          <h2 id="ill-h" className="text-xl font-bold">
            {t('credits.illustrations')}
          </h2>
          <p className="mt-2 text-muted">{t('credits.illustrationsText')}</p>
        </section>
        <section aria-labelledby="fonts-h">
          <h2 id="fonts-h" className="mb-4 text-xl font-bold">
            {t('credits.fonts')}
          </h2>
          <Table rows={FONTS} head={[t('credits.fonts'), t('credits.licence')]} />
        </section>
        <section aria-labelledby="sw-h">
          <h2 id="sw-h" className="mb-4 text-xl font-bold">
            {t('credits.icons')} & {t('credits.software')}
          </h2>
          <Table rows={SOFTWARE} head={[t('credits.software'), t('credits.licence')]} />
        </section>
        <section aria-labelledby="code-h" className="card p-6">
          <h2 id="code-h" className="text-xl font-bold">
            {t('credits.code')}
          </h2>
          <p className="mt-2 text-muted">{t('credits.codeText')}</p>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block" dir="ltr">
            {REPO_URL.replace('https://', '')}
            <span className="sr-only"> {t('common.openInNew')}</span>
          </a>
        </section>
      </div>
    </>
  );
}
