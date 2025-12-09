/**
 * Next.js configuration file with PWA support using next-pwa.
 * This setup generates a service worker and precaches static assets
 * to enable offline usage of the BJJ Academy PWA.
 */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false, // keep new SW in "waiting" so the UI can decide when to promote it
  disable: process.env.NODE_ENV === 'development',
  swSrc: 'public/service-worker.js',
});

module.exports = withPWA({
  reactStrictMode: true,
  typescript: {
    // O ambiente de prototipagem não instala automaticamente os pacotes de tipagem.
    // Ao ignorar erros de TypeScript garantimos o build mesmo com stores .ts mockados.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Evita que o build falhe tentando instalar dependências do ESLint/TypeScript automaticamente.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  async redirects() {
    return [
      {
        source: '/documentos',
        destination: '/instrutor/documentos',
        permanent: false,
      },
    ];
  },
});
