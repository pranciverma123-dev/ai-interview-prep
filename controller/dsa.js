const { generateDSA } = require("../services/dsaAI.service");
const { solveDSA } = require("../services/dsaSolve.service");
const { executeCode } = require("../services/codeRunner.service");


async function runCode(req, res) {
   console.log("===== RUN CODE REQUEST =====");
  console.log(JSON.stringify(req.body, null, 2));
  try {
    const { code, language, testCases = [] } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language required",
      });
    }

    const result = await executeCode(code, language, testCases);

    return res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    console.error("runCode error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}






async function solveDSAQuestion(req, res) {
  try {
    const { question, code, language } = req.body;

    // 1. Validation
    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // 2. Call AI / service
    const result = await solveDSA(question, code, language);

    // 3. SAFE RESPONSE CLEANING (IMPORTANT FIX)
    let cleanedResult = result;

    // If result is string → prevent JSON crash
    if (typeof result === "string") {
      cleanedResult = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    // 4. Send response safely
    return res.status(200).json({
      success: true,
      result: cleanedResult,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function generateDSAQuestions(req, res) {
  try {
    const {
      company,
      difficulty,
      topic,
      questionCount,
    } = req.body;

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company is required",
      });
    }

    const questions = await generateDSA(
      company,
      difficulty,
      topic,
      questionCount || 5
    );

    return res.json({
      success: true,
      type: "DSA",
      questions,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { runCode,generateDSAQuestions,solveDSAQuestion };