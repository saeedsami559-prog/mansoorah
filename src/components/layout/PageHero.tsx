import type { ReactNode } from 'react';
import { ArchesMotif } from './OmaniMotif';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

export function PageHero({
  title,
  sub,
  crumbs,
  children,
  compact = false,
}: {
  title: string;
  sub?: string;
  crumbs: Crumb[];
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="hero-band">
      <ArchesMotif className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full md:h-36" />
      <div className={`container-x relative ${compact ? 'py-10 md:py-12' : 'py-12 md:py-16'}`}>
        <Breadcrumbs items={crumbs} inverted />
        <h1 className="max-w-3xl text-[2rem] font-extrabold md:text-[3rem]">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-lg text-white/85">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
