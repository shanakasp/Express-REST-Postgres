"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Project.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title cannot be empty",
          },
          len: {
            args: [1, 255],
            msg: "Title must be between 1 and 255 characters",
          },
        },
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          isIn: {
            args: [[true, false]],
            msg: "Featured must be true or false",
          },
        },
      },
      productImage: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product image array cannot be empty",
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Price must be a positive number",
          },
        },
      },
      shortDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Short description cannot be empty",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description cannot be empty",
          },
        },
      },
      productUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product URL cannot be empty",
          },
          isUrl: {
            msg: "Invalid product URL format",
          },
        },
      },
      category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User", // Assuming "User" is your User model
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "project",
      freezeTableName: true,
      paranoid: true, // Enable soft deletes
      timestamps: true, // Enable timestamps (createdAt, updatedAt)
    }
  );

  return Project;
};
