const { getMentorResponse, getSessionStats, MentorError } = require("../services/aiService");

const ERROR_STATUS_MAP = {
  API_KEY_MISSING: 503,
  SESSION_ERROR: 500,
  SAFETY_BLOCK: 422,
  QUOTA_EXCEEDED: 429,
  AUTH_ERROR: 503,
  NETWORK_ERROR: 502,
  UNKNOWN_ERROR: 500,
};

async function handleChat(req, res) {
  try {
    const { message, userContext, sessionId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required.", code: "VALIDATION" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required.", code: "VALIDATION" });
    }

    const trimmedMessage = message.trim().slice(0, 1000);

    const reply = await getMentorResponse(sessionId, trimmedMessage, userContext || {});
    res.json({ reply });
  } catch (err) {
    if (err instanceof MentorError) {
      const status = ERROR_STATUS_MAP[err.code] || 500;
      return res.status(status).json({
        error: err.userMessage,
        code: err.code,
      });
    }

    console.error("Mentor controller error:", err);
    res.status(500).json({
      error: "Something unexpected happened. Please try again.",
      code: "UNKNOWN_ERROR",
    });
  }
}

function handleStats(_req, res) {
  res.json(getSessionStats());
}

module.exports = { handleChat, handleStats };
