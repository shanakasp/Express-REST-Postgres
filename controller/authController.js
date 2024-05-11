const user = require("../db/models/user");
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
    userType: body.userType,
  });

  if (!newUser) {
    return res.status(400).json({
      status: "fail",
      message: "failed to create the user",
    });
  }

  return res.status(201).json({
    status: "success",
    data: newUser,
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

module.exports = { signup };
