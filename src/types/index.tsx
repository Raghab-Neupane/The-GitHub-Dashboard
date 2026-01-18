export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  private: boolean;
}

export interface GitHubOrg {
  login: string;
  avatar_url: string;
  description: string | null;
  blog: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface CachedOrgData {
  org: GitHubOrg;
  repos: GitHubRepo[];
  timestamp: number;
}

export type SortOption = 'stars' | 'forks' | 'recent';

export interface AppState {
  searchQuery: string;
  selectedOrg: string | null;
  sortBy: SortOption;
  githubToken: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedOrg: (org: string | null) => void;
  setSortBy: (sort: SortOption) => void;
  setGithubToken: (token: string | null) => void;
}
