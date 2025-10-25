'use client';

import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPostsPage() {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const utils = trpc.useContext();
  
  const { data: postsData, isLoading } = trpc.posts.list.useQuery({ limit: 50 });
  const posts = postsData ?? { items: [] };
  
  const deletePost = trpc.posts.delete.useMutation({
    onMutate: (variables) => {
      setIsDeleting(variables.id);
    },
    onSuccess: () => {
      utils.posts.list.invalidate();
    },
    onSettled: () => {
      setIsDeleting(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button href="/posts/new" variant="primary">
          Create New Post
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts?.items.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/posts/${post.slug}`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.categories?.map((cat: any) => cat.name).join(', ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="text-primary hover:text-primary/80"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost.mutate({ id: post.id })}
                    className="text-red-600 hover:text-red-900"
                    disabled={isDeleting === post.id}
                  >
                    {isDeleting === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts?.items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No posts yet. Create your first post!
        </div>
      )}
    </div>
  );
}