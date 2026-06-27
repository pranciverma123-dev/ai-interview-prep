const express = require("express");
const router = express.Router();

const {
  generateResume,
  downloadResumePDF
} = require("../controller/ats");

// OPTIONAL (recommended middlewares)
const validateResume = (req, res, next) => {
  const { role, skills } = req.body;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: "Role is required",
    });
  }

  if (!skills || !Array.isArray(skills)) {
    req.body.skills = [];
  }

  next();
};

// ================= ROUTES =================

// Generate ATS Resume
router.post("/generate", validateResume, generateResume);

// Download PDF
router.post("/download", downloadResumePDF);

module.exports = router;