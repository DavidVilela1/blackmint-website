/** Hand-drawn underline used by .link-scribble and headline accents. */
export function Scribble({ className = 'scribble' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M2 8.5c18-3 36-4.2 58-3.6 24 .6 40 3.1 66 2.4 31-.8 47-4.6 76-4.3 14 .1 25 1.2 36 2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Thick brush underline, e.g. under the hero annotation. */
export function BrushUnderline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 18"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M4 12c40-5 82-7.5 128-7 52 .6 92 2.4 164-3l-2 7c-58 4.4-104 3.9-158 3.6-46-.3-82 1-130 4.4z"
        fill="currentColor"
      />
    </svg>
  );
}
