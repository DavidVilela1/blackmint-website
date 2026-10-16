'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { optionalCategories, type OptionalCategory } from '@/lib/consent/config';
import { Modal } from '@/components/ui/Modal';
import { LegalDialogButton } from '@/components/legal/LegalDialogButton';
import { useConsent, type ConsentStrings } from './ConsentProvider';

function Switch({
  checked,
  onChange,
  labelledBy,
  describedBy,
  onLabel,
  offLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  labelledBy: string;
  describedBy: string;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-11 shrink-0 items-center gap-3"
    >
      <span
        aria-hidden
        className={`relative h-7 w-12 border transition-colors ${checked ? 'border-mint bg-mint/20' : 'border-bone/40 bg-transparent'}`}
      >
        <span
          className={`absolute top-1 size-[1.125rem] transition-all duration-300 ${checked ? 'bg-mint left-[1.6rem]' : 'bg-bone/60 left-1'}`}
        />
      </span>
      <span className="w-20 text-left font-mono text-xs tracking-[0.12em] uppercase">
        {checked ? onLabel : offLabel}
      </span>
    </button>
  );
}

export function CookiePreferences({
  open,
  onClose,
  locale,
  strings,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  strings: ConsentStrings;
}) {
  const { consent, save, acceptAll, rejectAll } = useConsent();
  const p = strings.consent.preferences;
  // Draft edits; null = show the stored decision (reset every time the dialog closes).
  const [draft, setDraft] = useState<Record<OptionalCategory, boolean> | null>(null);
  const choices: Record<OptionalCategory, boolean> = draft ?? {
    preferences: !!consent?.preferences,
    analytics: !!consent?.analytics,
    marketing: !!consent?.marketing,
  };
  const close = () => {
    setDraft(null);
    onClose();
  };
  const act = (fn: () => void) => () => {
    fn();
    close();
  };

  const btn =
    'min-h-11 border border-bone/40 px-4 py-2.5 font-mono text-[0.78rem] tracking-[0.12em] uppercase transition-colors hover:border-mint hover:text-mint';

  return (
    <Modal
      open={open}
      onClose={close}
      title={p.title}
      closeLabel={strings.legal.close}
      size="lg"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" className={btn} onClick={act(rejectAll)}>
            {p.rejectAll}
          </button>
          <button type="button" className={btn} onClick={act(acceptAll)}>
            {p.acceptAll}
          </button>
          <button
            type="button"
            className={`${btn} border-mint text-mint hover:bg-mint hover:text-obsidian`}
            onClick={act(() => save(choices))}
            data-consent-action="save"
          >
            {p.save}
          </button>
        </div>
      }
    >
      <p className="text-bone/85 text-[0.98rem] leading-relaxed">{p.intro}</p>
      <ul className="divide-bone/10 border-bone/10 mt-6 divide-y border-y">
        <li className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div>
            <h3
              id="cat-necessary"
              className="text-bone font-mono text-sm tracking-[0.12em] uppercase"
            >
              {p.categories.necessary.title}
            </h3>
            <p id="cat-necessary-desc" className="text-muted mt-2 text-sm leading-relaxed">
              {p.categories.necessary.body}
            </p>
          </div>
          <span className="text-mint inline-flex min-h-11 shrink-0 items-center font-mono text-xs tracking-[0.12em] uppercase">
            {p.alwaysOn}
          </span>
        </li>
        {optionalCategories.map((c) => (
          <li
            key={c}
            className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
          >
            <div>
              <h3
                id={`cat-${c}`}
                className="text-bone font-mono text-sm tracking-[0.12em] uppercase"
              >
                {p.categories[c].title}
              </h3>
              <p id={`cat-${c}-desc`} className="text-muted mt-2 text-sm leading-relaxed">
                {p.categories[c].body}
              </p>
            </div>
            <Switch
              checked={choices[c]}
              onChange={(v) => setDraft({ ...choices, [c]: v })}
              labelledBy={`cat-${c}`}
              describedBy={`cat-${c}-desc`}
              onLabel={p.on}
              offLabel={p.off}
            />
          </li>
        ))}
      </ul>
      <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <LegalDialogButton
          doc="cookies"
          locale={locale}
          title={strings.linkTitles.cookies}
          strings={strings.legal}
        >
          {p.policy}
        </LegalDialogButton>
        <LegalDialogButton
          doc="privacy"
          locale={locale}
          title={strings.linkTitles.privacy}
          strings={strings.legal}
        >
          {p.privacy}
        </LegalDialogButton>
      </p>
    </Modal>
  );
}
