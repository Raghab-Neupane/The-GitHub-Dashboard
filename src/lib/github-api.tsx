import type { GitHubRepo, GitHubOrg, CachedOrgData } from '@/types';

const CACHE_DURATION = 5 * 60 * 1000;


const cache = new Map<string, CachedOrgData>();


function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}


export async function fetchGitHubOrg(
  orgName: string,
  token: string | null = null
): Promise<GitHubOrg> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(`https://api.github.com/orgs/${orgName}`, {
    headers,
  });

  if (response.status === 404) {
    throw new Error('Organization not found');
  }

  if (response.status === 403) {
    throw new Error('Rate limit exceeded or forbidden. Please check your token or try again later.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch organization: ${response.statusText}`);
  }

  return response.json();
}


export async function fetchGitHubRepos(
  orgName: string,
  page: number = 1,
  perPage: number = 10,
  token: string | null = null
): Promise<GitHubRepo[]> {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/orgs/${orgName}/repos?per_page=${perPage}&page=${page}&sort=updated`,
    { headers }
  );

  if (response.status === 404) {
    throw new Error('Organization not found');
  }

  if (response.status === 403) {
    throw new Error('Rate limit exceeded or forbidden. Please check your token or try again later.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get cached organization data if valid, otherwise fetch fresh data
 */
export async function getOrgData(
  orgName: string,
  token: string | null = null,
  forceRefresh: boolean = false
): Promise<{ org: GitHubOrg; repos: GitHubRepo[] }> {
  const cacheKey = `${orgName}-${token || 'anonymous'}`;
  const cached = cache.get(cacheKey);

  // Return cached data if valid and not forcing refresh
  if (cached && isCacheValid(cached.timestamp) && !forceRefresh) {
    return {
      org: cached.org,
      repos: cached.repos,
    };
  }

  // Fetch fresh data
  const [org, repos] = await Promise.all([
    fetchGitHubOrg(orgName, token),
    fetchGitHubRepos(orgName, 1, 10, token),
  ]);

  // Update cache
  cache.set(cacheKey, {
    org,
    repos,
    timestamp: Date.now(),
  });

  return { org, repos };
}

export async function fetchMoreRepos(
  orgName: string,
  page: number,
  token: string | null = null
): Promise<GitHubRepo[]> {
  return fetchGitHubRepos(orgName, page, 10, token);
}
