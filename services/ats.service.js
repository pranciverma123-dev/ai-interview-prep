
const OpenAI = require("openai");

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateAIResume = async (data) => {
  const {
    role,
    experience,
    skills = [],
    projects = [],
    targetCompany,
  } = data;

  const prompt = `
You are an expert ATS resume builder.

Create a professional ATS-friendly resume in JSON format.

Role: ${role || "Full Stack Developer"}
Experience: ${experience || "Fresher"}
Skills: ${skills.join(", ")}
Projects: ${projects.join(", ") || "N/A"}
Target Company: ${targetCompany || "Startup"}

RULES:
- Return ONLY valid JSON
- No explanation text
- No markdown
- Simple ATS format
- Strong professional summary
- Job-ready content

OUTPUT FORMAT:

{
  "summary": "",
  "skills": [],
  "projects": [],
  "strengths": [
    "Quick Learner",
    "Problem Solving",
    "Leadership",
    "Critical Thinking",
    "Team Collaboration"
  ]
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume builder AI. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const text = response.choices?.[0]?.message?.content || "{}";

    const clean = JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "").trim()
    );

    // Fallback strengths
    if (!clean.strengths || !Array.isArray(clean.strengths)) {
      clean.strengths = [
        "Quick Learner",
        "Problem Solving",
        "Leadership",
        "Critical Thinking",
        "Team Collaboration",
      ];
    }

    // Fallback skills
    if (!clean.skills || !Array.isArray(clean.skills)) {
      clean.skills = skills;
    }

    // Fallback projects
    if (!clean.projects || !Array.isArray(clean.projects)) {
      clean.projects = projects;
    }

    // Fallback summary
    if (!clean.summary) {
      clean.summary =
        "Motivated and detail-oriented professional with strong technical and problem-solving abilities.";
    }

    return clean;
  } catch (error) {
    console.error("AI ERROR:", error);

    return {
      summary:
        "Motivated and detail-oriented professional with strong technical and problem-solving abilities.",
      skills,
      projects,
      strengths: [
        "Quick Learner",
        "Problem Solving",
        "Leadership",
        "Critical Thinking",
        "Team Collaboration",
      ],
    };
  }
};

module.exports = { generateAIResume };
