import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-700.css';
import './styles/index.css';
import App from './App';
import { I18nProvider, detectLang, loadLang } from './i18n';
import { ThemeProvider } from './components/layout/theme';
import { ToastProvider } from './components/ui/Toast';
import { BookingProvider } from './components/booking/BookingContext';
import { AuthProvider } from './components/auth/AuthContext';

// GitHub Pages SPA fallback: 404.html stores the requested path, we restore it before routing.
try {
  const redirect = sessionStorage.getItem('mansoorah.redirect');
  if (redirect) {
    sessionStorage.removeItem('mansoorah.redirect');
    window.history.replaceState(null, '', redirect);
  }
} catch {
  /* ignore */
}

const initialLang = detectLang();
loadLang(initialLang).finally(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ThemeProvider>
          <I18nProvider initial={initialLang}>
            <ToastProvider>
              <AuthProvider>
                <BookingProvider>
                  <App />
                </BookingProvider>
              </AuthProvider>
            </ToastProvider>
          </I18nProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  ),
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch(() => {});
  });
}
