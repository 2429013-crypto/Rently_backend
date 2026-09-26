const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profile = sequelize.define(
    "Profile",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },

        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        isProfileComplete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: "profiles",
        timestamps: true,
    }
);

module.exports = Profile; 