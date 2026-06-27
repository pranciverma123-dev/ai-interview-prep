const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: "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", // 🔴 yaha apna GROQ_API_KEY lagana
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateSkills(role) {
  const prompt = `
You are a career expert.

Role: ${role}

Return ONLY JSON:
{
  "skills": ["list of required skills"],
  "levels": {
    "skill": "easy/medium/hard"
  }
}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0].message.content;

  return JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));
}

module.exports = { generateSkills };