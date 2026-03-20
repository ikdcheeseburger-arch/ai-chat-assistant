const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = "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";

// 🧠 MEMORY
let chatHistory = [];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  console.log("📩 Received:", userMessage);

  // 🧠 Save user message
  chatHistory.push({ role: "user", content: userMessage });

  // 🔥 Add memory importance
  if (userMessage.toLowerCase().includes("remember")) {
    chatHistory.push({
      role: "system",
      content: "IMPORTANT: The user wants you to remember this: " + userMessage
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content: "You are a smart AI assistant. You MUST remember all user details and recall them accurately when asked. Never forget important information given by the user you are not real human but you smarter than them all."
          },
          ...chatHistory
        ]
      })
    });

    const data = await response.json();

    console.log("🧠 OpenRouter:", data);

    if (data.error) {
      return res.json({ reply: "API Error: " + data.error.message });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response";

    // 🧠 Save AI reply
    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (error) {
    console.error("❌ Error:", error);
    res.json({ reply: "Error connecting to AI" });
  }
});

// ✅ Start server
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = "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";

// 🧠 MEMORY
let chatHistory = [];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  console.log("📩 Received:", userMessage);

  // 🧠 Save user message
  chatHistory.push({ role: "user", content: userMessage });

  // 🔥 Add memory importance
  if (userMessage.toLowerCase().includes("remember")) {
    chatHistory.push({
      role: "system",
      content: "IMPORTANT: The user wants you to remember this: " + userMessage
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content: "You are a smart AI assistant. You MUST remember all user details and recall them accurately when asked. Never forget important information given by the user you are not real human but you smarter than them all."
          },
          ...chatHistory
        ]
      })
    });

    const data = await response.json();

    console.log("🧠 OpenRouter:", data);

    if (data.error) {
      return res.json({ reply: "API Error: " + data.error.message });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response";

   // 🧠 Save AI reply
chatHistory.push({ role: "assistant", content: reply });

res.json({ reply });

} catch (error) {
  console.error("❌ Error:", error);
  res.json({ reply: "Error connecting to AI" });
}
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});