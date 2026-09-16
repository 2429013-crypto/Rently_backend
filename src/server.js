const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db"); 
const User = require("./models/User");                                    
const EmailVerification = require("./models/EmailVerification");          

const app = express();                                          

app.use(cors());
app.use(express.json()); 

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
 
 