import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import simpleGit from 'simple-git'
import { promises as fs } from 'fs'
import path from 'path'
import { PERSONAL_GITHUB_TOKEN } from '$env/static/private'
import { dev } from '$app/environment'

export const prerender = true

// Types and Interfaces
type PresetConfig = {
	owner: string
	repo: string
	path: string
	allowList: string[]
}

// Constants
const ONE_DAY = 24 * 60 * 60 * 1000 // One day in milliseconds
const CACHE_DURATION = dev ? 0 : ONE_DAY // Cache duration in milliseconds

const presets: Record<string, PresetConfig> = {
	svelte: {
		owner: 'sveltejs',
		repo: 'svelte',
		path: 'documentation',
		allowList: ['docs']
	}
	// Add more presets here
}

// Helper Functions
async function cleanDirectory(dir: string) {
	try {
		await fs.rm(dir, { recursive: true, force: true })
		console.log(`Cleaned directory: ${dir}`)
	} catch (error) {
		if (error.code !== 'ENOENT') {
			console.error(`Error cleaning directory: ${error.message}`)
		}
	}
}

async function cloneRepo(owner: string, repo: string, dir: string) {
	const git = simpleGit()
	await git.clone(`https://${PERSONAL_GITHUB_TOKEN}@github.com/${owner}/${repo}.git`, dir)
	console.log(`Cloned repository: ${owner}/${repo}`)
}

async function findMarkdownFiles(dir: string, allowList: string[], baseDir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true })
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.resolve(dir, entry.name)
			const relativePath = path.relative(baseDir, fullPath)

			// Check if the relative path starts with any allowed path
			const isAllowed = allowList.some(allowed => relativePath.startsWith(allowed))

			if (isAllowed) {
				if (entry.isDirectory()) {
					return findMarkdownFiles(fullPath, allowList, baseDir)
				} else if (entry.isFile() && fullPath.endsWith('.md')) {
					console.log(`Found allowed Markdown file: ${fullPath}`)
					return [fullPath]
				}
			}
			// If not allowed, don't recurse into subdirectories
			return []
		})
	)
	return files.flat()
}

function minimizeContent(content: string): string {
	return content
		.replace(/\s+/g, ' ')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/\[.*?\]/g, '')
		.replace(/\(.*?\)/g, '')
		.trim()
}

// Main Functions
async function fetchAndProcessMarkdown(preset: PresetConfig): Promise<string> {
	const { owner, repo, path: subPath, allowList } = preset
	const tempDir = path.join(process.cwd(), 'temp', `${owner}-${repo}`)

	await cleanDirectory(tempDir)
	await cloneRepo(owner, repo, tempDir)

	const baseDir = path.join(tempDir, subPath)
	const files = await findMarkdownFiles(baseDir, allowList, baseDir)
	console.log(`Found ${files.length} Markdown files`)

	const contents = await Promise.all(files.map((file) => fs.readFile(file, 'utf-8')))
	const minimizedContent = contents.map(minimizeContent).join(' ')

	// Save files to a permanent location
	const saveDir = path.join(process.cwd(), 'markdown_files', `${owner}-${repo}`)
	await fs.mkdir(saveDir, { recursive: true })

	await Promise.all(
		files.map(async (file, index) => {
			const relativePath = path.relative(path.join(tempDir, subPath), file)
			const savePath = path.join(saveDir, relativePath)
			await fs.mkdir(path.dirname(savePath), { recursive: true })
			await fs.writeFile(savePath, contents[index], 'utf-8')
		})
	)

	await cleanDirectory(tempDir)
	return minimizedContent
}

async function getCachedOrFetchMarkdown(preset: PresetConfig): Promise<string> {
	const { owner, repo } = preset
	const cacheFile = path.join(process.cwd(), 'markdown_files', `${owner}-${repo}`, 'cache.json')

	try {
		const cacheStats = await fs.stat(cacheFile)
		if (Date.now() - cacheStats.mtimeMs < CACHE_DURATION) {
			const cache = JSON.parse(await fs.readFile(cacheFile, 'utf-8'))
			return cache.content
		}
	} catch (error) {
		// Cache doesn't exist or is invalid, continue to fetch
	}

	const content = await fetchAndProcessMarkdown(preset)
	await fs.mkdir(path.dirname(cacheFile), { recursive: true })
	await fs.writeFile(cacheFile, JSON.stringify({ content, timestamp: Date.now() }), 'utf-8')
	return content
}

// Request Handler
export const GET: RequestHandler = async ({ params }) => {
	const { preset } = params

	if (preset in presets) {
		try {
			const content = await getCachedOrFetchMarkdown(presets[preset])
			console.log('Content length:', content.length)
			return new Response(content, {
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

// SvelteKit Entry Generator
export function entries() {
	return Object.keys(presets).map((preset) => ({ preset }))
}
