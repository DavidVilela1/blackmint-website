import Image from 'next/image';

/** Hand-drawn mint doodles extracted from the brand sheet. Always decorative. */
const doodles = {
  crown: { src: '/brand/doodle-crown.png', w: 176, h: 188 },
  star: { src: '/brand/doodle-star.png', w: 149, h: 172 },
  x: { src: '/brand/doodle-x.png', w: 144, h: 161 },
  controller: { src: '/brand/doodle-controller.png', w: 212, h: 155 },
} as const;

export type DoodleName = keyof typeof doodles;

export function Doodle({ name, className }: { name: DoodleName; className?: string }) {
  // Optimised by next/image (WebP, sized srcset); intrinsic size keeps aspect ratio.
  const d = doodles[name];
  return (
    <Image
      src={d.src}
      width={d.w}
      height={d.h}
      alt=""
      aria-hidden
      className={className}
      sizes="128px"
      draggable={false}
    />
  );
}
