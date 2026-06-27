// const OpenAI = require("openai");


// const client = new OpenAI({
// apiKey: "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",
//   baseURL: "https://api.groq.com/openai/v1",
// });


// const generateAIResume = async (data) => {
//   const { role, experience, skills, projects, targetCompany } = data;

//   const prompt = `
// You are an expert ATS resume builder.

// Create a professional ATS-friendly resume in JSON format.

// Role: ${role}
// Experience: ${experience || "Fresher"}
// Skills: ${skills.join(", ")}
// Projects: ${projects?.join(", ") || "N/A"}
// Target Company: ${targetCompany || "Startup"}

// RULES:
// - Return ONLY valid JSON
// - No explanation text
// - Simple ATS format
// - Strong professional summary
// - Bullet points
// - Job-ready content

// OUTPUT FORMAT:

// {
//   "summary": "",
//   "skills": [],
//   "projects": [],
//    strengths: [
//         "Quick Learner",
//         "Problem Solving",
//         "Leadership",
//         "Critical Thinking",
//         "Team Collaboration"
//       ],
// }
// `;

//   try {
//     const response = await client.chat.completions.create({
//      model: "llama-3.1-8b-instant", 
//       messages: [
//         {
//           role: "system",
//           content: "You are a professional resume builder AI.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.7,
//     });

//     const text = response.choices[0].message.content;

//     // safe JSON parse
//     const clean = JSON.parse(
//       text.replace(/```json/g, "").replace(/```/g, "")
//     );

//     return clean;

//   } catch (error) {
//     console.log("AI ERROR:", error);

//     return {
//       summary: "Failed to generate resume",
//       skills: skills || [],
//       projects: projects || [],
//       strengths: ["Problem Solving", "Fast Learner"],
//     };
//   }
// };

// module.exports = { generateAIResume };
const OpenAI = require("openai");

