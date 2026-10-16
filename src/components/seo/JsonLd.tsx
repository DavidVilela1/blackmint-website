import { serializeJsonLd } from '@/lib/seo/jsonld';

/** Emits exactly one JSON-LD block (use graph() to combine nodes). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
