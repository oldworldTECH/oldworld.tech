import rss from '@astrojs/rss';
import { getPublishedLogs } from '../lib/logs';

export async function GET(context) {
  const logs = await getPublishedLogs();

  return rss({
    title: 'oldworld.tech',
    description: 'IT infrastructure and homelab engineering logs.',
    site: context.site,
    // Without this, @astrojs/rss appends a trailing slash. Under build.format: 'file'
    // there is no /logs/<slug>/ directory to serve, so every feed link would 404.
    trailingSlash: false,
    items: logs.map(log => ({
      title: log.data.title,
      description: log.data.description,
      pubDate: log.data.pubDate,
      link: `/logs/${log.data.slug}`,
    })),
  });
}
