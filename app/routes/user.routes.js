const users = require("../controllers/user.controller");
const validateId = require("../middlewares/id.validation.middleware");

const router = require("express").Router();

router.use("/:id", validateId); // validate id (it must be an integer)

router.get("/", users.getAll); // get all users in an array
router.get("/:id", users.getById); // get specific user by id
router.put("/:id", users.update); // update specific user by id
router.post("/", users.create); // create new user
router.delete("/:id", users.delete); // delete specific user by id

router.post("/:id/picture", users.uploadPicture); // upload picture

module.exports = router;
