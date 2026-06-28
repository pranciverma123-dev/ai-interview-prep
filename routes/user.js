const express = require("express");
const router = express.Router();

const {
  handleusersignup,
  handleuserLogin,
  handleuserLogout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getProfile,
  
} = require("../controller/user");

const { protect } = require("../middleware/auth");

router.post("/signup", handleusersignup);

router.post("/login", handleuserLogin);

router.post("/logout", handleuserLogout);

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.put("/reset-password", resetPassword);

router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;