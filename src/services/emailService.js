const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function testEmailConnection() {
    try {
        await transporter.verify();
        console.log("✅ Email service connected successfully!");
    } catch (error) {
        console.error("❌ Email service connection failed:");
        console.error(error.message);
    }
}

async function sendOTPEmail(email, otp) {
    await transporter.sendMail({
        from: `"Rently" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Rently Email Verification OTP",
        text: `Your Rently verification OTP is ${otp}. It is valid for 10 minutes.`,
        html: `
            <h2>Rently Email Verification</h2>
            <p>Your verification OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    });
}         
async function sendPasswordResetOTPEmail(email, otp) {
    await transporter.sendMail({
        from: `"Rently" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Rently Password Reset OTP",
        text: `Your Rently password reset OTP is ${otp}. It is valid for 10 minutes.`,
        html: `
            <h2>Rently Password Reset</h2>
            <p>Your OTP for resetting your Rently password is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        `,
    });
}                        

module.exports = { 
    transporter,                      
    testEmailConnection,                          
    sendOTPEmail,
    sendPasswordResetOTPEmail,       
}; 