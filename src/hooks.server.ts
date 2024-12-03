import { sequence } from '@sveltejs/kit/hooks'
import { type Handle } from '@sveltejs/kit'
import { building } from '$app/environment'

const headers: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)
	response.headers.set('cache-control', 'no-cache')
	return response
}

const logger: Handle = async ({ event, resolve }) => {
	const requestStartTime = Date.now()
	const response = await resolve(event)

	// Note: This is specific to the CapRover environment
	let ip = '127.0.0.1'

	if (!building) {
		try {
			ip = event.request.headers.get('x-forwarded-for') || event.getClientAddress()
		} catch (e) {
			console.error('Could not get client IP address:', e)
		}
	}

	const date = new Date(requestStartTime)
	const wlz = (num: number) => (num < 10 ? `0${num}` : num)

	console.log(
		`${wlz(date.getHours())}:${wlz(date.getMinutes())}:${wlz(date.getSeconds())}`,
		`[${ip}]`,
		event.request.method,
		event.url.pathname,
		`- 🐇 ${Date.now() - requestStartTime} ms`,
		`${response.status === 200 ? '✅' : '❌'} ${response.status}`
	)
	return response
}

export const handle: Handle = sequence(logger, headers)
