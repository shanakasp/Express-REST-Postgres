const { authentication, avoidTo } = require("../controller/authController");
const {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controller/projectController");

const router = require("express").Router();

router.route("/").post(authentication, avoidTo("1", "2"), createProject);

router.route("/all").get(authentication, getAllProject);

router
  .route("/:id")
  .get(getProjectById)
  .patch(authentication, updateProject)
  .delete(authentication, deleteProject);

module.exports = router;
