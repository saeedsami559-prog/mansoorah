import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useI18n } from '../../i18n';
import { InstallPrompt } from './InstallPrompt';
import { track } from '../../lib/track';
import { ErrorBoundary } from './ErrorBoundary';
import { Link } from 'react-router-dom';

function PageFallback() {
  const { t } = useI18n();
  return (
    <div className="container-x min-h-[100dvh] py-24 text-center text-muted" role="status">
      {t('common.loading')}
    </div>
  );
}

export function Layout() {
  const { t } = useI18n();
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    track('page_view', { path: pathname });
  }, [pathname, hash]);
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        {t('common.skip')}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <ErrorBoundary
          resetKey={pathname}
          fallback={
            <div className="container-x py-24 text-center">
              <p className="text-lg font-semibold">{t('notFound.title')}</p>
              <Link to="/" className="btn btn-primary mt-6">
                {t('notFound.home')}
              </Link>
            </div>
          }
        >
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  );
}
