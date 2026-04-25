export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Mi Negocio',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Los mejores productos a tu alcance',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  colors: {
    primary: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#000000',
    secondary: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#ffffff',
  },
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '',
};

export type SiteConfig = typeof siteConfig;
