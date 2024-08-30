<script>
	import { presets as _presets } from '$lib/presets'

	let presets = $derived(
		Object.entries(_presets)
			.map(([key, value]) => ({ key: key.toLowerCase(), title: value.title }))
			.sort()
	)

	const instructions = [
		{
			title: 'Cursor',
			description: `Cursor supports adding context via URL using the <a href="https://docs.cursor.com/context/@-symbols/@-link#paste-links">Paste Links</a> feature.`,
			command: '@https://llmctx.com/[preset]'
		},
		{
			title: 'Zed',
			description:
				'You can use llmctx directly in Zed using a <a href="https://zed.dev/docs/assistant/commands">/fetch command</a>.',
			command: '/fetch https://llmctx.com/[preset]'
		},
		{
			title: 'cURL',
			description: `Let's be real—if you clicked this, you probably already know how to use cURL. But if you don't, here's a quick example:`,
			command: 'curl https://llmctx.com/[preset] -o context.txt'
		}
	]
</script>

<main>
	<article>
		<div>llmctx.com</div>
		<h1>Developer documentation in an LLM-ready format</h1>

		<p>
			llmctx.com transforms docs into LLM-friendly formats. Pick a preset, get AI-ready context.
			Perfect for coding with AI assistants like Cursor or Zed.
		</p>
	</article>

	<section>
		<p>
			<code>https://llmctx.com/</code><code>[preset]</code>
		</p>
		<h2>Currently supported presets:</h2>
		<ul>
			{#each presets as preset}
				<li>
					<a href="/{preset.key}">{preset.title}</a>
				</li>
			{/each}
			<li><a target="_blank" href="https://github.com/didier/llmctx">Add your own...</a></li>
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
		A project by <a href="https://twitter.com/didiercatz">Didier Catz</a>.
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
