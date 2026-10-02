const Property = require("../models/Property");
const User = require("../models/User");


// GET ALL PROPERTIES
const getProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: {
                status: "APPROVED",
                available: true,
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        console.error("Get properties error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch properties",
        });
    }
};


// GET ONE PROPERTY
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id, {
            include: [
                {   
                    model: User,
                    attributes: ["id", "email"],
                },
            ],
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        res.json({
            success: true,
            property,
        });
    } catch (error) {
        console.error("Get property error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch property",
        });
    }
};


// GET LOGGED IN USER'S PROPERTIES
const getMyProperties = async (req, res) => {
    try {
        console.log("MY PROPERTIES SESSION:", req.session);
        const userId = req.session.userId || req.session.user?.id;
        console.log("MY PROPERTIES USER ID:", userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }

        const properties = await Property.findAll({
            where: {
                ownerId: userId,
            },
            order: [["createdAt", "DESC"]],
        });

        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        console.error("Get my properties error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch your properties",
        });
    }
};


// CREATE PROPERTY
const createProperty = async (req, res) => {
    try {
        console.log("CREATE PROPERTY SESSION:", req.session);
        const userId = req.session.userId || req.session.user?.id;
        console.log("CREATE PROPERTY USER ID:", userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }

        const {
            title,
            description,
            type,
            address,
            city,
            bedrooms,
            bathrooms,
            area,
            rent,
            deposit,
            furnishing,
            image,
        } = req.body;

        if (!title || !type || !address || !city || !rent) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, type, address, city and rent are required",
            });
        }

        const property = await Property.create({
            ownerId: userId,
            title,
            description,
            type,
            address,
            city,
            bedrooms,
            bathrooms,
            area,
            rent,
            deposit,
            furnishing,
            image,
            status: "APPROVED",
            available: true,
        });

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            property,
        });
    } catch (error) {
        console.error("Create property error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create property",
        });
    }
};


// UPDATE PROPERTY
const updateProperty = async (req, res) => {
    try {
        console.log("UPDATE PROPERTY SESSION:", req.session);
        const userId = req.session.userId || req.session.user?.id;
        console.log("UPDATE PROPERTY USER ID:", userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }

        const property = await Property.findByPk(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        if (Number(property.ownerId) !== Number(userId)) {
            return res.status(403).json({
                success: false,
                message: "You cannot edit this property",
            });
        }

        await property.update(req.body);

        res.json({
            success: true,
            message: "Property updated successfully",
            property,
        });
    } catch (error) {
        console.error("Update property error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update property",
        });
    }
};


// DELETE PROPERTY
const deleteProperty = async (req, res) => {
    try {
        console.log("DELETE PROPERTY SESSION:", req.session);
        const userId = req.session.userId || req.session.user?.id;
        console.log("DELETE PROPERTY USER ID:", userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }

        const property = await Property.findByPk(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        if (Number(property.ownerId) !== Number(userId)) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete this property",
            });
        }

        await property.destroy();

        res.json({
            success: true,
            message: "Property deleted successfully",
        });
    } catch (error) {
        console.error("Delete property error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete property",
        });
    }
};


module.exports = {
    getProperties,
    getMyProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};
 