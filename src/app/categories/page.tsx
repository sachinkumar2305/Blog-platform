'use client';

import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/Form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const utils = trpc.useContext();
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const { data: categories } = trpc.categories.list.useQuery();
  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      setNewCategory({ name: '', description: '' });
      utils.categories.list.invalidate();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const deleteCategory = trpc.categories.delete.useMutation({
    onSuccess: () => {
      utils.categories.list.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) {
      setError('Name is required');
      return;
    }
    createCategory.mutate(newCategory);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" required error={error}>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </FormField>
            <FormField label="Description">
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />
            </FormField>
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={createCategory.isLoading}
            >
              Add Category
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="grid divide-y">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500">{category.description}</p>
                )}
                <div className="text-sm text-gray-500">
                  {category.postCount} posts
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    deleteCategory.mutate({ id: category.id })
                  }
                  isLoading={deleteCategory.isLoading}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {categories?.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No categories yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
}