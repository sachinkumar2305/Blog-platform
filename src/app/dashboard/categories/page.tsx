'use client';

import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';

export default function DashboardCategoriesPage() {
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const utils = trpc.useContext();
  const { data: categories, isLoading } = trpc.categories.list.useQuery();

  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      setNewCategory({ name: '', description: '' });
      utils.categories.list.invalidate();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateCategory = trpc.categories.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editingId) return;
    updateCategory.mutate({ id: editingId, ...editForm });
  };

  const startEditing = (category: any) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, description: category.description || '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-6">Categories</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <Input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter category description"
                className="mt-1"
              />
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={createCategory.isLoading}
            >
              {createCategory.isLoading ? 'Adding...' : 'Add Category'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="grid divide-y">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="p-4"
            >
              {editingId === category.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <Input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="primary" disabled={updateCategory.isLoading}>
                      {updateCategory.isLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
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
                      onClick={() => startEditing(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCategory.mutate({ id: category.id })}
                      disabled={deleteCategory.isLoading}
                    >
                      {deleteCategory.isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              )}
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