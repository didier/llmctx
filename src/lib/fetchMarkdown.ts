import type { PresetConfig } from '$lib/presets';
import { dev } from '$app/environment';
import { minimatch } from 'minimatch';

// Main function to fetch and process markdown files
export async function fetchAndProcessMarkdown(preset: PresetConfig): Promise<string> {
	const files = await fetchMarkdownFiles(preset);
	if (dev) {
		console.log(`Fetched ${files.length} files for ${preset.title}`);
	}
	return files.join('\n\n---\n\n');
}

// Fetch markdown files directly from GitHub
async function fetchMarkdownFiles({ owner, repo, glob }: PresetConfig): Promise<string[]> {
	const contents: string[] = [];
	const branch = (owner === 'sveltejs' && (repo === 'svelte' || repo === 'kit')) || (owner === 'huntabyte' && repo === 'shadcn-svelte') ? 'main' : 'master';
	const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch file list from GitHub API: ${response.status}`);
		}
		const data = await response.json();
		const files = data.tree
			.filter((item: any) => item.type === 'blob' && glob.some(pattern => minimatch(item.path, pattern)))
			.map((item: any) => item.path);

		for (const filePath of files) {
			const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
			if (dev) {
				console.log(`Fetching content from: ${rawUrl}`);
			}
			try {
				const fileResponse = await fetch(rawUrl);
				if (!fileResponse.ok) {
					throw new Error(`Failed to fetch ${rawUrl}: ${fileResponse.statusText}`);
				}
				const content = await fileResponse.text();
				contents.push(content);
			} catch (error: any) {
				console.error(`Error fetching ${rawUrl}: ${error.message}`);
			}
		}
	} catch (error: any) {
		console.error(`Error fetching file list: ${error.message}`);
	}

	return contents;
}

export interface MinimizeOptions {
	normalizeWhitespace: boolean;
	removeCodeBlocks: boolean;
	removeSquareBrackets: boolean;
	removeParentheses: boolean;
	trim: boolean;
}

const defaultOptions: MinimizeOptions = {
	normalizeWhitespace: true,
	removeCodeBlocks: true,
	removeSquareBrackets: true,
	removeParentheses: true,
	trim: true
};

function minimizeContent(content: string, options?: Partial<MinimizeOptions>): string {
	// Merge with defaults, but only for properties that are defined
	const settings: MinimizeOptions = options ? { ...defaultOptions, ...options } : defaultOptions;

	let minimized = content;

	if (settings.normalizeWhitespace) {
		console.log('Normalizing whitespace');
		minimized = minimized.replace(/\s+/g, ' ');
	}

	if (settings.removeCodeBlocks) {
		console.log('Removing code blocks');
		minimized = minimized.replace(/```[\s\S]*?```/g, '');
	}

	if (settings.removeSquareBrackets) {
		console.log('Removing square brackets');
		minimized = minimized.replace(/\[.*?\]/g, '');
	}

	if (settings.removeParentheses) {
		console.log('Removing parentheses');
		minimized = minimized.replace(/\(.*?\)/g, '');
	}

	if (settings.trim) {
		console.log('Trimming whitespace');
		minimized = minimized.trim();
	}

	if (dev) {
		console.log(`Original content length: ${content.length}`);
		console.log(`Minimized content length: ${minimized.length}`);
		console.log('Applied minimizations:', JSON.stringify(settings, null, 2));
	}

	return minimized;
}
