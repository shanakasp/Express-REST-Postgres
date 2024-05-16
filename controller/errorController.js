const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.isOperational ? error.message : "Something went wrong!";

  res.status(statusCode).json({
    status,
    message,
  });
};

const globalErrorController = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Handle Sequelize validation errors
  if (error.name === "jsonWebTokenError") {
    error = new AppError("Invalid JSON Web Token", 401);
  }

  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    const errorMessage = error.errors.map((err) => err.message).join(". ");
    error = new AppError(`Invalid input data. ${errorMessage}`, 400);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorController;
