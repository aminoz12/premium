'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SearchResult {
  slug: string;
  categoryPath: string;
  title: string;
  description: string;
  keywords: string[];
}

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      setIsLoading(true);
      
      setTimeout(() => {
        if (searchQuery.trim()) {
          fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
            .then(res => res.json())
            .then(data => {
              setResults(data.results || []);
            })
            .catch(() => {
              setResults([]);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          setResults([]);
          setIsLoading(false);
        }
      }, 300);
    },
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, debouncedSearch]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-10 w-10"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-2 shadow-lg">
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : (
              results.map((result) => (
                <Link
                  key={`${result.categoryPath}-${result.slug}`}
                  href={`/docs/${result.categoryPath}/${result.slug}`}
                  className="block rounded-sm p-3 hover:bg-accent"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{result.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {result.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {result.categoryPath}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="mt-2 border-t pt-2">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="block text-center text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
            >
              View all results for &quot;{query}&quot;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
