import type { GlobPattern } from 'glob'
import type { MinimizeOptions } from './fetchMarkdown'

export type PresetConfig = {
	/** The pretty title of the preset */
	title: string
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
	svelte: {
		title: 'Svelte',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/svelte/**/*.md'],
		ignore: ['**/apps/svelte.dev/content/docs/svelte/99-legacy/**/*.md'],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		estimatedSizeKb: 350,
		minimize: {}
	},
	'svelte-small': {
		title: 'Svelte (Small)',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/svelte/**/*.md'],
		ignore: [
			'**/apps/svelte.dev/content/docs/svelte/99-legacy/**/*.md',
			'**/apps/svelte.dev/content/docs/svelte/07-misc/**/*.md',
			'**/apps/svelte.dev/content/docs/svelte/98-reference/**/*.md' // TODO: This one is questionable to remove
		],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		minimize: {
			removeLegacy: true,
			removePlaygroundLinks: true,
			removeNoteBlocks: true,
			removeDetailsBlocks: true,
			removeHtmlComments: true
		}
	},
	'svelte-small-experimental': {
		title: 'Svelte + SvelteKit (Small Experimental)',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/tutorial/**/*.md'],
		ignore: [
		],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		minimize: {
			//removeLegacy: true,
			//removePlaygroundLinks: true,
			//removeNoteBlocks: true,
			//removeDetailsBlocks: true,
			//removeHtmlComments: true
		}
	},
	sveltekit: {
		title: 'SvelteKit',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/kit/**/*.md'],
		estimatedSizeKb: 410,
		minimize: {}
	},
	'sveltekit-small': {
		title: 'SvelteKit (Small)',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/kit/**/*.md'],
		ignore: [
			'**/apps/svelte.dev/content/docs/kit/25-build-and-deploy/**/*.md',
			'**/apps/svelte.dev/content/docs/kit/60-appendix/**/*.md',
			'**/apps/svelte.dev/content/docs/kit/98-reference/**/*.md'
		],
		minimize: {
			removeLegacy: true,
			removePlaygroundLinks: true,
			removeNoteBlocks: true,
			removeDetailsBlocks: true,
			removeHtmlComments: true
		}
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
