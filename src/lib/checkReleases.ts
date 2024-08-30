import { Octokit } from '@octokit/rest'
import { PERSONAL_GITHUB_TOKEN } from '$env/static/private'
import { presets } from './presets'

const octokit = new Octokit({ auth: PERSONAL_GITHUB_TOKEN })

export async function checkForNewReleases() {
	for (const [presetName, preset] of Object.entries(presets)) {
		const { owner, repo } = preset
		try {
			const { data: latestRelease } = await octokit.repos.getLatestRelease({
				owner,
				repo
			})

			// Compare with your stored last release tag
			const storedLastReleaseTag = await getStoredLastReleaseTag(presetName)
			if (latestRelease.tag_name !== storedLastReleaseTag) {
				console.log(`New release detected for ${owner}/${repo}: ${latestRelease.tag_name}`)
				await triggerBuild(presetName)
				await updateStoredLastReleaseTag(presetName, latestRelease.tag_name)
			}
		} catch (error) {
			console.error(`Error checking releases for ${owner}/${repo}:`, error)
		}
	}
}

async function getStoredLastReleaseTag(presetName: string): Promise<string> {
	// Implement this to retrieve the last known release tag from your storage
}

async function updateStoredLastReleaseTag(presetName: string, tag: string): Promise<void> {
	// Implement this to update the stored last release tag
}

async function triggerBuild(presetName: string): Promise<void> {
	// Implement your build triggering logic here
}
