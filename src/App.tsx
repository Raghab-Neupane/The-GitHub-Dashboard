import { useState, useEffect } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchGitHubOrg, fetchGitHubRepos } from '@/lib/github-api';
import { sortRepos } from '@/utils/sortRepos';
import { getLanguageStats } from '@/utils/languageStats';
import { RepoCard } from '@/components/RepoCard';
import { RepoSkeleton, OrgHeaderSkeleton } from '@/components/SkeletonLoader';
import { ErrorState, EmptyState } from '@/components/ErrorState';
import { LanguageChart } from '@/components/LanguageChart';
import type { GitHubRepo, SortOption } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function DashboardContent() {
  const { searchQuery, selectedOrg, sortBy, githubToken, setSearchQuery, setSelectedOrg, setSortBy, setGithubToken } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [allFetchedRepos, setAllFetchedRepos] = useState<GitHubRepo[]>([]);

  // Reset page when search query changes
  useEffect(() => {
    if (debouncedQuery.trim() !== searchQuery) {
      setSearchQuery(debouncedQuery.trim());
      setCurrentPage(1);
      setAllFetchedRepos([]);
    }
  }, [debouncedQuery, searchQuery, setSearchQuery]);

  // Fetch organization data
  const {
    data: orgData,
    isLoading: isLoadingOrg,
    isError: isOrgError,
    error: orgError,
    refetch: refetchOrg,
  } = useQuery({
    queryKey: ['org', debouncedQuery, githubToken],
    queryFn: () => fetchGitHubOrg(debouncedQuery, githubToken || null),
    enabled: debouncedQuery.length > 0,
  });

  // Fetch repositories for current page
  const {
    data: reposData,
    isLoading: isLoadingRepos,
    isError: isReposError,
    error: reposError,
  } = useQuery({
    queryKey: ['repos', debouncedQuery, currentPage, githubToken],
    queryFn: () => fetchGitHubRepos(debouncedQuery, currentPage, 10, githubToken || null),
    enabled: debouncedQuery.length > 0 && !!orgData,
  });

  // Accumulate fetched repos for language chart
  useEffect(() => {
    if (reposData) {
      setAllFetchedRepos((prev) => {
        // Merge with existing repos, avoiding duplicates
        const existingIds = new Set(prev.map(r => r.id));
        const newRepos = reposData.filter(r => !existingIds.has(r.id));
        return [...prev, ...newRepos];
      });
    }
  }, [reposData]);

  // Set selected org when data loads
  useEffect(() => {
    if (orgData) {
      setSelectedOrg(orgData.login);
    }
  }, [orgData, setSelectedOrg]);

  // Sort current page repos (10 items per page)
  const sortedRepos = reposData ? sortRepos(reposData, sortBy) : [];
  // Language stats from all accumulated repos
  const languageStats = getLanguageStats(allFetchedRepos.length > 0 ? allFetchedRepos : sortedRepos);
  
  // Check if there's a next page (if current page has 10 items, likely has next)
  const hasNextPage = reposData?.length === 10;
  const hasPreviousPage = currentPage > 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubToken(e.target.value || null);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const error = orgError || reposError;
  const isError = isOrgError || isReposError;
  const isLoading = isLoadingOrg || isLoadingRepos;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GitHub Organizations Dashboard</h1>
          <p className="text-gray-600">Explore organizations and their repositories</p>
        </header>

        {/* Search and Token Input */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={localQuery}
              onChange={handleSearchChange}
              placeholder="Enter organization name (e.g., facebook, microsoft, google)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="stars">Sort by Stars</option>
              <option value="forks">Sort by Forks</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="token" className="text-sm text-gray-700 whitespace-nowrap">
              GitHub Token (optional):
            </label>
            <input
              id="token"
              type="password"
              value={githubToken || ''}
              onChange={handleTokenChange}
              placeholder="ghp_xxxxxxxxxxxx"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Organization Header */}
        {isLoadingOrg && <OrgHeaderSkeleton />}
        {orgData && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <img
                src={orgData.avatar_url}
                alt={orgData.login}
                className="w-20 h-20 rounded-full border-2 border-gray-200"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{orgData.login}</h2>
                {orgData.description && (
                  <p className="text-gray-600 mt-1">{orgData.description}</p>
                )}
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>{orgData.public_repos} repositories</span>
                  {orgData.location && <span>{orgData.location}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && error && (
          <ErrorState
            error={error instanceof Error ? error.message : 'An error occurred'}
            onRetry={() => {
              refetchOrg();
            }}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && debouncedQuery.length > 0 && sortedRepos.length === 0 && (
          <EmptyState />
        )}

        {/* Repositories Grid */}
        {!isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <RepoSkeleton key={i} />)
              : sortedRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        )}

        {/* Pagination Controls */}
        {!isError && sortedRepos.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Language Chart */}
        {!isError && sortedRepos.length > 0 && languageStats.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <LanguageChart data={languageStats} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
