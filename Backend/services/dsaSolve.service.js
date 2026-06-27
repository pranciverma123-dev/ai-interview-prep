


const OpenAI = require("openai");

const client = new OpenAI({
   apiKey: "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",
  baseURL: "https://api.groq.com/openai/v1",
});

function safeJSONParse(text) {
  if (!text) return null;

  try {
    // remove markdown if any
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // direct parse attempt
    return JSON.parse(text);
  } catch (e) {
    try {
      // fallback: extract JSON block
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return null;
      return JSON.parse(match[0]);
    } catch (err) {
      return null;
    }
  }
}

async function solveDSA(question, code, language) {
  try {
    const prompt = `
You are a DSA expert.

Return ONLY valid JSON. No explanation. No markdown.

FORMAT:
{
  "language": "${language || "javascript"}",
  "isCorrect": true,
  "approach": "short explanation",
  "mistakes": "if any",
  "correctCode": "fixed code",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "feedback": "short feedback"
}

Question:
${question}

User Code:
${code || "No code provided"}

Language:
${language || "javascript"}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    let text = response.choices[0].message.content;

    const parsed = safeJSONParse(text);

    if (!parsed) {
      throw new Error("Invalid JSON from AI response");
    }

    return parsed;

  } catch (error) {
    return {
      language: language || "javascript",
      isCorrect: false,
      approach: "Failed to process AI response",
      mistakes: error.message,
      correctCode: code || "",
      timeComplexity: "",
      spaceComplexity: "",
      feedback: "AI parsing failed"
    };
  }
}

module.exports = { solveDSA };