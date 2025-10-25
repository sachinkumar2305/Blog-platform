import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const searchQuery = trpc.posts.search.useQuery(
    { query: search },
    { enabled: search.length > 0 }
  );

  const posts = searchQuery.data?.items || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
          )}
        >
          <span className="hidden lg:inline-flex">Search posts...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Posts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by title or content..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button variant="secondary" size="md">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {search.length > 0 && (
            <div className="space-y-2">
              {searchQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Searching...</p>
              ) : posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No results found.</p>
              ) : (
                <div className="divide-y">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="block py-4 hover:bg-accent"
                      onClick={() => setOpen(false)}
                    >
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      {post.excerpt && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}