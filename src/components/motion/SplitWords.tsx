import { Fragment } from 'react';

/**
 * Splits text into masked words for headline reveals. Rendered on the server:
 * the full sentence stays in the DOM in reading order, so screen readers and
 * crawlers get normal text. No runtime DOM splitting.
 */
export function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className={`word-mask ${className ?? ''}`}>
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}
