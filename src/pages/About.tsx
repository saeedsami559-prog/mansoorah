import {
  Eye,
  GraduationCap,
  Lightbulb,
  ReceiptText,
  ShieldCheck,
  Star,
  Target,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { Seo } from '../components/layout/Seo';
import { PageHero } from '../components/layout/PageHero';
import { InitialsAvatar } from '../components/technician/Avatar';
import { ButtonLink, SectionHeading } from '../components/ui/primitives';
import { TEAM } from '../data/team';
import { initials } from '../lib/format';

const PILLAR_ICONS: LucideIcon[] = [ShieldCheck, Star, ReceiptText, Zap];

export default function About() {
  const { t, ta, loc } = useI18n();
  return (
    <>
      <Seo title={t('meta.about.title')} description={t('meta.about.description')} />
      <PageHero title={t('about.title')} sub={t('about.sub')} crumbs={[{ label: t('about.title') }]} />

      <section className="section" aria-labelledby="story-h">
        <div className="container-x">
          <SectionHeading id="story-h" title={t('about.storyTitle')} />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-7">
              <TriangleAlert className="size-8 text-warning" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-bold">{t('about.problemTitle')}</h3>
              <p className="mt-2 text-muted">{t('about.problemText')}</p>
            </div>
            <div className="card p-7">
              <Lightbulb className="size-8 text-gold" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-bold">{t('about.ideaTitle')}</h3>
              <p className="mt-2 text-muted">{t('about.ideaText')}</p>
            </div>
            <div className="card bg-gradient-to-br from-brand-100 to-surface p-7">
              <Target className="size-8 text-brand-700" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-bold">{t('about.missionTitle')}</h3>
              <p className="mt-2">{t('about.missionText')}</p>
            </div>
            <div className="card bg-gradient-to-br from-brand-100 to-surface p-7">
              <Eye className="size-8 text-brand-700" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-bold">{t('about.visionTitle')}</h3>
              <p className="mt-2">{t('about.visionText')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16" aria-labelledby="pil-h">
        <div className="container-x">
          <SectionHeading id="pil-h" title={t('about.pillarsTitle')} />
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {ta('home.pillars.items').map((p, i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <li key={p.title} className="card p-6">
                  <Icon className="size-7 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900" aria-hidden="true" />
                  <h3 className="mt-3 font-bold">{p.title}</h3>
                  <p className="mt-1 text-muted">{p.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="team-h">
        <div className="container-x">
          <SectionHeading id="team-h" title={t('about.teamTitle')} sub={t('about.teamSub')} />
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m) => (
              <li key={m.name.en} className="card flex items-center gap-4 p-5">
                <InitialsAvatar text={initials(m.name.en)} tone={m.tone} size={68} />
                <div>
                  <p className="font-heading font-bold text-heading">{loc(m.name)}</p>
                  <p className="mt-1 text-sm text-muted">{loc(m.role)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="card mt-8 flex flex-col gap-4 p-6 md:flex-row md:items-center">
            <GraduationCap
              className="size-10 shrink-0 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold">{t('about.utas')}</p>
              <p className="text-muted">{t('about.utasText')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16" aria-labelledby="road-h">
        <div className="container-x">
          <SectionHeading id="road-h" title={t('about.roadmapTitle')} />
          <ol className="grid list-none gap-5 p-0 md:grid-cols-4">
            {ta('about.roadmap').map((r, i) => (
              <li key={r.title} className={`card relative p-6 ${i === 0 ? 'border-2 !border-brand-700' : ''}`}>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${i === 0 ? 'bg-brand-700 text-on-brand' : 'bg-surface-2 text-muted'}`}
                >
                  {i === 0 ? t('about.now') : `${t('about.next')} · ${i + 1}`}
                </span>
                <h3 className="mt-3 font-bold">{r.title}</h3>
                <p className="mt-1 text-muted">{r.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/services">{t('nav.book')}</ButtonLink>
            <ButtonLink to="/join" variant="secondary">
              {t('home.callouts.techCta')}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
