import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://oldworld.tech',
    base: '/',
    trailingSlash: 'never',
    build: {
        // dist/logs/foo.html -> served at /logs/foo with no redirect hop.
        // Default 'directory' emits foo/index.html, which 301s under trailingSlash: 'never'.
        format: 'file',
        // Keeps CSS in external files so the CSP can be style-src 'self' with no 'unsafe-inline'.
        inlineStylesheets: 'never',
    },
    markdown: {
        // Shiki writes inline style="" on <pre> and every token <span>, which the
        // style-src 'self' CSP blocks outright. Prism emits class names instead;
        // the theme lives in the .prose-content styles in src/pages/logs/[slug].astro.
        syntaxHighlight: 'prism',
    },
    integrations: [sitemap()],
});
