const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile,
    deleteProfile,
} = require("../controllers/profileController");

// Get the logged-in user's profile
router.get("/me", getProfile);

// Create or update the profile
router.put("/me", updateProfile);

// Delete the profile (not the account)
router.delete("/me", deleteProfile);

module.exports = router;  