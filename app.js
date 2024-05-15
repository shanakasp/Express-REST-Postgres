require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./route/authRoute");
const projectRouter = require("./route/projectRoute");
const AppError = require("./utils/appError");
const globalErrorController = require("./controller/errorController");

const app = express();
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `Time ${timestamp} - API Method - ${req.method} API Path - ${req.path}`
  );
  next();
});

// Mount authRouter under /api/v1/auth
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);

// Route not found handler
app.all("*", (req, res, next) => {
  const timestamp = new Date().toISOString();
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const message = `Can't find ${url} on this server`;
  const err = new AppError(message, 404);
  next(err); // Pass the error to the next middleware
});

// Global error handler
app.use(globalErrorController);

const PORT = process.env.PORT || 3000; // Default port 3000 if PORT is not defined

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
