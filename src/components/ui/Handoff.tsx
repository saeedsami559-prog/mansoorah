import { CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SUPPORT_EMAIL } from '../../config/site';
import { mailtoLink, whatsappLink } from '../../lib/whatsapp';
import { track } from '../../lib/track';

/** Final step of every demo form: the visitor explicitly chooses to send it on WhatsApp or e-mail. */
export function Handoff({
  title,
  text,
  message,
  subject,
  from,
}: {
  title: string;
  text: string;
  message: string;
  subject: string;
  from: string;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-success/30 bg-success-bg p-5" role="status" aria-live="polite">
      <p className="flex items-center gap-2 font-bold text-success-ink">
        <CheckCircle2 className="size-5" aria-hidden="true" />
        {title}
      </p>
      <p className="mt-1 text-sm">{text}</p>
      <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-surface p-3 font-body text-xs whitespace-pre-wrap text-ink">
        {message}
      </pre>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          className="btn btn-whatsapp"
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('handoff', { from, channel: 'whatsapp' })}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          {t('join.sendWa')}
        </a>
        <a
          className="btn btn-secondary"
          href={mailtoLink(SUPPORT_EMAIL, subject, message)}
          onClick={() => track('handoff', { from, channel: 'email' })}
        >
          <Mail className="size-5" aria-hidden="true" />
          {t('join.sendEmail')}
        </a>
      </div>
    </div>
  );
}
