import type { Metadata } from 'next';
import './styles/globals.css';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Providers } from '@/components/Providers';
import Preloader from '@/components/tenant/Preloader';
import MyOrdersToggle from '@/components/tenant/MyOrdersToggle';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Dongarbanzo',
  description: 'Tu tienda de confianza',
  icons: {
    icon: '/favicon.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50/50 dark:bg-[#0A0A0C] flex flex-col">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
           <Preloader />
            <MyOrdersToggle />
            <Toaster richColors position="top-right" />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
