export default function PostCard({ title, excerpt, slug }: { title: string; excerpt?: string; slug: string }) {
  return (
    <article className="border rounded-md p-4 bg-white">
      <a href={`/posts/${slug}`} className="text-lg font-semibold">{title}</a>
      {excerpt && <p className="text-sm text-gray-600 mt-2">{excerpt}</p>}
    </article>
  )
}
