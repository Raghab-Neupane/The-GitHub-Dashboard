import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, SortOption } from '@/types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      searchQuery: '',
      selectedOrg: null,
      sortBy: 'stars',
      githubToken: null,
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setSelectedOrg: (org: string | null) => set({ selectedOrg: org }),
      setSortBy: (sort: SortOption) => set({ sortBy: sort }),
      setGithubToken: (token: string | null) => set({ githubToken: token }),
    }),
    {
      name: 'github-dashboard-storage',
    }
  )
);
