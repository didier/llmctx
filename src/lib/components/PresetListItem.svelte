<script lang="ts">
	import { onMount } from 'svelte'

	let { title, key, description } = $props<{
		title: string
		key: string
		description?: string
	}>()

	let sizeKb = $state<number | undefined>(undefined)
	let sizeLoading = $state<boolean | undefined>(undefined)
	let sizeError = $state<string | undefined>(undefined)
	let dialog = $state<HTMLDialogElement | null>(null)

	onMount(async () => {
		try {
			sizeLoading = true
			const response = await fetch(`/${key}/size`)
			if (!response.ok) throw new Error('Failed to fetch size')
			const data = await response.json()
			sizeKb = data.sizeKb
		} catch (err) {
			sizeError = 'Failed to load size'
		} finally {
			sizeLoading = false
		}
	})
</script>

<li>
	<a href="/{key}">{title}</a>
	{#if description}
		<button class="info-marker" onclick={() => dialog?.showModal()}>*</button>
		<dialog bind:this={dialog}>
			<form method="dialog">
				<p>{description}</p>
				<!-- svelte-ignore a11y_autofocus -->
				<button autofocus>Close</button>
			</form>
		</dialog>
	{/if}
	{#if sizeKb}
		&nbsp;(~{sizeKb}KB)
	{:else if sizeLoading}
		&nbsp;(Loading size...)
	{:else if sizeError}
		&nbsp;(Size unavailable)
	{/if}
</li>

<style>
	.info-marker {
		cursor: help;
		color: #666;
		margin-left: 4px;
	}

	dialog {
		border-radius: 4px;
		border: 1px solid #ccc;
		padding: 1em;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
		align-items: flex-start;
	}

	button {
		padding: 0.5em 1em;
		cursor: pointer;
	}

	button.info-marker {
		padding: 0.5em 1em;
		cursor: pointer;
		/* remove default button styles */
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		text-align: inherit;
		margin: 0;
		padding: 0;
	}
</style>
