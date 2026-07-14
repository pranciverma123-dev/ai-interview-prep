
const OpenAI = require("openai");

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateQuestions(role, experience, difficulty, questionCount) {
  const prompt = `
Generate ${questionCount} interview questions for:

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Return ONLY JSON array like:
["Question 1", "Question 2"]
`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0].message.content;

  return JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));
}

module.exports = { generateQuestions };