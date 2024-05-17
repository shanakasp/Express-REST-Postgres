const { authentication, avoidTo } = require("../controller/authController");
const {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controller/projectController");

const router = require("express").Router();

router.route("/").post(authentication, avoidTo("0"), createProject);

router.route("/all").get(getAllProject);

router
  .route("/:id")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

module.exports = router;
