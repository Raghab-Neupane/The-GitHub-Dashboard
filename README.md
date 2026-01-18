# GitHub Organizations Dashboard

A production-grade React application for exploring GitHub Organizations and their repositories. Built with React, Vite, TypeScript, TanStack Query, and Zustand.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript (strict mode)
- **State Management**: 
  - Zustand (global state with persistence)
  - TanStack Query (server state, caching, pagination)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd GDG
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run preview
```

The built files will be in the `dist` directory.

## Project Structure

```
GDG/
├── src/                   # Source files
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   ├── index.css         # Global styles
│   ├── components/       # React components
│   │   ├── ErrorState.tsx    # Error and empty states
│   │   ├── LanguageChart.tsx # Pie chart component
│   │   ├── RepoCard.tsx      # Repository card component
│   │   └── SkeletonLoader.tsx # Loading skeletons
│   ├── hooks/            # Custom React hooks
│   │   └── useDebounce.tsx   # Debounce hook
│   ├── lib/              # API utilities
│   │   └── github-api.tsx    # GitHub API client
│   ├── store/            # State management
│   │   └── index.tsx         # Zustand store
│   ├── types/            # TypeScript types
│   │   └── index.tsx         # Type definitions
│   └── utils/            # Utility functions
│       ├── languageStats.tsx # Language distribution logic
│       └── sortRepos.tsx     # Repository sorting logic
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## Usage

### Basic Search
1. Enter an organization name in the search box (e.g., "facebook", "microsoft", "google")
2. Results appear automatically after debounce (500ms)

### Sorting
- Use the dropdown to sort repositories by:
  - **Stars**: Most starred first
  - **Forks**: Most forked first
  - **Recent**: Most recently updated first

### Infinite Scroll
- Scroll down to automatically load more repositories
- Uses Intersection Observer for optimal performance

### GitHub Token (Optional)
- Enter a GitHub Personal Access Token to increase rate limits
- Token is stored securely in localStorage
- Get your token at: https://github.com/settings/tokens

## API Rate Limits

Without a token:
- 60 requests per hour

With a Personal Access Token:
- 5,000 requests per hour

## Error Handling

The application handles various error scenarios:
- **404**: Organization not found
- **403**: Rate limit exceeded or forbidden
- **Empty Results**: No repositories found
- **Network Errors**: Connection issues

## Performance Optimizations

1. **Debouncing**: Reduces API calls during typing
2. **Caching**: TanStack Query caches responses for 5 minutes
3. **Skeleton Screens**: Prevents layout shift during loading
4. **Infinite Scroll**: Loads data incrementally
5. **State Persistence**: Preserves search state across sessions

## Browser Support

Modern browsers with support for:
- ES2017+
- Fetch API
- Intersection Observer API
- localStorage

## License

MIT
