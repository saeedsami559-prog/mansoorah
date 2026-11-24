import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

/** Label + control + hint + error (error is linked with aria-describedby and announced). */
export function Field({
  id,
  label,
  error,
  hint,
  optional,
  optionalLabel,
  children,
  className = '',
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  optionalLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ms-1 font-normal text-muted">({optionalLabel})</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <div aria-live="polite">
        {error && (
          <p id={`${id}-error`} className="field-error">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
