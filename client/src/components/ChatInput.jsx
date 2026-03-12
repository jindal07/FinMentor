import { useState } from "react";

const SUGGESTIONS = [
  "What is a SIP?",
  "How does compounding work?",
  "Mutual funds vs FD?",
  "Is investing risky?",
];

export default function ChatInput({ onSend, disabled, showSuggestions = false }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="space-y-3">
      {showSuggestions && !text && (
        <div className="flex gap-2 flex-wrap animate-fade-in">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSend(s)}
              disabled={disabled}
              className="px-3.5 py-1.5 text-xs font-medium bg-white border border-taupe-200/80 text-taupe-600 rounded-full
                         hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50
                         transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div
          className={`flex-1 flex items-center rounded-2xl border bg-white/90 backdrop-blur-sm transition-all duration-300 ${
            focused
              ? "border-primary-400 shadow-glow ring-1 ring-primary-400/10"
              : "border-taupe-200/80 shadow-soft"
          }`}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask your mentor anything about investing..."
            disabled={disabled}
            className="flex-1 px-5 py-3.5 bg-transparent text-sm text-taupe-800 placeholder:text-taupe-400
                       focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className={`mr-1.5 p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
              text.trim() && !disabled
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 active:scale-95"
                : "bg-taupe-100 text-taupe-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
