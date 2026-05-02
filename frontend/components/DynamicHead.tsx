'use client';

import { useEffect } from 'react';
import { fetchConfigs } from '@/lib/api';

export default function DynamicHead() {
  useEffect(() => {
    async function updateMetadata() {
      try {
        const configs = await fetchConfigs();
        
        // Update Title
        if (configs.site_title) {
          document.title = configs.site_title;
        } else if (configs.site_name) {
          document.title = configs.site_name;
        }

        // Update Favicon
        if (configs.site_favicon) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = configs.site_favicon;
        }
      } catch (error) {
        console.error('Error updating dynamic metadata:', error);
      }
    }

    updateMetadata();
  }, []);

  return null;
}
