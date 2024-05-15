const { authentication, restrictTo } = require("../controller/authController");
const {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controller/projectController");

const router = require("express").Router();

router.route("/").post(createProject);

router
  .route("/:id")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

module.exports = router;
