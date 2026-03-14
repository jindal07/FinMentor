import { useState, useEffect, useCallback } from "react";

const GOALS = [
  { id: "emergency", label: "Build emergency fund", icon: "🛡️", desc: "Safety net for unexpected expenses" },
  { id: "wealth", label: "Long-term wealth", icon: "📈", desc: "Grow your money over the years" },
  { id: "travel", label: "Save for travel", icon: "✈️", desc: "Fund your dream trips" },
  { id: "retirement", label: "Retirement planning", icon: "🏖️", desc: "Secure your future self" },
];

const STEPS = [
  { num: 1, label: "Income" },
  { num: 2, label: "Savings" },
  { num: 3, label: "Goal" },
];

export default function OnboardingForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ income: "", savings: "", goal: "" });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else onSubmit(form);
  };

  const canProceed =
    (step === 0 && form.income) ||
    (step === 1 && form.savings) ||
    (step === 2 && form.goal);

  const handleEnter = useCallback((e) => {
    if (e.key === "Enter" && step === 2 && form.goal) handleNext();
  }, [step, form.goal]);

  useEffect(() => {
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [handleEnter]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-1 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                  i < step
                    ? "bg-lime-600 text-white shadow-md shadow-lime-600/20"
                    : i === step
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 scale-110"
                    : "bg-taupe-100 text-taupe-400"
                }`}
              >
                {i < step ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              <span className={`text-[10px] mt-1.5 font-medium ${i <= step ? "text-primary-600" : "text-taupe-400"}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`w-16 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500 ${i < step ? "bg-lime-500" : "bg-taupe-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card p-8 min-h-[320px]">
        {step === 0 && (
          <div className="animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-taupe-900 mb-2">
              What's your monthly income?
            </h2>
            <p className="text-taupe-500 mb-6 text-sm leading-relaxed">
              This helps us understand your financial situation better. Don't worry — we won't store this anywhere.
            </p>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400 font-semibold text-lg">₹</span>
              <input
                type="number"
                min="0"
                value={form.income}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, income: val });
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                  if (e.key === "Enter" && form.income) handleNext();
                }}
                placeholder="e.g. 30000"
                className="input-modern pl-9 py-4 text-lg"
                autoFocus
              />
            </div>
            {form.income && Number(form.income) > 0 && (
              <p className="text-xs text-lime-700 mt-2 ml-1 animate-fade-in">
                Great, that's a good starting point!
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-chiffon-50 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-chiffon-700" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-taupe-900 mb-2">
              How much can you save monthly?
            </h2>
            <p className="text-taupe-500 mb-6 text-sm leading-relaxed">
              Even ₹500/month can make a difference. There's no wrong answer here.
            </p>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400 font-semibold text-lg">₹</span>
              <input
                type="number"
                min="0"
                value={form.savings}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, savings: val });
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                  if (e.key === "Enter" && form.savings) handleNext();
                }}
                placeholder="e.g. 5000"
                className="input-modern pl-9 py-4 text-lg"
                autoFocus
              />
            </div>
            {form.savings && form.income && Number(form.savings) > 0 && (
              <p className="text-xs text-primary-600 mt-2 ml-1 animate-fade-in">
                That's {Math.round((Number(form.savings) / Number(form.income)) * 100)}% of your income — nice!
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-oak-50 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-oak-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-taupe-900 mb-2">
              What's your investment goal?
            </h2>
            <p className="text-taupe-500 mb-6 text-sm leading-relaxed">
              Pick what resonates most with you right now. You can always change this later.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setForm({ ...form, goal: g.label })}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                    form.goal === g.label
                      ? "border-primary-400 bg-primary-50/60 shadow-md shadow-primary-400/10"
                      : "border-taupe-100 hover:border-oak-200 hover:bg-taupe-50/50 hover:shadow-soft"
                  }`}
                >
                  <span className="text-2xl block mb-2 transition-transform duration-200 group-hover:scale-110">
                    {g.icon}
                  </span>
                  <span className="text-sm font-semibold text-taupe-800 block">{g.label}</span>
                  <span className="text-[11px] text-taupe-400 mt-0.5 block">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="btn-secondary">
            Back
          </button>
        )}
        <button onClick={handleNext} disabled={!canProceed} className="btn-primary flex-1 py-3.5">
          {step < 2 ? "Continue" : "Start with Mentor →"}
        </button>
      </div>
    </div>
  );
}
