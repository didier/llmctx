import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { GITHUB_WEBHOOK_SECRET } from '$env/static/private'
import crypto from 'crypto'

export const POST: RequestHandler = async ({ request }) => {
    const payload = await request.text()
    const signature = request.headers.get('x-hub-signature-256')

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET)
    const digest = 'sha256=' + hmac.update(payload).digest('hex')
    if (signature !== digest) {
        return json({ error: 'Invalid signature' }, { status: 403 })
    }

    const event = JSON.parse(payload)
    if (event.action === 'published' && event.release) {
        // Trigger your build process here
        console.log('New release detected, triggering build')
        // You might want to use a queue system for handling builds
        triggerBuild(event.repository.full_name)
    }

    return json({ success: true })
}

function triggerBuild(repoFullName: string) {
    // Implement your build triggering logic here
    // This could involve running a script, calling an API, etc.
    console.log(`Triggering build for ${repoFullName}`)
}