import { useNavigate } from "react-router-dom";
import MentorAvatar from "../components/MentorAvatar";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Ask, Don't Search",
    desc: "Chat with your mentor like a friend. Get answers, not dashboards.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Visualize Growth",
    desc: "See how small monthly investments can compound into wealth over time.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Learn by Doing",
    desc: "Understand SIPs, mutual funds, and compounding through simple explanations.",
  },
];

const SAMPLE_QUESTIONS = [
  "What is a SIP?",
  "How does compounding work?",
  "Mutual funds vs FD?",
  "Where should I start?",
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-mesh flex flex-col overflow-hidden">
      {/* Floating blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-48 w-80 h-80 bg-oak-200/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-chiffon-200/15 rounded-full blur-3xl animate-float" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <MentorAvatar size="sm" />
          <span className="font-bold text-taupe-900 text-lg tracking-tight">FinMentor</span>
        </div>
        <span className="hidden sm:inline-block text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
          AI-Powered
        </span>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto py-8">
        <div className="mb-8 animate-fade-up">
          <MentorAvatar size="xl" pulse />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-taupe-900 mb-5 leading-[1.1] tracking-tight animate-fade-up">
          Your AI{" "}
          <span className="gradient-text">Financial Mentor</span>
        </h1>

        <p className="text-lg sm:text-xl text-taupe-500 mb-6 max-w-lg leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Learn investing the simple way. No jargon, no confusing dashboards — just a friendly mentor who speaks your language.
        </p>

        {/* Sample questions */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {SAMPLE_QUESTIONS.map((q) => (
            <span
              key={q}
              className="px-4 py-2 glass rounded-full text-sm text-taupe-500 shadow-soft cursor-default hover:shadow-glass hover:text-primary-600 transition-all duration-300"
            >
              "{q}"
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={() => navigate("/onboarding")}
            className="group px-10 py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white rounded-2xl text-base font-semibold
                       hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Start with Mentor
            <span className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-taupe-400 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          Free & educational — not financial advice
        </p>
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card p-6 hover:shadow-glass transition-all duration-300 hover:-translate-y-1 animate-fade-up group"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-taupe-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-taupe-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-taupe-100/60">
        <p className="text-xs text-taupe-400">Built with care for first-time investors</p>
      </footer>
    </div>
  );
}
