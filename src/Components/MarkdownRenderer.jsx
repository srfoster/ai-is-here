import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw';

export default function MarkdownRenderer({ children }) {
  const renderers = {
    a: ({ href, children }) => {
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
      const match = href.match(youtubeRegex);

      if (match) {
        const videoId = match[1];
        return (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="YouTube Video"
            ></iframe>
          </div>
        );
      }

      return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={renderers}
    >
      {children}
    </ReactMarkdown>
  );
}