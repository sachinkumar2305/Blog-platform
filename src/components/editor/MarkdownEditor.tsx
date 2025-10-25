import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// @ts-ignore - MDEditor types are not completely accurate
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  height = 400,
}: MarkdownEditorProps) {
  const handleChange = useCallback(
    (value?: string) => {
      onChange(value || '');
    },
    [onChange]
  );

  return (
    <div data-color-mode="light" className="w-full">
      <MDEditor
        value={value}
        onChange={handleChange}
        height={height}
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
        textareaProps={{ placeholder }}
      />
    </div>
  );
}