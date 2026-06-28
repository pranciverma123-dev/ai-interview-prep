

const { generateSkills } = require("../services/skillAI.service");
const Skill = require("../models/skills");
const Interview = require("../models/interview");
const { generateQuestions } = require("../services/generateQuestions.service");

async function getSkills(req, res) {
  try {
    const { role } = req.body;

    const skills = await generateSkills(role);

    return res.json({
      success: true,
      skills,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate skills",
    });
  }
}


async function createInterview(req, res) {
  try {
    const {
      role,
      skills,
      difficulty,
      questionTypes,
      questionCount,
    } = req.body;

    const questions = await generateQuestions(
      role,
      skills,
      difficulty,
      questionTypes,
      questionCount || 5
    );

    const interview = await Interview.create({
      user: null,   // OR req.user._id (depends on middleware)
      role,
      skills,
      questions,
      status: "pending",
    });

    return res.json({
      success: true,
      interview,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { createInterview, getSkills };