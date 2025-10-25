import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  return (
    <div className={`prose prose-blue max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Override default element styling
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mt-6 mb-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mt-4 mb-3" {...props} />
          ),
          p: ({ node, ...props }) => <p className="my-4" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:underline" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 my-4" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-200 pl-4 italic my-4"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) => {
            const match = /language-(\w+)/.exec(props.className || '');
            return inline ? (
              <code
                className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono"
                {...props}
              />
            ) : (
              <code
                className="block bg-gray-100 rounded p-4 text-sm font-mono overflow-x-auto"
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}