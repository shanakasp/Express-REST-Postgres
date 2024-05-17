const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/appError");
const project = require("./project");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");

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
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "uniqueEmail",
        msg: "Email already exists",
      },
      validate: {
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
      allowNull: false,
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
    sequelize,
    modelName: "user",
    tableName: "User",
    paranoid: true,
  }
);

User.hasMany(project, { foreignKey: "createdBy" });
project.belongsTo(User, { foreignKey: "createdBy" });

// Encrypt password before saving
User.beforeSave(async (user, options) => {
  if (user.changed("password")) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword;
  }
});

module.exports = User;
