# Content & internationalization

## Locales

`src/i18n/config.ts` is the single list of locales:

| Locale                     | URL prefix | `<html lang>` | hreflang | Intl / OG         |
| -------------------------- | ---------- | ------------- | -------- | ----------------- |
| English (British spelling) | `/en`      | `en`          | `en`     | `en-GB` / `en_GB` |
| European Portuguese        | `/pt-pt`   | `pt-PT`       | `pt-PT`  | `pt-PT` / `pt_PT` |

`x-default` points to the English URL of each page.

## Where text lives

| Kind                                                                    | File                                                       | Notes                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| UI strings, metadata, alt text for site images, form/consent/error copy | `src/i18n/dictionaries/en.ts` (type source) and `pt-pt.ts` | PT must match EN exactly; TypeScript fails otherwise                        |
| Games                                                                   | `src/content/games.ts`                                     | `Localized<T>` fields: `{ en, 'pt-pt' }`                                    |
| Journal                                                                 | `src/content/journal.ts`                                   | Body is an array of blocks (`p`, `h2`, `quote`, `list`, `image`) per locale |
| Legal                                                                   | `src/content/legal/{en,pt-pt}.ts`                          | Same section ids in both languages (tested)                                 |
| Studio facts & legal identity                                           | `src/content/site.ts`                                      | Language-neutral values; `null` renders "To be confirmed" or a placeholder  |
| Client-only error copy                                                  | `src/i18n/client-strings.ts`                               | Tiny slice for the error boundary                                           |

Server Components read dictionaries with `getDictionary(locale)` and pass only the slices that client components need. No dictionary is bundled wholesale into client JS.

## Interpolation and formatting

- Tokens look like `{name}` and are filled by `format()`.
- Dates use `formatDate(iso, locale)`. It runs deterministically in UTC on the server, giving "24 September 2026" or "24 de setembro de 2026".
- European Portuguese uses guillemets «…», lower-case month names, and EU vocabulary.

## Adding a translation key

1. Add it to `en.ts`.
2. Run `npm run typecheck`. TypeScript lists the missing key in `pt-pt.ts`.
3. Add the European Portuguese value.
4. Run `npm run test`. The parity test also checks tokens and flags Brazilian vocabulary.

## Adding a locale

1. Add it to `locales` and `localeMeta` in `src/i18n/config.ts`.
2. Create `src/i18n/dictionaries/<locale>.ts` typed as `Dictionary`, and register it in `dictionaries/index.ts`.
3. Add the locale key to every `Localized<…>` field in `content/`.
4. Add legal content in `src/content/legal/<locale>.ts`.
5. Adjust `negotiateLocale` if needed.

Routes, sitemap, hreflang and the language switcher pick the new locale up automatically.

## Placeholder and sample content

| Flag                          | Effect                                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `isPlaceholder: true` (games) | "Concept placeholder" badge and a notice on the page, `noindex`, excluded from sitemap, labelled in llms.txt, no genre in JSON-LD |
| `isSample: true` (journal)    | "Sample entry" badge and notice, `noindex`, excluded from sitemap                                                                 |

Set `INDEX_PLACEHOLDER_CONTENT=true` only if you deliberately want them indexed.

## Content that needs studio input

| Item                                               | Location                    | Current state                                                                                |
| -------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| Founded / based in / team size                     | `site.ts → facts`           | `null` → "To be confirmed"                                                                   |
| Official social channels                           | `site.ts → socials`         | Empty → no links rendered; a "channels will be listed here" line instead                     |
| Public email                                       | `NEXT_PUBLIC_CONTACT_EMAIL` | Unset → only the form is offered                                                             |
| Real games                                         | `games.ts`                  | 3 labelled concept placeholders                                                              |
| Real journal posts                                 | `journal.ts`                | 3 labelled samples with placeholder dates                                                    |
| Team profiles                                      | `about` page                | Pending note shown                                                                           |
| Brand-voice copy (statement, principles, approach) | dictionaries                | Written from the brand sheet's slogans and tone. Review and adjust to the studio's own words |
