import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import MentorAvatar from "../components/MentorAvatar";
import { sendMessageToMentor, resetSession } from "../services/api";
import { formatCurrency } from "../utils/calculations";

function buildIntroMessages(user) {
  const savings = Number(user.savings);
  const sipAmount = Math.round(savings * 0.6);
  const emergencyAmount = Math.round(savings * 0.2);
  const goldAmount = savings - sipAmount - emergencyAmount;

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return [
    {
      role: "mentor",
      text: `Hi! I'm your financial mentor. I see you save about ${formatCurrency(savings)} each month and your goal is "${user.goal}". Let's explore how you can grow your savings over time!`,
      time: now,
    },
    {
      role: "mentor",
      text: `Many beginners start with something like this:\n\n💰 ${formatCurrency(sipAmount)} → Mutual Fund SIP\n🛡️ ${formatCurrency(emergencyAmount)} → Emergency savings\n✨ ${formatCurrency(goldAmount)} → Gold ETF\n\nThis is just an example to understand how allocation works — not a recommendation.`,
      time: now,
    },
  ];
}

export default function Chat() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState({});
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("finmentor_user");
    if (!stored) {
      navigate("/onboarding");
      return;
    }
    const user = JSON.parse(stored);
    setUserContext(user);
    setMessages(buildIntroMessages(user));
    resetSession();
  }, [navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", text, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setMessageCount((c) => c + 1);
    setLoading(true);

    try {
      const reply = await sendMessageToMentor(text, userContext);
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [...prev, { role: "mentor", text: reply, time: replyTime }]);
    } catch (err) {
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          text: err.message || "Something went wrong. Please try again.",
          code: err.code,
          time: replyTime,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface-50">
      {/* Header */}
      <header className="glass-strong border-b border-taupe-100/60 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <MentorAvatar size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-taupe-900 tracking-tight">FinMentor</h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-50 border border-lime-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-600 animate-pulse" />
                <span className="text-[10px] font-medium text-lime-800">Online</span>
              </span>
            </div>
            <p className="text-[11px] text-taupe-400">Your AI Investment Guide</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/visualizer")}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl
                     hover:shadow-glow transition-all duration-200 active:scale-[0.97]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Visualize Growth
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Date badge */}
          <div className="flex justify-center mb-6">
            <span className="text-[11px] font-medium text-taupe-400 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-taupe-100 shadow-sm">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>

          {messages.map((msg, i) => (
            msg.role === "error" ? (
              <ErrorBubble key={i} message={msg} onRetry={() => {
                setMessages((prev) => prev.filter((_, idx) => idx !== i));
                const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
                if (lastUserMsg) handleSend(lastUserMsg.text);
              }} />
            ) : (
              <ChatMessage key={i} message={msg} isLatest={i === messages.length - 1} />
            )
          ))}

          {loading && (
            <div className="flex gap-3 items-start mb-5 animate-fade-in">
              <MentorAvatar size="sm" clickable={false} />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-oak-500/70 ml-1">FinMentor</span>
                <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-md shadow-soft border border-taupe-100/80">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-typing-dot" />
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-typing-dot" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-typing-dot" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="glass-strong border-t border-taupe-100/60 px-4 py-3 sticky bottom-0 z-20">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSend={handleSend}
            disabled={loading}
            showSuggestions={messageCount < 2}
          />
          <p className="text-[10px] text-taupe-400 text-center mt-2.5">
            Educational guidance only — not financial advice
          </p>
        </div>
      </footer>
    </div>
  );
}

function ErrorBubble({ message, onRetry }) {
  const ERROR_ICONS = {
    QUOTA_EXCEEDED: (
      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    NETWORK_ERROR: (
      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
      </svg>
    ),
    API_KEY_MISSING: (
      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  };

  const icon = ERROR_ICONS[message.code] || (
    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  return (
    <div className="flex gap-3 mb-5 justify-start animate-slide-in-left">
      <div className="flex flex-col gap-1 max-w-[78%]">
        <div className="px-4 py-3.5 rounded-2xl rounded-tl-md border border-primary-200/60 bg-primary-50/50 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">{icon}</div>
            <div>
              <p className="text-[13.5px] leading-[1.7] text-taupe-700">{message.text}</p>
              {onRetry && message.code !== "QUOTA_EXCEEDED" && message.code !== "API_KEY_MISSING" && (
                <button
                  onClick={onRetry}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
        <span className="text-[10px] text-taupe-400 ml-1">{message.time}</span>
      </div>
    </div>
  );
}