const client = new OpenAI({
 apiKey: "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", // 🔴 yaha apna GROQ_API_KEY lagana
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

// const OpenAI = require("openai");

// const client = new OpenAI({
//  apiKey: "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",
//   baseURL: "https://api.groq.com/openai/v1",
// });

// const generateAIResume = async (data) => {
//   const { role, experience, skills, projects, targetCompany, personal } = data;

//   const prompt = `
// You are an expert ATS resume generator.

// Return a STRICT JSON resume with this structure:

// {
//   personal: {
//     name: string,
//     email: string,
//     phone: string,
//     linkedin: string,
//     github: string
//   },
//   summary: string,
//   skills: string[],
//   projects: [
//     {
//       name: string,
//       description: string (DETAILED EXPLANATION),
//       technologies: string[],
//       achievements: string[]
//     }
//   ],
//   experience: [
//     {
//       role: string,
//       company: string,
//       duration: string,
//       responsibilities: string[]
//     }
//   ],
//   strengths: string[],
//   education: {
//     degree: string,
//     college: string,
//     cgpa: string,
//     year: string
//   },
//   ats_keywords: string[]
// }

// Rules:
// - MUST include LinkedIn and GitHub inside personal object
// - Projects MUST be detailed with explanation + achievements
// - Strengths MUST be 4-6 points
// - Experience MUST be realistic and expanded
// - Do NOT skip any field
// - Output ONLY JSON

// Input:
// Role: ${role}
// Experience: ${experience}
// Skills: ${skills.join(", ")}
// Projects: ${projects.join(", ")}
// Target Company: ${targetCompany}
// Personal: ${JSON.stringify(personal)}
// `;
//   try {
//     const response = await client.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           content: "You are a strict ATS resume generator. Return only valid JSON.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.5,
//     });

//     let text = response.choices[0].message.content;

//     // clean markdown if any
//     text = text
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim();

//     const parsed = JSON.parse(text);

//     return parsed;

//   } catch (error) {
//     console.log("AI ERROR:", error);

//     return {
//       personal: personal || {},
//       summary: "Resume generation failed",
//       skills: skills || [],
//       projects: [],
//       experience: [],
//       education: {},
//       ats_keywords: [],
//     };
//   }
// };

// module.exports = { generateAIResume };
// const OpenAI = require("openai");

// const client = new OpenAI({
//   apiKey: "YOUR_GROQ_API_KEY",
//   baseURL: "https://api.groq.com/openai/v1",
// });

// const generateAIResume = async (data) => {

//   const {
//     personal = {},
//     education = {},
//     role = "",
//     targetCompany = "",
//     experience = [],
//     projects = [],
//     skills = {},
//     certifications = [],
//     achievements = [],
//     languages = [],
//     interests = [],
//   } = data;

//     const prompt = `
// You are a world-class ATS Resume Builder and Senior Technical Recruiter.

// Your task is to generate a PROFESSIONAL ATS FRIENDLY RESUME.

// Target Role:
// ${role}

// Target Company:
// ${targetCompany || "Any Company"}

// ========================
// PERSONAL INFORMATION
// ========================

// ${JSON.stringify(personal, null, 2)}

// ========================
// EDUCATION
// ========================

// ${JSON.stringify(education, null, 2)}

// ========================
// WORK EXPERIENCE
// ========================

// ${JSON.stringify(experience, null, 2)}

// ========================
// PROJECTS
// ========================

// ${JSON.stringify(projects, null, 2)}

// ========================
// TECHNICAL SKILLS
// ========================

// ${JSON.stringify(skills, null, 2)}

// ========================
// CERTIFICATIONS
// ========================

// ${JSON.stringify(certifications, null, 2)}

// ========================
// ACHIEVEMENTS
// ========================

// ${JSON.stringify(achievements, null, 2)}

// ========================
// LANGUAGES
// ========================

// ${JSON.stringify(languages, null, 2)}

// ========================
// INTERESTS
// ========================

// ${JSON.stringify(interests, null, 2)}

// ========================
// RULES
// ========================

// 1. Resume should be ATS Score 95+

// 2. Rewrite every project professionally.

// 3. Use strong action verbs.

// 4. Add quantified achievements whenever possible.

// 5. Improve weak descriptions.

// 6. Generate recruiter-friendly summary.

// 7. Categorize technical skills.

// 8. Generate professional strengths.

// 9. Generate ATS Keywords.

// 10. Generate Missing Keywords.

// 11. Generate Career Objective.

// 12. Return ONLY VALID JSON.

// 13. Do not return markdown.

// 14. Do not explain anything.

// ========================
// OUTPUT FORMAT
// ========================

// {
//   "personal": {},
//   "summary": "",
//   "careerObjective": "",
//   "education": {},
//   "experience": [],
//   "projects": [],
//   "skills": {
//     "languages": [],
//     "frameworks": [],
//     "libraries": [],
//     "databases": [],
//     "tools": [],
//     "cloud": [],
//     "softSkills": []
//   },
//   "certifications": [],
//   "achievements": [],
//   "strengths": [],
//   "atsKeywords": [],
//   "missingKeywords": [],
//   "recruiterTips": [],
//   "atsScore": 95
// }
// `;

//    try {

//     const response = await client.chat.completions.create({
//       model: "llama-3.3-70b-versatile",

//       temperature: 0.4,

//       max_tokens: 4096,

//       response_format: {
//         type: "json_object",
//       },

//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a Professional ATS Resume Writer. Return ONLY valid JSON.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     let text = response.choices[0].message.content;

//     text = text
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim();

//     let resume = JSON.parse(text);

//     // ==========================
//     // DEFAULT VALUES
//     // ==========================

//     resume.personal ??= personal;

//     resume.summary ??= "";

//     resume.careerObjective ??= "";

//     resume.education ??= education;

//     resume.experience ??= [];

//     resume.projects ??= [];

//     resume.skills ??= {
//       languages: [],
//       frameworks: [],
//       libraries: [],
//       databases: [],
//       tools: [],
//       cloud: [],
//       softSkills: [],
//     };

//     resume.certifications ??= [];

//     resume.achievements ??= [];

//     resume.strengths ??= [];

//     resume.atsKeywords ??= [];

//     resume.missingKeywords ??= [];

//     resume.recruiterTips ??= [];

//     resume.languages ??= languages;

//     resume.interests ??= interests;

//     resume.atsScore ??= 95;

//     // ==========================
//     // NORMALIZE PROJECTS
//     // ==========================

//     if (Array.isArray(resume.projects)) {

//       resume.projects = resume.projects.map((project) => ({

//         title:
//           project.title ||
//           project.name ||
//           "Project",

//         description:
//           project.description || "",

//         technologies:
//           project.technologies || [],

//         features:
//           project.features || [],

//         impact:
//           project.impact || "",

//         github:
//           project.github || "",

//         live:
//           project.live || ""

//       }));

//     }

//     // ==========================
//     // NORMALIZE EXPERIENCE
//     // ==========================

//     if (Array.isArray(resume.experience)) {

//       resume.experience = resume.experience.map((exp) => ({

//         company:
//           exp.company || "",

//         role:
//           exp.role || "",

//         duration:
//           exp.duration || "",

//         responsibilities:
//           exp.responsibilities || [],

//         achievements:
//           exp.achievements || []

//       }));

//     }

//     // ==========================
//     // REMOVE DUPLICATES
//     // ==========================

//     resume.strengths = [...new Set(resume.strengths)];

//     resume.certifications = [...new Set(resume.certifications)];

//     resume.achievements = [...new Set(resume.achievements)];

//     resume.atsKeywords = [...new Set(resume.atsKeywords)];

//     resume.missingKeywords = [...new Set(resume.missingKeywords)];

//     resume.recruiterTips = [...new Set(resume.recruiterTips)];

//     return resume;

//       } catch (error) {

//     console.error("ATS AI ERROR:", error.message);

//     return {

//       personal,

//       summary:
//         `Motivated ${role || "Software Engineer"} with strong analytical, problem-solving and software development skills. Passionate about building scalable applications and continuously learning modern technologies.`,

//       careerObjective:
//         `Seeking a challenging ${role || "Software Engineer"} role where technical expertise, innovation and teamwork can contribute to organizational success while enabling continuous professional growth.`,

//       education,

//       experience: experience || [],

//       projects: Array.isArray(projects)
//         ? projects.map((project) => ({
//             title: project.title || project.name || "Project",

//             description:
//               project.description ||
//               "Designed and developed a software application following modern development practices.",

//             technologies:
//               project.technologies || [],

//             features:
//               project.features || [],

//             impact:
//               project.impact ||
//               "Improved application usability and performance.",

//             github:
//               project.github || "",

//             live:
//               project.live || ""
//           }))
//         : [],

//       skills: {
//         languages:
//           skills.languages || [],

//         frameworks:
//           skills.frameworks || [],

//         libraries:
//           skills.libraries || [],

//         databases:
//           skills.databases || [],

//         tools:
//           skills.tools || [],

//         cloud:
//           skills.cloud || [],

//         softSkills: [
//           "Problem Solving",
//           "Communication",
//           "Leadership",
//           "Teamwork",
//           "Adaptability"
//         ]
//       },

//       certifications:
//         certifications || [],

//       achievements:
//         achievements.length
//           ? achievements
//           : [
//               "Built multiple real-world software projects.",
//               "Strong understanding of Data Structures and Algorithms.",
//               "Hands-on experience in Full Stack Development."
//             ],

//       strengths: [
//         "Quick Learner",
//         "Problem Solving",
//         "Leadership",
//         "Critical Thinking",
//         "Team Collaboration"
//       ],

//       atsKeywords: [
//         role,
//         "REST API",
//         "Git",
//         "Agile",
//         "JavaScript",
//         "Problem Solving"
//       ],

//       missingKeywords: [],

//       recruiterTips: [
//         "Keep resume within one page.",
//         "Use measurable achievements.",
//         "Customize resume for every company.",
//         "Include GitHub and LinkedIn profile."
//       ],

//       languages,

//       interests,

//       atsScore: 90

//     };

//   }

// };

// module.exports = {
//   generateAIResume
// };