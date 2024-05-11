const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const signup = async (req, res, next) => {
  const body = req.body;

  // Check if userType is not '1' or '2'
  if (!["1", "2"].includes(body.userType)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid user type: " + body.userType,
    });
  }

  const newUser = await user.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
    userType: body.userType,
  });

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });

  // result.hi = 10;

  if (!result) {
    return res.status(400).json({
      status: "fail",
      message: "failed to create the user",
    });
  }

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
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  const result = await user.findOne({ where: { email } });
  if (!result) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  const isPasswordMatched = await bcrypt.compare(password, result.password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }
  const token = generateToken({
    id: result.id,
  });

  return res.json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
};

module.exports = { signup, login };
