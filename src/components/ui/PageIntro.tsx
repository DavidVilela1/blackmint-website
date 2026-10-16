import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitWords } from '@/components/motion/SplitWords';

/** Editorial page opening: eyebrow, oversized distressed headline, lede. */
export function PageIntro({
  eyebrow,
  title,
  intro,
  children,
  aside,
  size = 'xl',
}: {
  size?: 'xl' | 'lg';
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  const titleSize =
    size === 'xl' ? 'text-[clamp(2.6rem,9vw,8.5rem)]' : 'text-[clamp(2.6rem,6vw,5.6rem)]';
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
      <div className={size === 'xl' ? 'lg:col-span-8' : 'lg:col-span-12'}>
        <Reveal variant="fade" start="load">
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <Reveal
          as="h1"
          variant="words"
          start="load"
          className={`display distress mt-5 ${titleSize} text-bone`}
        >
          <SplitWords text={title} />
        </Reveal>
      </div>
      {aside ? <div className="lg:col-span-4">{aside}</div> : null}
      {intro || children ? (
        <Reveal variant="up" start="load" delay={0.25} className="lg:col-span-7">
          {intro ? (
            <p className="text-bone/85 text-lg leading-relaxed sm:text-xl">{intro}</p>
          ) : null}
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}
