'use client';

import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/Form';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { useUIStore } from '@/store/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewPostPage() {
  const router = useRouter();
  const { isDraftMode, setDraftMode } = useUIStore();
  const [post, setPost] = useState({
    title: '',
    content: '',
    categoryIds: [] as number[],
    imageUrl: undefined as string | undefined,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: categories } = trpc.categories.list.useQuery();
  const createPost = trpc.posts.create.useMutation({
    onSuccess: (newPost) => {
      router.push(`/posts/${newPost.slug}`);
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!post.title) {
      setErrors((prev) => ({ ...prev, title: 'Title is required' }));
      return;
    }

    if (!post.content) {
      setErrors((prev) => ({ ...prev, content: 'Content is required' }));
      return;
    }

    createPost.mutate({
      ...post,
      published: !isDraftMode,
    });
  };

  const uploadImageMutation = trpc.posts.uploadImage.useMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      try {
        const res = await uploadImageMutation.mutateAsync({ filename: file.name, data: result });
        setPost((p) => ({ ...p, imageUrl: res.url } as any));
      } catch (err: any) {
        setErrors({ submit: err?.message || 'Image upload failed' });
      }
    };
    reader.readAsDataURL(file);
  };

  const categoryOptions = categories?.map((category: { id: number; name: string }) => ({
    label: category.name,
    value: category.id,
  })) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">New Post</h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDraftMode(!isDraftMode)}
            >
              {isDraftMode ? '📝 Draft' : '✨ Ready to Publish'}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createPost.isLoading}
            >
              {isDraftMode ? 'Save Draft' : 'Publish'}
            </Button>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <FormField label="Title" required error={errors.title}>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Enter post title"
          />
        </FormField>

        <FormField label="Categories">
          <MultiSelect
            options={categoryOptions}
            value={post.categoryIds}
            onChange={(values) => setPost({ ...post, categoryIds: values as number[] })
            }
            placeholder="Select categories"
            className="w-full"
          />
        </FormField>

        <FormField label="Featured image">
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {post.imageUrl && (
              <img src={post.imageUrl} alt="preview" className="h-16 w-16 object-cover rounded" />
            )}
          </div>
        </FormField>

        <FormField label="Content" required error={errors.content}>
          <MarkdownEditor
            value={post.content}
            onChange={(value) => setPost({ ...post, content: value })}
          />
        </FormField>
      </form>
    </div>
  );
}