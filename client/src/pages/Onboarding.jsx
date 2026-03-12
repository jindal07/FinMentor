import { useNavigate } from "react-router-dom";
import OnboardingForm from "../components/OnboardingForm";
import MentorAvatar from "../components/MentorAvatar";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    localStorage.setItem("finmentor_user", JSON.stringify(formData));
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col overflow-hidden">
      {/* Floating blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 -right-32 w-72 h-72 bg-primary-200/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-32 w-64 h-64 bg-oak-200/15 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-6 py-5 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <MentorAvatar size="sm" />
          <span className="font-bold text-taupe-900 text-lg tracking-tight">FinMentor</span>
        </button>
      </nav>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-8 text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold mb-5 border border-primary-100">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Setup — 30 seconds
          </div>
          <h1 className="text-3xl font-bold text-taupe-900 mb-2 tracking-tight">
            Let's personalize your experience
          </h1>
          <p className="text-taupe-500 text-sm max-w-md mx-auto leading-relaxed">
            Three quick questions so your mentor can give you relevant examples and guidance.
          </p>
        </div>

        <div className="animate-fade-up w-full" style={{ animationDelay: "0.15s" }}>
          <OnboardingForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
