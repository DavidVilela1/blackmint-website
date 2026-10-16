'use client';

import { useConsent } from './ConsentProvider';

/** Footer control to reopen preferences and change or withdraw consent. */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className={className}
      aria-haspopup="dialog"
      data-cookie-settings
    >
      {label}
    </button>
  );
}
