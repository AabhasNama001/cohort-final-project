const express = require("express");
const agent = require("../../agent/agent");
// 1. Import HumanMessage to ensure proper type-safety for LangGraph
const { HumanMessage } = require("@langchain/core/messages");

const router = express.Router();

router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  let token = null;

  // Extract token from cookie or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) token = parts[1];
  }

  try {
    // 2. Wrap the user input in a HumanMessage object
    // This prevents "500 Internal Server Error" caused by invalid message schemas
    const agentResponse = await agent.invoke(
      {
        messages: [new HumanMessage(q)],
      },
      {
        metadata: { token },
      }
    );

    // 3. Get the final response from the agent's message history
    const lastMessage =
      agentResponse.messages[agentResponse.messages.length - 1];

    return res.status(200).json({
      ok: true,
      reply: lastMessage.content,
    });
  } catch (err) {
    // 4. Log the full error to your Render dashboard for debugging
    console.error("AI agent route error:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "An error occurred while processing your request.",
    });
  }
});

module.exports = router;
