import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'SaaS Pedidos - Gestión de Órdenes',
  description: 'Plataforma SaaS para gestión de pedidos gastronómicos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
