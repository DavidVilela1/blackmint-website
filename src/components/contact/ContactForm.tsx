'use client';

import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import {
  type ContactErrors,
  type ContactField,
  type ContactResponse,
  LIMITS,
  contactTopics,
  normalizeContact,
  validateContact,
} from '@/lib/contact/validation';
import { LegalDialogButton, type LegalDialogStrings } from '@/components/legal/LegalDialogButton';

type Status = 'idle' | 'sending' | 'success' | 'error';

const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? String(v[k]) : m));

/**
 * Contact form with client-side validation for instant feedback and the same
 * validation repeated on the server. Errors are announced via an error
 * summary (focus moves to it) and inline messages tied with aria-describedby.
 */
export function ContactForm({
  locale,
  strings,
  legal,
  privacyTitle,
}: {
  locale: Locale;
  strings: Dictionary['contact'];
  legal: LegalDialogStrings;
  privacyTitle: string;
}) {
  const f = strings.form;
  const id = useId();
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const startedAt = useRef<number>(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const message = (field: ContactField) => {
    const code = errors[field];
    return code
      ? fill(strings.validation[code], {
          min: LIMITS.messageMin,
          max: field === 'name' ? LIMITS.nameMax : LIMITS.messageMax,
        })
      : '';
  };

  const readForm = () => {
    const fd = new FormData(formRef.current ?? undefined);
    return normalizeContact({
      name: fd.get('name'),
      email: fd.get('email'),
      topic: fd.get('topic'),
      message: fd.get('message'),
      acknowledgement: fd.get('acknowledgement'),
    });
  };

  const validateField = (field: ContactField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const all = validateContact(readForm());
    setErrors((e) => {
      const next = { ...e };
      if (all[field]) next[field] = all[field];
      else delete next[field];
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = readForm();
    const found = validateContact(data);
    setSubmitted(true);
    setErrors(found);
    setTouched({ name: true, email: true, topic: true, message: true, acknowledgement: true });
    if (Object.keys(found).length) {
      setStatus('idle');
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus('sending');
    setServerMessage('');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          locale,
          website: fd.get('website') ?? '',
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const json = (await res.json().catch(() => null)) as ContactResponse | null;
      if (json?.ok) {
        setStatus('success');
        setSubmitted(false);
        formRef.current?.reset();
      } else {
        setStatus('error');
        if (json && !json.ok && json.fields) setErrors(json.fields);
        const key = json && !json.ok ? json.error : 'deliveryFailed';
        setServerMessage(
          key === 'notConfigured'
            ? strings.status.notConfigured
            : key === 'rateLimited'
              ? strings.status.rateLimited
              : key === 'invalid'
                ? strings.status.invalid
                : strings.status.error,
        );
      }
    } catch {
      setStatus('error');
      setServerMessage(strings.status.error);
    }
    window.requestAnimationFrame(() => statusRef.current?.focus());
  };

  const errorList = (Object.keys(errors) as ContactField[]).filter((k) => errors[k]);
  const fieldId = (n: string) => `${id}-${n}`;
  const describedBy = (n: ContactField, extra?: string) =>
    [errors[n] && touched[n] ? `${fieldId(n)}-error` : '', extra ?? ''].filter(Boolean).join(' ') ||
    undefined;

  if (status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="border-mint/50 border p-8 outline-none"
      >
        <p className="display distress text-mint text-5xl">{strings.status.successTitle}</p>
        <p className="text-bone/85 mt-4 text-lg">{strings.status.successBody}</p>
        <button type="button" className="link-scribble mt-6" onClick={() => setStatus('idle')}>
          {strings.status.sendAnother} <span aria-hidden>→</span>
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={errorList.length ? `${id}-summary` : undefined}
    >
      {errorList.length && submitted && status !== 'sending' ? (
        <div
          ref={summaryRef}
          id={`${id}-summary`}
          tabIndex={-1}
          role="alert"
          className="mb-8 border border-[#ff8f7a]/60 p-5 outline-none focus-visible:outline-2 focus-visible:outline-[#ff8f7a]"
        >
          <p className="font-mono text-xs tracking-[0.14em] uppercase">{f.errorSummary}</p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-[#ffb2a3]">
            {errorList.map((k) => (
              <li key={k}>
                <a href={`#${fieldId(k)}`} className="underline underline-offset-2">
                  {message(k)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset className="space-y-8">
        <legend className="eyebrow mb-2">{f.legend}</legend>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor={fieldId('name')} className="field-label">
              {f.name} <span className="text-mint">*</span>
              <span className="sr-only"> ({f.required})</span>
            </label>
            <input
              id={fieldId('name')}
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={LIMITS.nameMax + 10}
              aria-invalid={!!errors.name && !!touched.name}
              aria-describedby={describedBy('name')}
              onBlur={() => validateField('name')}
              className="field"
            />
            {errors.name && touched.name ? (
              <p id={`${fieldId('name')}-error`} className="field-error mt-2">
                {message('name')}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={fieldId('email')} className="field-label">
              {f.email} <span className="text-mint">*</span>
              <span className="sr-only"> ({f.required})</span>
            </label>
            <input
              id={fieldId('email')}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              aria-invalid={!!errors.email && !!touched.email}
              aria-describedby={describedBy('email')}
              onBlur={() => validateField('email')}
              className="field"
            />
            {errors.email && touched.email ? (
              <p id={`${fieldId('email')}-error`} className="field-error mt-2">
                {message('email')}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor={fieldId('topic')} className="field-label">
            {f.topic} <span className="text-mint">*</span>
            <span className="sr-only"> ({f.required})</span>
          </label>
          <select
            id={fieldId('topic')}
            name="topic"
            defaultValue="general"
            required
            aria-invalid={!!errors.topic && !!touched.topic}
            aria-describedby={describedBy('topic')}
            onBlur={() => validateField('topic')}
            className="field"
          >
            {contactTopics.map((t) => (
              <option key={t} value={t}>
                {f.topics[t]}
              </option>
            ))}
          </select>
          {errors.topic && touched.topic ? (
            <p id={`${fieldId('topic')}-error`} className="field-error mt-2">
              {message('topic')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId('message')} className="field-label">
            {f.message} <span className="text-mint">*</span>
            <span className="sr-only"> ({f.required})</span>
          </label>
          <textarea
            id={fieldId('message')}
            name="message"
            rows={7}
            required
            maxLength={LIMITS.messageMax + 100}
            aria-invalid={!!errors.message && !!touched.message}
            aria-describedby={describedBy('message', `${fieldId('message')}-hint`)}
            onBlur={() => validateField('message')}
            className="field resize-y"
          />
          <p id={`${fieldId('message')}-hint`} className="text-muted mt-2 text-sm">
            {fill(f.messageHint, { min: LIMITS.messageMin })}
          </p>
          {errors.message && touched.message ? (
            <p id={`${fieldId('message')}-error`} className="field-error mt-1">
              {message('message')}
            </p>
          ) : null}
        </div>

        {/* Honeypot — hidden from people and assistive tech, tempting to bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={fieldId('website')}>{f.honeypot}</label>
          <input
            id={fieldId('website')}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              id={fieldId('acknowledgement')}
              name="acknowledgement"
              type="checkbox"
              required
              aria-invalid={!!errors.acknowledgement && !!touched.acknowledgement}
              aria-describedby={describedBy('acknowledgement')}
              onChange={() => validateField('acknowledgement')}
              className="accent-mint mt-1 size-5 shrink-0 cursor-pointer"
            />
            <div className="text-bone/85 text-[0.98rem] leading-relaxed">
              <label htmlFor={fieldId('acknowledgement')} className="cursor-pointer">
                {f.acknowledgement}
              </label>{' '}
              <LegalDialogButton doc="privacy" locale={locale} title={privacyTitle} strings={legal}>
                {f.privacyLink}
              </LegalDialogButton>
              .
            </div>
          </div>
          {errors.acknowledgement && touched.acknowledgement ? (
            <p id={`${fieldId('acknowledgement')}-error`} className="field-error mt-2 pl-8">
              {message('acknowledgement')}
            </p>
          ) : null}
        </div>
      </fieldset>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="btn-brush"
          disabled={status === 'sending'}
          aria-disabled={status === 'sending'}
        >
          {status === 'sending' ? f.sending : f.submit}
          <span aria-hidden>→</span>
        </button>
        <div
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="outline-none"
        >
          {status === 'sending' ? <span className="text-muted">{f.sending}</span> : null}
          {status === 'error' && serverMessage ? (
            <p className="field-error max-w-md">{serverMessage}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
