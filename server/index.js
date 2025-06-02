// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const callOpenRouterModel = require("./modelRouter");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Use Railway's dynamic port

app.use(cors());
app.use(bodyParser.json());

// ✅ Swagger UI (for development or leave in production)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Chat API
app.post("/api/chat", async (req, res) => {
  const { model, prompt } = req.body;

  if (!model || !prompt) {
    return res.status(400).json({ error: "Model and prompt are required" });
  }

  try {
    const result = await callOpenRouterModel(model, prompt);
    res.json({ content: result.choices[0].message.content });
  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

// ✅ Serve React frontend in production
const clientBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📄 Swagger UI available at /api-docs`);
});
