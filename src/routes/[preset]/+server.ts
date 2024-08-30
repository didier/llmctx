// Types
import type { RequestHandler } from './$types'

// Utils
import { error } from '@sveltejs/kit'
import { presets } from '$lib/presets'
import { getCachedOrFetchMarkdown } from '$lib/markdown'
import { dev } from '$app/environment'

export const GET: RequestHandler = async ({ params }) => {
	const { preset } = params

	if (dev) {
		console.log(`Received request for preset: ${preset}`)
	}

	if (preset in presets) {
		try {
			if (dev) {
				console.time(`Fetching markdown for ${preset}`)
			}

			const content = await getCachedOrFetchMarkdown(presets[preset])

			if (dev) {
				console.timeEnd(`Fetching markdown for ${preset}`)
				console.log(`Content length for ${preset}: ${content.length}`)
			}

			if (content.length === 0) {
				throw new Error(`No content found for ${preset}`)
			}

			const response = presets[preset].prompt
				? `${content}\n\nInstructions for LLMs: <SYSTEM>${presets[preset].prompt}</SYSTEM>`
				: content

			if (dev) {
				console.log(`Final response length for ${preset}: ${response.length}`)
			}

			return new Response(response, {
				status: 200,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			})
		} catch (e) {
			console.error(`Error fetching documentation for ${preset}:`, e)
			error(500, `Failed to fetch documentation for "${preset}"`)
		}
	}

	error(400, `Invalid preset: "${preset}"`)
}

export function entries() {
	return Object.keys(presets).map((preset) => ({ preset }))
}
