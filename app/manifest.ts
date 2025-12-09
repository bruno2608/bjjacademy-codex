import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BJJ Academy',
    short_name: 'BJJ',
    description: 'Gestão de alunos e treinos da BJJ Academy',
    start_url: '/home',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    // Uncomment and fill in when screenshots are available for richer install prompts.
    // screenshots: [
    //   {
    //     src: '/screenshots/home.png',
    //     sizes: '1280x720',
    //     type: 'image/png',
    //     form_factor: 'wide',
    //   },
    // ],
  };
}
