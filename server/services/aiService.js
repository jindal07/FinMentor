const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_INSTRUCTION = `You are FinMentor, a friendly AI financial mentor who helps first-time investors understand personal finance and investing.

Your job is NOT to give financial advice or recommend specific stocks or funds. Your role is to EDUCATE users so they understand how investing works.

The users are beginners with little or no financial knowledge.

Rules:
1. Always explain concepts in very simple language.
2. Avoid financial jargon unless you explain it clearly.
3. Use analogies or everyday examples when possible.
4. Keep answers short and easy to read (3–6 sentences).
5. Focus on teaching the concept rather than recommending products.
6. Never tell users what exactly they should buy or invest in.
7. If the user asks for advice, explain the concept instead.
8. Maintain a friendly, patient, mentor-like tone.
9. Remember the user's financial context (income, savings, goal) shared at the start and reference it naturally when relevant.
10. If the user asks something unrelated to finance or investing, gently steer them back.

Tone: Friendly, encouraging, supportive, non-judgmental.

Example tone:
Instead of: "Diversification reduces portfolio risk."
Say: "Think of investing like planting different crops in a farm. If one crop doesn't grow well, the others can still do well."

You are a financial mentor explaining how investing works, not a financial advisor giving investment recommendations.
If appropriate, end with: "This explanation is for educational purposes and not financial advice."`;

const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
};

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

class MentorError extends Error {
  constructor(message, code, userMessage) {
    super(message);
    this.code = code;
    this.userMessage = userMessage;
  }
}

let genAI = null;
const sessions = new Map();

const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_SESSIONS = 200;

function initializeAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("GEMINI_API_KEY not set — please add your API key to .env");
    return;
  }
  genAI = new GoogleGenerativeAI(apiKey);
  console.log("Gemini AI initialized successfully.");

  setInterval(cleanupSessions, 5 * 60 * 1000);
}

function buildUserContextInstruction(userContext) {
  if (!userContext || !userContext.income) return "";
  return `\n\nCurrent user's financial profile:
- Monthly income: ₹${userContext.income}
- Monthly savings: ₹${userContext.savings}
- Primary goal: ${userContext.goal}
Use this context to give personalized examples when relevant. Do not repeat this info back to the user unless they ask.`;
}

function createChatSession(sessionId, userContext = {}) {
  if (!genAI) return null;

  const contextInstruction = buildUserContextInstruction(userContext);
  const fullInstruction = SYSTEM_INSTRUCTION + contextInstruction;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: fullInstruction,
    generationConfig: GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  });

  const chat = model.startChat({ history: [] });

  const session = {
    chat,
    userContext,
    createdAt: Date.now(),
    lastUsedAt: Date.now(),
    messageCount: 0,
  };

  if (sessions.size >= MAX_SESSIONS) {
    cleanupSessions();
    if (sessions.size >= MAX_SESSIONS) {
      const oldest = [...sessions.entries()].sort((a, b) => a[1].lastUsedAt - b[1].lastUsedAt)[0];
      if (oldest) sessions.delete(oldest[0]);
    }
  }

  sessions.set(sessionId, session);
  return session;
}

function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  if (Date.now() - session.lastUsedAt > SESSION_TTL_MS) {
    sessions.delete(sessionId);
    return null;
  }

  session.lastUsedAt = Date.now();
  return session;
}

function cleanupSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastUsedAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

async function getMentorResponse(sessionId, userMessage, userContext = {}) {
  if (!genAI) {
    throw new MentorError(
      "API key not configured",
      "API_KEY_MISSING",
      "The AI mentor isn't configured yet. Please ask the admin to add a valid Gemini API key to get started."
    );
  }

  let session = getSession(sessionId);
  if (!session) {
    session = createChatSession(sessionId, userContext);
    if (!session) {
      throw new MentorError(
        "Failed to create session",
        "SESSION_ERROR",
        "Something went wrong starting our conversation. Please refresh and try again."
      );
    }
  }

  try {
    const result = await session.chat.sendMessage(userMessage);
    session.messageCount++;
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err.message);
    sessions.delete(sessionId);

    if (err.message?.includes("SAFETY")) {
      throw new MentorError(
        "Safety filter triggered",
        "SAFETY_BLOCK",
        "I can only help with finance and investing topics. Could you rephrase your question? Try asking about SIPs, mutual funds, or how compounding works!"
      );
    }

    if (err.message?.includes("quota") || err.message?.includes("429") || err.message?.includes("Resource")) {
      throw new MentorError(
        "Gemini quota exceeded",
        "QUOTA_EXCEEDED",
        "The AI mentor has reached its daily usage limit. The quota resets every 24 hours — please try again later. In the meantime, explore the investment growth visualizer!"
      );
    }

    if (err.message?.includes("API_KEY") || err.message?.includes("401") || err.message?.includes("403")) {
      throw new MentorError(
        "Invalid API key",
        "AUTH_ERROR",
        "There's an issue with the AI service configuration. Please check that the API key is valid."
      );
    }

    if (err.message?.includes("fetch") || err.message?.includes("ENOTFOUND") || err.message?.includes("network")) {
      throw new MentorError(
        "Network error",
        "NETWORK_ERROR",
        "Unable to reach the AI service right now. Please check your internet connection and try again."
      );
    }

    throw new MentorError(
      err.message || "Unknown error",
      "UNKNOWN_ERROR",
      "Something unexpected happened. Please try sending your message again."
    );
  }
}

function getSessionStats() {
  return {
    activeSessions: sessions.size,
    aiConfigured: !!genAI,
    sessions: [...sessions.entries()].map(([id, s]) => ({
      id: id.slice(0, 8) + "...",
      messages: s.messageCount,
      age: Math.round((Date.now() - s.createdAt) / 1000) + "s",
      idle: Math.round((Date.now() - s.lastUsedAt) / 1000) + "s",
    })),
  };
}

module.exports = { initializeAI, getMentorResponse, getSessionStats, MentorError };
