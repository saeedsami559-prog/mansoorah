import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Star } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'white' | 'outline-white' | 'whatsapp' | 'danger';
type Size = 'sm' | 'md' | 'lg';

function cls(variant: Variant, size: Size, extra = '') {
  return ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '', extra].filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }>(
  function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...rest }, ref) {
    return <button ref={ref} type={type} className={cls(variant, size, className)} {...rest} />;
  },
);

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={cls(variant, size, className)} {...rest} />;
}

export function ExternalButton({
  href,
  children,
  variant = 'whatsapp',
  size = 'md',
  className = '',
  onClick,
  label,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls(variant, size, className)}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </a>
  );
}

export function Card({
  children,
  className = '',
  hover = false,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}) {
  return <Tag className={`card ${hover ? 'card-hover' : ''} ${className}`}>{children}</Tag>;
}

type BadgeTone = 'brand' | 'success' | 'warning' | 'danger' | 'gold' | 'neutral';
const badgeTone: Record<BadgeTone, string> = {
  brand: 'bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900',
  success: 'bg-success-bg text-success-ink',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  gold: 'bg-[#FBF3E1] text-[#7A5614] [:root[data-theme=dark]_&]:bg-[#3A2D10] [:root[data-theme=dark]_&]:text-gold',
  neutral: 'bg-surface-2 text-muted',
};
export function Badge({
  children,
  tone = 'brand',
  className = '',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.78rem] font-semibold leading-6 ${badgeTone[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`chip ${className}`}>{children}</span>;
}

export function RatingStars({ value, size = 16, label }: { value: number; size?: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label ?? `${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
            <Star width={size} height={size} className="absolute inset-0 text-line" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star width={size} height={size} className="text-gold" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface-2 ${className}`} aria-hidden="true" />;
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div
        className="grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900"
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="font-heading text-lg font-bold text-heading">{title}</p>
      {text && <p className="max-w-md text-muted">{text}</p>}
      {action}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = false,
  id,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
  id?: string;
}) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className={`eyebrow mb-3 ${center ? 'justify-center' : ''}`}>{eyebrow}</p>}
      <h2 id={id} className="text-[1.75rem] font-extrabold md:text-[2.25rem]">
        {title}
      </h2>
      {sub && <p className="mt-3 text-lg text-muted">{sub}</p>}
    </div>
  );
}
