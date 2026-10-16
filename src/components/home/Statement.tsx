import type { Dictionary } from '@/i18n/dictionaries';
import { PinnedStatement } from '@/components/motion/PinnedStatement';
import { Reveal } from '@/components/motion/Reveal';
import { Doodle, type DoodleName } from '@/components/brand/Doodle';

export function Statement({ dict }: { dict: Dictionary }) {
  const s = dict.home.statement;
  const doodles: DoodleName[] = ['crown', 'controller', 'x'];
  return (
    <section
      id="statement"
      aria-labelledby="statement-heading"
      className="bg-obsidian relative py-24 sm:py-32"
    >
      <div className="container-bm">
        <h2 id="statement-heading" className="sr-only">
          {s.label}
        </h2>
        <PinnedStatement text={s.text} label={s.label} />
        <Reveal
          as="ul"
          variant="stagger"
          className="border-bone/10 bg-bone/10 mt-20 grid gap-px border md:grid-cols-3"
        >
          {s.principles.map((p, i) => (
            <li key={p.title} className="group bg-obsidian relative p-7 sm:p-9">
              <div className="flex items-start justify-between">
                <span className="text-muted font-mono text-xs">0{i + 1}</span>
                <Doodle
                  name={doodles[i] ?? 'x'}
                  className="h-10 w-auto opacity-80 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                />
              </div>
              <h3 className="display text-bone mt-10 text-3xl sm:text-4xl">{p.title}</h3>
              <p className="text-bone/75 mt-4 leading-relaxed">{p.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
