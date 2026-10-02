const express = require("express");

const {
    getProperties,
    getMyProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
} = require("../controllers/propertyController");

const router = express.Router();

router.get("/", getProperties);

router.get("/my", getMyProperties);

router.get("/:id", getPropertyById);

router.post("/", createProperty);

router.put("/:id", updateProperty);

router.delete("/:id", deleteProperty);

module.exports = router;
 
