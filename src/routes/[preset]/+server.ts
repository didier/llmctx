import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { presets } from '$lib/presets'
import { getCachedOrFetchMarkdown } from '$lib/markdown'

export const GET: RequestHandler = async ({ params }) => {
	const { preset } = params

	if (preset in presets) {
		try {
			const content = await getCachedOrFetchMarkdown(presets[preset])

			const response = presets[preset].prompt
				? `${content}\n\nInstructions for LLMs: <SYSTEM>${presets[preset].prompt}</SYSTEM>`
				: content

			return new Response(response, {
				status: 200,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			})
		} catch (error) {
			console.error(`Error fetching documentation for ${preset}:`, error)
			return json({ error: `Failed to fetch documentation for ${preset}` }, { status: 500 })
		}
	}

	return json({ error: 'Invalid preset' }, { status: 400 })
}

export function entries() {
	return Object.keys(presets).map((preset) => ({ preset }))
}
