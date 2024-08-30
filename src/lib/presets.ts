export type PresetConfig = {
	owner: string
	repo: string
	path: string
	allowList: string[]
	prompt?: string
}

export const presets: Record<string, PresetConfig> = {
	svelte: {
		owner: 'sveltejs',
		repo: 'svelte',
		path: 'documentation',
		allowList: ['docs'],
		prompt: 'Always use Svelte 5 runes. Runes do not need to be imported, they are globals.'
	}
	// You can add more presets here as needed
}
