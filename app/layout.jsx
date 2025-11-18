/**
 * Root layout for the BJJ Academy PWA.
 * Applies the global Tailwind styles and defines metadata used for the PWA install prompt.
 */
import '../styles/globals.css';
import AppShell from '../components/ui/AppShell';

export const metadata = {
  title: 'BJJ Academy',
  description: 'PWA de gestão da BJJ Academy com foco em performance e simplicidade.',
  manifest: '/manifest.json'
};

export const viewport = {
  themeColor: '#000000'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="night">
      <head>
        {/* PWA meta tags garantem comportamento instalável e cores nativas. */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className="font-sans bg-base-100 text-base-content">
        {/* Todas as páginas do App são renderizadas aqui. */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
