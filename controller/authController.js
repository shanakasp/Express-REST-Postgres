const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  // Check if userType is not '1' or '2'
  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("Invalid user Type", 400);
  }

  const newUser = await user.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
    userType: body.userType,
  });

  if (!newUser) {
    return next(new AppError("Failed to create the user", 400));
  }
  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });

  // result.hi = 10;

  return res.status(201).json({
    status: "success",
    data: result,
  });

  // If userType is valid, continue with signup logic
  // For demonstration, let's assume signup logic goes here

  // Example of signup logic:
  // User.create({
  //   firstName: body.firstName,
  //   lastName: body.lastName,
  //   email: body.email,
  //   password: body.password,
  //   userType: body.userType
  // })
  // .then(user => {
  //   res.status(201).json({
  //     status: 'success',
  //     message: 'User signed up successfully',
  //     user: user
  //   });
  // })
  // .catch(err => {
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'Failed to signup user',
  //     error: err.message
  //   });
  // });

  // The above code is an example of how you might handle user signup using a database model (e.g., User) with Sequelize

  // Since this is a placeholder function, replace the above example with your actual signup logic
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const result = await user.findOne({ where: { email } });
  if (!result) {
    return next(new AppError("Invalid Email or Password", 400));
  }

  const isPasswordMatched = await bcrypt.compare(password, result.password);

  if (!isPasswordMatched) {
    return next(new AppError("Invalid Email or Password", 400));
  }
  const token = generateToken({
    id: result.id,
  });

  return res.json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
});

const authentication = catchAsync(async (req, res, next) => {
  //get the token
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }
  {
    if (!idToken) {
      return next(new AppError("Please login to gain access ", 401));
    }
  }
  //token verification
  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET);
  //get use detail and add

  const freshUser = user.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError("User no longer exists", 400));
  }
  req.user = freshUser;
  return next();
});

module.exports = { signup, login, authentication };
