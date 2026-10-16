# SEO implementation

## Per-page metadata

`src/lib/seo/metadata.ts → buildMetadata()` is called by every page's `generateMetadata`. It produces:

- `title`: localized and unique per page, with the template `%s — BlackMint Interactive`. Home uses an absolute title.
- `description`: unique and localized, taken from the dictionaries or content.
- `alternates.canonical`: the absolute URL of this locale's page.
- `alternates.languages`: `en`, `pt-PT` and `x-default`, reciprocal on every page.
- `openGraph`: type, url, siteName, localized title and description, `locale` and `alternateLocale`, an image with alt text (1200×630 localized default or page art), and article times for journal posts.
- `twitter`: `summary_large_image`.
- `robots`:
  - `index, follow` with `max-image-preview: large` on production.
  - `noindex` on non-production, placeholder games, sample articles and 404s.

The layout sets only site-wide defaults (`metadataBase`, title template, manifest), so no page inherits another page's canonical.

## Structured data

Generated in `src/lib/seo/jsonld.ts`. Each page renders **exactly one** `<script type="application/ld+json">` with an `@graph`. Output is escaped against `</script>` injection.

| Page                              | Nodes                                       |
| --------------------------------- | ------------------------------------------- |
| Home                              | `Organization`, `WebSite`, `WebPage`        |
| Studio                            | `Organization`, `WebPage`, `BreadcrumbList` |
| Games / Journal / Contact / Legal | `WebPage`, `BreadcrumbList`                 |
| Game detail                       | `WebPage`, `VideoGame`, `BreadcrumbList`    |
| Article                           | `Article`, `BreadcrumbList`                 |

These fields are emitted **only when confirmed** in `content/site.ts` or `games.ts`:

- `legalName`, `foundingDate`, `email`, `sameAs`
- `genre` (never for placeholders), `gamePlatform`

These are **never** emitted: ratings, reviews, offers, prices, release dates.

Validate after deploy with the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/).

## Sitemap — `/sitemap.xml`

The sitemap is built from `indexableRoutes()` (`src/lib/seo/routes.ts`), the same content source as the pages:

- **Static pages:** 8 per locale.
- **Games and articles:** only when not placeholder or sample.
- **Each entry:** has reciprocal `xhtml:link` alternates.
- **`lastModified`:** only for journal entries (their real publish/update date). Static pages have no defensible date, so none is invented.

It is generated at build time (works without a dev server).

## robots.txt — `/robots.txt`

```
# production
User-Agent: *
Allow: /
Disallow: /api/
Host: https://www.your-domain
Sitemap: https://www.your-domain/sitemap.xml

# any other NEXT_PUBLIC_SITE_ENV
User-Agent: *
Disallow: /
```

Public assets (`/_next`, `/brand`, `/images`, …) are never blocked.

## Indexing strategy

- `/` returns a 307 redirect to a locale. It is deliberately not in the sitemap; the locale URLs are canonical.
- Unknown URLs return a **real HTTP 404** with a localized page and `noindex`.
- Staging and preview deployments are automatically noindexed.

## Going live: Search Console & Bing

1. Deploy with `NEXT_PUBLIC_SITE_URL=https://<your-domain>` and `NEXT_PUBLIC_SITE_ENV=production`, then check `https://<your-domain>/robots.txt`.
2. **Google Search Console:**
   1. Add a _Domain_ property and verify by DNS TXT.
   2. Go to _Sitemaps_ → submit `https://<your-domain>/sitemap.xml`.
   3. Use _URL inspection_ on `/en` and `/pt-pt`.
3. **Bing Webmaster Tools:** import from Search Console or verify the site, then submit the same sitemap.
4. Monitor _Pages_ and _International targeting / hreflang_ reports in the following weeks.

> Nothing has been submitted to any search engine. That requires the studio's accounts and the final domain.
