const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const { generateDSAQuestions ,solveDSAQuestion,runCode} = require("../controller/dsa");

router.post("/dsa", protect, generateDSAQuestions);
router.post("/dsa/solve", solveDSAQuestion);
router.post("/run-code", runCode);
module.exports = router;