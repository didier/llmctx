import type { PresetConfig } from '$lib/presets'
import { GITHUB_TOKEN } from '$env/static/private'
import { dev } from '$app/environment'
import tarStream from 'tar-stream'
import { Readable } from 'stream'
import { createGunzip } from 'zlib'
import { minimatch } from 'minimatch'

// Main function to fetch and process markdown files
export async function fetchAndProcessMarkdown(preset: PresetConfig): Promise<string> {
	const files = await fetchMarkdownFiles(preset)
	if (dev) {
		console.log(`Fetched ${files.length} files for ${preset.title}`)
	}
	return files.join(' ')
}

// Fetch markdown files using GitHub's tarball API
async function fetchMarkdownFiles({ owner, repo, glob }: PresetConfig): Promise<string[]> {
	// Construct the tarball URL
	const url = `https://api.github.com/repos/${owner}/${repo}/tarball`

	if (dev) {
		console.log(`Fetching tarball from: ${url}`)
	}

	// Fetch the tarball
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3.raw'
		}
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch tarball: ${response.statusText}`)
	}

	const contents: string[] = []
	const extractStream = tarStream.extract()

	let processedFiles = 0
	let matchedFiles = 0

	// Process each file in the tarball
	extractStream.on('entry', (header, stream, next) => {
		processedFiles++
		const isAllowed = glob.some((pattern) => {
			const isNegated = pattern.startsWith('!')
			const matchPattern = isNegated ? pattern.slice(1) : pattern
			const matches = minimatch(header.name, matchPattern)
			return isNegated ? !matches : matches
		})

		if (dev) {
			if (isAllowed) {
				console.info(`Allowed file: ${header.name}`)
			}
		}

		if (header.type === 'file' && isAllowed) {
			matchedFiles++
			let content = ''
			stream.on('data', (chunk) => (content += chunk.toString()))
			stream.on('end', () => {
				contents.push(minimizeContent(content))
				if (dev) {
					console.log(`Processed file: ${header.name}`)
				}
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

	if (dev) {
		console.log(`Total files processed: ${processedFiles}`)
		console.log(`Files matching glob: ${matchedFiles}`)
	}

	return contents
}

// Minimize the content of a markdown file
function minimizeContent(content: string): string {
	const minimized = content
		.replace(/\s+/g, ' ')
		// .replace(/```[\s\S]*?```/g, '')
		.replace(/\[.*?\]/g, '')
		.replace(/\(.*?\)/g, '')
		.trim()

	if (dev) {
		console.log(`Original content length: ${content.length}`)
		console.log(`Minimized content length: ${minimized.length}`)
	}

	return minimized
}
