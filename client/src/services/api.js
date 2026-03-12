const API_BASE = import.meta.env.VITE_API_URL || "/api";

let sessionId = null;

function getSessionId() {
  if (!sessionId) {
    sessionId =
      localStorage.getItem("finmentor_session") ||
      crypto.randomUUID();
    localStorage.setItem("finmentor_session", sessionId);
  }
  return sessionId;
}

export function resetSession() {
  sessionId = crypto.randomUUID();
  localStorage.setItem("finmentor_session", sessionId);
}

export async function sendMessageToMentor(message, userContext = {}) {
  const res = await fetch(`${API_BASE}/mentor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      userContext,
      sessionId: getSessionId(),
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.error || "Something went wrong. Please try again.");
    error.code = data?.code || "UNKNOWN_ERROR";
    throw error;
  }

  return data.reply;
}
