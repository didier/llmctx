<script>
	import { presets as _presets } from '$lib/presets'

	let presets = $derived(
		Object.entries(_presets)
			.map(([key, value]) => ({ key: key.toLowerCase(), title: value.title }))
			.sort()
	)
</script>

<main>
	<article>
		<div class="mb-[2em] text-xl">llmctx.com</div>
		<h1 class="mb-[2em] text-3xl">Developer documentation in an LLM-ready format</h1>

		<p class="mb-[2em] text-lg">
			llmctx.com transforms docs into LLM-friendly formats. Pick a preset, get AI-ready context.
			Perfect for coding with AI assistants like Cursor or Zed.
		</p>
	</article>

	<section>
		<p class="mb-[2em] text-base">
			<code>https://llmctx.com/</code><code>[preset]</code>
		</p>
		<h2 class="mb-[1em] text-lg">Currently supported presets:</h2>
		<ul>
			{#each presets as preset}
				<li>
					<a href="/{preset.key}">{preset.title}</a>
				</li>
			{/each}
		</ul>
	</section>

	<footer>
		A project by <a href="https://twitter.com/didiercatz">Didier Catz</a>. Want your documentation
		to be included in this list? Let me know.
	</footer>
</main>

<style>
	:global(body) {
		line-height: 1.4;
		font-size: 16px;
		padding: 0 10px;
		margin: 50px auto;
		max-width: 650px;
	}

	main {
		max-width: 42em;
		margin: 15 auto;
	}
</style>
