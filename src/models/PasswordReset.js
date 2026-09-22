const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PasswordReset = sequelize.define(
    "PasswordReset",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },

        otpHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: "password_resets",
        timestamps: true,
    }
);

module.exports = PasswordReset; 