import type { GitHubRepo } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const updatedAt = formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true });

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {repo.name}
            </a>
          </h3>
          {repo.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{repo.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {repo.stargazers_count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.707 3.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 2.586 9.707 3.293zM11 7a1 1 0 100-2h-3a1 1 0 000 2h3zM9 13a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zM8.293 15.707a1 1 0 001.414 1.414L11 17.414l1.293 1.293a1 1 0 001.414-1.414l-2-2a1 1 0 00-1.414 0l-2 2z" />
          </svg>
          {repo.forks_count.toLocaleString()}
        </span>
        <span className="text-xs">Updated {updatedAt}</span>
      </div>
    </div>
  );
}
