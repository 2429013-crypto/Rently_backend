 const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Property = sequelize.define(
    "Property",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        type: {
            type: DataTypes.ENUM("House", "Flat", "PG", "Shared"),
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        bedrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        bathrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        area: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        rent: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        deposit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        furnishing: {
            type: DataTypes.ENUM(
                "Furnished",
                "Semi-Furnished",
                "Unfurnished"
            ),
            allowNull: true,
        },

        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "APPROVED",
                "REJECTED"
            ),
            defaultValue: "APPROVED",
        },
    },
    {
        tableName: "properties",
        timestamps: true,
    }
);

module.exports = Property;  