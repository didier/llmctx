<script lang="ts">
    import { onMount } from 'svelte'

    let { title, key, description } = $props<{
        title: string;
        key: string;
        description?: string;
    }>();
    
    let sizeKb = $state<number | undefined>(undefined);
    let sizeLoading = $state<boolean | undefined>(undefined);
    let sizeError = $state<string | undefined>(undefined);

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
        <span class="asterisk" title={description}>*</span>
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
    .asterisk {
        color: #666;
        cursor: help;
        margin-left: 4px;
    }
</style>