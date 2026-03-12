import Markdown from "react-markdown";
import MentorAvatar from "./MentorAvatar";

function MentorContent({ text }) {
  return (
    <div className="mentor-markdown">
      <Markdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-taupe-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-taupe-600">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => <p className="font-bold text-base text-taupe-900 mb-1">{children}</p>,
          h2: ({ children }) => <p className="font-bold text-[14px] text-taupe-900 mb-1">{children}</p>,
          h3: ({ children }) => <p className="font-semibold text-[13.5px] text-taupe-900 mb-1">{children}</p>,
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-taupe-50 rounded-lg px-3 py-2 my-2 text-xs font-mono text-taupe-800 overflow-x-auto">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-taupe-100/60 text-taupe-800 px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary-300 pl-3 my-2 text-taupe-600 italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
              {children}
            </a>
          ),
          hr: () => <hr className="my-3 border-taupe-200/60" />,
        }}
      >
        {text}
      </Markdown>
    </div>
  );
}

export default function ChatMessage({ message, isLatest = false }) {
  const isMentor = message.role === "mentor";

  return (
    <div
      className={`flex gap-3 mb-5 ${
        isMentor
          ? "justify-start animate-slide-in-left"
          : "justify-end animate-slide-in-right"
      }`}
    >
      {isMentor && <MentorAvatar size="sm" clickable={false} />}

      <div className="flex flex-col gap-1 max-w-[78%]">
        {isMentor && (
          <span className="text-[11px] font-medium text-oak-500/70 ml-1">
            FinMentor
          </span>
        )}

        <div
          className={`px-4 py-3 text-[13.5px] leading-[1.7] ${
            isMentor
              ? "bg-white text-taupe-800 rounded-2xl rounded-tl-md shadow-soft border border-taupe-100/80"
              : "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-md shadow-md shadow-primary-500/15 whitespace-pre-wrap"
          }`}
        >
          {isMentor ? <MentorContent text={message.text} /> : message.text}
        </div>

        <span
          className={`text-[10px] text-taupe-400 ${
            isMentor ? "ml-1" : "mr-1 text-right"
          }`}
        >
          {message.time || "just now"}
        </span>
      </div>
    </div>
  );
}
