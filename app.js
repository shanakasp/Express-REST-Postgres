require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./route/authRoute");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorController = require("./controller/errorController");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Success",
  });
});

// Mount authRouter under /api/v1/auth
app.use("/api/v1/auth", authRouter);

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `Time ${timestamp} - API Method - ${req.method} API Path - ${req.path}`
  );
  next();
});

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError("This is error", 404);
  })
);

app.use(globalErrorController);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
