'use client';

import { trpc } from '@/utils/trpc';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: postsData } = trpc.posts.list.useQuery({ limit: 5 });
  const { data: categoriesData } = trpc.categories.list.useQuery();
    const seedMutation = trpc.seed.useMutation({
      onSuccess: () => {
        window.location.reload();
      },
    });

  const stats = {
    posts: postsData?.items.length || 0,
    categories: categoriesData?.length || 0,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
        {(stats.posts === 0 || stats.categories === 0) && (
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {seedMutation.isLoading ? 'Adding sample data...' : 'Add sample data'}
          </button>
        )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Posts
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.posts}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/posts"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                View all posts
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Categories
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.categories}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/categories"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Manage categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium">Recent Posts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {postsData?.items.map((post) => (
            <div key={post.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/posts/${post.slug}/edit`}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}