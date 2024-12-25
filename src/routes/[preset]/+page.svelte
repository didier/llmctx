<script lang="ts">
	import { onMount } from 'svelte';
	import { presets } from '$lib/presets';
	import { getCachedOrFetchMarkdown } from '$lib/markdown';
	import { page } from '$app/stores';

	$: params = $page.params;
	let combinedContent = '';
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		const presetNames: string[] = params.preset.split(',').map((p: string) => p.trim());

		try {
			const contentPromises = presetNames.map(async (presetName: string) => {
				if (!(presetName in presets)) {
					throw new Error(`Invalid preset: ${presetName}`);
				}
				return await getCachedOrFetchMarkdown(presets[presetName]);
			});
			const contents = await Promise.all(contentPromises);
			combinedContent = contents.join('');
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<pre>{combinedContent}</pre>
{/if}