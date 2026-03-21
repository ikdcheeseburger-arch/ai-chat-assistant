const express = require("express");
const cors = require("cors");
const path = require("path");

console.log("KEY LENGTH:", process.env.OPENROUTER_KEY?.length);

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

let chatHistory = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message?.trim();
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    chatHistory.push({ role: "user", content: userMessage });
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000); // 10 sec

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "openrouter/auto",
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      ...chatHistory.slice(-16)
    ]
  }),
  signal: controller.signal
});

clearTimeout(timeout);

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("DATA:", data);

   const reply = data.choices?.[0]?.message?.content;

if (!reply) {
  console.log("⚠️ FULL MESSAGE OBJECT:", data.choices?.[0]?.message);
}

res.json({ reply: reply || "No response" });

    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});