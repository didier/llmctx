import { dev } from '$app/environment'
import { createStaleWhileRevalidateCache } from 'stale-while-revalidate-cache'
import type { Storage } from 'stale-while-revalidate-cache/types'

const map = new Map()

const storage: Storage = {
	getItem(cacheKey: string) {
		return map.get(cacheKey)
	},
	setItem(cacheKey: string, cacheValue: any) {
		map.set(cacheKey, cacheValue)
	},
	removeItem(cacheKey: string) {
		map.delete(cacheKey)
	}
}

export const swr = createStaleWhileRevalidateCache({
	storage,
	minTimeToStale: 5 * 1000,
	maxTimeToLive: 24 * 60 * 60 * 1000,
	serialize: JSON.stringify,
	deserialize: JSON.parse
})

if (dev) {
	swr.on('cacheMiss', (payload) => {
		console.log(`Cache miss for ${payload.cacheKey}`)
	})
}
