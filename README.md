# llmctx

llmctx transforms technical documentation into AI-ready formats. It provides a simple way to access condensed, LLM-friendly versions of popular framework and library documentation through preset URLs. This makes it easier for developers to use AI coding assistants like Cursor or Zed with accurate, up-to-date context from official documentation sources.

- Preset URLs for quick access to LLM-optimized documentation
- Regularly updated content from official documentation

## Supported presets
- Svelte
- SvelteKit

### Adding presets
To add a new preset:

1. Fork this repo.
2. Open the `src/lib/presets.ts` file.
3. Add a new entry to the `presets` object with the following structure:

   ```ts
   [presetKey]: {
     title: 'Preset Title',
     owner: 'github-owner',
     repo: 'github-repo',
     path: 'documentation-path',
     allowList: ['allowed-directories-or-files'],
     prompt: 'Optional prompt for additional context'
   }
   ```

4. Create a pull request with your changes.

Please ensure that the documentation source is reliable and actively maintained.

## Feature requests

- [ ] Combine multiple documentation sources (e.g., https://llmctx.com/svelte,sveltekit)
- [ ] Create a "stack" of frequently used frameworks and libraries
- [ ] Implement a checkbox UI for selecting presets and generate custom URLs based on selected documentation
