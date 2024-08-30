import type { Preset } from '$lib/presets'
import { PERSONAL_GITHUB_TOKEN } from '$env/static/private'
import tarStream from 'tar-stream'
import { Readable } from 'stream'
import { createGunzip } from 'zlib'

// Main function to fetch and process markdown files
export async function fetchAndProcessMarkdown(preset: Preset): Promise<string> {
	const { owner, repo, path, allowList } = preset
	const files = await fetchMarkdownFiles(owner, repo, path, allowList)
	return files.join(' ')
}

// Fetch markdown files using GitHub's tarball API
async function fetchMarkdownFiles(
	owner: string,
	repo: string,
	path: string,
	allowList: string[]
): Promise<string[]> {
	// Construct the tarball URL
	const url = `https://api.github.com/repos/${owner}/${repo}/tarball`

	// Fetch the tarball
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${PERSONAL_GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3.raw'
		}
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch tarball: ${response.statusText}`)
	}

	const contents: string[] = []
	const extractStream = tarStream.extract()

	// Process each file in the tarball
	extractStream.on('entry', (header, stream, next) => {
		if (
			header.type === 'file' &&
			header.name.endsWith('.md') &&
			allowList.some((allowed) => header.name.includes(allowed))
		) {
			let content = ''
			stream.on('data', (chunk) => (content += chunk.toString()))
			stream.on('end', () => {
				contents.push(minimizeContent(content))
				next()
			})
		} else {
			stream.resume()
			next()
		}
	})

	// Create a readable stream from the response body
	const tarballStream = Readable.from(response.body)

	// Create a gunzip stream
	const gunzipStream = createGunzip()

	// Pipe the tarball stream through gunzip to the extract stream
	tarballStream.pipe(gunzipStream).pipe(extractStream)

	// Wait for the extraction to complete
	await new Promise<void>((resolve) => extractStream.on('finish', resolve))

	return contents
}

// Minimize the content of a markdown file
function minimizeContent(content: string): string {
	return content
		.replace(/\s+/g, ' ')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/\[.*?\]/g, '')
		.replace(/\(.*?\)/g, '')
		.trim()
}
