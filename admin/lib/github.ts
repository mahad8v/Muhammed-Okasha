const GITHUB_API = 'https://api.github.com';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} — set it in admin/.env.local (see .env.local.example).`,
    );
  }
  return value;
}

function getConfig() {
  return {
    token: requiredEnv('GITHUB_TOKEN'),
    owner: requiredEnv('GITHUB_OWNER'),
    repo: requiredEnv('GITHUB_REPO'),
    branch: process.env.GITHUB_BRANCH || 'master',
  };
}

async function githubRequest(path: string, init?: RequestInit) {
  const { token } = getConfig();

  const response = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${body}`);
  }

  return response.json();
}

/** Reads and JSON-parses a file from the repo, returning its content and blob SHA (needed to update it). */
export async function readJsonFile<T>(
  path: string,
): Promise<{ content: T; sha: string }> {
  const { owner, repo, branch } = getConfig();
  const data = await githubRequest(
    `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
  );
  const raw = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content: JSON.parse(raw) as T, sha: data.sha };
}

/**
 * jsDelivr caches `@branch` references for a while — without this, a saved
 * edit here could take hours to actually show up in the app. Purging is
 * best-effort: if it fails, the commit itself has still succeeded and
 * jsDelivr's cache will expire on its own.
 */
async function purgeJsdelivrCache(path: string): Promise<void> {
  const { owner, repo, branch } = getConfig();
  try {
    await fetch(
      `https://purge.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`,
    );
  } catch (error) {
    console.warn(`jsDelivr purge failed for ${path}:`, error);
  }
}

/** Commits new JSON content to a file in the repo, then busts jsDelivr's CDN cache for it. */
export async function writeJsonFile(
  path: string,
  content: unknown,
  sha: string,
  message: string,
): Promise<void> {
  const { owner, repo, branch } = getConfig();
  const body = JSON.stringify(content, null, 2) + '\n';
  const encoded = Buffer.from(body, 'utf-8').toString('base64');

  await githubRequest(`/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: encoded, sha, branch }),
  });

  await purgeJsdelivrCache(path);
}
