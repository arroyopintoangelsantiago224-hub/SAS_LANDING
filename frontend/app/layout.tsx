import type { Metadata } from 'next';
import './styles/globals.css';
import Header from '@/components/tenant/Header';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50/50 flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 py-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
