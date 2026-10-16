import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BlackMint Interactive',
    short_name: 'BlackMint',
    description: 'Independent game studio. Small team. Big worlds.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090a09',
    theme_color: '#090a09',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
