const Project = require("../db/models/project");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    isFeatured,
    productImage,
    price,
    shortDescription,
    productUrl,
    category,
    tags,
  } = req.body;

  const createdBy = 1;

  try {
    // Create a new project record
    const newProject = await Project.create({
      title,
      description,
      isFeatured,
      productImage, // Assuming productImage is an array of strings
      price,
      shortDescription,
      productUrl,
      category, // Assuming category is an array of strings
      tags, // Assuming tags is an array of strings
      createdBy,
      // Add other fields as needed based on your schema
    });

    // Return the newly created project in the response
    res.status(201).json({
      status: "success",
      data: {
        project: newProject,
      },
    });
  } catch (error) {
    // Check if the error is due to Sequelize validation failure
    if (error.name === "SequelizeValidationError") {
      // Extract validation error details from the error object
      const errors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      // Return validation error response
      res.status(400).json({
        status: "fail",
        errors,
      });
    } else {
      // Handle other unexpected errors
      console.error("Error creating project:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
});

module.exports = {
  createProject,
};
