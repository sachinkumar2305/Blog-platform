'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchDialog } from '@/components/search/SearchDialog';

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Posts', href: '/dashboard/posts' },
  { name: 'Categories', href: '/dashboard/categories' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
  <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-gray-900"
              >
                Blog Platform
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block w-64">
              <SearchDialog />
            </div>
            <Link
              href="/posts/new"
              className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              New Post
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}