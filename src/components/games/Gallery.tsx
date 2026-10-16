'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Screenshot / artwork gallery with an accessible lightbox (native dialog,
 * keyboard arrows, Escape, focus return).
 */
export function Gallery({
  images,
  title,
  strings,
}: {
  images: GalleryImage[];
  title: string;
  strings: { close: string; previous: string; next: string; imageCount: string; openImage: string };
}) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const go = (d: number) =>
    setIndex((i) => (i === null ? i : (i + d + images.length) % images.length));
  const fill = (s: string, vars: Record<string, number>) =>
    s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src} className={i === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-haspopup="dialog"
              aria-label={fill(strings.openImage, { n: i + 1 })}
              className="group relative block aspect-video w-full overflow-hidden border border-current/10 lg:h-full"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={
                  i === 0 ? '(min-width: 1024px) 64vw, 100vw' : '(min-width: 1024px) 32vw, 50vw'
                }
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      <Modal
        open={index !== null}
        onClose={close}
        title={title}
        closeLabel={strings.close}
        size="full"
        className="!max-h-[100svh] !w-full"
      >
        {current && index !== null ? (
          <div
            className="flex h-full flex-col"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') go(1);
              if (e.key === 'ArrowLeft') go(-1);
            }}
          >
            <figure className="relative min-h-[50svh] flex-1">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </figure>
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                className="hover:text-mint inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase"
              >
                <ChevronLeft aria-hidden className="size-5" /> {strings.previous}
              </button>
              <p aria-live="polite" className="text-muted text-center text-sm">
                {fill(strings.imageCount, { n: index + 1, total: images.length })}
                <span className="text-bone/80 block">{current.alt}</span>
              </p>
              <button
                type="button"
                onClick={() => go(1)}
                className="hover:text-mint inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase"
              >
                {strings.next} <ChevronRight aria-hidden className="size-5" />
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
