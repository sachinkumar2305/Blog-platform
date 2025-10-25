"use client";

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      router.push('/dashboard/posts');
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPost.mutateAsync({ title, content, published: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Content (markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border rounded p-2 h-48"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || createPost.isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {isSubmitting || createPost.isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
