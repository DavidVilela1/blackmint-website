import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { fontVariables } from '@/lib/fonts';

/**
 * Last-resort 404 for URLs that match no route at all (the proxy normally
 * sends every request to a localized route, whose own not-found page is used).
 * Bilingual because the locale is unknown here.
 */
export const metadata: Metadata = {
  title: 'Page not found — BlackMint Interactive',
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-obsidian text-bone flex min-h-svh items-center">
        <main className="container-bm py-24">
          <p className="eyebrow">404</p>
          <h1 className="display mt-6 text-[clamp(3rem,10vw,8rem)]">Lost in the fog.</h1>
          <p lang="pt-PT" className="display text-bone/50 mt-2 text-[clamp(2rem,6vw,4.5rem)]">
            Perdido no nevoeiro.
          </p>
          <ul className="mt-10 flex flex-wrap gap-6">
            <li>
              <Link className="btn-brush" href="/en">
                English
              </Link>
            </li>
            <li>
              <Link
                className="btn-brush btn-brush--bone"
                href="/pt-pt"
                lang="pt-PT"
                hrefLang="pt-PT"
              >
                Português
              </Link>
            </li>
          </ul>
        </main>
      </body>
    </html>
  );
}
