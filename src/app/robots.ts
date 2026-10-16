import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/env';

/**
 * robots.txt — production allows crawling of all public pages and points to
 * the canonical sitemap; any non-production environment disallows everything
 * (pages there also carry <meta name="robots" content="noindex">).
 * robots.txt is not access control: never rely on it to hide private content.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
