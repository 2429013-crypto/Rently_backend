const express = require("express");
const { sendOTP, resendOTP, verifyOTP, register } = require("../controllers/authController"); 
const router = express.Router();
router.post("/send-otp", sendOTP);
router.post("/resend-otp", resendOTP); 
router.post("/verify-otp", verifyOTP);        
router.post("/register", register);        
module.exports = router;                       


  
