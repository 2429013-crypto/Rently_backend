const Profile = require("../models/Profile");

// ==========================================
// GET PROFILE
// GET /api/profile/me
// ==========================================

const getProfile = async (req, res) => {
    try {
        console.log("PROFILE SESSION:", req.session);
        const userId = req.session.userId || req.session.user?.id;
        console.log("PROFILE USER ID:", userId);

        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated.",
            });
        }

        const profile = await Profile.findOne({
            where: { userId },
        });

        if (!profile) {
            return res.status(200).json({
                profile: null,
                isProfileComplete: false,
            });
        }

        return res.status(200).json({
            profile,
            isProfileComplete: profile.isProfileComplete,
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            message: "Failed to get profile.",
        });
    }
};


// ==========================================
// CREATE OR UPDATE PROFILE
// PUT /api/profile/me
// ==========================================

const updateProfile = async (req, res) => {
    try {
        console.log("UPDATE PROFILE SESSION:", req.session);
        const userId = req.session.userId || req.session.user?.id;
        console.log("UPDATE PROFILE USER ID:", userId);

        if (!userId) {
            return res.status(401).json({
                message: "Not authenticated.",
            });
        }


        const {
            fullName,
            phone,
            city,
            address,
            profilePicture,
            bio,
        } = req.body;

        // Find the user's existing profile
        let profile = await Profile.findOne({
            where: { userId },
        });

        // ==========================================
        // CREATE NEW PROFILE
        // ==========================================

        if (!profile) {
            // Required fields for first-time profile creation
            if (
                typeof fullName !== "string" ||
                typeof phone !== "string" ||
                typeof city !== "string" ||
                typeof address !== "string" ||
                !fullName.trim() ||
                !phone.trim() ||
                !city.trim() ||
                !address.trim()
            ) {
                return res.status(400).json({
                    message:
                        "Full name, phone, city and address are required.",
                });
            }

            profile = await Profile.create({
                userId,
                fullName: fullName.trim(),
                phone: phone.trim(),
                city: city.trim(),
                address: address.trim(),
                profilePicture: profilePicture || null,
                bio: bio || null,
                isProfileComplete: true,
            });

            return res.status(201).json({
                message: "Profile created successfully.",
                profile,
                isProfileComplete: profile.isProfileComplete,
            });
        }

        // ==========================================
        // UPDATE EXISTING PROFILE
        // ==========================================

        // Update only the fields sent by the frontend
        if (fullName !== undefined) {
            if (
                typeof fullName !== "string" ||
                !fullName.trim()
            ) {
                return res.status(400).json({
                    message: "Full name cannot be empty.",
                });
            }

            profile.fullName = fullName.trim();
        }

        if (phone !== undefined) {
            if (
                typeof phone !== "string" ||
                !phone.trim()
            ) {
                return res.status(400).json({
                    message: "Phone number cannot be empty.",
                });
            }

            profile.phone = phone.trim();
        }

        if (city !== undefined) {
            if (
                typeof city !== "string" ||
                !city.trim()
            ) {
                return res.status(400).json({
                    message: "City cannot be empty.",
                });
            }

            profile.city = city.trim();
        }

        if (address !== undefined) {
            if (
                typeof address !== "string" ||
                !address.trim()
            ) {
                return res.status(400).json({
                    message: "Address cannot be empty.",
                });
            }

            profile.address = address.trim();
        }

        if (profilePicture !== undefined) {
            profile.profilePicture = profilePicture || null;
        }

        if (bio !== undefined) {
            profile.bio = bio || null;
        }

        // Recalculate profile completion
        profile.isProfileComplete = Boolean(
            profile.fullName?.trim() &&
            profile.phone?.trim() &&
            profile.city?.trim() &&
            profile.address?.trim()
        );

        await profile.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            profile,
            isProfileComplete: profile.isProfileComplete,
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            message: "Failed to update profile.",
        });
    }
};


// ==========================================
// DELETE PROFILE
// DELETE /api/profile/me
// ==========================================

const deleteProfile = async (req, res) => {
    try {
        // Check whether user is logged in
        if (!req.session.user) {
            return res.status(401).json({
                message: "Not authenticated.",
            });
        }

        const userId = req.session.user.id;

        const profile = await Profile.findOne({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found.",
            });
        }

        await profile.destroy();

        return res.status(200).json({
            message: "Profile deleted successfully.",
            isProfileComplete: false,
        });

    } catch (error) {
        console.error("Delete profile error:", error);

        return res.status(500).json({
            message: "Failed to delete profile.",
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile,
}; 