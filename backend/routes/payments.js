const express = require("express");
const router = express.Router();

// Payments disabled for local development
router.post("/capturePayment", (req, res) => {
  return res.status(503).json({
    success: false,
    message: "Payments are disabled in local setup",
  });
});

module.exports = router;
