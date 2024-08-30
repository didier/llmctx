export type PresetConfig = {
	/** The pretty title of the preset */
	title: string
	/** The owner of the GitHub repository */
	owner: string
	/** The name of the GitHub repository */
	repo: string
	/** The path within the repository to search for files */
	path: string
	/** List of allowed file or directory names */
	allowList: string[]
	/** Optional prompt to provide additional context or instructions to language models */
	prompt?: string
}

export const presets: Record<string, PresetConfig> = {
	svelte: {
		title: 'Svelte',
		owner: 'sveltejs',
		repo: 'svelte',
		path: 'documentation',
		allowList: ['docs'],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.'
	},
	sveltekit: {
		title: 'SvelteKit',
		owner: 'sveltejs',
		repo: 'kit',
		path: 'documentation',
		allowList: ['docs']
	},
	supabase: {
		title: 'Supabase',
		owner: 'supabase',
		repo: 'supabase',
		path: 'apps/docs',
		allowList: ['content']
	}
}
