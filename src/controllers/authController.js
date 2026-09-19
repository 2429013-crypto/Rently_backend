const bcrypt = require("bcryptjs");                          
const crypto = require("crypto"); 

const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const { sendOTPEmail } = require("../services/emailService"); 
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check whether email was provided
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        // Check whether the email is already registered
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }
  // Generate a cryptographically secure 6-digit OTP
const otp = crypto.randomInt(100000, 1000000).toString();
        // Hash the OTP before storing it
        const otpHash = await bcrypt.hash(otp, 10);

        // OTP expires after 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Remove any previous OTP for this email
        await EmailVerification.destroy({
            where: { email },
        });

        // Store the hashed OTP
        await EmailVerification.create({
            email,
            otpHash,
            expiresAt,
            attempts: 0,
            verified: false,
        }); 

        // Send OTP to the user's email
        await sendOTPEmail(email, otp);

        return res.status(200).json({
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error("Send OTP error:", error);

        return res.status(500).json({
            message: "Failed to send OTP",
        });
    }
}; 
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check whether email was provided
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        // Check whether the email is already registered
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        // Find the existing OTP verification record
        const verification = await EmailVerification.findOne({
            where: { email },
        });

        if (!verification) {
            return res.status(404).json({
                message: "No OTP request found. Please request an OTP first.",
            });
        }

    // Generate a cryptographically secure 6-digit OTP
const otp = crypto.randomInt(100000, 1000000).toString(); 

        // Hash the new OTP before storing it
        const otpHash = await bcrypt.hash(otp, 10);

        // New OTP expires after 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Replace the old OTP with the new one
        verification.otpHash = otpHash;
        verification.expiresAt = expiresAt;
        verification.attempts = 0;
        verification.verified = false;

        await verification.save();

        // Send the new OTP to the user's email
        await sendOTPEmail(email, otp);

        return res.status(200).json({
            message: "OTP resent successfully",
        });

    } catch (error) {
        console.error("Resend OTP error:", error);

        return res.status(500).json({
            message: "Failed to resend OTP",
        });                                               
    }
}; 
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check required fields
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
            });
        }

        // Find the OTP record
        const verification = await EmailVerification.findOne({
            where: { email },
        });

        if (!verification) {
            return res.status(404).json({
                message: "OTP not found. Please request a new OTP.",
            });
        }

        // Check whether OTP has expired
        if (new Date() > new Date(verification.expiresAt)) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP.",
            }); 
        }  
        // Check if this OTP was already successfully verified
// If yes, do not allow the same OTP to be used again
 
        if (verification.verified) {
    return res.status(400).json({
        message: "OTP has already been verified.",
    });
} 

        // Check maximum attempts
        if (verification.attempts >= 5) {
            return res.status(429).json({
                message: "Too many incorrect attempts. Please request a new OTP.",
            });
        }

        // Compare entered OTP with stored hash
        const isValidOTP = await bcrypt.compare(
            otp.toString(),
            verification.otpHash
        );

        // Wrong OTP
        if (!isValidOTP) {
            await verification.increment("attempts");

            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // Correct OTP
        verification.verified = true;
        await verification.save();

        return res.status(200).json({
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            message: "Failed to verify OTP",
        });
    }
}; 
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // Check whether this email has been successfully verified
        const verification = await EmailVerification.findOne({
            where: {
                email,
                verified: true,
            },
        });

        if (!verification) {
            return res.status(400).json({
                message: "Please verify your email before registering",
            });
        }

        // Check whether the email is already registered
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Allow only USER or OWNER during registration
        const userRole = role === "OWNER" ? "OWNER" : "USER";

        // Create the user account
        const user = await User.create({
            email,
            password: hashedPassword,     
            role: userRole,
        }); 
        // Mark email verification as used after successful registration
       verification.verified = false;
      await verification.save();                       

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role, 
            },
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed",
        });
    }
}; 

module.exports = {
    sendOTP, 
        resendOTP,   
    verifyOTP,       
        register,  
};                             