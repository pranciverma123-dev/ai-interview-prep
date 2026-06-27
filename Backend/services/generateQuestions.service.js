
const OpenAI = require("openai");

const client = new OpenAI({
 apiKey: "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",
  baseURL: "https://api.groq.com/openai/v1",
});


async function generateQuestions(
  role,
  skills,
  difficulty,
  questionTypes,
  questionCount
) {
  const prompt = `
You are a STRICT JSON generator.

 ABSOLUTE RULES:
- Output ONLY valid JSON array
- No markdown
- No explanation
- No extra text
- No backticks
- MUST start with [ and end with ]

 FORMAT:
[
  {
    "question": "string",
    "type": "text | mcq | code",
    "options": ["string"],
    "answer": "string"
  }
]

 STRICT JSON RULES:
- All keys and values MUST use double quotes
- NO unquoted symbols like +=, ++, -- outside quotes
- options MUST always be array of strings
- answer MUST be string

Generate ${questionCount} interview questions.

Role: ${role}
Skills: ${skills.join(", ")}
Difficulty: ${difficulty}
Question Types: ${questionTypes.join(", ")}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  let text = response.choices[0].message.content;

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("🔥 Raw AI Response:\n", text);

  text = text
    .replace(/\+\=/g, '"+="')
    .replace(/\+\+/g, '"++"')
    .replace(/--/g, '"--"');


  if (!text.startsWith("[")) {
    console.log("❌ Invalid start:", text);
    throw new Error("AI did not return valid JSON array");
  }


  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.log("❌ First parse failed");

   
    const cleaned = text
      .replace(/^[^\[]*/, "") 
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.log("❌ UNRECOVERABLE AI RESPONSE:\n", text);
      throw new Error("Invalid JSON from AI (even after cleanup)");
    }
  }

  parsed = parsed.map((q) => ({
    question: q.question || "No question generated",
    type: q.type || "text",
    options: q.type === "mcq" ? q.options || [] : [],
    answer: q.answer || "",
  }));

  return parsed;
}

module.exports = { generateQuestions };