import type { GlobPattern } from 'glob'
import type { MinimizeOptions } from './fetchMarkdown'

export type PresetConfig = {
	/** The pretty title of the preset */
	title: string
	/** Optional description of the preset */
	description?: string
	/** The owner of the GitHub repository */
	owner: string
	/** The name of the GitHub repository */
	repo: string
	/** List of glob patterns for including files */
	glob: GlobPattern[]
	/** List of glob patterns for excluding files */
	ignore?: GlobPattern[]
	/** Optional prompt to provide additional context or instructions to language models */
	prompt?: string
	/** Minimization options for the content */
	minimize?: MinimizeOptions
	/** Estimated size of the content in KB */
	estimatedSizeKb?: number
}

export const presets: Record<string, PresetConfig> = {
	'svelte-complete': {
		title: '⭐️ Svelte + SvelteKit (Recommended - Large preset)',
		description: 'Complete Svelte + SvelteKit docs content excluding legacy docs',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: [
			'**/apps/svelte.dev/content/docs/kit/**/*.md',
			'**/apps/svelte.dev/content/docs/svelte/**/*.md'
		],
		ignore: [
		],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		minimize: {
			removeLegacy: true,
			removePlaygroundLinks: true,
			removeNoteBlocks: true,
			removeDetailsBlocks: true,
			removeHtmlComments: true,
			normalizeWhitespace: true
		}
	},
	'svelte-complete-small': {
		title: '⭐️ Svelte + SvelteKit (Recommended - Small preset)',
		description: 'Tutorial content and Svelte + Kit reference docs',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: [
			'**/apps/svelte.dev/content/tutorial/**/*.md',
			'**/apps/svelte.dev/content/docs/svelte/98-reference/**/*.md',
			'**/apps/svelte.dev/content/docs/kit/98-reference/**/*.md'
		],
		ignore: [
		],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		minimize: {
			removeLegacy: true,
			removePlaygroundLinks: true,
			removeNoteBlocks: true,
			removeDetailsBlocks: true,
			removeHtmlComments: true,
			normalizeWhitespace: true
		}
	},
	'svelte-complete-tiny': {
		title: '⭐️ Svelte + SvelteKit (Recommended - Tiny preset)',
		description: 'Tutorial content only',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: [
			'**/apps/svelte.dev/content/tutorial/**/*.md',
		],
		ignore: [
		],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		minimize: {
			removeLegacy: true,
			removePlaygroundLinks: true,
			removeNoteBlocks: true,
			removeDetailsBlocks: true,
			removeHtmlComments: true,
			 normalizeWhitespace: true
		}
	},
	svelte: {
		title: 'Svelte (Full)',
		description: 'Complete documentation including legacy and reference',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/svelte/**/*.md'],
		ignore: ['**/apps/svelte.dev/content/docs/svelte/99-legacy/**/*.md'],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		estimatedSizeKb: 350,
		minimize: {}
	},
	sveltekit: {
		title: 'SvelteKit (Full)',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/kit/**/*.md'],
		estimatedSizeKb: 410,
		minimize: {}
	},
	'svelte-cli': {
		title: 'Svelte CLI - npx sv',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/cli/**/*.md'],
		ignore: [],
		minimize: {}
	}
}
