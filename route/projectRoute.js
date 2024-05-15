const express = require("express");
const router = express.Router();
const { signup, login } = require("../controller/authController");
const { createProject } = require("../controller/projectController");

router.post("/", createProject);

module.exports = router;
