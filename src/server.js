require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const sequelize = require("./config/db");
const User = require("./models/User");        
const Profile = require("./models/Profile"); 
const EmailVerification = require("./models/EmailVerification"); 
const PasswordReset = require("./models/PasswordReset"); 
const { testEmailConnection } = require("./services/emailService");
const authRoutes = require("./routes/authRoutes");         
const profileRoutes = require("./routes/profileRoutes");   
const Property = require("./models/Property");  
const propertyRoutes = require("./routes/propertyRoutes"); 
// USER-PROFILE ASSOCIATION
User.hasOne(Profile, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});  

Profile.belongsTo(User, { 
    foreignKey: "userId", 
});                              
User.hasMany(Property, {
    foreignKey: "ownerId",
    onDelete: "CASCADE",
});

Property.belongsTo(User, {
    foreignKey: "ownerId",
}); 

const app = express();  

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); 

app.use(express.json());  

// SESSION MUST COME BEFORE ROUTES
app.use(
    session({
        secret: process.env.SESSION_SECRET || "rently_session_secret_2026",
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
            path: "/",
        },
    })
); 


// ROUTES AFTER SESSION
app.use("/api/auth", authRoutes);   
app.use("/api/profile", profileRoutes);  
app.use("/api/properties", propertyRoutes); 

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
 