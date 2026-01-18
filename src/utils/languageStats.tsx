import type { GitHubRepo } from '@/types';

export interface LanguageStat {
  name: string;
  value: number;
  color: string;
}

// Predefined colors for languages
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#239120',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  'Jupyter Notebook': '#DA5B0B',
  Other: '#6c757d',
};

export function getLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const languageCounts: Record<string, number> = {};
  
  repos.forEach((repo) => {
    const lang = repo.language || 'Other';
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });

  return Object.entries(languageCounts)
    .map(([name, value]) => ({
      name,
      value,
      color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other,
    }))
    .sort((a, b) => b.value - a.value);
}
