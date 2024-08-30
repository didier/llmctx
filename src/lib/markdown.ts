import type { PresetConfig } from '$lib/presets'
import { fetchAndProcessMarkdown } from '$lib/fetchMarkdown'
import { dev } from '$app/environment'

const ONE_DAY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const CACHE_DURATION = dev ? 0 : ONE_DAY // 24 hours in milliseconds

const cache: { [key: string]: { content: string; timestamp: number } } = {}

export async function getCachedOrFetchMarkdown(preset: PresetConfig): Promise<string> {
	const cacheKey = `${preset.owner}-${preset.repo}`

	if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
		return cache[cacheKey].content
	}

	const content = await fetchAndProcessMarkdown(preset)
	cache[cacheKey] = { content, timestamp: Date.now() }
	return content
}
