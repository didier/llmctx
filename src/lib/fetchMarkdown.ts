import type { PresetConfig } from '$lib/presets'
import { env } from '$env/dynamic/private'
import { dev } from '$app/environment'
import tarStream from 'tar-stream'
import { Readable } from 'stream'
import { createGunzip } from 'zlib'
import { minimatch } from 'minimatch'
import { swr } from './cache'

// Main function to fetch and process markdown files
export async function fetchAndProcessMarkdown(preset: PresetConfig): Promise<string> {
	const { value: files } = await swr(preset.title, async () => fetchMarkdownFiles(preset))
	if (dev) {
		console.log(`Fetched ${files.length} files for ${preset.title}`)
	}
	return files.join('\n\n')
}

function shouldIncludeFile(filename: string, glob: string[], ignore: string[] = []): boolean {
	// First check if the file should be ignored
	const shouldIgnore = ignore.some((pattern) => minimatch(filename, pattern))
	if (shouldIgnore) {
		return false
	}

	// Then check if the file matches include patterns
	return glob.some((pattern) => minimatch(filename, pattern))
}

// Fetch markdown files using GitHub's tarball API
async function fetchMarkdownFiles({
	owner,
	repo,
	glob,
	ignore = [],
	minimize = undefined
}: PresetConfig): Promise<string[]> {
	// Construct the tarball URL
	const url = `https://api.github.com/repos/${owner}/${repo}/tarball`

	if (dev) {
		console.log(`Fetching tarball from: ${url}`)
	}

	// Fetch the tarball
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${env.GITHUB_TOKEN}`,
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
		const isAllowed = shouldIncludeFile(header.name, glob, ignore)

		if (dev) {
			if (isAllowed) {
				console.info(`Allowed file: ${header.name}`)
			} else if (ignore?.some((pattern) => minimatch(header.name, pattern))) {
				console.info(`Ignored file: ${header.name}`)
			}
		}

		if (header.type === 'file' && isAllowed) {
			matchedFiles++
			let content = ''
			stream.on('data', (chunk) => (content += chunk.toString()))
			stream.on('end', () => {
				// Remove the repo directory prefix and apps/svelte.dev/content
				const cleanPath = header.name
					.split('/')
					.slice(1) // Remove repo directory
					.join('/')
					.replace('apps/svelte.dev/content/', '') // Remove the fixed prefix

				// Add the file header before the content
				const contentWithHeader = `## ${cleanPath}\n\n${minimizeContent(content, minimize)}`
				contents.push(contentWithHeader)
				if (dev) {
					// console.log(`Processed file: ${header.name}`)
				}
				next()
			})
		} else {
			stream.resume()
			next()
		}
	})

	if (!response.body) {
		throw new Error('Response body is null')
	}

	// Create a readable stream from the response body
	const chunks: Uint8Array[] = []
	const reader = response.body.getReader()

	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		chunks.push(value)
	}

	const tarballStream = Readable.from(Buffer.concat(chunks))

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

export interface MinimizeOptions {
	normalizeWhitespace?: boolean
	removeLegacy?: boolean
	removePlaygroundLinks?: boolean
	removePrettierIgnore?: boolean
	removeNoteBlocks?: boolean
}

const defaultOptions: MinimizeOptions = {
	normalizeWhitespace: false,
	removeLegacy: false,
	removePlaygroundLinks: false,
	removePrettierIgnore: true,
	removeNoteBlocks: false
}

function removeQuoteBlocks(content: string, blockType: string): string {
	return content
		.split('\n')
		.reduce((acc: string[], line: string, index: number, lines: string[]) => {
			// If we find a block (with or without additional text), skip it and all subsequent blockquote lines
			if (line.trim().startsWith(`> [!${blockType}]`)) {
				// Skip all subsequent lines that are part of the blockquote
				let i = index
				while (i < lines.length && (lines[i].startsWith('>') || lines[i].trim() === '')) {
					i++
				}
				// Update the index to skip all these lines
				index = i - 1
				return acc
			}

			// Only add the line if it's not being skipped
			acc.push(line)
			return acc
		}, [])
		.join('\n')
}

function minimizeContent(content: string, options?: Partial<MinimizeOptions>): string {
	// Merge with defaults, but only for properties that are defined
	const settings: MinimizeOptions = options ? { ...defaultOptions, ...options } : defaultOptions

	let minimized = content

	if (settings.removeLegacy) {
		minimized = removeQuoteBlocks(minimized, 'LEGACY')
	}

	if (settings.removeNoteBlocks) {
		minimized = removeQuoteBlocks(minimized, 'NOTE')
	}

	if (settings.removePlaygroundLinks) {
		// Replace playground URLs with /[link] but keep the original link text
		minimized = minimized.replace(/\[([^\]]+)\]\(\/playground[^)]+\)/g, '[$1](/REMOVED)')
	}

	if (settings.removePrettierIgnore) {
		minimized = minimized
			.split('\n')
			.filter((line) => line.trim() !== '<!-- prettier-ignore -->')
			.join('\n')
	}

	if (settings.normalizeWhitespace) {
		minimized = minimized.replace(/\s+/g, ' ')
	}

	minimized = minimized.trim()

	if (dev) {
		//console.log(`Original content length: ${content.length}`)
		//console.log(`Minimized content length: ${minimized.length}`)
		//console.log('Applied minimizations:', Object.keys(settings).join(', '))
	}

	return minimized
}
