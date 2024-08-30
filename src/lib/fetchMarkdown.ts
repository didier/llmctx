import type { PresetConfig } from '$lib/presets';
import simpleGit from 'simple-git';
import { promises as fs } from 'fs';
import path from 'path';

export async function fetchAndProcessMarkdown(preset: PresetConfig): Promise<string> {
    const { owner, repo, path: subPath, allowList } = preset;
    const tempDir = path.join(process.cwd(), 'temp', `${owner}-${repo}`);

    await cleanDirectory(tempDir);
    await cloneRepo(owner, repo, tempDir);

    const files = await findMarkdownFiles(path.join(tempDir, subPath), allowList);
    const contents = await Promise.all(files.map(file => fs.readFile(file, 'utf-8')));
    const processedContent = contents.map(minimizeContent).join(' ');

    await cleanDirectory(tempDir);
    return processedContent;
}

async function cleanDirectory(dir: string) {
    try {
        await fs.rm(dir, { recursive: true, force: true });
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`Error cleaning directory: ${error.message}`);
        }
    }
}

async function cloneRepo(owner: string, repo: string, dir: string) {
    const git = simpleGit();
    await git.clone(`https://github.com/${owner}/${repo}.git`, dir);
}

async function findMarkdownFiles(dir: string, allowList: string[]): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const fullPath = path.resolve(dir, entry.name);
        const relativePath = path.relative(dir, fullPath);
        
        if (allowList.some(allowed => relativePath.startsWith(allowed))) {
            if (entry.isDirectory()) {
                return findMarkdownFiles(fullPath, allowList);
            } else if (entry.isFile() && fullPath.endsWith('.md')) {
                return [fullPath];
            }
        }
        return [];
    }));
    return files.flat();
}

function minimizeContent(content: string): string {
    return content
        .replace(/\s+/g, ' ')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim();
}