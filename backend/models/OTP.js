const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // 🔥 REQUIRED for OTP validation
);

module.exports = mongoose.model("OTP", OTPSchema);
