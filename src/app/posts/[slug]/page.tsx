import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/Button';
import { notFound } from 'next/navigation';
import { MarkdownPreview } from '@/components/editor/MarkdownPreview';
import Head from 'next/head';

function computeStats(markdown: string | undefined) {
  if (!markdown) return { words: 0, minutes: 0 };
  // Strip markdown formatting roughly and count words
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`[^`]*`/g, '') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, '') // links
    .replace(/[#>*_~\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = stripped ? stripped.split(' ').filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.round(words / 200)); // 200 wpm baseline
  return { words, minutes };
}

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const { data: post } = trpc.posts.bySlug.useQuery(
    { slug: params.slug },
    {
      onError: (error) => {
        if (error.data?.code === 'NOT_FOUND') {
          notFound();
        }
      },
    }
  );

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = computeStats(post.content);

  return (
    <>
      <Head>
        <title>{post.title} — My Blog</title>
        <meta name="description" content={(post.content || '').slice(0, 160).replace(/[#\n]/g, ' ')} />
        <meta property="og:title" content={post.title} />
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
      </Head>

      <article className="max-w-3xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(post.categories) && post.categories.map((category: any) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {category.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div>
              Published on {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div>
              {stats.words} words · {stats.minutes} min read
            </div>
            {post.views != null && (
              <div className="flex items-center gap-1">
                <span>{post.views}</span>
                <span>views</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button href={`/posts/${post.slug}/edit`} variant="outline">
            Edit
          </Button>
        </div>
      </div>

      <div className="mb-8">
        {post.imageUrl ? (
          <div className="mb-8 aspect-video relative overflow-hidden rounded-lg">
            <img src={post.imageUrl} alt={post.title} className="object-cover w-full h-full" />
          </div>
        ) : (
          <div className="mb-8 aspect-video relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400">No image available</div>
          </div>
        )}
      </div>

      <MarkdownPreview content={post.content || ''} className="mt-8 prose prose-lg max-w-none" />
    </article>
  );
}