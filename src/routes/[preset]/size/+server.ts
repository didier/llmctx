import type { RequestHandler } from './$types'
import { error } from '@sveltejs/kit'
import { presets } from '$lib/presets'
import { fetchAndProcessMarkdown } from '$lib/fetchMarkdown'
import { swr } from '$lib/cache'

export const GET: RequestHandler = async ({ params }) => {
    const preset = params.preset

    if (!(preset in presets)) {
        error(400, `Invalid preset: "${preset}"`)
    }

    try {
        // Use SWR cache with a longer TTL for sizes
        const { value: size } = await swr(`${preset}-size`, async () => {
            const content = await fetchAndProcessMarkdown(presets[preset])
            // Get size in KB and round to 1 decimal
            const sizeKb = Math.round(new TextEncoder().encode(content).length / 1024 * 10) / 10
            return sizeKb
        }, {
            // Cache size calculations for longer since they change less frequently
            minTimeToStale: 24 * 60 * 60 * 1000, // 24 hours
            maxTimeToLive: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        return new Response(JSON.stringify({ sizeKb: size }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (e) {
        console.error(`Error calculating size for preset "${preset}":`, e)
        error(500, `Failed to calculate size for preset "${preset}"`)
    }
}