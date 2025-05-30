// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const callOpenRouterModel = require("./modelRouter");

const app = express();
const PORT = 3000;

app.use(cors()); // ✅ Allow requests from React frontend
app.use(bodyParser.json());

// ✅ Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send prompt to OpenRouter AI model
 *     tags: [Chat]
 *     requestBody:
 *       description: Provide model and prompt
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - model
 *               - prompt
 *             properties:
 *               model:
 *                 type: string
 *                 example: mistralai/mistral-7b-instruct
 *               prompt:
 *                 type: string
 *                 example: What is the capital of France?
 *     responses:
 *       200:
 *         description: The OpenRouter model response
 *       400:
 *         description: Missing input
 *       500:
 *         description: OpenRouter API error
 */
app.post("/api/chat", async (req, res) => {
  const { model, prompt } = req.body;

  if (!model || !prompt) {
    return res.status(400).json({ error: "Model and prompt are required" });
  }
// ✅ Append instruction to make response paragraph-style and longer
  prompt = `Please write a detailed paragraph of at least 100 words in response to the following question:\n\n${prompt}`;

  try {
    const result = await callOpenRouterModel(model, prompt);
    res.json({ content: result.choices[0].message.content });
  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📄 Swagger UI at http://localhost:${PORT}/api-docs`);
});