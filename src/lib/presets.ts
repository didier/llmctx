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
}

export const presets: Record<string, PresetConfig> = {
	svelte: {
		title: 'Svelte',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/svelte/**/*.md'],
		ignore: ['**/apps/svelte.dev/content/docs/svelte/99-legacy/**/*.md'],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.',
		minimize: {
			removeCodeBlocks: false,
			removeSquareBrackets: false,
			removeParentheses: false,
			normalizeWhitespace: true
		}
	},
	sveltekit: {
		title: 'SvelteKit',
		owner: 'sveltejs',
		repo: 'svelte.dev',
		glob: ['**/apps/svelte.dev/content/docs/kit/**/*.md'],
		ignore: [],
		minimize: {
			removeCodeBlocks: false,
			removeSquareBrackets: false,
			removeParentheses: false,
			normalizeWhitespace: true
		}
	},
	'supabase-js': {
		title: 'Supabase',
		owner: 'supabase',
		repo: 'supabase',
		glob: ['**/apps/docs/spec/**/supabase_js_v2.{md,mdx,yaml,yml}']
	},
	effect: {
		title: 'effect',
		owner: 'Effect-TS',
		repo: 'website',
		glob: ['**/content/docs/**/*.md', '**/content/docs/**/*.mdx']
	},
	effect_schema: {
		title: '@effect/schema',
		owner: 'Effect-TS',
		repo: 'effect',
		glob: ['**/packages/schema/README.md'],
		prompt: 'All Schema functions are now denoted with uppercase (Struct, String, Number etc.)'
	},
	triplit: {
		title: 'Triplit.dev',
		owner: 'aspen-cloud',
		repo: 'triplit',
		glob: ['**/packages/docs/src/pages/**/*.mdx']
	},
	instantdb: {
		title: 'InstantDB',
		owner: 'instantdb',
		repo: 'instant',
		glob: ['**/client/www/pages/docs/**/*.md']
	},
	'clerk-sveltkit': {
		title: 'Clerk adapter for SvelteKit',
		owner: 'markjaquith',
		repo: 'clerk-sveltekit',
		glob: ['**/README.md']
	},
	'shadcn-svelte': {
		title: 'Shadcn Svelte',
		owner: 'huntabyte',
		repo: 'shadcn-svelte',
		glob: ['**/sites/docs/src/content/**/*.md']
	}
}
