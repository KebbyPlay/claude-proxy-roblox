const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

app.post("/claude", async (req, res) => {
  try {
    const { message, system } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Campo 'message' é obrigatório." });
    }

    const payload = {
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: message }],
    };

    // System prompt opcional (personalidade do NPC, narrador, etc.)
    if (system) {
      payload.system = system;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const text = data.content[0].text;
    res.json({ resposta: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.get("/", (req, res) => {
  res.send("Proxy Claude ativo!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
