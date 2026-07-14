

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateFeedback(role, answers) {
  try {
    const prompt = `
You are an expert interview evaluator.

Return ONLY valid JSON.
No markdown, no explanation.

Rules:
- scores must be integers 1 to 10
- if unsure use 5
- be strict and realistic

Format:
{
  "communication": 1-10,
  "technical": 1-10,
  "confidence": 1-10,
  "overall": 1-10,
  "strengths": ["..."],
  "improvements": ["..."]
}

Role: ${role}

Answers:
${JSON.stringify(answers, null, 2)}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    let text = response.choices[0].message.content;

    if (!text) throw new Error("Empty AI response");

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid JSON from AI");

      parsed = JSON.parse(match[0]);
    }

 
    const safe = {
      communication: parsed.communication || 5,
      technical: parsed.technical || 5,
      confidence: parsed.confidence || 5,
      overall: parsed.overall || 5,
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths
        : [],
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements
        : [],
    };

    return safe;
  } catch (error) {
    console.log("AI ERROR:", error.message);

    return {
      communication: 5,
      technical: 5,
      confidence: 5,
      overall: 5,
      strengths: [],
      improvements: ["AI failed to generate proper feedback"],
    };
  }
}

module.exports = { generateFeedback };