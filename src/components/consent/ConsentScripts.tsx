'use client';

import Script from 'next/script';
import type { ConsentState } from '@/lib/consent/config';
import { integrations } from '@/lib/consent/integrations';

/** Injects consent-gated third-party scripts. Renders nothing by default. */
export function ConsentScripts({ consent }: { consent: ConsentState | null }) {
  if (!consent) return null;
  const allowed = integrations.filter((i) => consent[i.category]);
  return (
    <>
      {allowed.map((i) => (
        <Script
          key={i.id}
          id={`consent-${i.id}`}
          src={i.src}
          strategy="afterInteractive"
          {...i.attributes}
        />
      ))}
    </>
  );
}
