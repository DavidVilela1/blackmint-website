/**
 * Torn-paper edge between sections. `position="top"` sits on the top of the
 * section it belongs to; the colour follows `currentColor` via CSS mask.
 */
export function TornEdge({
  position = 'top',
  className = 'text-obsidian',
}: {
  position?: 'top' | 'bottom';
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 h-10 md:h-14 ${
        position === 'top' ? '-top-px rotate-180' : '-bottom-px'
      } ${className}`}
      style={{
        backgroundColor: 'currentColor',
        WebkitMask: "url('/textures/torn-edge.webp') center bottom / 100% 100% no-repeat",
        mask: "url('/textures/torn-edge.webp') center bottom / 100% 100% no-repeat",
      }}
    />
  );
}
