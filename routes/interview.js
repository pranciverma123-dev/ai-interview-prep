const express = require("express");

const router = express.Router();

const {
  createInterview,
  submitInterview,
  getHistory,
  getInterviewById,
} = require("../controller/interview");

const {
  protect,
} = require("../middleware/auth");

// Create Interview
router.post(
  "/create",
  protect,
  createInterview
);

// Submit Interview
router.post(
  "/submit",
  protect,
  submitInterview
);

// Get Interview History
router.get(
  "/history",
  protect,
  getHistory
);

// Get Single Interview
// router.get(
//   "/:id",
//   protect,
//   getInterviewById
// );
router.get("/:id", protect, getInterviewById);

module.exports = router;