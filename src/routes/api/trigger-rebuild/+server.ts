// Types
import type { RequestHandler } from './$types'

// Env
import { VERCEL_DEPLOY_HOOK_URL } from '$env/static/private'

export const GET: RequestHandler = async () => {
	try {
		const response = await fetch(VERCEL_DEPLOY_HOOK_URL, { method: 'POST' })
		if (!response.ok) {
			throw new Error(`Deploy hook failed: ${response.statusText}`)
		}
		return new Response('Rebuild triggered successfully', { status: 200 })
	} catch (error) {
		console.error('Failed to trigger rebuild:', error)
		return new Response('Failed to trigger rebuild', { status: 500 })
	}
}
