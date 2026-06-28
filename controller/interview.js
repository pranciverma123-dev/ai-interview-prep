const Interview = require("../models/interview");
const mongoose = require("mongoose");

const { generateQuestions } = require("../services/gemini.services");
const { generateFeedback } = require("../services/feedbackAI.service");

async function createInterview(req, res) {
  try {
    const { role, experience, difficulty, questionCount } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const aiResponse = await generateQuestions(
      role,
      experience || "fresher",
      difficulty || "easy",
      questionCount || 5
    );

    let questions = [];

    try {
      const parsed =
        typeof aiResponse === "string"
          ? JSON.parse(aiResponse)
          : aiResponse;

      questions = parsed.map((q) => ({
        question: typeof q === "string" ? q : q.question || "",
        type: q.type || "text",
        options: q.options || [],
        answer: q.answer || "",
      }));
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      role,
      questions,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


async function submitInterview(req, res) {
  try {
    const { interviewId, answers } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "InterviewId is required",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }


    const cleanAnswers = answers.map((a) => ({
      question: a?.question || "",
      answer: a?.answer ? a.answer.trim() : "",
      attempted: !!(a?.answer && a.answer.trim() !== ""),
    }));

    if (!cleanAnswers.length) {
      return res.status(400).json({
        success: false,
        message: "No answers provided",
      });
    }

    interview.answers = cleanAnswers;
    interview.status = "completed";


    const role = interview.role?.trim() || "General";

    const evaluation = await generateFeedback(role, cleanAnswers);

    const avg =
      (
        evaluation.communication +
        evaluation.technical +
        evaluation.confidence
      ) / 3;

    const finalScore = Math.round((avg + evaluation.overall) / 2);

    let performance = "";

    if (finalScore >= 8) {
      performance = "Excellent 🔥 (Strong Candidate)";
    } else if (finalScore >= 6) {
      performance = "Good ⚡ (Hireable)";
    } else if (finalScore >= 4) {
      performance = "Average 😐 (Needs improvement)";
    } else {
      performance = "Weak ❌ (Not ready)";
    }

    interview.evaluation = evaluation;
    interview.finalScore = finalScore;
    interview.performance = performance;

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview submitted & evaluated successfully",
      interview,
      evaluation,
      finalScore,
      performance,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


async function getHistory(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const interviews = await Interview.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      interviews,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
}


async function getInterviewById(req, res) {
  try {
    const interview = await Interview.findById(req.params.id).populate(
      "user",
      "firstname lastname email"
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (
      req.user &&
      interview.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createInterview,
  submitInterview,
  getHistory,
  getInterviewById,
};

// const Interview = require("../models/interview");
// const mongoose = require("mongoose");

// const { generateQuestions } = require("../services/gemini.services");
// const {generateFeedback}=require("../services/feedbackAI.service");
// // ================= CREATE INTERVIEW =================
// async function createInterview(req, res) {
//   try {
//     const { role, experience, difficulty, questionCount } = req.body;

//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized user",
//       });
//     }

//     if (!role) {
//       return res.status(400).json({
//         success: false,
//         message: "Role is required",
//       });
//     }

//     const aiResponse = await generateQuestions(
//       role,
//       experience || "fresher",
//       difficulty || "easy",
//       questionCount || 5
//     );

//     let questions = [];

//     try {
//       const parsed =
//         typeof aiResponse === "string"
//           ? JSON.parse(aiResponse)
//           : aiResponse;

//       questions = parsed.map((q) => ({
//         question: typeof q === "string" ? q : q.question || "",
//         type: q.type || "text",
//         options: q.options || [],
//         answer: q.answer || "",
//       }));
//     } catch (err) {
//       console.log("QUESTION PARSE ERROR:", err);

//       return res.status(500).json({
//         success: false,
//         message: "Failed to parse AI response",
//       });
//     }

//     const interview = await Interview.create({
//       user: req.user._id,
//       role,
//       questions,
//       status: "pending",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Interview created successfully",
//       interview,
//     });
//   } catch (error) {
//     console.log("CREATE INTERVIEW ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }


// // const submitInterview = async (req, res) => {
// //   try {
// //     const { interviewId, answers } = req.body;

// //     if (!interviewId || !Array.isArray(answers)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid request",
// //       });
// //     }

// //     const cleanedAnswers = answers.map(a => ({
// //       question: a.question || "",
// //       answer: (a.answer || "").trim(),
// //     }));

// //     const interview = await Interview.findById(interviewId);

// //     if (!interview) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Interview not found",
// //       });
// //     }

// //     // 🔥 NEVER CRASH SAVE
// //     interview.answers = cleanedAnswers;
// //     await interview.save();

// //     return res.json({
// //       success: true,
// //       message: "Submitted successfully",
// //       feedbackId: interview._id, // fallback safe
// //     });

// //   } catch (error) {
// //     console.log("SUBMIT ERROR:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: "Server error (submit failed)",
// //     });
// //   }
// // };

// //new
// async function submitInterview(req, res) {
//   try {
//     const { interviewId, answers } = req.body;

//     if (!interviewId) {
//       return res.status(400).json({
//         success: false,
//         message: "InterviewId is required",
//       });
//     }

//     if (!Array.isArray(answers)) {
//       return res.status(400).json({
//         success: false,
//         message: "Answers must be an array",
//       });
//     }

//    const interview = await Interview.findById(interviewId);

// if (!interview) {
//   return res.status(404).json({
//     success: false,
//     message: "Interview not found",
//   });
// }

// // ✅ ADD THIS HERE
// const role = interview.role || "General";

//     // ================= CLEAN ANSWERS =================
//    const cleanAnswers = answers.map((a) => ({
//   question: a?.question || "",
//   answer: a?.answer ? a.answer.trim() : "",
//   attempted: !!(a?.answer && a.answer.trim() !== ""),
// }));

// // ✅ ADD HERE
// if (!cleanAnswers.length) {
//   return res.status(400).json({
//     success: false,
//     message: "No answers provided",
//   });
// }

//     interview.answers = cleanAnswers;
//     interview.status = "completed";

//     // ================= AI EVALUATION =================
//    const evaluation = await generateFeedback(
//   interview.role,
//   cleanAnswers
// );

// // 👉 ADD THIS HERE 👇
// const avg =
//   (
//     evaluation.communication +
//     evaluation.technical +
//     evaluation.confidence
//   ) / 3;

// const finalScore = Math.round((avg + evaluation.overall) / 2);

//     /*
//       expected evaluation:
//       {
//         communication: 1-10,
//         technical: 1-10,
//         confidence: 1-10,
//         overall: 1-10,
//         strengths: [],
//         improvements: []
//       }
//     */

//     // ================= PERFORMANCE CALC =================
//     let performance = "";

//     if (evaluation.overall >= 8) {
//       performance = "Excellent 🔥 (Strong Candidate)";
//     } else if (evaluation.overall >= 6) {
//       performance = "Good ⚡ (Hireable)";
//     } else if (evaluation.overall >= 4) {
//       performance = "Average 😐 (Needs improvement)";
//     } else {
//       performance = "Weak ❌ (Not ready)";
//     }

//     await interview.save();

//     return res.status(200).json({
//       success: true,
//       message: "Interview submitted & evaluated successfully",
//       interview,
//       evaluation,
//       finalScore,
//       performance,
//     });

//   } catch (error) {
//     console.log("SUBMIT ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }
// // ================= SUBMIT INTERVIEW =================
// // async function submitInterview(req, res) {
// //   try {
// //     const { interviewId, answers } = req.body;

// //     if (!interviewId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "InterviewId is required",
// //       });
// //     }

// //     if (!Array.isArray(answers)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Answers must be an array",
// //       });
// //     }

// //     const interview = await Interview.findById(interviewId);

// //     if (!interview) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Interview not found",
// //       });
// //     }

// //     // ✅ SAFE MAPPING (no crash, partial allowed)
// //     const cleanAnswers = answers.map((a) => ({
// //       question: a?.question || "",
// //       answer: a?.answer ? a.answer.trim() : "",
// //       attempted: !!(a?.answer && a.answer.trim() !== ""),
// //     }));

// //     interview.answers = cleanAnswers;
// //     interview.status = "completed";

// //     await interview.save();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Interview submitted successfully",
// //       interview,
// //     });

// //   } catch (error) {
// //     console.log("SUBMIT ERROR:", error);

// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // }
// // ================= HISTORY =================
// async function getHistory(req, res) {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized user",
//       });
//     }

//     const interviews = await Interview.find({
//       user: req.user._id,
//     }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       interviews,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch history",
//     });
//   }
// }

// // ================= GET SINGLE INTERVIEW =================
// async function getInterviewById(req, res) {
//   try {
//     const interview = await Interview.findById(req.params.id).populate(
//       "user",
//       "firstname lastname email"
//     );

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message: "Interview not found",
//       });
//     }

//     if (
//       req.user &&
//       interview.user._id.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       interview,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// module.exports = {
//   createInterview,
//   submitInterview,
//   getHistory,
//   getInterviewById,
// };
// const Interview = require("../models/interview");

// const {
//   generateQuestions,
// } = require("../services/gemini.services");

// // ================= CREATE INTERVIEW =================

// async function createInterview(req, res) {
//   try {
//     const {
//       role,
//       experience,
//       difficulty,
//       questionCount,
//     } = req.body;

//     if (!role) {
//       return res.status(400).json({
//         success: false,
//         message: "Role is required",
//       });
//     }

//     const aiResponse = await generateQuestions(
//       role,
//       experience || "fresher",
//       difficulty || "easy",
//       questionCount || 5
//     );

//     let questions = [];

//     try {
//       const parsedQuestions = Array.isArray(aiResponse)
//         ? aiResponse
//         : JSON.parse(aiResponse);

//       questions = parsedQuestions.map((q) => ({
//         question:
//           typeof q === "string"
//             ? q
//             : q.question || "",
//         type: q.type || "text",
//         options: q.options || [],
//         answer: q.answer || "",
//       }));

//     } catch (err) {
//       console.log("QUESTION PARSE ERROR:", err);

//       return res.status(500).json({
//         success: false,
//         message: "Failed to parse AI questions",
//       });
//     }

//     console.log("USER:", req.user);
//     console.log(
//       "QUESTIONS:",
//       JSON.stringify(questions, null, 2)
//     );

//     const interview = await Interview.create({
//       user: req.user._id,
//       role,
//       questions,
//       status: "pending",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Interview created successfully",
//       interview,
//     });

//   } catch (error) {
//     console.log(
//       "CREATE INTERVIEW ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// // ================= SUBMIT INTERVIEW =================

// async function submitInterview(req, res) {
//   try {
//     const { interviewId, answers } = req.body;

//     if (!interviewId) {
//       return res.status(400).json({
//         success: false,
//         message: "InterviewId is required",
//       });
//     }

//     if (!Array.isArray(answers)) {
//       return res.status(400).json({
//         success: false,
//         message: "Answers must be an array",
//       });
//     }

//     const interview = await Interview.findById(interviewId);

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message: "Interview not found",
//       });
//     }

//     // 🔥 SAFE CLEANING
//     const cleanAnswers = answers.map((a) => ({
//       question: a.question || "",
//       answer: (a.answer || "").trim(), // important
//     }));

//     interview.answers = cleanAnswers;
//     interview.status = "completed";

//     // 🔥 SAFE SCORE (only if schema supports it)
//     if ("score" in interview) {
//       interview.score = 80;
//     }

//     await interview.save();

//     return res.status(200).json({
//       success: true,
//       message: "Interview submitted successfully",
//       interview,
//     });

//   } catch (error) {
//     console.log("Submit Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to submit interview",
//     });
//   }
// }
// // ================= HISTORY =================

// async function getHistory(req, res) {
//   try {
//     const interviews =
//       await Interview.find({
//         user: req.user._id,
//       }).sort({
//         createdAt: -1,
//       });

//     return res.status(200).json({
//       success: true,
//       interviews,
//     });

//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch history",
//     });
//   }
// }

// // ================= GET SINGLE INTERVIEW =================

// async function getInterviewById(
//   req,
//   res
// ) {
//   try {
//     const interview =
//       await Interview.findById(
//         req.params.id
//       ).populate(
//         "user",
//         "firstname lastname email"
//       );

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Interview not found",
//       });
//     }

//     if (
//       interview.user._id.toString() !==
//       req.user._id.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Access denied",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       interview,
//     });

//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch interview",
//     });
//   }
// }

// module.exports = {
//   createInterview,
//   submitInterview,
//   getHistory,
//   getInterviewById,
// };


// const Interview = require("../models/interview");

// const {
//   generateQuestions,
// } = require("../services/gemini.services");

// // ================= CREATE INTERVIEW =================

// async function createInterview(req, res) {
//   try {
//     const {
//       role,
//       experience,
//       difficulty,
//       questionCount,
//     } = req.body;

//     if (!role) {
//       return res.status(400).json({
//         success: false,
//         message: "Role is required",
//       });
//     }

//     const aiResponse = await generateQuestions(
//       role,
//       experience || "fresher",
//       difficulty || "easy",
//       questionCount || 5
//     );

//     let questions = [];

//     try {
//       const parsedQuestions = Array.isArray(aiResponse)
//         ? aiResponse
//         : JSON.parse(aiResponse);

//       questions = parsedQuestions.map((q) => ({
//         question:
//           typeof q === "string"
//             ? q
//             : q.question || "",
//         type: q.type || "text",
//         options: q.options || [],
//         answer: q.answer || "",
//       }));

//     } catch (err) {
//       console.log("QUESTION PARSE ERROR:", err);

//       return res.status(500).json({
//         success: false,
//         message: "Failed to parse AI questions",
//       });
//     }

//     console.log("USER:", req.user);
//     console.log(
//       "QUESTIONS:",
//       JSON.stringify(questions, null, 2)
//     );

//     const interview = await Interview.create({
//       user: req.user._id,
//       role,
//       questions,
//       status: "pending",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Interview created successfully",
//       interview,
//     });

//   } catch (error) {
//     console.log(
//       "CREATE INTERVIEW ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// // ================= SUBMIT INTERVIEW =================

// async function submitInterview(req, res) {
//   try {
//     const { interviewId, answers } =
//       req.body;

//     if (
//       !answers ||
//       !Array.isArray(answers)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Answers must be an array",
//       });
//     }

//     const interview =
//       await Interview.findById(
//         interviewId
//       );

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Interview not found",
//       });
//     }

//     interview.answers = answers;
//     interview.status = "completed";
//     interview.score = 80;

//     await interview.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         "Interview submitted successfully",
//       interview,
//     });

//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to submit interview",
//     });
//   }
// }

// // ================= HISTORY =================

// async function getHistory(req, res) {
//   try {
//     const interviews =
//       await Interview.find({
//         user: req.user._id,
//       }).sort({
//         createdAt: -1,
//       });

//     return res.status(200).json({
//       success: true,
//       interviews,
//     });

//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch history",
//     });
//   }
// }

// // ================= GET SINGLE INTERVIEW =================

// async function getInterviewById(
//   req,
//   res
// ) {
//   try {
//     const interview =
//       await Interview.findById(
//         req.params.id
//       ).populate(
//         "user",
//         "firstname lastname email"
//       );

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Interview not found",
//       });
//     }

//     if (
//       interview.user._id.toString() !==
//       req.user._id.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Access denied",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       interview,
//     });

//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch interview",
//     });
//   }
// }


// // ================= SUBMIT INTERVIEW =================

// async function submitInterview(req, res) {
//   try {
//     const {
//       interviewId,
//       answers,
//     } = req.body;

//     if (
//       !answers ||
//       !Array.isArray(answers)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Answers must be an array",
//       });
//     }

//     const interview =
//       await Interview.findById(
//         interviewId
//       );

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Interview not found",
//       });
//     }

//     interview.answers =
//       answers;

//     interview.status =
//       "completed";

//     interview.score = 80;

//     await interview.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         "Interview submitted successfully",
//       interview,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to submit interview",
//     });
//   }
// }

// // ================= HISTORY =================

// async function getHistory(req, res) {
//   try {
//     const interviews =
//       await Interview.find({
//         user: req.user.uid,
//       }).sort({
//         createdAt: -1,
//       });

//     return res.status(200).json({
//       success: true,
//       interviews,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch history",
//     });
//   }
// }
// // ================= GET SINGLE INTERVIEW =================

// async function getInterviewById(
//   req,
//   res
// ) {
//   try {
//     const interview =
//       await Interview.findById(
//         req.params.id
//       ).populate(
//         "user",
//         "firstname lastname email"
//       );

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Interview not found",
//       });
//     }

//     if (
//       interview.user._id.toString() !==
//       req.user.uid
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Access denied",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       interview,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch interview",
//     });
//   }
// }

// module.exports = {
//   createInterview,
//   submitInterview,
//   getHistory,
//   getInterviewById,
// };