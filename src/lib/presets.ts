export type PresetConfig = {
	owner: string
	repo: string
	path: string
	allowList: string[]
}

export const presets: Record<string, PresetConfig> = {
	svelte: {
		owner: 'sveltejs',
		repo: 'svelte',
		path: 'documentation',
		allowList: ['docs']
	}
	// You can add more presets here as needed
}
