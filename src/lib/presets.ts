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
}

const SVELTE_5_PROMPT = 'Always use Svelte 5 runes and Svelte 5 syntax. Runes do not need to be imported, they are globals.'; 

export const presets: Record<string, PresetConfig> = {
	'svelte-complete': {
		title: '⭐️ Svelte + SvelteKit (Recommended - Large preset)',
		description: 'Complete Svelte + SvelteKit docs excluding legacy, notes and migration docs',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: [
			'**/apps/svelte.dev/content/docs/kit/**/*.md',
			'**/apps/svelte.dev/content/docs/svelte/**/*.md'
		],
		ignore: [
		],
		prompt: SVELTE_5_PROMPT,
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
		description: 'Tutorial content and Svelte + Kit reference docs, excluding legacy, notes and migration docs',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: [
			'**/apps/svelte.dev/content/tutorial/**/*.md',
			'**/apps/svelte.dev/content/docs/svelte/98-reference/**/*.md',
			'**/apps/svelte.dev/content/docs/kit/98-reference/**/*.md'
		],
		ignore: [
		],
		prompt: SVELTE_5_PROMPT,
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
		prompt: SVELTE_5_PROMPT,
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
		ignore: [],
		prompt: SVELTE_5_PROMPT,
		minimize: {},
	},
	sveltekit: {
		title: 'SvelteKit (Full)',
		description: 'Complete documentation including legacy and reference',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		prompt: SVELTE_5_PROMPT,
		glob: ['**/apps/svelte.dev/content/docs/kit/**/*.md'],
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
