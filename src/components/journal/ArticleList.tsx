import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { articleHref } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { format, formatDate } from '@/i18n/format';
import type { Article } from '@/content/journal';
import { Reveal } from '@/components/motion/Reveal';

/** Editorial entry list used on the home page (paper surface) and journal index. */
export function ArticleList({
  locale,
  dict,
  articles,
  headingLevel = 3,
  layout = 'columns',
  priorityFirst = false,
}: {
  /** Preload the first cover (when the list is above the fold). */
  priorityFirst?: boolean;
  locale: Locale;
  dict: Dictionary;
  articles: Article[];
  headingLevel?: 2 | 3;
  layout?: 'columns' | 'rows';
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <Reveal
      as="ol"
      variant="stagger"
      className={
        layout === 'columns'
          ? 'grid gap-12 md:grid-cols-3 md:gap-8'
          : 'divide-y divide-current/15 border-y border-current/15'
      }
    >
      {articles.map((a, i) => (
        <li key={a.slug} className={layout === 'rows' ? 'py-10' : ''}>
          <article
            className={`group relative ${layout === 'rows' ? 'grid gap-6 md:grid-cols-12 md:items-start' : ''}`}
          >
            <div
              className={`relative aspect-[4/3] overflow-hidden ${layout === 'rows' ? 'md:col-span-4' : ''}`}
            >
              <Image
                src={a.cover.src}
                alt={a.cover.alt[locale]}
                fill
                priority={priorityFirst && i === 0}
                sizes={
                  layout === 'rows'
                    ? '(min-width: 768px) 33vw, 100vw'
                    : '(min-width: 768px) 30vw, 100vw'
                }
                className="object-cover grayscale transition-[filter,transform] duration-700 will-change-[filter,transform] group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            </div>
            <div className={layout === 'rows' ? 'md:col-span-8' : 'mt-6'}>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase opacity-80">
                <time dateTime={a.publishedAt}>{formatDate(a.publishedAt, locale)}</time>
                <span aria-hidden>·</span>
                <span>{dict.journal.tags[a.tag]}</span>
                <span aria-hidden>·</span>
                <span>{format(dict.common.minutesRead, { n: a.readingMinutes })}</span>
                {a.isSample ? (
                  <span className="badge-placeholder">{dict.common.sampleEntry}</span>
                ) : null}
              </p>
              <H className="display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] leading-[0.95]">
                <Link
                  href={articleHref(locale, a.slug)}
                  className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                    {a.title[locale]}
                  </span>
                </Link>
              </H>
              <p className="mt-4 leading-relaxed opacity-80">{a.excerpt[locale]}</p>
              <p className="mt-5 font-mono text-xs tracking-[0.14em] uppercase" aria-hidden>
                {dict.journal.readEntry} →
              </p>
            </div>
          </article>
        </li>
      ))}
    </Reveal>
  );
}
