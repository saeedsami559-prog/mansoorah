import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { readJSON, writeJSON } from '../../lib/storage';
import { track } from '../../lib/track';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** PWA install prompt for repeat visitors on mobile (shown only when the browser offers it). */
export function InstallPrompt() {
  const { t } = useI18n();
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const visits = readJSON<number>('visits', 0) + 1;
    writeJSON('visits', visits);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (visits >= 2 && !readJSON<boolean>('installDismissed', false)) setEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);
  if (!evt) return null;
  const close = () => {
    writeJSON('installDismissed', true);
    setEvt(null);
  };
  return (
    <div
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-lg)]"
      role="dialog"
      aria-label={t('common.installApp')}
    >
      <Download className="size-6 shrink-0 text-brand-700" aria-hidden="true" />
      <p className="flex-1 text-sm">{t('common.installHint')}</p>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={async () => {
          await evt.prompt();
          const choice = await evt.userChoice;
          track('pwa_install', { outcome: choice.outcome });
          close();
        }}
      >
        {t('common.installApp')}
      </button>
      <button type="button" className="btn btn-ghost btn-sm !px-2" onClick={close} aria-label={t('common.notNow')}>
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
