import { promises as fs } from 'fs';
import path from 'path';
import type { PresetConfig } from '$lib/presets';
import { fetchAndProcessMarkdown } from '$lib/fetchMarkdown';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function getCachedOrFetchMarkdown(preset: PresetConfig): Promise<string> {
    const { owner, repo } = preset;
    const cacheFile = path.join(process.cwd(), 'markdown_files', `${owner}-${repo}`, 'cache.json');

    try {
        const cacheStats = await fs.stat(cacheFile);
        if (Date.now() - cacheStats.mtimeMs < CACHE_DURATION) {
            const cache = JSON.parse(await fs.readFile(cacheFile, 'utf-8'));
            return cache.content;
        }
    } catch (error) {
        // Cache doesn't exist or is invalid, continue to fetch
    }

    const content = await fetchAndProcessMarkdown(preset);
    await fs.mkdir(path.dirname(cacheFile), { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify({ content, timestamp: Date.now() }), 'utf-8');
    return content;
}

// ... other functions ...