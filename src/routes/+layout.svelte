<script lang="ts">
	import '../app.css'

	// Types
	import type { PageData } from './$types'
	import type { Snippet } from 'svelte'

	type Props = {
		data: PageData
		children: Snippet
	}

	let { data, children }: Props = $props()
</script>

<div class="container mx-auto">
	{@render children?.()}
</div>
