const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("AI server is running ✅");
});

const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

let chatHistory = [];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message?.trim();
  if (!userMessage) return res.status(400).json({ error: "No message provided" });

  chatHistory.push({ role: "user", content: userMessage });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "auto",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          ...chatHistory.slice(-16)
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";

    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});