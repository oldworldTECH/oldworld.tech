import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const logs = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/logs' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        status: z.enum(['stable', 'draft', 'deprecated']).default('stable'),
        // Controls the URL. Permanent once published. Never derived from the filename.
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase kebab-case only'),
    }),
});

export const collections = { logs };
