const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (value === this.password) {
          const hashPasword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashPasword);
        } else {
          throw new Error("Password and Confirm Password does not match");
        }
      },
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, // Pass the sequelize connection instance
    modelName: "user", // Set the model name
    tableName: "User", // Set the table name (optional)
    paranoid: true, // Enable soft deletion (optional)
  }
);

module.exports = User; // Export the User model
