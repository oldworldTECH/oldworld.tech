import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Published logs, newest first.
 *
 * Single source of truth for the draft filter. The index, the [slug] routes and
 * the RSS feed all call this, so they cannot drift out of agreement about what
 * is public. Drafts render under `npm run dev` and are absent from any build.
 */
export async function getPublishedLogs(): Promise<CollectionEntry<'logs'>[]> {
    const logs = await getCollection('logs', ({ data }) =>
        import.meta.env.PROD ? data.status !== 'draft' : true
    );
    return logs.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
