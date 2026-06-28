const express = require("express");
const router = express.Router();

const {
  getSkills,
  createInterview,
} = require("../controller/skills");
const {
  protect,
} = require("../middleware/auth");
// ================= GET SKILLS FROM ROLE =================
router.post("/skills", getSkills);

// ================= CREATE INTERVIEW =================
router.post("/interview", createInterview);

module.exports = router;