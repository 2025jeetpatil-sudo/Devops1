const express = require("express");
const router = express.Router();

const {
  sendOTP,
  signup,
  login,
} = require("../controllers/auth");

// Routes
router.post("/sendotp", sendOTP);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
