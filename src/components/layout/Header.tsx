import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CalendarPlus, LogIn, LogOut, Menu, Moon, Sun, X, Languages } from 'lucide-react';
import { useI18n, type TKey } from '../../i18n';
import { Logo } from '../ui/Logo';
import { getUser, signOut, type DemoUser } from '../../lib/auth';
import { initials } from '../../lib/format';
import { useToast } from '../ui/Toast';
import { useTheme } from './theme';

const NAV: { to: string; key: TKey; end?: boolean }[] = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/services', key: 'nav.services' },
  { to: '/technicians', key: 'nav.technicians' },
  { to: '/how-it-works', key: 'nav.howItWorks' },
  { to: '/bookings', key: 'nav.bookings' },
];

function useDemoUser(): DemoUser | null {
  const [user, setUser] = useState<DemoUser | null>(() => getUser());
  useEffect(() => {
    const onChange = () => setUser(getUser());
    window.addEventListener('mansoorah-auth', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('mansoorah-auth', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);
  return user;
}

export function Header() {
  const { t, toggle, lang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useDemoUser();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const logout = () => {
    signOut();
    toast(t('auth.loggedOut'), 'info');
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-lg px-3 py-2 text-[0.95rem] font-semibold no-underline transition-colors ${
      isActive ? 'text-brand-700 [:root[data-theme=dark]_&]:text-brand-900' : 'text-ink hover:text-brand-700'
    }`;

  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-shadow ${scrolled ? 'border-line shadow-[var(--shadow-md)]' : 'border-transparent'} bg-surface/90 backdrop-blur-md`}
    >
      <div className="container-x flex h-[72px] items-center gap-3">
        <Logo />
        <nav aria-label={t('nav.main')} className="ms-6 hidden lg:block">
          <ul className="m-0 flex list-none items-center gap-0.5 p-0">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      {t(n.key)}
                      {isActive && (
                        <span className="absolute inset-x-3 -bottom-[3px] h-[3px] rounded-full bg-gold" aria-hidden="true" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            className="btn btn-ghost btn-sm !px-2.5"
            aria-label={t('nav.switchLangLabel')}
            lang={lang === 'en' ? 'ar' : 'en'}
          >
            <Languages className="size-4" aria-hidden="true" />
            <span>{t('nav.switchLang')}</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm hidden !px-2.5 sm:inline-flex"
            aria-label={t(theme === 'dark' ? 'nav.themeToLight' : 'nav.themeToDark')}
            title={t(theme === 'dark' ? 'nav.themeToLight' : 'nav.themeToDark')}
          >
            <ThemeIcon className="size-[18px]" aria-hidden="true" />
          </button>
          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              <span
                className="grid size-9 place-items-center rounded-full bg-brand-700 text-sm font-bold text-on-brand"
                title={t('nav.signedInAs', { name: user.name })}
                aria-label={t('nav.signedInAs', { name: user.name })}
                role="img"
                data-testid="user-initials"
              >
                {initials(user.name)}
              </span>
              <button
                type="button"
                onClick={logout}
                className="btn btn-ghost btn-sm !px-2"
                aria-label={t('nav.logout')}
                title={t('nav.logout')}
              >
                <LogOut className="flip-rtl size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm hidden md:inline-flex">
              <LogIn className="flip-rtl size-4" aria-hidden="true" />
              {t('nav.login')}
            </Link>
          )}
          <Link to="/services" className="btn btn-primary btn-sm hidden sm:inline-flex">
            <CalendarPlus className="size-4" aria-hidden="true" />
            {t('nav.book')}
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm !px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-surface lg:hidden">
          <nav aria-label={t('nav.main')} className="container-x py-3">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 font-semibold no-underline ${isActive ? 'bg-brand-100 text-brand-700 [:root[data-theme=dark]_&]:text-brand-900' : 'text-ink hover:bg-surface-2'}`
                    }
                  >
                    {t(n.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              {user ? (
                <button type="button" onClick={logout} className="btn btn-secondary">
                  <LogOut className="flip-rtl size-4" aria-hidden="true" />
                  {t('nav.logout')}
                </button>
              ) : (
                <Link to="/login" className="btn btn-secondary">
                  <LogIn className="flip-rtl size-4" aria-hidden="true" />
                  {t('nav.login')}
                </Link>
              )}
              <button type="button" onClick={toggleTheme} className="btn btn-secondary">
                <ThemeIcon className="size-4" aria-hidden="true" />
                {t(theme === 'dark' ? 'nav.themeToLight' : 'nav.themeToDark')}
              </button>
              <Link to="/services" className="btn btn-primary col-span-2">
                <CalendarPlus className="size-4" aria-hidden="true" />
                {t('nav.book')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
