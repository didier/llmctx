<script>
	import { presets as _presets } from '$lib/presets'
	const SITE_URL = 'https://svelte-llm-ctx.khromov.se'

	let presets = $derived(
		Object.entries(_presets)
			.map(([key, value]) => {
				return { key: key.toLowerCase(), ...value }
			})
			.sort()
	)

	const instructions = [
		{
			title: 'Cursor',
			description: `Cursor supports adding context via URL using the <a href="https://docs.cursor.com/context/@-symbols/@-link#paste-links">Paste Links</a> feature.`,
			command: `@${SITE_URL}/[preset]`
		},
		{
			title: 'Zed',
			description:
				'You can use llmctx directly in Zed using a <a href="https://zed.dev/docs/assistant/commands">/fetch command</a>.',
			command: `/fetch ${SITE_URL}/[preset]`
		},
		{
			title: 'cURL',
			description: `Let's be real—if you clicked this, you probably already know how to use cURL. But if you don't, here's a quick example:`,
			command: `curl ${SITE_URL} -o context.txt`
		}
	]
</script>

<main>
	<article>
		<div>svelte-llm-ctx</div>
		<h1>Developer documentation for Svelte in an LLM-ready format</h1>

		<p>
			This side provides documentation in an LLM-friendly format. Pick a preset, get AI-ready
			context. Perfect for coding with AI assistants like Cursor or Zed, or uploading to Claude
			Projects.
		</p>
		<p>
			Documentation is automatically fetched from the official documentation source on GitHub and
			updated hourly.
		</p>
		<p>
			<em
				>"Small" versions have reduced file size. Some less important documentation content is
				omitted.</em
			>
		</p>
	</article>

	<section>
		<h3>Single preset:</h3>
		<p>
			<code>{SITE_URL}/</code><code>[preset]</code> (<a href="/svelte">Link</a>)
		</p>
		<h3>All presets merged:</h3>
		<p>
			<code>{SITE_URL}/</code><code>svelte,sveltekit,svelte-cli</code> (<a
				href="/svelte,sveltekit,svelte-cli">Link</a
			>)
		</p>
		<h2>Currently supported presets:</h2>
		<ul>
			{#each presets as preset}
				<li>
					<a href="/{preset.key}">{preset.title}</a>{#if preset.estimatedSizeKb}
						&nbsp;(~{preset.estimatedSizeKb}KB)
					{/if}
				</li>
			{/each}
		</ul>
	</section>

	<br />
	{#each instructions as { title, description, command }}
		<details>
			<summary>{title}</summary>
			<p>{@html description}</p>
			<pre><code>{command}</code></pre>
		</details>
	{/each}

	<br />
	<footer>
		Maintained by <a href="https://khromov.se" target="_blank">Stanislav Khromov</a>. Forked from
		<a href="https://twitter.com/didiercatz">Didier Catz</a>.
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
