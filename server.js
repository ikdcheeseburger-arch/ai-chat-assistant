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
      return res.status(400).json({ reply: "No message provided" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openrouter/auto",
        max_tokens: 100,
        messages: [
          { role: "system", content: "Reply briefly in 1 sentence." },
          { role: "user", content: userMessage }
        ]
      })
    });

    clearTimeout(timeout);

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";

    return res.json({ reply });

  } catch (err) {
    console.error(err);
    return res.json({ reply: "Server error" });
  }
});
    
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});