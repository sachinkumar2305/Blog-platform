'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { Button } from './ui/Button';
import { useUIStore } from '@/store/ui';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export function Header() {
  const { isDarkMode, setDarkMode } = useUIStore();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Blog Platform
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            
            <Button href="/posts" variant="ghost">
              Posts
            </Button>
            <Button href="/posts/new" variant="primary">
              New Post
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}