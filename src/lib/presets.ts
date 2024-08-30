import type { GlobPattern } from 'glob'

export type PresetConfig = {
	/** The pretty title of the preset */
	title: string
	/** The owner of the GitHub repository */
	owner: string
	/** The name of the GitHub repository */
	repo: string
	/** List of glob patterns for including and excluding files */
	glob: GlobPattern[]
	/** Optional prompt to provide additional context or instructions to language models */
	prompt?: string
}

export const presets: Record<string, PresetConfig> = {
	svelte: {
		title: 'Svelte',
		owner: 'sveltejs',
		repo: 'svelte',
		glob: ['**/documentation/docs/**/*.md'],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.'
	},
	sveltekit: {
		title: 'SvelteKit',
		owner: 'sveltejs',
		repo: 'kit',
		glob: ['**/documentation/docs/**/*.md']
	},
	'supabase-js': {
		title: 'Supabase',
		owner: 'supabase',
		repo: 'supabase',
		glob: ['**/apps/docs/spec/**/supabase_js_v2.{md,mdx,yaml,yml}']
	}
}
