import type { MetadataRoute } from 'next';
import { getAppUrl } from './lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/Dashboard', '/admin', '/api/', '/checkout', '/saved', '/sign-in', '/sign-up'],
    },
    sitemap: `${getAppUrl()}/sitemap.xml`,
  };
}
