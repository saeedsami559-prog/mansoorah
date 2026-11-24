import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useI18n, type TKey } from '../../i18n';
import { Logo } from '../ui/Logo';
import { ArchesMotif } from './OmaniMotif';
import { PHONE_NUMBER, SOCIAL, SUPPORT_EMAIL, WHATSAPP_NUMBER } from '../../config/site';
import { formatOmaniPhone } from '../../lib/format';
import { whatsappLink } from '../../lib/whatsapp';

const COLS: { title: TKey; links: { to: string; key: TKey }[] }[] = [
  {
    title: 'footer.explore',
    links: [
      { to: '/services', key: 'nav.services' },
      { to: '/technicians', key: 'nav.technicians' },
      { to: '/how-it-works', key: 'nav.howItWorks' },
      { to: '/bookings', key: 'nav.bookings' },
    ],
  },
  {
    title: 'footer.company',
    links: [
      { to: '/about', key: 'about.title' },
      { to: '/join', key: 'home.callouts.techCta' },
      { to: '/partners', key: 'home.callouts.partnerCta' },
      { to: '/contact', key: 'contact.title' },
    ],
  },
  {
    title: 'footer.legal',
    links: [
      { to: '/faq', key: 'faq.title' },
      { to: '/privacy', key: 'legal.privacyTitle' },
      { to: '/terms', key: 'legal.termsTitle' },
      { to: '/cancellation-refund', key: 'legal.cancellationTitle' },
      { to: '/credits', key: 'legal.creditsTitle' },
    ],
  },
];

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#0B2C6E] text-white/85 [:root[data-theme=dark]_&]:bg-[#071228]">
      <ArchesMotif className="pointer-events-none absolute inset-x-0 top-0 h-32 w-full rotate-180" opacity={0.08} />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-sm text-[0.95rem] text-white/75">{t('footer.about')}</p>
          <ul className="mt-5 list-none space-y-2 p-0 text-[0.95rem]">
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 text-[#D4A84B]" aria-hidden="true" />
              <a
                href={whatsappLink('')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white no-underline hover:underline"
                dir="ltr"
              >
                {formatOmaniPhone(WHATSAPP_NUMBER)}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-[#D4A84B]" aria-hidden="true" />
              <a href={`tel:${PHONE_NUMBER}`} className="text-white no-underline hover:underline" dir="ltr">
                {formatOmaniPhone(PHONE_NUMBER)}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-[#D4A84B]" aria-hidden="true" />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-white no-underline hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-[#D4A84B]" aria-hidden="true" />
              {t('footer.hours')}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-1 size-4 shrink-0 text-[#D4A84B]" aria-hidden="true" />
              {t('footer.regions')}
            </li>
          </ul>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h2 className="mb-4 text-sm font-bold tracking-wider text-white uppercase [:root[dir=rtl]_&]:tracking-normal">
              {t(col.title)}
            </h2>
            <ul className="m-0 list-none space-y-2.5 p-0">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/80 no-underline hover:text-white hover:underline">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-white">{t('footer.cr')}</p>
            <p>{t('footer.course')}</p>
            <p>
              {t('footer.follow')}:{' '}
              <span dir="ltr">
                Instagram @{SOCIAL.instagram} · X @{SOCIAL.x} · TikTok @{SOCIAL.tiktok} · Snapchat @{SOCIAL.snapchat}
              </span>
            </p>
          </div>
          <div className="space-y-1 md:text-end">
            <p>
              {t('footer.payments')}: {t('footer.paymentsList')}
            </p>
            <p>{t('footer.rights', { year })}</p>
            <p className="font-heading font-semibold text-[#D4A84B]">{t('brand.closing')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
