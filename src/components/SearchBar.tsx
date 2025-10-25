'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { trpc } from '@/utils/trpc';

// small debounce utility to avoid adding lodash
function debounceFn<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults } = trpc.posts.search.useQuery(
    { query, limit: 5 },
    { enabled: query.length >= 2 }
  );

  const debouncedSetQuery = useCallback(debounceFn((value: string) => setQuery(value), 300), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetQuery(e.target.value);
    setIsOpen(true);
  };

  const handleResultClick = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/posts/${slug}`);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search posts..."
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && searchResults?.items.length ? (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          <ul className="py-2">
            {searchResults.items.map((result) => (
              <li
                key={result.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleResultClick(result.slug)}
              >
                <div className="font-medium">{result.title}</div>
                {result.excerpt && (
                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {result.excerpt}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}