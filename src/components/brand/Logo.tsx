import Image from 'next/image';

/**
 * Brand marks traced from the supplied BlackMint artwork (see
 * docs/ASSET_INVENTORY.md). Never redraw or restyle the logo — swap the SVG
 * files in /public/brand to update it everywhere.
 */
const files = {
  lockup: { src: '/brand/logo-lockup.svg', w: 3110, h: 1093 },
  wordmark: { src: '/brand/wordmark.svg', w: 2398, h: 829 },
  symbol: { src: '/brand/symbol-mint.svg', w: 806, h: 1093 },
  'symbol-bone': { src: '/brand/symbol-offwhite.svg', w: 806, h: 1093 },
} as const;

export type LogoVariant = keyof typeof files;

export function Logo({
  variant = 'lockup',
  className,
  alt = 'BlackMint Interactive',
  priority,
  decorative,
}: {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
  priority?: boolean;
  /** When the adjacent text already names the studio. */
  decorative?: boolean;
}) {
  const f = files[variant];
  return (
    <Image
      src={f.src}
      width={f.w}
      height={f.h}
      alt={decorative ? '' : alt}
      aria-hidden={decorative || undefined}
      className={className}
      priority={priority}
      unoptimized
      draggable={false}
    />
  );
}
