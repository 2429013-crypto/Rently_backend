const express = require("express");

const {
    sendOTP,
    resendOTP,
    verifyOTP,
    register,
    login, 
        getCurrentUser,  
            logout, 
            forgotPassword, 
            verifyResetOTP,     
            resetPassword,
   } = require("../controllers/authController");
 const router = express.Router();
router.post("/send-otp", sendOTP);     
router.post("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", login);               
router.get("/me", getCurrentUser);   
router.post("/logout", logout);  
router.post("/forgot-password", forgotPassword); 
router.post("/verify-reset-otp", verifyResetOTP);  
router.post("/reset-password", resetPassword);
module.exports = router;                                                                             


  
 
