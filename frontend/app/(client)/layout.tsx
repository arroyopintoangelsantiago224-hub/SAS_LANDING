import Header from '@/components/tenant/Header';
import { siteConfig } from '@/config/site';
import ThemeToggle from '@/components/ThemeToggle';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white dark:bg-[var(--surface)] border-t border-[var(--border)] py-8 transition-colors">
        <div className="container mx-auto px-4 text-center text-[var(--muted)] text-sm">
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
        </div>
      </footer>
      <ThemeToggle />
    </>
  );
}
