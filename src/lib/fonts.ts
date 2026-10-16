import localFont from 'next/font/local';

/**
 * Self-hosted, subset (latin) fonts — no third-party font requests.
 * Licences: src/fonts/LICENSE-*.txt (SIL Open Font License 1.1).
 *
 *  Anton         → oversized condensed display headlines
 *  Patrick Hand  → hand-lettered annotations (echoes the brand sheet lettering)
 *  Archivo       → body copy (variable)
 *  JetBrains Mono→ dev-log labels & metadata (variable)
 */
export const anton = localFont({
  src: '../fonts/anton-400.woff2',
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
  fallback: ['Arial Narrow', 'Impact', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const handScript = localFont({
  src: '../fonts/patrick-hand-400.woff2',
  weight: '400',
  variable: '--font-hand-script',
  display: 'swap',
  preload: false,
});

export const archivo = localFont({
  src: [
    { path: '../fonts/archivo-variable.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/archivo-variable-italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-archivo',
  display: 'swap',
});

export const jetbrains = localFont({
  src: '../fonts/jetbrains-mono-variable.woff2',
  weight: '100 800',
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});

export const fontVariables = [
  anton.variable,
  handScript.variable,
  archivo.variable,
  jetbrains.variable,
].join(' ');
