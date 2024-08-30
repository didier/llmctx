<script lang="ts">
	import { dev } from '$app/environment'

	// Types
	import type { PageData } from './$types'
	import type { Snippet } from 'svelte'

	type Props = {
		data: PageData
		children: Snippet
	}

	let { children }: Props = $props()
</script>

<svelte:head>
	{#if !dev}
		<script
			defer
			data-domain="llmctx.com"
			src="/metrics/metrics.js"
			data-api="/metrics/api/event"
		></script>
		<script>
			window.plausible =
				window.plausible ||
				function () {
					;(window.plausible.q = window.plausible.q || []).push(arguments)
				}
		</script>
	{/if}
</svelte:head>

<div class="container mx-auto">
	{@render children?.()}
</div>
