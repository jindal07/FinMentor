import { useNavigate } from "react-router-dom";

export default function MentorAvatar({ size = "md", pulse = false, clickable = true }) {
  const navigate = useNavigate();

  const config = {
    sm: { container: "w-9 h-9", icon: "w-4 h-4", ring: "w-11 h-11" },
    md: { container: "w-11 h-11", icon: "w-5 h-5", ring: "w-14 h-14" },
    lg: { container: "w-16 h-16", icon: "w-7 h-7", ring: "w-20 h-20" },
    xl: { container: "w-20 h-20", icon: "w-9 h-9", ring: "w-24 h-24" },
  };

  const s = config[size];

  return (
    <div
      onClick={clickable ? () => navigate("/") : undefined}
      className={`relative flex-shrink-0 flex items-center justify-center ${clickable ? "cursor-pointer" : ""}`}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === "Enter") navigate("/"); } : undefined}
    >
      {pulse && (
        <div
          className={`absolute ${s.ring} rounded-full bg-primary-400/20 animate-pulse-soft`}
        />
      )}
      <div
        className={`${s.container} rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-oak-600 flex items-center justify-center shadow-lg shadow-primary-500/25 ring-2 ring-white transition-transform duration-200 ${clickable ? "hover:scale-105 active:scale-95" : ""}`}
      >
        <svg
          className={`${s.icon} text-white`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  );
}
