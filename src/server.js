require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const sequelize = require("./config/db");
const User = require("./models/User");
const EmailVerification = require("./models/EmailVerification"); 
const PasswordReset = require("./models/PasswordReset"); 
const { testEmailConnection } = require("./services/emailService");
const authRoutes = require("./routes/authRoutes");

const app = express();  

app.use(cors());
app.use(express.json());

// SESSION MUST COME BEFORE ROUTES
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

// ROUTES AFTER SESSION
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Rently backend is running successfully!"
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("✅ MySQL database connected successfully!");

        await testEmailConnection();

        await sequelize.sync();

        console.log("✅ Database tables synchronized!");

        app.listen(PORT, () => {
            console.log(`🚀 Rently backend running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database connection failed:");
        console.error(error.message);
    }
}

startServer(); 
 