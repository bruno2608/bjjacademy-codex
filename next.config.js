/**
 * Next.js configuration file with PWA support using next-pwa.
 * This setup generates a service worker and precaches static assets
 * to enable offline usage of the BJJ Academy PWA.
 */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  swSrc: 'public/service-worker.js'
});

module.exports = withPWA({
  reactStrictMode: true,
  experimental: {
    appDir: true
  }
});
