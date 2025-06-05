const axios = require("axios");

async function callOpenRouterModel(model, prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing in environment variables");
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenRouter-Referer": "http://localhost:3000", // ✅ Correct header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("OpenRouter API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}

module.exports = callOpenRouterModel;
