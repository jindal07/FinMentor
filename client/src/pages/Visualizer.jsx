import { useNavigate } from "react-router-dom";
import CompoundingChart from "../components/CompoundingChart";
import MentorAvatar from "../components/MentorAvatar";

export default function Visualizer() {
  const navigate = useNavigate();
  const stored = localStorage.getItem("finmentor_user");
  const user = stored ? JSON.parse(stored) : {};
  const defaultMonthly = Number(user.savings) || 3000;

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-taupe-100/60 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <MentorAvatar size="sm" />
          <div>
            <h1 className="text-sm font-bold text-taupe-900 tracking-tight">FinMentor</h1>
            <p className="text-[11px] text-taupe-400">Investment Growth Visualizer</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/chat")}
          className="btn-secondary py-2 px-4 text-xs"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Chat
          </span>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Chart card */}
          <div className="card p-6 sm:p-8 animate-fade-up">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-taupe-900 tracking-tight mb-1">
                  See Your Money Grow
                </h2>
                <p className="text-sm text-taupe-500">
                  Adjust the values below to explore how compounding works over time.
                </p>
              </div>
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>

            <CompoundingChart defaultMonthly={defaultMonthly} />
          </div>

          {/* Mentor quote */}
          <div className="card p-6 flex items-start gap-4 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <MentorAvatar size="sm" clickable={false} />
            <div>
              <p className="text-sm text-taupe-700 leading-relaxed italic">
                "This is the power of compounding. Even small investments grow
                significantly when given enough time. The earlier you start, the
                more your money works for you."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-5 h-0.5 bg-primary-200 rounded-full" />
                <p className="text-xs font-semibold text-primary-600">Your FinMentor</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-[11px] text-taupe-400 pb-4">
            Assumed return of 12% p.a. for illustration only. Actual returns may vary. Not financial advice.
          </p>
        </div>
      </main>
    </div>
  );
}
