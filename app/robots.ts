import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

// Libera buscadores e robôs de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) para ler o site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
